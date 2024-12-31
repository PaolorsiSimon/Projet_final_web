// Fonction pour charger les données des artistes à partir du CSV
function loadArtistesCSV(callback) {
  fetch('https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/refs/heads/main/artistes.csv')
      .then(response => response.text())
      .then(data => {
          const rows = data.split('\n');
          const headers = rows[0].split(';');
          const artistes = rows.slice(1).map(row => {
              const cells = row.split(';');
              let artiste = {};
              headers.forEach((header, index) => {
                  artiste[header] = cells[index];
              });
              return artiste;
          });
          callback(artistes);  // Passe les données à la fonction de callback
      })
      .catch(err => console.error('Erreur de chargement du CSV', err));
}

// Fonction pour afficher les informations détaillées de l'artiste sous le nom
function displayArtisteInfo(artistes) {
  const params = new URLSearchParams(window.location.search);
  const nom = params.get('nom');
  const artiste = artistes.filter(a => a.nom.toLowerCase() === nom.toLowerCase()); // Filtrer les artistes correspondants

  if (artiste.length > 0) {
      const infoContainer = document.getElementById('personne-info');
      const artisteInfo = artiste[0];
      
      // Afficher le nom de l'artiste
      infoContainer.innerHTML = `
          <h2>${artisteInfo.nom}</h2>
          <p><strong>Age :</strong> ${artisteInfo.age} ans</p>
          <p><strong>Profession :</strong> ${artisteInfo.profession}</p>
          <p><strong>Description :</strong> ${artisteInfo.description}</p>
      `;

      // Ajouter des métadonnées dans le head pour l'artiste
      const head = document.head;

      // Créer et ajouter une balise meta pour l'artiste
      const metaNom = document.createElement('meta');
      metaNom.name = "artist-name";
      metaNom.content = artisteInfo.nom; // Nom de l'artiste
      head.appendChild(metaNom);

      const metaAge = document.createElement('meta');
      metaAge.name = "artist-age";
      metaAge.content = artisteInfo.age; // Âge de l'artiste
      head.appendChild(metaAge);

      const metaProfession = document.createElement('meta');
      metaProfession.name = "artist-profession";
      metaProfession.content = artisteInfo.profession; // Profession de l'artiste
      head.appendChild(metaProfession);

      const metaDescription = document.createElement('meta');
      metaDescription.name = "artist-description";
      metaDescription.content = artisteInfo.description; // Description de l'artiste
      head.appendChild(metaDescription);

  } else {
      document.getElementById('personne-info').innerHTML = '<p>Artiste non trouvé.</p>';
  }
}

// Charger les données CSV et remplir la page en fonction de l'URL
loadArtistesCSV(artistes => {
  if (document.getElementById('personne-info')) {
      // Si on est sur personne.html, afficher les informations de l'artiste
      displayArtisteInfo(artistes);
  }
});
