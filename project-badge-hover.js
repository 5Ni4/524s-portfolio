(() => {
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hoverPointer.matches) return;

  const cards = document.querySelectorAll("#works .project-card");
  const resetBadge = (badge) => {
    if (!badge) return;
    badge.closest(".project-card")?.classList.remove("is-badge-pointer-active");
    badge.style.removeProperty("--badge-rotate-x");
    badge.style.removeProperty("--badge-rotate-y");
  };

  cards.forEach((card) => {
    const badge = card.querySelector(".project-preview");
    if (!badge) return;

    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || reduceMotion.matches) return;

      const bounds = badge.getBoundingClientRect();
      const radius = badge.offsetWidth / 2;
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);
      const responseRadius = radius + 42;

      if (Math.hypot(offsetX, offsetY) > responseRadius) {
        resetBadge(badge);
        return;
      }

      card.classList.add("is-badge-pointer-active");
      const x = Math.max(-1, Math.min(1, offsetX / radius));
      const y = Math.max(-1, Math.min(1, offsetY / radius));

      badge.style.setProperty("--badge-rotate-x", `${(y * 24).toFixed(1)}deg`);
      badge.style.setProperty("--badge-rotate-y", `${(-x * 24).toFixed(1)}deg`);
    }, { passive: true });

    card.addEventListener("pointerleave", () => resetBadge(badge));
  });

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) cards.forEach((card) => resetBadge(card.querySelector(".project-preview")));
  });
})();
