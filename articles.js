// Fonction principale pour charger et afficher les articles
async function loadArticles() {
  try {
      displayLoading();

      // URL du fichier CSV (lien brut GitHub par exemple)
      const csvUrl = 'https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/main/articles.csv';

      // Charger le fichier CSV
      const response = await fetch(csvUrl);
      if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}: Impossible de charger le fichier CSV`);
      }

      const csvData = await response.text();

      if (!csvData.trim()) {
          throw new Error('Le fichier CSV est vide');
      }

      const articlesByArtist = parseCSV(csvData);

      if (Object.keys(articlesByArtist).length === 0) {
          throw new Error('Aucun article trouvé dans le fichier CSV');
      }

      displayArticles(articlesByArtist);
  } catch (error) {
      console.error('Détails de l\'erreur:', error);
      displayError(`Erreur lors du chargement des articles: ${error.message}`);
  }
}

// Fonction pour parser le CSV avec regroupement par artiste
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const articlesByArtist = {};

  // Vérifier qu'il y a au moins un en-tête et une ligne de données
  if (lines.length < 2) {
      throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');
  }

  // Vérifier l'en-tête
  const header = lines[0].trim().split(';');
  if (!header.includes('artiste') || !header.includes('photo') || !header.includes('nom') || !header.includes('taille')) {
      throw new Error('L\'en-tête du CSV doit contenir "artiste", "photo", "nom" et "taille"');
  }

  // Parser les lignes de données
  for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') continue;

      const [artiste, photo, nom, taille] = line.split(';').map(item => item.trim());

      if (!artiste || !photo || !nom || !taille) {
          console.warn(`Ligne ${i + 1} ignorée car incomplète`);
          continue;
      }

      // Grouper les articles par artiste
      if (!articlesByArtist[artiste]) {
          articlesByArtist[artiste] = [];
      }
      articlesByArtist[artiste].push({ photo, nom, taille });
  }

  return articlesByArtist;
}

// Fonction pour afficher un message de chargement
function displayLoading() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '<div class="loading">Chargement des articles...</div>';
}

// Fonction pour afficher les articles regroupés par artiste
function displayArticles(articlesByArtist) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Nettoyer le conteneur

  Object.keys(articlesByArtist).forEach(artiste => {
      // Créer une section pour chaque artiste
      const artistSection = document.createElement('section');
      artistSection.classList.add('artist-section');

      const artistTitle = document.createElement('h2');
      artistTitle.textContent = artiste;
      artistSection.appendChild(artistTitle);

      // Ajouter les articles de l'artiste
      articlesByArtist[artiste].forEach(article => {
          const articleElement = document.createElement('article');
          articleElement.classList.add('article');

          articleElement.innerHTML = `
              <img src="${article.photo}" alt="${article.nom}" 
                   onerror="this.onerror=null; this.src='placeholder.jpg'; this.classList.add('error-image')">
              <h3>${article.nom}</h3>
              <p>Taille : ${article.taille}</p>
          `;
          artistSection.appendChild(articleElement);
      });

      // Ajouter la section de l'artiste au conteneur principal
      container.appendChild(artistSection);
  });
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
