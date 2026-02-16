// scripts/content.js

// 1. Fungsi Injeksi (Aman dari CSP WhatsApp)
function injectScript(file, settings) {
  const id = "wa-script-" + file.replace(/\//g, "-").replace(".", "-");
  if (document.getElementById(id)) return;

  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(file);
  s.id = id;

  // Kirim data via atribut agar bisa dibaca instan tanpa melanggar CSP
  if (settings) {
    s.setAttribute("data-settings", JSON.stringify(settings));
  }

  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
}

// 2. Fungsi Tampilan (Blur)
function applySettings(settings) {
  const body = document.body;
  if (!settings || !body) return; // Mencegah error classList of null

  const blurClasses = [
    "blur-recent",
    "blur-group-sender",
    "blur-names",
    "blur-photos",
    "blur-conversation",
  ];

  blurClasses.forEach((cls) => {
    const key = cls.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    settings[key] ? body.classList.add(cls) : body.classList.remove(cls);
  });

  window.postMessage({ type: "WA_SETTINGS_UPDATE", settings: settings }, "*");
}

// 3. Inisialisasi Tunggal (Satu Pintu)
chrome.storage.local.get(null, (settings) => {
  // Suntikkan skrip utama dan restore
  injectScript("scripts/inject_main.js", settings);
  injectScript("scripts/inject_restore.js", settings);
  injectScript("scripts/status_download.js", settings);
  injectScript("scripts/custom_background.js", settings);

  // Terapkan efek visual
  if (document.body) {
    applySettings(settings);
  } else {
    document.addEventListener("DOMContentLoaded", () =>
      applySettings(settings),
    );
  }
});

// 4. Pendengar Perubahan dari Popup
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(null, (settings) => applySettings(settings));
});
