+++
id = "simple"
weight = 10
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## To put it simply

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Vous entrez une URL dans l’EcoIndex, qui calcule alors la **performance** et **l’empreinte environnementale** de la page
testée :

- **La performance environnementale** est représentée par un score sur 100 et une note de A à G (plus la note est
  élevée, mieux c’est !).
- **L’empreinte environnementale** correspond aux émissions de gaz à effet de serre et à la consommation d’eau générées
  par la page.

Plusieurs critères sont pris en compte par notre méthode de calcul :

- **La complexité de la page** : le DOM (Document Object Model) représente la structure et les éléments d’une page web
  HTML. Plus le DOM comporte d’éléments, **plus la page est complexe à déchiffrer**, et donc à afficher pour le
  navigateur. Concrètement, tout ça signifie un effort plus important à fournir de la part du processeur de votre
  ordinateur pour afficher la page, ce qui **diminue la durée de vie de votre équipement.**
- **Le poids des données transférées** : Avant d’apparaître sur votre écran, une page web est un ensemble de données
  stockées sur un serveur. Lorsque vous accédez à une page, votre navigateur envoie une requête au serveur pour qu’il
  lui communique ces données, afin de les mettre en forme et de les afficher sur votre écran. Seulement voilà : **le
  transport de ces données, plus ou moins lourdes, du serveur au navigateur nécessite de l’énergie.**
- Petite précision : Dans cette version, nous considérons que la connexion est de **type Wi-Fi via ADSL**. Dans la
  prochaine version, nous prendrons en compte différents types de connexions, notamment la 4G. En effet, une **connexion
  4G nécessite jusqu’à 23 fois plus d’énergie** pour transporter la même quantité de données qu’une connexion ADSL.
- **Le nombre de requêtes HTTP** : Ce critère permet de prendre en compte l’effort fait par les serveurs pour afficher
  la page testée. Plus le nombre de requêtes est important pour une même page, plus il faudra de serveurs pour servir
  cette page.

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
