"use client";

import { useEffect, useState } from "react";

export function useMenuScrollSpy(
  sectionIds: string[],
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (sectionIds.length) {
      setActiveId(sectionIds[0]);
    }
  }, [sectionIds]);

  useEffect(() => {
    if (!sectionIds.length) return;

    const handleScroll = () => {
      const scrollPosition =
        window.scrollY + window.innerHeight / 3;

      let currentId = activeId;

      for (const id of sectionIds) {
        const section = sectionRefs.current[id];
        if (!section) continue;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          currentId = id;
          break;
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, activeId, sectionRefs]);

  return { activeId, setActiveId };
}