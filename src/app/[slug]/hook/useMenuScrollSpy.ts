"use client";

import { useEffect, useState } from "react";
import type { MenuData } from "@/features/menu/menu.types";

export function useMenuScrollSpy(
  menu: MenuData,
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
) {
  const [activeCategoryId, setActiveCategoryId] = useState(
    menu.categories?.[0]?.id || ""
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentId = activeCategoryId;

      menu.categories.forEach((cat) => {
        const section = sectionRefs.current[cat.id];
        if (!section) return;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          currentId = cat.id;
        }
      });

      if (currentId !== activeCategoryId) {
        setActiveCategoryId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menu.categories, activeCategoryId, sectionRefs]);

  return { activeCategoryId, setActiveCategoryId };
}