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
  });
})();
