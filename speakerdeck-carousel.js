(() => {
  const posts = document.querySelector("#speakerdeck-posts");
  const navigation = document.querySelector("#speakerdeck-scroll-navigation");
  const previousButton = document.querySelector("#speakerdeck-scroll-prev");
  const nextButton = document.querySelector("#speakerdeck-scroll-next");
  if (!posts || !navigation || !previousButton || !nextButton) return;

  function updateScrollControls() {
    const hasOverflow = window.matchMedia("(max-width: 1060px)").matches
      && posts.scrollWidth > posts.clientWidth + 4;
    navigation.hidden = !hasOverflow;
    previousButton.hidden = !hasOverflow;
    nextButton.hidden = !hasOverflow;
  }

  function scrollToAdjacentPost(direction) {
    const firstPost = posts.firstElementChild;
    if (!firstPost) return;
    const gap = Number.parseFloat(getComputedStyle(posts).columnGap) || 0;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    posts.scrollBy({ left: direction * (firstPost.getBoundingClientRect().width + gap), behavior });
  }

  posts.addEventListener("scroll", updateScrollControls, { passive: true });
  window.addEventListener("resize", updateScrollControls);
  window.addEventListener("load", updateScrollControls, { once: true });
  previousButton.addEventListener("click", () => scrollToAdjacentPost(-1));
  nextButton.addEventListener("click", () => scrollToAdjacentPost(1));
  requestAnimationFrame(updateScrollControls);
})();
