const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const result = document.getElementById("result");
const favoritesList = document.getElementById("favorites");

let favorites = [];

// Handle search
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) {
    result.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  fetchWord(word);
});

// Fetch API data
function fetchWord(word) {
  result.innerHTML = "<p>Loading...</p>";

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => res.json())
    .then(data => displayWord(data))
    .catch(() => {
      result.innerHTML = "<p>Error fetching data. Try again later.</p>";
    });
}

// Display results
function displayWord(data) {
  if (data.title) {
    result.innerHTML = "<p>Word not found.</p>";
    return;
  }

  const word = data[0].word;
  const meaning = data[0].meanings[0];
  const definition = meaning.definitions[0].definition;
  const example = meaning.definitions[0].example || "No example available.";
  const partOfSpeech = meaning.partOfSpeech;
  const synonym = meaning.synonyms?.[0] || "No synonyms available.";
  const audio = data[0].phonetics?.find(p => p.audio)?.audio;

  result.innerHTML = `
    <h2>${word}</h2>
    <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
    <p><strong>Definition:</strong> ${definition}</p>
    <p><strong>Example:</strong> ${example}</p>
    <p><strong>Synonym:</strong> ${synonym}</p>
    <button onclick="saveWord('${word}')">⭐ Save</button>
  `;

  if (audio) {
    result.innerHTML += `
      <p><strong>Pronunciation:</strong></p>
      <audio controls src="${audio}"></audio>
    `;
  }
}

// Save favorites
function saveWord(word) {
  if (!favorites.includes(word)) {
    favorites.push(word);
    updateFavorites();
  }
}

// Display favorites
function updateFavorites() {
  favoritesList.innerHTML = "";

  favorites.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    favoritesList.appendChild(li);
  });
}