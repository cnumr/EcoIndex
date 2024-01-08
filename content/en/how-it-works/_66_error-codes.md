+++
id = "codes-erreur"
weight = 66
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Error codes

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

In some cases, the analyzes can fall into error. Here are some possible explanations:

- **Code 403:** The ecoindex site tries to circumvent antibot protections such as Datadome, Imperva... However, this feature is not infallible. In case an antibot system detects ecoindex as a bot, it will return a 403 error code
- **Code 429:** As explained [here](#points-important), we voluntarily limit analyzes to 10 per day for the same domain name. If you want to do more, you can deploy [your own API instance](https://github.com/cnumr/ecoindex_api) or use the [command line analyzer tool](https://github.com/cnumr/ecoindex_cli)

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
