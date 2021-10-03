+++
id = "calcul"
weight = 40
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Le calcul de l’EcoIndex

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Les trois critères sont injectés dans notre algorithme pour calculer l’EcoIndex de la page testée. Nous les associons
via une moyenne pondérée de :

- 3 pour le DOM
- 2 pour les requêtes HTTP
- 1 pour le poids des données transférées

Différentes analyses micro et macro soulignent le poids prépondérant du tiers « internaute » en terme d’impacts
environnementaux, surtout lors de la fabrication des équipements. C’est pour cette raison qu’il est surpondéré par
rapport aux autres.

IMAGE CALCUL

Afin de prendre en compte la disparité dans les mesures des trois indicateurs, nous positionnons la valeur constatée
pour chaque critère dans un quantile, en tenant compte de sa proximité avec les bornes inférieures/supérieures du
quantile. Les bornes de l’échelle de l’EcoIndex (0 à 100) ont été mises au point et validées en analysant la base
HTTParchive (500 000 URLs).

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
