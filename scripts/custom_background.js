(function () {
  const scriptId = "wa-script-scripts-custom-background-js";
  const currentScript = document.getElementById(scriptId);
  let settings = currentScript
    ? JSON.parse(currentScript.getAttribute("data-settings") || "{}")
    : {};

  function applyWallpaper() {
    const mainChat = document.querySelector("#main .copyable-area");
    if (!mainChat) return;

    let bgLayer = document.getElementById("wa-ctl-bg-layer");
    if (!bgLayer) {
      bgLayer = document.createElement("div");
      bgLayer.id = "wa-ctl-bg-layer";
      mainChat.prepend(bgLayer);
    }

    // Jika fitur mati ATAU data foto kosong (setelah dihapus)
    if (!settings.customChatWallpaper || !settings.wallpaperData) {
      if (bgLayer) bgLayer.style.display = "none";
      return;
    }

    // Terapkan semua gaya visual seperti biasa
    bgLayer.style.display = "block";
    bgLayer.style.position = "absolute";
    bgLayer.style.inset = "-10%";
    bgLayer.style.zIndex = "0";
    bgLayer.style.pointerEvents = "none";
    bgLayer.style.backgroundImage = `url(${settings.wallpaperData})`;
    bgLayer.style.backgroundRepeat = "no-repeat";
    bgLayer.style.backgroundSize = `${settings.wallpaperSize || 100}%`;
    bgLayer.style.backgroundPosition = `${settings.wallpaperPosX || 50}% ${settings.wallpaperPosY || 50}%`;
    bgLayer.style.opacity = (settings.wallpaperOpacity || 100) / 100;
    bgLayer.style.filter = `blur(${settings.wallpaperBlur || 0}px)`;
    bgLayer.style.transform = `rotate(${settings.wallpaperRotate || 0}deg)`;

    // Logika Masking (Feather)
    const edgeBlur = settings.wallpaperEdgeBlur || 0;
    if (edgeBlur > 0) {
      const spread = 100 - edgeBlur;
      const mask = `radial-gradient(circle at ${settings.wallpaperPosX}% ${settings.wallpaperPosY}%, black 0%, black ${spread}%, transparent 100%)`;
      bgLayer.style.webkitMaskImage = mask;
      bgLayer.style.maskImage = mask;
    } else {
      bgLayer.style.webkitMaskImage = "";
      bgLayer.style.maskImage = "";
    }
  }

  window.addEventListener("message", (e) => {
    if (e.data?.type === "WA_SETTINGS_UPDATE") {
      settings = e.data.settings;
      applyWallpaper();
    }
  });

  setInterval(applyWallpaper, 1500);
})();
