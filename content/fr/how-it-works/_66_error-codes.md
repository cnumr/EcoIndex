+++
id = "codes-erreur"
weight = 66
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Codes erreur

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Dans certains cas, les analyses peuvent tomber en erreur. Voici quelques explications possibles :

- **Code 403:** Le site ecoindex essaye de contourner les protections antibot tels que Datadome, Imperva... Cependant, ce dispositif n'est pas infaillible. Dans le cas où un système antibot détecte ecoindex comme un bot, il renverra un code erreur 403
- **Code 429:** Comme expliqué [ici](#points-importants), nous limitons volontairement les analyses à 10 par jour pour un même nom de domaine. Si vous souhaitez faire plus, vous pouvez déployer [votre propre instance d'API](https://github.com/cnumr/ecoindex_api) ou encore utiliser [l'outil d'analyse en ligne de commande](https://github.com/cnumr/ecoindex_cli)

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
