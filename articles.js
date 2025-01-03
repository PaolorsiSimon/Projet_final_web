// Fonction pour charger le fichier CSV
async function loadCSV(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Erreur lors du chargement du fichier CSV: ${response.statusText}`);
      }
      const data = await response.text();
      return parseCSV(data);
  } catch (error) {
      console.error(error);
  }
}

// Fonction pour parser le contenu du CSV
function parseCSV(data) {
  const lines = data.split("\n");
  // Ignore la première ligne (l'en-tête)
  const rows = lines.slice(1).filter(line => line.trim() !== "");
  return rows.map(row => row.trim());
}

// Fonction pour afficher les images dans le conteneur
function displayImages(imageUrls) {
  const container = document.getElementById("articles-container");

  imageUrls.forEach(url => {
      // Crée une nouvelle div pour chaque image
      const div = document.createElement("div");
      div.classList.add("col-md-3", "col-sm-6", "mb-4");
      
      // Crée l'élément image
      const img = document.createElement("img");
      img.src = url;
      img.alt = "Image de street art";
      img.style.width = "100%"; // Ajuste la taille des images pour qu'elles occupent toute la largeur de la div
      img.style.margin = "10px";
      
      // Ajoute l'image dans la div
      div.appendChild(img);
      
      // Ajoute la div au conteneur
      container.appendChild(div);
  });
}

// Charger et afficher les images
(async function () {
  const csvUrl = "https://raw.githubusercontent.com/PaolorsiSimon/Projet_final_web/refs/heads/main/articles.csv";
  const imageUrls = await loadCSV(csvUrl);
  if (imageUrls) {
      displayImages(imageUrls);
  }
})();
