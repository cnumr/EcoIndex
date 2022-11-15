+++
id = "methodologie"
weight = 65
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Méthodologie d'analyse

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Le site internet ecoindex.fr utilise l'API [ecoindex_api](https://github.com/cnumr/ecoindex_api) pour faire tourner les analyses de page. Le projet ecoindex_api embarque un [driver chrome pour selenium](https://github.com/ultrafunkamsterdam/undetected-chromedriver).

Lorsqu'on lance une analyse, on va donc charger la page demandée dans un vrai navigateur Chrome et jouer le scenario suivant :

1. Lancer un navigateur Chrome headless avec les options `no-sandbox`, `disable-dev-shm-usage` et les capacités `goog:loggingPrefs` à `{"performance": "ALL"}`
2. Ouvrir la page sans données locales (cache, cookies, localstorage...) avec une résolution 1920x1080px
3. Attendre 3 secondes
4. Scroller en bas de page
5. Attendre de nouveau 3 secondes
6. Fermer la page

Si la page est bien une page html (content type `text/html`) qui ne rencontre pas d'erreur (code HTTP 200), alors on procède à l'analyse des métriques de la session :

- Le nombre de logs de type `Network.loadingFinished` indique le **nombre de requêtes** faites à des ressources externes
- La somme de tous les `encodedDataLength` de ces mêmes requêtes + taille du html de la page elle même permet de calculer **le poids de la page**
- Le décompte de tous les noeuds du DOM de la page en excluant les noeuds enfants des éléments `svg` nous indique **le nombre d'éléments du DOM** de la page

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}