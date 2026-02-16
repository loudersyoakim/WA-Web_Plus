(function () {
  const currentScript = document.getElementById(
    "wa-script-scripts-inject_restore-js",
  );
  let waSettings = currentScript
    ? JSON.parse(currentScript.getAttribute("data-settings") || "{}")
    : {};

  window.addEventListener("message", (e) => {
    if (e.data?.type === "WA_SETTINGS_UPDATE") waSettings = e.data.settings;
  });

  const STORAGE_KEY = "wa_restored_final_l";
  const HASH_KEY = "wa_saved_hashes";

  let store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  let savedHashes = JSON.parse(localStorage.getItem(HASH_KEY) || "[]");

  function autoBackupDownload(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `wa_backup_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function saveAll() {
    if (Object.keys(store).length >= 500) {
      autoBackupDownload(store);
      store = {};
      savedHashes = [];
    }
    if (savedHashes.length > 3000) savedHashes.splice(0, 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    localStorage.setItem(HASH_KEY, JSON.stringify(savedHashes));
  }

  function getHash(wrapper) {
    const parent = wrapper.closest("[data-id]");
    return parent ? parent.getAttribute("data-id").split("_").pop() : null;
  }

  function backupMessage(wrapper) {
    if (!waSettings.restoreDeleted || !wrapper.classList.contains("message-in"))
      return;

    const hash = getHash(wrapper);
    const timeNode = wrapper.querySelector("span[style*='--x-fontSize']");
    const textNode =
      wrapper.querySelector("span[data-testid='selectable-text']") ||
      wrapper.querySelector(".copyable-text span");

    if (!timeNode || !textNode || !hash) return;

    const time = timeNode.innerText.trim();
    const text = textNode.innerText.trim();

    if (
      !text ||
      text.toLowerCase().includes("dihapus") ||
      text.toLowerCase().includes("deleted")
    )
      return;

    if (!savedHashes.includes(hash)) {
      if (!store[time]) store[time] = [];
      // Simpan objek berisi teks dan hash asli untuk pelacakan balik
      store[time].push({ text, hash });
      savedHashes.push(hash);
      saveAll();
    }
  }

  function handleRecalled(wrapper) {
    if (
      !waSettings.restoreDeleted ||
      wrapper.classList.contains("wa-restored-bubble")
    )
      return;

    const timeNode = wrapper.querySelector("span[style*='--x-fontSize']");
    if (!timeNode) return;
    const time = timeNode.innerText.trim();

    const isDeleted =
      wrapper.innerText.toLowerCase().includes("dihapus") ||
      wrapper.innerText.toLowerCase().includes("deleted");

    if (isDeleted && store[time]) {
      const currentHash = getHash(wrapper);
      let originalText = null;

      // 1. COBA CARI PAKAI HASH (Jika beruntung ID-nya masih sama)
      const foundByHash = store[time].find((item) => item.hash === currentHash);
      if (foundByHash) {
        originalText = foundByHash.text;
      }
      // 2. JIKA GAGAL, PAKAI POSISI BARISAN (FALLBACK)
      else {
        const allIncoming = Array.from(
          document.querySelectorAll(".message-in"),
        );
        const sameTimeBubbles = allIncoming.filter((w) => {
          const t = w.querySelector("span[style*='--x-fontSize']");
          return t && t.innerText.trim() === time;
        });
        const myIndex = sameTimeBubbles.indexOf(wrapper);
        if (myIndex !== -1 && store[time][myIndex]) {
          originalText = store[time][myIndex].text || store[time][myIndex];
        }
      }

      if (originalText) {
        const walker = document.createTreeWalker(
          wrapper,
          NodeFilter.SHOW_TEXT,
          null,
          false,
        );
        let textNode;
        while ((textNode = walker.nextNode())) {
          if (
            textNode.nodeValue.toLowerCase().includes("dihapus") ||
            textNode.nodeValue.toLowerCase().includes("deleted")
          ) {
            textNode.nodeValue = originalText;
            wrapper.classList.add("wa-restored-bubble");
            const icon = wrapper.querySelector(
              "[data-icon='recalled'], [data-icon='msg-recall']",
            );
            if (icon) icon.style.display = "inline-block";
            break;
          }
        }
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const wrappers =
            node.querySelectorAll?.(".message-in, .message-out") || [];
          wrappers.forEach((w) => {
            backupMessage(w);
            handleRecalled(w);
          });
        }
      });
      if (m.type === "characterData" || m.type === "childList") {
        const wrapper =
          m.target.nodeType === 1
            ? m.target.closest(".message-in, .message-out")
            : m.target.parentElement?.closest(".message-in, .message-out");
        if (wrapper) handleRecalled(wrapper);
      }
    });
  });

  const start = () => {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else {
      setTimeout(start, 500);
    }
  };
  start();
})();
