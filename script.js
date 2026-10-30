const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "sv", name: "Swedish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "uk", name: "Ukrainian" }
];

const srcSelect = document.getElementById("sourceLang");
const tgtSelect = document.getElementById("targetLang");

languages.forEach(lang => {
  srcSelect.add(new Option(lang.name, lang.code));
  tgtSelect.add(new Option(lang.name, lang.code));
});

// Defaults: English → Spanish
srcSelect.value = "en";
tgtSelect.value = "es";

function swapLanguages() {
  const tmp = srcSelect.value;
  srcSelect.value = tgtSelect.value;
  tgtSelect.value = tmp;

  // Also swap the text
  const inputEl = document.getElementById("input");
  const outputEl = document.getElementById("output");
  const tmpText = inputEl.value;
  inputEl.value = outputEl.value;
  outputEl.value = tmpText;
}

async function translateText() {
  const text = document.getElementById("input").value.trim();
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("translateBtn");

  if (!text) {
    statusEl.textContent = "Please enter some text to translate.";
    return;
  }

  const langPair = srcSelect.value + "|" + tgtSelect.value;
  const url = "https://api.mymemory.translated.net/get?"
    + new URLSearchParams({ q: text, langpair: langPair });

  statusEl.textContent = "";
  btn.disabled = true;
  btn.textContent = "Translating…";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API returned status " + res.status);

    const data = await res.json();
    console.log("API response:", data);

    if (data.responseStatus != 200) {
      throw new Error(data.responseDetails || "Translation failed.");
    }

    document.getElementById("output").value = data.responseData.translatedText;
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Translate";
  }
}

function copyOutput() {
  const text = document.getElementById("output").value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const statusEl = document.getElementById("status");
    statusEl.style.color = "#27ae60";
    statusEl.textContent = "Copied to clipboard!";
    setTimeout(() => { statusEl.textContent = ""; statusEl.style.color = "#e74c3c"; }, 1500);
  });
}

function speakOutput() {
  const text = document.getElementById("output").value;
  if (!text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = tgtSelect.value;
  speechSynthesis.speak(utterance);
}

// Allow Ctrl+Enter to translate
document.getElementById("input").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.ctrlKey) translateText();
});
