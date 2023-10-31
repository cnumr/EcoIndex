+++
id = "outils"
weight = 40
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## La boîte à outils

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

### Les plugins navigateurs

#### GreenIT Analysis | EcoIndex dans la poche

EcoIndex et certaines bonnes pratiques sont unis dans une même extension ! Sur Chrome et Firefox, vous pouvez tester
l’empreinte environnementale de n’importe quelle page web et constituer un historique pour reproduire le parcours de vos
utilisateur·ices. Si pratique !
<p>
{{% content_link href="https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr" %}}Extension Chrome{{% /content_link %}}
<br>
{{% content_link href="https://addons.mozilla.org/fr/firefox/addon/greenit-analysis/" %}}Extension Firefox{{% /content_link %}}
</p>

Contribuez au code source en allant sur le [GitHub du plugin Greenit Analysis](https://github.com/cnumr/GreenIT-Analysis)

#### Le plugin Ecoindex

Le plugin Ecoindex permet d'afficher le score écoindex existant dans la base de données du site ecoindex.fr d'une page web dans le navigateur. Il est disponible pour Firefox, Chrome, Edge et Opera. Il vous permettra de voir les dernières notes pour une même page, mais également les notes sur les autres pages de votre site. Enfin, il simplifie l'analyse d'une page:

<p>
{{% content_link href="https://chrome.google.com/webstore/detail/ecoindexfr/apeadjelacokohnkfclnhjlihklpclmp" %}}Extension Chrome{{% /content_link %}}
<br>
{{% content_link href="https://addons.mozilla.org/fr/firefox/addon/ecoindex-fr/" %}}Extension Firefox{{% /content_link %}}
<br>
{{% content_link href="https://microsoftedge.microsoft.com/addons/detail/fioadgdggjngcpbeilfgacmddamnhnah" %}}Extension Edge{{% /content_link %}}
<br>
{{% content_link href="https://addons.opera.com/fr/extensions/details/ecoindexfr/" %}}Extension Opera{{% /content_link %}}
</p>

Contribuez au code source en allant sur le [GitHub du plugin Ecoindex](https://github.com/cnumr/ecoindex-browser-plugin)

#### Pourquoi des résultats différents entre ces 2 plugins ?

Les 2 plugins ont des modes de fonctionnement différents pour effectuer des analyses et les résultats peuvent donc différer d'un outil à l'autre:

- Le plugin Greenit Analysis fonctionne dans votre navigateur en tenant compte du contexte actuel de l'utilisateur (Adresse IP, navigateur Plugins installés, cache, cookies de session...). Plus de précisions sur la [documentation du plugin](https://github.com/cnumr/GreenIT-Analysis#r%C3%A9sultats-diff%C3%A9rents-entre-deux-analyses)
- Le plugin Ecoindex utilise l'API ecoindex.fr qui va ouvrir un navigateur chrome vierge à  chaque analyse avec un scenario prédéfini. Plus de précisions sur le [fonctionnement de l'API](https://www.ecoindex.fr/comment-ca-marche/#m%C3%A9thodologie-danalyse)

### Le badge Ecoindex

Le badge Ecoindex permet d'afficher le score écoindex simplement sur votre page. Pour celà, il suffit d'ajouter un code html dans votre page.

<p>
{{% content_link href="https://github.com/cnumr/ecoindex_badge" %}}La page du projet badge Ecoindex{{% /content_link %}}
</p>

### Ecoindex en ligne de commande

Le projet Ecoindex CLI permet de lancer une analyse d'une page web en ligne de commande. Développé en python, il est disponible pour Linux, Mac et Windows. Il vous permettra lancer une analyse d'une page ou d'un ensemble de pages, générer un fichier de résultat au format csv ou json, générer un rapport HTML...

<p>
{{% content_link href="https://github.com/cnumr/ecoindex_cli" %}}La page du projet Ecoindex CLI{{% /content_link %}}
</p>

### GitHub | A vous de jouer

EcoIndex est un projet communautaire et open source qui ne demande qu’à être enrichi via la contribution d’experts et
passionné·es. Vous pouvez consulter à tout moment le GitHub du projet afin de mieux le comprendre et, pourquoi pas, d’y
participer !
<p>
{{% content_link href="https://github.com/cnumr" %}}GitHub Cnumr{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/EcoIndex" %}}GitHub frontend site EcoIndex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_api" %}}GitHub backend site EcoIndex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/GreenIT-Analysis" %}}GitHub plugin GreenIT Analysis{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex-browser-plugin" %}}GitHub plugin Ecoindex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_badge" %}}GitHub badge Ecoindex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_cli" %}}GitHub CLI Ecoindex{{% /content_link %}}
</p>

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
