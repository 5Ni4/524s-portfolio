(() => {
  const instagramShortcodes = [
    "DIYSW4AStBI", "DISSq33StOn", "DIPo4V8yYS8", "DPnVjpNkc7e",
    "DMc6jL3Slzd", "DMIXK75Sp6a", "DL2Tto7yr4Z", "DJmMSoeSXHE",
    "DJeRcSVSLu_", "DJZDLUqSYVR", "DJSuTLKSWuv", "DJRKTZhS3Mr",
    "DJQPQBnyWbZ", "DJO60OSS0nL", "DJJpCi6yGDL", "DJCJwANSMQ4",
    "DI1ABwcyCed", "DItefReyuDh", "DId6OY6SXd5", "DId3l6Oyz_O",
    "DIbhFhKSkSV", "DINEnBpyLd2", "DIJWF1MS_Ol", "DIGmz0_yLIU",
    "DIB80lpS17d", "DH52i5oSqx_", "DH17tmHSDTX", "DHvgEGqy7-z",
    "DHpA1oZy4rT", "DHkzi-KyoCG", "DHcQsoyBJ2S", "DHD4OVtyk4x",
    "DG4IbRuy54j", "DG0YpFgyi5j", "DGr9QmByRKd", "DGiNSHISt1k"
  ];

  const instagramPosts = document.querySelector("#instagram-posts");
  const instagramStatus = document.querySelector("#instagram-status");
  const refreshInstagramButton = document.querySelector("#refresh-instagram-posts");
  const previousPostButton = document.querySelector("#instagram-scroll-prev");
  const nextPostButton = document.querySelector("#instagram-scroll-next");
  if (!instagramPosts || !instagramStatus || !refreshInstagramButton) return;

  function updateScrollControls() {
    if (!previousPostButton || !nextPostButton) return;
    const hasOverflow = instagramPosts.scrollWidth > instagramPosts.clientWidth + 4;
    const atStart = instagramPosts.scrollLeft <= 4;
    const atEnd = instagramPosts.scrollLeft + instagramPosts.clientWidth >= instagramPosts.scrollWidth - 4;
    previousPostButton.hidden = !hasOverflow || atStart;
    nextPostButton.hidden = !hasOverflow || atEnd;
  }

  function scrollToAdjacentPost(direction) {
    const firstPost = instagramPosts.firstElementChild;
    if (!firstPost) return;
    const gap = Number.parseFloat(getComputedStyle(instagramPosts).columnGap) || 0;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    instagramPosts.scrollBy({ left: direction * (firstPost.getBoundingClientRect().width + gap), behavior });
  }

  instagramPosts.addEventListener("scroll", updateScrollControls, { passive: true });
  window.addEventListener("resize", updateScrollControls);
  previousPostButton?.addEventListener("click", () => scrollToAdjacentPost(-1));
  nextPostButton?.addEventListener("click", () => scrollToAdjacentPost(1));

  let instagramEmbedScriptPromise;

  function pickThreeAtRandom(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }

  function createInstagramPost(shortcode) {
    const postUrl = `https://www.instagram.com/p/${shortcode}/`;
    const embed = document.createElement("blockquote");
    embed.className = "instagram-media";
    embed.dataset.instgrmPermalink = postUrl;
    embed.dataset.instgrmVersion = "14";
    const link = document.createElement("a");
    link.href = postUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Instagramで投稿を見る";
    embed.append(link);
    return embed;
  }

  function waitForInstagramEmbeds(expectedCount, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        const frames = [...instagramPosts.querySelectorAll("iframe")];
        if (frames.length >= expectedCount) {
          clearTimeout(timeout);
          observer.disconnect();
          resolve(frames);
        }
      });
      const timeout = setTimeout(() => {
        observer.disconnect();
        reject(new Error("Instagram埋め込みの表示に時間がかかっています。"));
      }, timeoutMs);
      observer.observe(instagramPosts, { childList: true, subtree: true });

      const frames = [...instagramPosts.querySelectorAll("iframe")];
      if (frames.length >= expectedCount) {
        clearTimeout(timeout);
        observer.disconnect();
        resolve(frames);
      }
    });
  }

  function loadInstagramEmbedScript() {
    if (window.instgrm?.Embeds?.process) return Promise.resolve();
    if (!instagramEmbedScriptPromise) {
      instagramEmbedScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.async = true;
        script.dataset.instagramEmbed = "";
        script.src = "https://www.instagram.com/embed.js";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Instagram埋め込みスクリプトを読み込めませんでした。"));
        document.body.append(script);
      }).catch((error) => {
        instagramEmbedScriptPromise = undefined;
        throw error;
      });
    }
    return instagramEmbedScriptPromise;
  }

  async function showRandomInstagramPosts() {
    const selectedPosts = pickThreeAtRandom(instagramShortcodes);
    refreshInstagramButton.disabled = true;
    instagramPosts.setAttribute("aria-busy", "true");
    instagramStatus.textContent = "投稿を読み込んでいます。";

    try {
      const embeds = selectedPosts.map(createInstagramPost);
      instagramPosts.replaceChildren(...embeds);
      await loadInstagramEmbedScript();
      window.instgrm.Embeds.process();
      const renderedEmbeds = await waitForInstagramEmbeds(embeds.length);
      renderedEmbeds.forEach((embed) => {
        const frame = document.createElement("div");
        frame.className = "instagram-photo";
        embed.replaceWith(frame);
        frame.append(embed);
      });
      instagramStatus.textContent = "";
      requestAnimationFrame(updateScrollControls);
    } catch (error) {
      const fallbackLinks = selectedPosts.map((shortcode) => {
        const link = document.createElement("a");
        link.className = "instagram-fallback";
        link.href = `https://www.instagram.com/p/${shortcode}/`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Instagramで投稿を見る ↗";
        return link;
      });
      instagramPosts.replaceChildren(...fallbackLinks);
      instagramStatus.textContent = "Instagramを埋め込めませんでした。投稿リンクからご覧ください。";
      requestAnimationFrame(updateScrollControls);
    } finally {
      instagramPosts.setAttribute("aria-busy", "false");
      refreshInstagramButton.disabled = false;
    }
  }

  refreshInstagramButton.addEventListener("click", showRandomInstagramPosts);
  showRandomInstagramPosts();
})();
