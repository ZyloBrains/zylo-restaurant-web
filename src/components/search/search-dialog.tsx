"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { itemService } from "@/services/item.service";
import type { ItemResponse } from "@/features/menu/menu.types";
import { resolveImageUrl } from "@/lib/utils/image.utils";

type SearchDialogProps = {
  slug: string;
  onClose: () => void;
};

export function SearchDialog({ slug, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const term = query.trim();
    if (!slug) return;

    if (!term) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      itemService
        .searchItems(slug, term, 0, 10)
        .then((page) => {
          setResults(page?.content ?? []);
          setSearched(true);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setResults([]);
          setSearched(true);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, slug]);

  const handleSelect = (item: ItemResponse) => {
    onClose();
    router.push(`/menu/${item.id}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/30" onClick={onClose} />

      <div className="relative flex items-start justify-center px-4 pt-24">
        <div
          className="relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-card)",
            color: "var(--color-text)",
          }}
        >
          {/* SEARCH INPUT */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
            <Search size={20} className="shrink-0 text-[var(--color-text-muted)]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items..."
              className="flex-1 bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
            {loading && (
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            )}
            <button
              onClick={onClose}
              className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>

          {/* RESULTS */}
          <div className="max-h-[50vh] overflow-y-auto">
            {query.trim() === "" && (
              <p className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)]">
                Type to search items
              </p>
            )}

            {query.trim() !== "" && searched && results.length === 0 && !loading && (
              <p className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)]">
                No items found for &ldquo;{query.trim()}&rdquo;
              </p>
            )}

            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[var(--color-primary)]/10 active:scale-[0.99]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  {item.imageUrl ? (
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">
                    {item.menuName}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-semibold text-[var(--color-primary-text)]">
                  NPR {item.price}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
