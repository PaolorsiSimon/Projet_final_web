Pour essayer de tenter quelque chose de plus compliquer, je me suis permis de réaliser un site web avec des informations qui s'affiche dynamiquement.
C'est pourquoi il n'y à qu'un seul fichier personne.html.
Les liens raw présents dans les codes javascripts peuvent avoir des défauts de mises à jours à cause du cache.
J'utilise les liens raw car avec le fetch, je n'arrivais pas à accéder à mes fichiers csv en local.

La structure du projet est comme suis :

Des pages HTML qui on des balises avec des identifiants
Des fichiers CSV déposées sur GitHub, donc avec un lien raw unique pour récupéré les données
des fichiers JS pour récupérés les données des CSV, puis n'affiché que les données en fonctions de l'identifiants des div
Les métadonnées sont aussi créer en fonction des informations récupérées dans le CSV.
Pour consulter les métadonnées, appyez sur F12 puis aller dans "elements", les métadonnées n'étant pas écritent dans le fichier sources, vous ne pourrez pas les voir dans "sources".