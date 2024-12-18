// Fonction pour charger les données du CSV
function loadCSV(callback) {
    fetch('https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/refs/heads/main/personnes.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const personnes = rows.slice(1).map(row => {
          const cells = row.split(',');
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
      if(personne.nom != ''){
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
    const personne = personnes.find(p => p.nom === nom);
  
    if (personne) {
      const infoContainer = document.getElementById('personne-info');
      infoContainer.innerHTML = `
        <h2>${personne.nom}</h2>
        <p><strong>Âge :</strong> ${personne.age}</p>
        <p><strong>Profession :</strong> ${personne.profession}</p>
        <p><strong>Description :</strong> ${personne.description}</p>
      `;
      // Afficher les images de la personne
      displayPersonneImages(personne.dossierImages);
    } else {
      document.getElementById('personne-info').innerHTML = '<p>Personne non trouvée.</p>';
    }
  }
  
  // Fonction pour afficher les images de la personne
  function displayPersonneImages(dossierImages) {
    const imagesContainer = document.getElementById('personne-images');
    imagesContainer.innerHTML = ''; // Réinitialiser les images
  
    // Supposez que chaque personne ait 3 images maximum
    for (let i = 1; i <= 3; i++) {
      const img = document.createElement('img');
      img.src = `images/artistes/${dossierImages}/${dossierImages}_${i}.jpg`;
      img.alt = `${dossierImages}_${i}`;
      img.style.maxWidth = '300px'; // Limite la taille des images pour les rendre responsives
      img.style.margin = '10px';
      imagesContainer.appendChild(img);
    }
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
  