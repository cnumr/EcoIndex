+++
id = "ecoindex"
weight = 40
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## EcoIndex calculation

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

These three criteria are injected into our algorithm to calculate the EcoIndex of the tested page. We associate them via a weighted average of:

- 3 for DOM complexity
- 2 for HTTP requests
- 1 for data transferred size

Various micro and macro analyzes underline the overriding importance of the "Internet user" regarding environmental impacts, especially during the manufacture of connected devices. This is why the "DOM complexity" criteria is "overweighted" compared to the others.

{{% equation %}}

In order to consider the disparity in these 3 indicators measure, we place the value observed for each criterion in a quantile, taking into account its proximity to lower/upper limits of the quantile. Limits of EcoIndex scale (0 to 100) were determined and validated analyzing The HTTP Archive database (500 000 URLs).

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
