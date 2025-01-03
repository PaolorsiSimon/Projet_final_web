// Fonction pour charger les données du CSV
function loadCSV(callback) {
  fetch('https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/refs/heads/main/images_personnes.csv')
      .then(response => response.text())
      .then(data => {
          const rows = data.split('\n').filter(row => row.trim() !== '');
          const headers = rows[0].split(';');
          const personnes = rows.slice(1).map(row => {
              const cells = row.split(';');
              let personne = {};
              headers.forEach((header, index) => {
                  personne[header.trim()] = cells[index]?.trim() || '';
              });
              return personne;
          });
          callback(personnes); // Passe les données à la fonction callback
      })
      .catch(err => {
          console.error('Erreur de chargement du CSV', err);
          displayError('Impossible de charger les données.');
      });
}

// Fonction pour afficher les articles
function displayArticles(personnes) {
  const container = document.getElementById('articles-container');
  container.innerHTML = ''; // Nettoyer le conteneur

  if (!personnes || personnes.length === 0) {
      displayError('Aucun article disponible.');
      return;
  }

  // Organiser les articles par artiste
  const artistes = {};
  personnes.forEach(personne => {
      if (!artistes[personne.nom]) {
          artistes[personne.nom] = [];
      }
      artistes[personne.nom].push(personne);
  });

  // Créer les sections pour chaque artiste
  for (let artiste in artistes) {
      const artistSection = document.createElement('section');
      artistSection.classList.add('artist-section');

      const artistTitle = document.createElement('h2');
      artistTitle.innerText = artiste;
      artistSection.appendChild(artistTitle);

      artistes[artiste].forEach(personne => {
          const articleElement = document.createElement('div');
          articleElement.classList.add('article');

          // Image avec gestion d'erreur
          const img = document.createElement('img');
          img.src = personne.photo;
          img.alt = `Image de ${personne.nom}`;
          img.onerror = () => {
              img.src = 'placeholder.jpg'; // Image de remplacement
              img.classList.add('error-image');
          };

          // Informations associées à l'image
          const infoDiv = document.createElement('div');
          infoDiv.classList.add('info');
          infoDiv.innerHTML = `
              <p><strong>Titre :</strong> ${personne.titre}</p>
              <p><strong>Taille :</strong> ${personne.taille}</p>
          `;

          articleElement.appendChild(img);
          articleElement.appendChild(infoDiv);
          artistSection.appendChild(articleElement);
      });

      container.appendChild(artistSection);
  }
}

// Fonction pour afficher une erreur
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
  displayLoading(); // Affiche un message de chargement pendant le rechargement
  loadCSV(displayArticles);
}

// Fonction pour afficher un message de chargement
function displayLoading() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '<div class="loading">Chargement des articles...</div>';
}

// Chargement automatique au démarrage de la page
document.addEventListener('DOMContentLoaded', () => {
  displayLoading(); // Affiche le message de chargement
  loadCSV(displayArticles); // Charge les données et affiche les articles
});
