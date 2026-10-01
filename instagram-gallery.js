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
  const instagramPostDates = {
    "DIYSW4AStBI": "2025-04-13",
    "DISSq33StOn": "2025-04-10",
    "DIPo4V8yYS8": "2025-04-09",
    "DPnVjpNkc7e": "2025-10-09",
    "DMc6jL3Slzd": "2025-07-23",
    "DMIXK75Sp6a": "2025-07-15",
    "DL2Tto7yr4Z": "2025-07-08",
    "DJmMSoeSXHE": "2025-05-13",
    "DJeRcSVSLu_": "2025-05-10",
    "DJZDLUqSYVR": "2025-05-08",
    "DJSuTLKSWuv": "2025-05-05",
    "DJRKTZhS3Mr": "2025-05-05",
    "DJQPQBnyWbZ": "2025-05-04",
    "DJO60OSS0nL": "2025-05-04",
    "DJJpCi6yGDL": "2025-05-02",
    "DJCJwANSMQ4": "2025-04-29",
    "DI1ABwcyCed": "2025-04-24",
    "DItefReyuDh": "2025-04-21",
    "DId6OY6SXd5": "2025-04-15",
    "DId3l6Oyz_O": "2025-04-15",
    "DIbhFhKSkSV": "2025-04-14",
    "DINEnBpyLd2": "2025-04-08",
    "DIJWF1MS_Ol": "2025-04-07",
    "DIGmz0_yLIU": "2025-04-06",
    "DIB80lpS17d": "2025-04-04",
    "DH52i5oSqx_": "2025-04-01",
    "DH17tmHSDTX": "2025-03-30",
    "DHvgEGqy7-z": "2025-03-28",
    "DHpA1oZy4rT": "2025-03-25",
    "DHkzi-KyoCG": "2025-03-24",
    "DHcQsoyBJ2S": "2025-03-20",
    "DHD4OVtyk4x": "2025-03-11",
    "DG4IbRuy54j": "2025-03-06",
    "DG0YpFgyi5j": "2025-03-05",
    "DGr9QmByRKd": "2025-03-01",
    "DGiNSHISt1k": "2025-02-26"
  };

  const instagramPosts = document.querySelector("#instagram-posts");
  const instagramStatus = document.querySelector("#instagram-status");
  const refreshInstagramButton = document.querySelector("#refresh-instagram-posts");
  const scrollNavigation = document.querySelector("#instagram-scroll-navigation");
  const previousPostButton = document.querySelector("#instagram-scroll-prev");
  const nextPostButton = document.querySelector("#instagram-scroll-next");
  if (!instagramPosts || !instagramStatus || !refreshInstagramButton) return;

  function updateScrollControls() {
    if (!scrollNavigation || !previousPostButton || !nextPostButton) return;
    const hasOverflow = window.matchMedia("(max-width: 1060px)").matches
      && instagramPosts.scrollWidth > instagramPosts.clientWidth + 4;
    scrollNavigation.hidden = !hasOverflow;
    previousPostButton.hidden = !hasOverflow;
    nextPostButton.hidden = !hasOverflow;
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

  function createPolaroidCaption(shortcode, tagName) {
    const caption = document.createElement(tagName);
    caption.className = "instagram-polaroid-caption";
    const publishedOn = instagramPostDates[shortcode];
    if (publishedOn) {
      const time = document.createElement("time");
      time.dateTime = publishedOn;
      time.textContent = publishedOn.split("-").join(".");
      caption.append(time);
    } else {
      caption.textContent = "R-524 · CAMERA";
    }
    return caption;
  }

  function createPolaroidFrame(shortcode) {
    const frame = document.createElement("figure");
    frame.className = "instagram-polaroid";
    const viewport = document.createElement("div");
    viewport.className = "instagram-photo";
    const caption = createPolaroidCaption(shortcode, "figcaption");
    frame.append(viewport, caption);
    return { frame, viewport };
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
      const polaroids = selectedPosts.map((shortcode) => {
        const polaroid = createPolaroidFrame(shortcode);
        polaroid.viewport.append(createInstagramPost(shortcode));
        return polaroid.frame;
      });
      instagramPosts.replaceChildren(...polaroids);
      await loadInstagramEmbedScript();
      window.instgrm.Embeds.process();
      await waitForInstagramEmbeds(polaroids.length);
      instagramStatus.textContent = "";
      requestAnimationFrame(updateScrollControls);
    } catch (error) {
      const fallbackLinks = selectedPosts.map((shortcode) => {
        const link = document.createElement("a");
        link.className = "instagram-polaroid instagram-fallback";
        link.href = `https://www.instagram.com/p/${shortcode}/`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const preview = document.createElement("span");
        preview.className = "instagram-fallback-image";
        preview.textContent = "Instagramで投稿を見る ↗";
        const caption = createPolaroidCaption(shortcode, "span");
        link.append(preview, caption);
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
