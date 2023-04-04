+++
id="tools"
weight = 40
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## The toolbox

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

### Browser plugins

#### Green IT Analysis | EcoIndex in the pocket

EcoIndex and some good practices are united in the same extension! On Chrome and Firefox, you can test
the environmental footprint of any web page and build a history to reproduce the path of your
users. So practical!
<p>
{{% content_link href="https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr" %}}Chrome extension{{% /content_link %}}
<br>
{{% content_link href="https://addons.mozilla.org/fr/firefox/addon/greenit-analysis/" %}}Firefox extension{{% /content_link %}}
</p>

Contribute the source code by going to the [Greenit Analysis Plugin GitHub](https://github.com/cnumr/GreenIT-Analysis)

#### The Ecoindex plugin

The Ecoindex plugin allows you to display the existing ecoindex score in the database of the ecoindex.fr site of a web page in the browser. It is available for Firefox, Chrome, Edge and Opera. It will allow you to see the latest ratings for the same page, but also the ratings on the other pages of your site. Finally, it simplifies the analysis of a page:

<p>
{{% content_link href="https://chrome.google.com/webstore/detail/ecoindexen/apeadjelacokohnkfclnhjlihklpclmp" %}}Chrome Extension{{% /content_link %}}
<br>
{{% content_link href="https://addons.mozilla.org/fr/firefox/addon/ecoindex-fr/" %}}Firefox extension{{% /content_link %}}
<br>
{{% content_link href="https://microsoftedge.microsoft.com/addons/detail/fioadgdggjngcpbeilfgacmddamnhnah" %}}Edge Extension{{% /content_link %}}
<br>
{{% content_link href="https://addons.opera.com/fr/extensions/details/ecoindexfr/" %}}Opera extension{{% /content_link %}}
</p>

Contribute the source code by going to the [Ecoindex plugin GitHub](https://github.com/cnumr/ecoindex-browser-plugin)

#### Why different results between these 2 plugins?

The 2 plugins have different operating modes to perform analyzes and the results may therefore differ from one tool to another:

- The Greenit Analysis plugin works in your browser taking into account the current context of the user (IP address, browser Plugins installed, cache, session cookies...). More details on the [plugin documentation](https://github.com/cnumr/GreenIT-Analysis#r%C3%A9sultats-diff%C3%A9rents-entre-deux-analyses)
- The Ecoindex plugin uses the ecoindex.fr API which will open a blank chrome browser on each analysis with a predefined scenario. More details on the [operation of the API](https://www.ecoindex.fr/comment-ca-marche/#m%C3%A9thodologie-danalyse)

### The Ecoindex badge

The Ecoindex badge makes it easy to display the ecoindex score on your page. To do this, simply add an html code to your page.

<p>
{{% content_link href="https://github.com/cnumr/ecoindex_badge" %}}The Ecoindex badge project page{{% /content_link %}}
</p>

### Ecoindex command line

The Ecoindex CLI project makes it possible to launch an analysis of a web page from the command line. Developed in python, it is available for Linux, Mac and Windows. It will allow you to launch an analysis of a page or a set of pages, generate a result file in csv or json format, generate an HTML report...

<p>
{{% content_link href="https://github.com/cnumr/ecoindex_cli" %}}The Ecoindex CLI project page{{% /content_link %}}
</p>

### GitHub | Up to you

EcoIndex is a community and open source project that only asks to be enriched through the contribution of experts and
passionate. You can consult the GitHub of the project at any time in order to better understand it and, why not, to
participate !
<p>
{{% content_link href="https://github.com/cnumr" %}}GitHub Cnumr{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/EcoIndex" %}}GitHub frontend site EcoIndex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_api" %}}GitHub backend site EcoIndex{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/GreenIT-Analysis" %}}GitHub plugin GreenIT Analysis{{% /content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex-browser-plugin" %}}GitHub Ecoindex plugin{{%/content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_badge" %}}GitHub Ecoindex badge{{%/content_link %}}
<br>
{{% content_link href="https://github.com/cnumr/ecoindex_cli" %}}GitHub CLI Ecoindex{{%/content_link %}}
</p>

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
