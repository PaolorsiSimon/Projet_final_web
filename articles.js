// Fonction principale pour charger et afficher les articles
async function loadArticles() {
  try {
    displayLoading();

    // Récupérer le fichier CSV
    const response = await fetch('https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/aeb12ea07641451fef9cc0fcfb1f18615d9e87c5/articles.csv');
    const csvData = await response.text();

    if (!csvData.trim()) {
      throw new Error('Le fichier CSV est vide');
    }

    const articles = parseCSV(csvData);

    if (articles.length === 0) {
      throw new Error('Aucun article trouvé dans le fichier CSV');
    }

    displayArticles(articles);
  } catch (error) {
    console.error('Détails de l\'erreur:', error);
    displayError(`Erreur lors du chargement des articles: ${error.message}`);
  }
}

// Fonction pour parser le CSV avec validation
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const articles = [];
  
  // Vérification de l'en-tête
  const header = lines[0].trim().split(';');
  if (!header.includes('artiste') || !header.includes('photo') || !header.includes('nom') || !header.includes('taille')) {
    throw new Error('Le fichier CSV doit contenir "artiste", "photo", "nom", et "taille"');
  }

  // Parser les lignes de données
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    const [artiste, photo, nom, taille] = line.split(';').map(item => item.trim());

    // Validation des données
    if (!artiste || !photo || !nom || !taille) {
      console.warn(`Ligne ${i + 1} ignorée car incomplète`);
      continue;
    }

    articles.push({ artiste, photo, nom, taille });
  }

  return articles;
}

// Fonction pour afficher un message de chargement
function displayLoading() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '<div class="loading">Chargement des articles...</div>';
}

// Fonction pour afficher les articles
// Fonction pour afficher les articles
function displayArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Nettoyer le conteneur

  // Organiser les articles par artiste
  const artists = {};

  articles.forEach(article => {
    if (!artists[article.artiste]) {
      artists[article.artiste] = [];
    }
    artists[article.artiste].push(article);
  });

  // Créer les sections d'artistes
  for (let artist in artists) {
    const artistSection = document.createElement('section');


    artistSection.classList.add('artist-section');

    const artistTitle = document.createElement('h2');
    artistTitle.innerText = artist;
    container.appendChild(artistTitle);

    artists[artist].forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('article');
      articleElement.innerHTML = `
        <img src="${article.photo}" alt="${article.nom}" onerror="this.onerror=null; this.src='placeholder.jpg'; this.classList.add('error-image')">
        <h3>${article.nom}</h3>
        <p>Taille : ${article.taille}</p>
      `;
      artistSection.appendChild(articleElement);
    });

    container.appendChild(artistSection);
  }
}


// Fonction pour afficher les erreurs
function displayError(message) {
  const container = document.getElementById('articles-container');
  container.innerHTML = `
    <div class="error-message">
      ${message}
      <button onclick="retryLoading()" class="retry-button">Réessayer</button>
    </div>
  `;
}

// Fonction pour réessayer le chargement
function retryLoading() {
  loadArticles();
}

// Chargement automatique au démarrage de la page
document.addEventListener('DOMContentLoaded', loadArticles);
