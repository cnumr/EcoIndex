![Image of CnumR](./public/Collectif_conception_numerique.png)

# EcoIndex

[EcoIndex](http://www.ecoindex.fr/) est un outils du [Collectif Conception Numérique Responsanle](https://collectif.greenit.fr/) 

## Contribuer

La contribution à l'ensemble de nos outils est ouvert à tout le monde, après s'être fait connaitre du collectif, 

Nous recherchons des personnes ayant des connaissances dans la tech, et dans le domaine de la traduction. 

Pour faciliter les échanges, un channel #ecoIndex est dédié au projet sur le [Slack du cNumR](https://cnumr.slack.com)

## Le Projet
La nouvelle version d'EcoIndex (V3) est réalisée avec le Framework PHP [Symfony](https://symfony.com/) (>=5.0)

#### Installation

Récupérer ce dépot via la commande suivante : 

```git
git clone https://github.com/cnumr/EcoIndex.git
```

Après avoir rccupéré la version actuelle du dépôt, vérifier que votre version de PHP et les exetnsions à activer 
sont bien en adéquation avec le fichier [composer.json](./composer.json) de ce projet. 

:warning: N'oubliez qu'il s'agit d'un projet `Symmfony >=5` il faut donc que vous ayez également installé le 
[Setup Symfony](https://symfony.com/download) pour continuer.

Vous pouvez désormais installer les dépendances avec la commande [composer](https://getcomposer.org/download/) suivante : 

```bash 
composer install
```

Enfin, vous pouvez démarrer une instance locale via la commande symfony suivante :

```bash
symfony server:start
``` 

#### Qualité

##### Prévenir les erreurs de code

Vous pouvez executer [PHPStan](https://github.com/phpstan/phpstan) via la commande suivante : 
```bash
.\vendor\bin\phpstan analyse
```

##### Executer les tests



##### Executer le linter 
 
