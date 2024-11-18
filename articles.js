// Fonction principale pour charger et afficher les articles
// Fonction principale pour charger et afficher les articles
async function loadArticles() {
  try {
      displayLoading();

      // Ouvrir une boîte de dialogue pour sélectionner le fichier CSV
      const fileHandle = await window.showOpenFilePicker({
          types: [{
              description: 'CSV Files',
              accept: {
                  'text/csv': ['.csv']
              }
          }]
      });
      
      const file = await fileHandle[0].getFile();
      const csvData = await file.text();

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

// Fonction pour parser le CSV avec validation améliorée
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const articles = [];
  
  // Vérifier qu'il y a au moins un en-tête et une ligne de données
  if (lines.length < 2) {
      throw new Error('Le fichier CSV doit contenir au moins un en-tête et une ligne de données');
  }
  
  // Vérifier l'en-tête
  const header = lines[0].trim().split(';');
  if (!header.includes('photo') || !header.includes('nom') || !header.includes('taille')) {
      throw new Error('L\'en-tête du CSV doit contenir "photo", "nom" et "taille"');
  }
  
  // Parser les lignes de données
  for(let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if(line === '') continue;
      
      const [photo, nom, taille] = line.split(';').map(item => item.trim());
      
      // Validation plus stricte des données
      if (!photo || !nom || !taille) {
          console.warn(`Ligne ${i + 1} ignorée car incomplète`);
          continue;
      }
      
      articles.push({ photo, nom, taille });
  }
  
  return articles;
}

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