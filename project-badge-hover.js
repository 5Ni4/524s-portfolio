(() => {
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hoverPointer.matches) return;

  const cards = document.querySelectorAll("#works .project-card");
  const resetBadge = (badge) => {
    if (!badge) return;
    badge.style.removeProperty("--badge-shift-x");
    badge.style.removeProperty("--badge-shift-y");
    badge.style.removeProperty("--badge-rotate-x");
    badge.style.removeProperty("--badge-rotate-y");
    badge.style.removeProperty("--badge-light-x");
    badge.style.removeProperty("--badge-light-y");
  };

  cards.forEach((card) => {
    const badge = card.querySelector(".project-preview");
    if (!badge) return;

    badge.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || reduceMotion.matches) return;

      const bounds = badge.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));

      badge.style.setProperty("--badge-shift-x", `${(x * 4).toFixed(1)}px`);
      badge.style.setProperty("--badge-shift-y", `${(y * 4).toFixed(1)}px`);
      badge.style.setProperty("--badge-rotate-x", `${(-y * 5).toFixed(1)}deg`);
      badge.style.setProperty("--badge-rotate-y", `${(x * 5).toFixed(1)}deg`);
      badge.style.setProperty("--badge-light-x", `${((x + 1) * 50).toFixed(1)}%`);
      badge.style.setProperty("--badge-light-y", `${((y + 1) * 50).toFixed(1)}%`);
    }, { passive: true });

    badge.addEventListener("pointerleave", () => resetBadge(badge));
  });

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) cards.forEach((card) => resetBadge(card.querySelector(".project-preview")));
  });
})();
