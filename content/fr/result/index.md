+++
title = "Résultat"
slug = "resultat"
custom_class = "js-result-container"
+++

{{< widgets zone="first" type="intro" >}}

{{< widgets type="info-container" >}}

<!-- TODO: find a way to put content in front matter or /data and pass it to javascript in a clean way -->
<!-- Set result relative text content from site notation -->
<script>
const resultRelativeTextData = {
 // Titre en fonction de la note du site (en haut à gauche de la page)
 verdictTitles: {
  A: "Bravo !",
  B: "Pas mal du tout !",
  C: "Encore un effort !",
  D: "Hum, pas top.",
  E: "Hum, pas top.",
  F: "Outch.",
  G: "Outch.",
 },
 // Message verdict en fonction de la note du site (affiché en haut à droite de la page)
 verdictMessages: {
  A: "Le top. On se rapproche dangereusement de la perfection. ",
  B: "Si toutes les pages web pouvaient être aussi légères que celle-ci, le numérique serait plus vert",
  C: "Vous y êtes presque ! Encore quelques efforts et ce sera bon.",
  D: "La bonne nouvelle, c’est que vous pouvez faire beaucoup mieux !",
  E: "La bonne nouvelle, c’est que vous pouvez faire beaucoup mieux !",
  F: "On ne va pas se le cacher : ça fait mal. Il est temps d’agir !",
  G: "On ne va pas se le cacher : ça fait mal. Il est temps d’agir !",
 },
 // "[Left: 'bad result', Right : 'good result']"
 verdictParameters: {
  size: ["Si légère", "Trop lourde"],
  nodes: ["Simple", "Trop complexe"],
  requests: ["Peu de requêtes", "Trop de requêtes"],
 },
 // Paramètres du résultats valeurs min et max pour les plages
 resultParametersMinMaxValues: {
  size: { min: 0, max: 4.82, target: 0.9 },
  nodes: { min: 0, max: 1386, target: 500 },
  requests: { min: 0, max: 156, target: 27 },
 },
 // Paramètres du résultats de l'empreinte environnementale pour les unitées de mesure
 footprintUnitsData: {
     water: { order: ["cl", "l"], factor: 100 },
     ges: {
         order: ["gCO2e", "kgCO2e"],
         factor: 1000,
     },
 }
}
window.__siteData = {...window.__siteData, ...{resultRelativeTextData}}
</script>
