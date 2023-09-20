![Image of CnumR](./collectif-conception-numerique-responsable-logo.png)

# EcoIndex

(English version below)

[EcoIndex](http://www.ecoindex.fr/) est un outil du
[Collectif Conception Numérique Responsable](https://collectif.greenit.fr/)

## Contribuer

La contribution à l’ensemble de nos outils est ouvert à tout le monde, après s’être fait connaitre du collectif,

Nous recherchons des personnes ayant des connaissances dans la tech, et dans le domaine de la traduction.

Pour faciliter les échanges, un channel #ecoIndex est dédié au projet sur le
[Mattermost de l'association GreenIt](https://chat.greenit.eco/)

## Le Projet

La nouvelle version d’EcoIndex (V3) est réalisée avec [Hugo](https://gohugo.io/).

Le projet se base sur le module Hugo
[base-structure](https://gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure).

### Installation

#### Local

1. Téléchargez et installez la dernière version _extented_ disponible de Hugo
   ([procédure d'installation de Hugo, en anglais](https://gohugo.io/getting-started/installing/)).
2. Téléchargez et installez la dernière version de NodeJS
   ([page de téléchargement de NodeJS](https://nodejs.org/fr/download/)).
3. Depuis un terminal :
   1. Clonez ce dépôt avec la commande `git clone https://github.com/cnumr/EcoIndex.git` ou avec
      `git clone git@github.com:cnumr/EcoIndex.git` si vous utilisez SSH.
   2. Installez les dernières dépendances avec la commmande `npm install`.
   3. Démarrez le serveur Hugo avec la commande `hugo server`.
4. Rendez-vous à l'adresse <http://localhost:1313> avec votre navigateur web.

#### Dans un Devcontainer (avec VSCode + Docker)

##### Prérequis

- Docker
- VSCODE
- Extension pack vscode :
  `[ms-vscode-remote.vscode-remote-extensionpack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)`

1. Clonez ce dépôt avec la commande `git clone https://github.com/cnumr/EcoIndex.git` ou avec
   `git clone git@github.com:cnumr/EcoIndex.git` si vous utilisez SSH.
2. Soit faire [CTRL/CMD]+[SHIFT]+P ou cliquer dans le coin à gauche de la fenètre VSCode et faire
   `Dev Containers: Reopen in Container` et le laisser se lancer ⏳

**Relancer si problème**  
Faire [CTRL/CMD]+[SHIFT]+P ou cliquer dans le coin à gauche de la fenètre VSCode et faire
`Dev Containers: Rebuild Without Cache and Reopen in Container` et le laisser se lancer ⏳

**Sortir du mode Devcontainer**  
Faire [CTRL/CMD]+[SHIFT]+P ou cliquer dans le coin à gauche de la fenètre VSCode et faire
`Dev Containers: Reopen Folder Locally` et le laisser se fermer ⏳

### Astuces pour les développeurs

#### Tester le build de prod en local

```sh
$ hugo serve --environment production
```

#### Tester le projet en local avec des clones locaux de modules utilisés dans le projet (ex. [Good Impact Base Structure](https://gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure/edit#js-general-project-settings) et [Every Layout Pure CSS](https://gitlab.com/goodimpact/every-layout-css)

```sh
$ env HUGO_MODULE_REPLACEMENTS="gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure -> ~/workspace/modules/base-structure,gitlab.com/goodimpact/every-layout-css -> ~/workspace/every-layout-css" hugo serve
```

(Cet exemple suppose que le code des modules se trouve dans ~/workspace)

Pour plus de praticité, on peut écrire un script :

`~/dev.sh`

```sh
#!/bin/bash
cmd="";
for cmdPart in "$@"
do
    cmd+=$cmdPart;
		cmd+=" "
done

res="env HUGO_MODULE_REPLACEMENTS=\"gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure -> ~/workspace/modules/base-structure,gitlab.com/goodimpact/every-layout-css -> ~/workspace/every-layout-css"\" "

res+=$cmd

echo $res

bash -c "$res"
```

et l'utiliser ainsi :

```sh
$ ~/dev.sh hugo serve
```

ou par exemple :

```sh
$ ~/dev.sh hugo serve --environment production
```

### Déploiement

Déploiement automatique grace aux Github Actions (WIP)

## Licence

Le site internet www.ecoindex.fr, ainsi que les règles d'analyses et de calcul de l'ecoindex sont publiés
[sous licence Creative Commons BY-NC-ND](LICENSE.md). Cela signifie que vous pouvez l'utiliser librement pour des
utilisations non commerciales, à la condition de maintenir la paternité du contenu, via un lien vers
http://www.ecoindex.fr

---

![Image of CnumR](./collectif-conception-numerique-responsable-logo.png)

# EcoIndex

[EcoIndex](http://www.ecoindex.fr/) is a tool from the french
[Collectif Conception Numérique Responsable](https://collectif.greenit.fr/)

## Contribute

All of our tools are open to contributions from everybody, after having contacted the collective.

We seek people with technical skills, and people able to make translations and localizations.

There’s a dedicated [Mattermost channel](https://chat.greenit.eco/) for the project.

## The project

The new version of EcoIndex is built with [Hugo](https://gohugo.io/).

The project is based on the Hugo module
[base-structure](https://gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure).

### Setup

1. Download and install the latest _extented_ version available of Hugo
   ([Hugo installation procedure](https://gohugo.io/getting-started/installing/)).
2. Download and install the latest version of NodeJS ([NodeJS download page](https://nodejs.org/en/download/)).
3. From a terminal :
   1. Clone this repository with the command `git clone https://github.com/cnumr/EcoIndex.git` or with
      `git clone git@github.com:cnumr/EcoIndex.git` if you prefer to use SSH.
   2. Install the latest dependencies with the command `npm install`.
   3. Start the Hugo server with the command `hugo server`.
4. Go to <http://localhost:1313> with your web browser.

### Tips for developers

#### Testing production build on dev environment

```sh
$ hugo serve --environment production
```

#### Testing on dev environment with local checkouts of the modules used in the project (ex. [Good Impact Base Structure](https://gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure/edit#js-general-project-settings) et [Every Layout Pure CSS](https://gitlab.com/goodimpact/every-layout-css)

```
$ env HUGO_MODULE_REPLACEMENTS="gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure -> ~/workspace/modules/base-structure,gitlab.com/goodimpact/every-layout-css -> ~/workspace/every-layout-css" hugo serve
```

(this example assumes you have cloned the modules in ~/workspace)

For more convenience, you can write a script:

`~/dev.sh`

```sh
#!/bin/bash
cmd="";
for cmdPart in "$@"
do
    cmd+=$cmdPart;
		cmd+=" "
done

res="env HUGO_MODULE_REPLACEMENTS=\"gitlab.com/goodimpact/goodimpact-hugo/modules/base-structure -> ~/workspace/modules/base-structure,gitlab.com/goodimpact/every-layout-css -> ~/workspace/every-layout-css"\" "

res+=$cmd

echo $res

bash -c "$res"
```

and use it like this:

```sh
$ ~/dev.sh hugo serve
```

ou for example:

```sh
$ ~/dev.sh hugo serve --environment production
```

### Deployment

Automatic deploys thanks to Github Actions (WIP)

## License

The website www.ecoindex.fr, as well as the ecoindex analysis and calculation rules are published
[under Creative Commons BY-NC-ND license](LICENSE.md). This means that you can use it freely for non-commercial uses, on
condition that you maintain the authorship of the content, via a link to http://www.ecoindex.fr
