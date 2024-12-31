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
            callback(personnes);  // Passe les données à la fonction de callback
        })
        .catch(err => console.error('Erreur de chargement du CSV', err));
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
        `;
        console.log(personne[0]);
  
        // Insérer des métadonnées globales pour l'artiste
        const head = document.head;
  
        // Créer et ajouter une balise meta pour l'artiste (nom)
        const metaArtist = document.createElement('meta');
        metaArtist.name = "artist";
        metaArtist.content = personne[0].nom; // Nom de l'artiste
        head.appendChild(metaArtist);
  
        // Regrouper les images de cet artiste
        const imagesParArtiste = groupImagesByArtist(personne);
  
        // Ajouter des métadonnées spécifiques à chaque tableau d'images
        Object.keys(imagesParArtiste).forEach(artistName => {
            const metaTableau = document.createElement('meta');
            metaTableau.name = "image-group";
            metaTableau.content = `Tableau de ${artistName}`;
            head.appendChild(metaTableau);
  
            // Afficher les images du tableau de cet artiste
            displayPersonneImages(imagesParArtiste[artistName]);
        });
  
    } else {
        document.getElementById('personne-info').innerHTML = '<p>Personne non trouvée.</p>';
    }
  }
  
  // Fonction pour regrouper les images par artiste
  function groupImagesByArtist(personne) {
    const grouped = {};
  
    personne.forEach(p => {
        if (!grouped[p.nom]) {
            grouped[p.nom] = [];
        }
        grouped[p.nom].push(p);
    });
  
    return grouped;
  }
  
  // Fonction pour afficher toutes les images d'un artiste avec leurs informations
  function displayPersonneImages(images) {
    const imagesContainer = document.getElementById('personne-images');
    imagesContainer.innerHTML = ''; // Réinitialiser les images
  
    // Créer une section d'articles
    const articleSection = document.createElement('section');
    articleSection.classList.add('artist-section'); // Classe pour la section des articles
    imagesContainer.appendChild(articleSection);
  
    // Afficher toutes les images de l'artiste
    images.forEach(p => {
        const divArticle = document.createElement('div');  // Créer une div avec la classe "article" pour chaque image
        divArticle.classList.add('article');
  
        // Image
        const img = document.createElement('img');
        img.src = p.photo;  // Utiliser le chemin de l'image à partir du CSV
        img.alt = `Image de ${p.nom}`;
  
        // Informations associées à l'image
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
  
        const titre = document.createElement('p');
        titre.innerHTML = `<strong>Titre :</strong> ${p.titre}`;
  
        const taille = document.createElement('p');
        taille.innerHTML = `<strong>Taille :</strong> ${p.taille}`;
  
        // Ajouter l'image et les informations au conteneur
        infoDiv.appendChild(titre);
        infoDiv.appendChild(taille);
  
        // Ajouter l'image et les informations à la div article
        divArticle.appendChild(img);
        divArticle.appendChild(infoDiv);
  
        // Ajouter la div article à la section d'articles
        articleSection.appendChild(divArticle);
  
        // Ajouter des métadonnées pour chaque image (Titre et Taille)
        const head = document.head;
  
        const metaImageTitle = document.createElement('meta');
        metaImageTitle.name = "image-title";
        metaImageTitle.content = p.titre;
        head.appendChild(metaImageTitle);
  
        const metaImageSize = document.createElement('meta');
        metaImageSize.name = "image-size";
        metaImageSize.content = p.taille;
        head.appendChild(metaImageSize);
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
  