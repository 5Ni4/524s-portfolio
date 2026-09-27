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
  if (!instagramPosts || !instagramStatus || !refreshInstagramButton) return;

  let instagramEmbedScriptPromise;

  function pickThreeAtRandom(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }

  async function loadInstagramPost(shortcode) {
    const postUrl = `https://www.instagram.com/p/${shortcode}/`;
    const oembedUrl = new URL("https://graph.facebook.com/v26.0/instagram_oembed");
    oembedUrl.searchParams.set("url", postUrl);
    oembedUrl.searchParams.set("maxwidth", "540");
    oembedUrl.searchParams.set("hidecaption", "true");

    const response = await fetch(oembedUrl);
    if (!response.ok) throw new Error("Instagram投稿を取得できませんでした。");

    const data = await response.json();
    const template = document.createElement("template");
    template.innerHTML = data.html || "";
    const embed = template.content.querySelector("blockquote.instagram-media");
    if (!embed) throw new Error("Instagram投稿の埋め込みデータがありません。");
    return embed;
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
      const embeds = await Promise.all(selectedPosts.map(loadInstagramPost));
      instagramPosts.replaceChildren(...embeds);
      await loadInstagramEmbedScript();
      window.instgrm.Embeds.process();
      const renderedEmbeds = [...instagramPosts.querySelectorAll("iframe")];
      if (renderedEmbeds.length !== 3) throw new Error("Instagram写真を表示できませんでした。");
      renderedEmbeds.forEach((embed) => {
        const frame = document.createElement("div");
        frame.className = "instagram-photo";
        embed.replaceWith(frame);
        frame.append(embed);
      });
      instagramStatus.textContent = "";
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
      instagramStatus.textContent = "投稿を埋め込めませんでした。リンクからInstagramでご覧ください。";
    } finally {
      instagramPosts.setAttribute("aria-busy", "false");
      refreshInstagramButton.disabled = false;
    }
  }

  refreshInstagramButton.addEventListener("click", showRandomInstagramPosts);
  showRandomInstagramPosts();
})();
