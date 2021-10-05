+++
id = "good-practices-tips"
weight = 30
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Some good practices

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Voici, pour commencer, quelques bonnes pratiques à mettre en application !

### Réduire le poids de la page

- **Optimisez les images en choisissant le bon format et réduisant la taille.** Pour les logos et illustrations,
  utilisez le format SVG. Pour les photos préférez le format WebP ou optimisez les jpeg. Pour les icônes, préférez les
  glyphes ou styles CSS.
- **Evitez les vidéos** ou réduisez au maximum leur durée. Prévoyez plusieurs formats adaptés aux contextes de
  visualisation, ou utilisez des services proposant des formats optimisés. Pensez aussi à désactiver l’autoplay.
- **Compresser les fichiers** HTML, CSS, JS, etc.
- **Facilitez la mise en cache navigateur** lors du développement, pour éviter le rechargement des éléments à chaque
  visite.

### Réduire la complexité de la page

- **Limitez le contenu et les fonctionnalités à l’essentiel.** 45% des fonctionnalités ne sont jamais utilisées,
  interrogez le réel besoin.
- **Optez pour l’approche “mobile first”** avant de passer à la version “desktop”. Cela permet de limiter la couverture
  fonctionnelle à l’essentiel, d’éviter de consommer inutilement de la bande passante, et de s’assurer du bon
  fonctionnement sur mobile.
- **Evitez les mécanismes comme l’infinite scroll.** Préférez une action de l’utilisateur pour afficher plus
  d’informations.

### Limiter le nombre de requêtes

- **Utilisez des polices standards** (Arial, Tahoma, Times New Roman, Verdana, etc.), qui n’ont pas besoin d’être
  téléchargées, plutôt que des polices custom.
- **Limitez l’utilisation de widgets et plugins.** Par exemple, remplacez les boutons de réseaux sociaux ou widget
  Googlemaps par une image et un lien.
- **Regroupez les images dans un sprite** et combinez certaines feuilles de styles CSS et librairies Javascript.
- **Favorisez les pages statiques**, quand cela est possible, plutôt que d’utiliser un CMS. Vous pouvez utiliser des
  générateurs de sites statiques ou une architecture JAMstack.

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
