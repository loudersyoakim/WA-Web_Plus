document.addEventListener("DOMContentLoaded", () => {
  // Daftar fitur checkbox umum
  const features = [
    "blurRecent",
    "blurGroupSender",
    "blurNames",
    "blurPhotos",
    "blurConversation",
    "playAudioSecretly",
    "viewStatusSecretly",
    "disableReadReceipts",
    "hideTyping",
    "hideRecording",
    "hideOnline",
    "restoreDeleted",
    "enableLikeBtn",
    "enableTranslateBtn",
    "freezeChatsList",
    "enableContactStatus",
    "notifyOnlineContacts",
    "keepContactInfoOpen",
    "enableContactInfoIcon",
    "startConvNonContact",
    "enableStatusDownloadBtn",
    "enablePinChatsBtn",
    "customChatWallpaper",
  ];

  // Daftar kontrol khusus Wallpaper (Slider)
  const wallpaperControls = [
    "wallpaperSize",
    "wallpaperOpacity",
    "wallpaperRotate",
    "wallpaperBlur",
    "wallpaperEdgeBlur",
  ];
  const removeBtn = document.getElementById("removeWallpaper");
  const wallpaperToggle = document.getElementById("customChatWallpaper");
  const wallpaperSettings = document.getElementById("wallpaperSettings");
  const wallpaperFile = document.getElementById("wallpaperFile");
  const positionPad = document.getElementById("positionPad");
  const positionHandle = document.getElementById("positionHandle");

  let currentPos = { x: 50, y: 50 };

  // 1. Inisialisasi Data & UI
  chrome.storage.local.get(null, (saved) => {
    // Setup Checkbox Fitur Umum
    features.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.checked = saved[id] || false;
        el.addEventListener("change", (e) => {
          chrome.storage.local.set({ [id]: e.target.checked });
        });
      }
    });

    // Tampilkan container blur grup jika blur recent aktif
    if (saved.blurRecent) {
      document.getElementById("containerBlurGroupSender").style.display =
        "flex";
    }

    // Inisialisasi Pengaturan Wallpaper jika Aktif
    if (saved.customChatWallpaper) {
      wallpaperSettings.style.display = "block";

      // Load semua nilai slider dan labelnya
      wallpaperControls.forEach((id) => {
        const el = document.getElementById(id);
        const valLabel = document.getElementById(
          "val" + id.replace("wallpaper", ""),
        );
        if (el) {
          el.value = saved[id] || el.value;
          if (valLabel) valLabel.innerText = el.value;
        }
      });

      // Load Posisi Analog
      currentPos = {
        x: saved.wallpaperPosX || 50,
        y: saved.wallpaperPosY || 50,
      };
      positionHandle.style.left = `${currentPos.x}%`;
      positionHandle.style.top = `${currentPos.y}%`;
    }
  });

  // Fungsi untuk menghapus foto
  removeBtn?.addEventListener("click", () => {
    chrome.storage.local.set({ wallpaperData: null }, () => {
      wallpaperFile.value = "";
    });
  });

  // Efek hover untuk tombol hapus agar lebih interaktif
  removeBtn?.addEventListener("mouseenter", () => {
    removeBtn.style.backgroundColor = "#ffebee";
  });
  removeBtn?.addEventListener("mouseleave", () => {
    removeBtn.style.backgroundColor = "transparent";
  });

  // 2. Logika Tampilan Panel
  document.getElementById("blurRecent")?.addEventListener("change", (e) => {
    document.getElementById("containerBlurGroupSender").style.display = e.target
      .checked
      ? "flex"
      : "none";
  });

  wallpaperToggle?.addEventListener("change", (e) => {
    wallpaperSettings.style.display = e.target.checked ? "block" : "none";
    saveWallpaperSettings();
  });

  // 3. Listener Otomatis untuk Semua Slider (Size, Opacity, Rotate, Blur)
  wallpaperControls.forEach((id) => {
    const el = document.getElementById(id);
    const valLabel = document.getElementById(
      "val" + id.replace("wallpaper", ""),
    );

    el?.addEventListener("input", (e) => {
      if (valLabel) valLabel.innerText = e.target.value;
      saveWallpaperSettings(); // Simpan setiap kali slider digeser
    });
  });

  // 4. Logika Analog Position (Geser Titik)
  positionPad?.addEventListener("mousedown", (e) => {
    const move = (ev) => {
      const rect = positionPad.getBoundingClientRect();
      currentPos.x = Math.round(
        Math.max(
          0,
          Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100),
        ),
      );
      currentPos.y = Math.round(
        Math.max(
          0,
          Math.min(100, ((ev.clientY - rect.top) / rect.height) * 100),
        ),
      );

      positionHandle.style.left = `${currentPos.x}%`;
      positionHandle.style.top = `${currentPos.y}%`;
      saveWallpaperSettings();
    };

    move(e);
    window.addEventListener("mousemove", move);
    window.addEventListener(
      "mouseup",
      () => {
        window.removeEventListener("mousemove", move);
      },
      { once: true },
    );
  });

  // 5. Handle File Upload (Convert ke Base64)
  wallpaperFile?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        chrome.storage.local.set({ wallpaperData: event.target.result }, () => {
          saveWallpaperSettings();
        });
      };
      reader.readAsDataURL(file);
    }
  });

  // 6. Fungsi Simpan Global
  function saveWallpaperSettings() {
    const data = {
      customChatWallpaper: wallpaperToggle.checked,
      wallpaperPosX: currentPos.x,
      wallpaperPosY: currentPos.y,
    };

    // Ambil semua nilai dari slider secara otomatis
    wallpaperControls.forEach((id) => {
      const el = document.getElementById(id);
      if (el) data[id] = el.value;
    });

    chrome.storage.local.set(data);
  }
});
