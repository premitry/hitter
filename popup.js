const $ = (id) => document.getElementById(id);

async function loadPrefs() {
  const { email = "", locale = "ID" } = await chrome.storage.sync.get(["email", "locale"]);
  $("email").value = email;
  $("locale").value = locale;
}

async function savePrefs() {
  await chrome.storage.sync.set({
    email: $("email").value.trim(),
    locale: $("locale").value
  });
}

function setStatus(msg, kind) {
  const el = $("status");
  el.textContent = msg;
  el.className = "status" + (kind ? " " + kind : "");
}

async function runFill() {
  await savePrefs();
  const email = $("email").value.trim();
  const locale = $("locale").value;

  if (email && !email.includes("@")) {
    setStatus("Email format invalid.", "err");
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    setStatus("No active tab.", "err");
    return;
  }

  $("fill").disabled = true;
  setStatus("Filling...");

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["js/content.js"]
    });

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: (email, locale) => window.__autofill && window.__autofill(email, locale),
      args: [email, locale]
    });

    const filled = results.reduce((sum, r) => sum + (r?.result?.filled || 0), 0);
    const source = results.map((r) => r?.result?.source).find((s) => s === "page" || s === "popup");

    let msg;
    if (!filled) {
      msg = "No matching fields found on this page.";
    } else if (source === "page") {
      msg = `Filled ${filled} field${filled === 1 ? "" : "s"} (email from page).`;
    } else if (source === "popup") {
      msg = `Filled ${filled} field${filled === 1 ? "" : "s"} (email from popup).`;
    } else {
      msg = `Filled ${filled} field${filled === 1 ? "" : "s"} (no email; name skipped).`;
    }
    setStatus(msg, filled ? "ok" : "err");
  } catch (e) {
    setStatus("Failed: " + (e?.message || String(e)), "err");
  } finally {
    $("fill").disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPrefs();
  $("email").addEventListener("change", savePrefs);
  $("locale").addEventListener("change", savePrefs);
  $("fill").addEventListener("click", runFill);
});
