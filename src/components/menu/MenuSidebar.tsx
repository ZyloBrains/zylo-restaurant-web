"use client";

import { CategoryResponse } from "@/features/menu/menu.types";

type Props = {
  categories: CategoryResponse[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
};

export function MenuSidebar({
  categories,
  activeCategoryId,
  onSelect,
}: Props) {
  return (
    <aside className="hidden md:block w-72 sticky top-0 h-screen p-4">
      <div
        className="rounded-2xl shadow-lg border border-[var(--color-border)] p-4 h-full"
        style={{
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <h2 className="text-xl font-bold mb-6 px-2 text-[var(--color-text)]">
          🍗 Menu Categories
        </h2>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const isActive = cat.id.toString() === activeCategoryId;

            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id.toString())}
                className="text-left px-4 py-3 rounded-xl transition"
                style={{
                  backgroundColor: isActive
                    ? "var(--color-primary)"
                    : "transparent",
                  color: isActive
                    ? "#fff"
                    : "var(--color-text)",
                  boxShadow: isActive
                    ? "var(--shadow-card)"
                    : "none",
                  transform: isActive
                    ? "scale(1.02)"
                    : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--color-background)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "transparent";
                  }
                }}
              >
                {cat.categoryName}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}