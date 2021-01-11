+++
title= "Le calcul de l'EcoIndex"
date= 2020-12-03T12:22:02+01:00
draft= false
widget= "text"
headless= true  # This file represents a page section.
active= true
weight= 50

+++
Les trois critères sont injectés dans notre algorithme pour calculer l’EcoIndex de la page testée.
Nous les associons via une moyenne pondérée de :
- 3 pour le DOM
- 2 pour les requêtes HTTP
- 1 pour le poids des données transférées

Différentes analyses micro et macro soulignent le poids prépondérant du tiers « internaute » en terme d’impacts environnementaux,
surtout lors de la fabrication des équipements. C’est pour cette raison qu’il est surpondéré par rapport aux autres.

IMAGE CALCUL

Afin de prendre en compte la disparité dans les mesures des trois indicateurs,
nous positionnons la valeur constatée pour chaque critère dans un quantile,
en tenant compte de sa proximité avec les bornes inférieures/supérieures du quantile.
Les bornes de l’échelle de l’EcoIndex (0 à 100) ont été mises au point et validées en analysant la base HTTParchive (500 000 URLs).
