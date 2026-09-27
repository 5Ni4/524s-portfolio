(() => {
  const storageKey = "r524-portfolio-design";
  const root = document.documentElement;

  try {
    if (localStorage.getItem(storageKey) === "colorful") {
      root.dataset.design = "colorful";
    }
  } catch {}

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("design-toggle");
    if (!button) return;
    const label = button.querySelector(".theme-current");
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const updateButton = () => {
      const isColorful = root.dataset.design === "colorful";
      button.setAttribute("aria-pressed", String(isColorful));
      button.setAttribute("aria-label", `テーマ切り替え。現在は${isColorful ? "524" : "WHITE"}。押すと${isColorful ? "WHITE" : "524"}に切り替え`);
      if (label) label.textContent = isColorful ? "524" : "WHITE";
      if (themeColor) themeColor.setAttribute("content", isColorful ? "#39bad7" : "#ffffff");
    };

    updateButton();
    button.addEventListener("click", () => {
      const next = root.dataset.design === "colorful" ? "simple" : "colorful";
      root.dataset.design = next;
      updateButton();
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
    });

    document.querySelectorAll(".clear-file-flip").forEach((flipButton) => {
      const front = flipButton.querySelector(".clear-file-flip-front");
      const back = flipButton.querySelector(".clear-file-flip-back");

      const updateFlipButton = () => {
        const isFlipped = flipButton.classList.contains("is-flipped");
        const visibleLabel = isFlipped ? flipButton.dataset.backLabel : flipButton.dataset.frontLabel;
        const nextSide = isFlipped ? "表面" : "裏面";
        const visibleDescription = isFlipped ? (flipButton.dataset.backDescription || "") : (flipButton.dataset.frontDescription || "");

        flipButton.setAttribute("aria-label", `${visibleLabel}${visibleDescription ? `。${visibleDescription}` : ""}。タップまたはクリックで${nextSide}へ切り替え`);
        flipButton.setAttribute("aria-pressed", String(isFlipped));
        front.setAttribute("aria-hidden", String(isFlipped));
        back.setAttribute("aria-hidden", String(!isFlipped));
      };

      flipButton.addEventListener("click", () => {
        flipButton.classList.toggle("is-flipped");
        updateFlipButton();
      });
      updateFlipButton();
    });
  });
})();
