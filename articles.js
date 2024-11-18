async function loadArticles() {
  try {
      displayLoading();

      // Charger le fichier CSV depuis une URL distante
      const csvUrl = 'https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/blob/main/articles.csv';
      const response = await fetch(csvUrl);

      if (!response.ok) {
          throw new Error('Impossible de charger le fichier CSV depuis l\'URL distante');
      }

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

// Les autres fonctions (parseCSV, displayLoading, displayArticles, displayError) restent identiques

// Chargement automatique au démarrage de la page
document.addEventListener('DOMContentLoaded', loadArticles);


// Fonction pour afficher un message de chargement
function displayLoading() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '<div class="loading">Chargement des articles...</div>';
}

// Fonction pour afficher les articles
function displayArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Nettoyer le conteneur
  
  articles.forEach(article => {
      const articleElement = document.createElement('article');
      articleElement.classList.add('article');
      
      articleElement.innerHTML = `
          <img src="${article.photo}" alt="${article.nom}" 
               onerror="this.onerror=null; this.src='placeholder.jpg'; this.classList.add('error-image')">
          <h2>${article.nom}</h2>
          <p>Taille : ${article.taille}</p>
      `;
      
      container.appendChild(articleElement);
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