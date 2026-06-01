"use client";

import { useEffect, useState } from "react";
import type { MenuData } from "@/features/menu/menu.types";

export function useMenuScrollSpy(
  menu: MenuData | null,
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  // Set first category when menu loads
  useEffect(() => {
    if (menu?.categories?.length) {
      setActiveCategoryId(
        menu.categories[0].id.toString()
      );
    }
  }, [menu]);

  useEffect(() => {
    if (!menu?.categories?.length) return;

    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + window.innerHeight / 3;

      let currentId = activeCategoryId;

      for (const category of menu.categories) {
        const section =
          sectionRefs.current[
            category.id.toString()
          ];

        if (!section) continue;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (
          scrollPosition >= top &&
          scrollPosition < bottom
        ) {
          currentId = category.id.toString();
          break;
        }
      }

      if (currentId !== activeCategoryId) {
        setActiveCategoryId(currentId);
      }
    };

    // Run once initially
    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [menu, activeCategoryId, sectionRefs]);

  return {
    activeCategoryId,
    setActiveCategoryId,
  };
}