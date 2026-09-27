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
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const updateButton = () => {
      const isColorful = root.dataset.design === "colorful";
      button.setAttribute("aria-pressed", String(isColorful));
      button.setAttribute("aria-label", `${isColorful ? "シンプル" : "カラフル"}表示に切り替え`);
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
      const label = flipButton.querySelector(".clear-file-flip-label");
      const hint = flipButton.querySelector(".clear-file-flip-hint");
      const note = flipButton.querySelector(".clear-file-flip-note");
      const front = flipButton.querySelector(".clear-file-flip-front");
      const back = flipButton.querySelector(".clear-file-flip-back");

      const updateFlipButton = () => {
        const isFlipped = flipButton.classList.contains("is-flipped");
        const visibleLabel = isFlipped ? flipButton.dataset.backLabel : flipButton.dataset.frontLabel;
        const nextSide = isFlipped ? "表面" : "裏面";
        const visibleNote = isFlipped ? (flipButton.dataset.backNote || "") : (flipButton.dataset.frontNote || "");

        label.textContent = visibleLabel;
        hint.textContent = `タップで${nextSide}へ ↻`;
        flipButton.setAttribute("aria-label", `${visibleLabel}。タップまたはクリックで${nextSide}へ切り替え`);
        flipButton.setAttribute("aria-pressed", String(isFlipped));
        front.setAttribute("aria-hidden", String(isFlipped));
        back.setAttribute("aria-hidden", String(!isFlipped));
        if (note) {
          note.textContent = visibleNote;
          note.hidden = !visibleNote;
        }
      };

      flipButton.addEventListener("click", () => {
        flipButton.classList.toggle("is-flipped");
        updateFlipButton();
      });
      updateFlipButton();
    });
  });
})();
