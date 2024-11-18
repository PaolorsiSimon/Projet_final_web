// Fonction pour charger les données du CSV
function loadCSV(callback) {
    fetch('personnes.csv')
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
      link.textContent = `${personne.nom} - Voir +`;
      listItem.appendChild(link);
      listContainer.appendChild(listItem);
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
    } else {
      document.getElementById('personne-info').innerHTML = '<p>Personne non trouvée.</p>';
    }
  }
  
  // Charger les données CSV et remplir la page en fonction de l'URL
  loadCSV(personnes => {
    if (document.getElementById('personnes-list')) {
      // Si on est sur index.html, afficher la liste des personnes
      populatePersonnesList(personnes);
    } else if (document.getElementById('personne-info')) {
      // Si on est sur personne.html, afficher les infos de la personne
      displayPersonneInfo(personnes);
    }
  });
  