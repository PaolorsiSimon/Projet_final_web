// Fonction pour charger les données du CSV
function loadCSV(callback) {
    fetch('https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/refs/heads/main/images_personnes.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(';');
        const personnes = rows.slice(1).map(row => {
          const cells = row.split(';');
          let personne = {};
          headers.forEach((header, index) => {
            personne[header] = cells[index];
          });
          return personne;
        });
        callback(personnes);
      })
      .catch(err => console.error('Erreur de chargement du CSV', err));
  }
  
  // Fonction pour remplir la liste des personnes sur index.html
  function populatePersonnesList(personnes) {
    const listContainer = document.getElementById('personnes-list');
    personnes.forEach(personne => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `personne.html?nom=${encodeURIComponent(personne.nom)}`;
      if (personne.nom != '') {
        link.textContent = `${personne.nom} - Voir +`;
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
      }
    });
  }
  
  // Fonction pour afficher les informations d'une personne sur personne.html
  function displayPersonneInfo(personnes) {
    const params = new URLSearchParams(window.location.search);
    const nom = params.get('nom');
    const personne = personnes.filter(p => p.nom.toLowerCase() === nom.toLowerCase()); // Filtrer toutes les personnes correspondant à ce nom
  
    if (personne.length > 0) {
      const infoContainer = document.getElementById('personne-info');
      infoContainer.innerHTML = `
        <h2>${personne[0].nom}</h2>
        <p><strong>Titre :</strong> ${personne[0].titre}</p>
        <p><strong>Taille :</strong> ${personne[0].taille}</p>
      `;
      // Afficher les images de la personne avec leurs informations
      displayPersonneImages(personne);
    } else {
      document.getElementById('personne-info').innerHTML = '<p>Personne non trouvée.</p>';
    }
  }
  
  // Fonction pour afficher toutes les images de la personne avec leurs informations
  function displayPersonneImages(personne) {
    const imagesContainer = document.getElementById('personne-images');
    imagesContainer.innerHTML = ''; // Réinitialiser les images
  
    // Créer un conteneur pour chaque image avec ses informations associées
    personne.forEach(p => {
      const imageItem = document.createElement('div');
      imageItem.style.display = 'flex';  // Utilisation de flexbox pour afficher côte à côte
  
      // Image
      const img = document.createElement('img');
      img.src = p.photo;  // Utiliser le chemin de l'image à partir du CSV
      img.alt = `Image de ${p.nom}`;
      img.style.maxWidth = '300px'; // Limiter la taille des images
      img.style.margin = '10px';
  
      // Informations associées à l'image
      const info = document.createElement('div');
      info.style.marginLeft = '15px';
  
      const titre = document.createElement('p');
      titre.innerHTML = `<strong>Titre :</strong> ${p.titre}`;
  
      const taille = document.createElement('p');
      taille.innerHTML = `<strong>Taille :</strong> ${p.taille}`;
  
      // Ajouter l'image et les informations au conteneur
      info.appendChild(titre);
      info.appendChild(taille);
  
      imageItem.appendChild(img);
      imageItem.appendChild(info);
      imagesContainer.appendChild(imageItem);
    });
  }
  
  // Charger les données CSV et remplir la page en fonction de l'URL
  loadCSV(personnes => {
    if (document.getElementById('personnes-list')) {
      // Si on est sur index.html, afficher la liste des personnes
      populatePersonnesList(personnes);
    } else if (document.getElementById('personne-info')) {
      // Si on est sur personne.html, afficher les infos de la personne et les images
      displayPersonneInfo(personnes);
    }
  });
  