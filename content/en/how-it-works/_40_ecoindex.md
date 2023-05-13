+++
id = "ecoindex"
weight = 40
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## EcoIndex calculation

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

These three criteria are injected into our algorithm to calculate the tested page EcoIndex. We associate them via a weighted average of:

- 3 for DOM complexity
- 2 for HTTP requests
- 1 for data transferred size

Various micro and macro analyzes underline the overriding importance of the "Internet user" regarding environmental impacts, especially during the manufacture of connected devices. This is why the "DOM complexity" criteria is "overweighted" compared to the others.

{{% equation %}}

Afin de prendre en compte la disparité dans les mesures des trois indicateurs, nous positionnons la valeur constatée
pour chaque critère dans un quantile, en tenant compte de sa proximité avec les bornes inférieures/supérieures du
quantile. Les bornes de l’échelle de l’EcoIndex (0 à 100) ont été mises au point et validées en analysant la base
HTTParchive (500 000 URLs).

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
