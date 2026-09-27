(() => {
  const root = document.documentElement;
  const canUseMouse = window.matchMedia("(any-pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!canUseMouse.matches) return;

  let layer;
  let lastDot = null;
  let lastSpawnAt = 0;

  const clearDots = () => {
    if (layer) layer.replaceChildren();
    lastDot = null;
    lastSpawnAt = 0;
  };

  const getLayer = () => {
    if (layer) return layer;
    layer = document.createElement("div");
    layer.className = "cursor-dot-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.append(layer);
    return layer;
  };

  document.addEventListener("pointermove", (event) => {
    if (
      root.dataset.design !== "colorful" ||
      event.pointerType !== "mouse" ||
      reduceMotion.matches
    ) {
      return;
    }

    const now = performance.now();
    const dx = lastDot ? event.clientX - lastDot.x : 0;
    const dy = lastDot ? event.clientY - lastDot.y : 0;
    if (lastDot && (dx * dx + dy * dy < 22 * 22 || now - lastSpawnAt < 28)) return;

    const dot = document.createElement("span");
    const size = 6 + Math.random() * 6;
    dot.className = "cursor-dot";
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.setProperty("--dot-drift-x", `${Math.round((Math.random() - 0.5) * 16)}px`);
    dot.style.setProperty("--dot-drift-y", `${Math.round(-6 - Math.random() * 14)}px`);

    const dots = getLayer();
    if (dots.childElementCount >= 18) dots.firstElementChild.remove();
    dots.append(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });

    lastDot = { x: event.clientX, y: event.clientY };
    lastSpawnAt = now;
  }, { passive: true });

  new MutationObserver(() => {
    if (root.dataset.design !== "colorful") clearDots();
  }).observe(root, { attributes: true, attributeFilter: ["data-design"] });

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) clearDots();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearDots();
  });
})();
