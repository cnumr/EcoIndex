+++
id = "methodologie"
weight = 65
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Analysis methodology

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

The ecoindex.fr website uses the [ecoindex_api](https://github.com/cnumr/EcoIndex_python/tree/main/projects/ecoindex_api#readme) API to run page analyses. The ecoindex_api project embeds a [chrome driver for selenium](https://github.com/ultrafunkamsterdam/undetected-chromedriver).

When an analysis is launched, the requested page is loaded in a real Chrome browser and play the following scenario:

1. Launch a headless Chrome browser with `no-sandbox`, `disable-dev-shm-usage` options and `goog:loggingPrefs` capabilities at `{"performance": "ALL"}`
2. Open the page without local data (cache, cookies, localstorage...) with a resolution of 1920x1080px
3. Wait 3 seconds
4. Scroll down
5. Wait 3 seconds again
6. Close the page

If the page is indeed an html page (content type `text/html`) which does not encounter an error (HTTP code 200), then we proceed to analyze the metrics of the session:

- The number of `Network.loadingFinished` type logs indicates the **number of requests** made to external resources
- The sum of all the `encodedDataLength` of these same requests + size of the html of the page itself allows to calculate **the weight of the page**
- The count of all the DOM nodes of the page excluding the child nodes of the `svg` elements tells us **the number of DOM elements** of the page

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
