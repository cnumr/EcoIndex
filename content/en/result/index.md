+++
title = "Result"
slug = "result"
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
  A: "Well done!",
  B: "Not bad at all!",
  C: "Almost there!",
  D: "Hmm, not great.",
  E: "Hmm, not great.",
  F: "Ouch.",
  G: "Ouch.",
 },
 // Message verdict en fonction de la note du site (affiché en haut à droite de la page)
 verdictMessages: {
  A: "Excellent! We're getting dangerously close to perfection!.",
  B: "If all web pages could be as light as this one, internet would be greener",
  C: "You're almost there! Just a little more effort and it's all good.",
  D: "The good news is that you can do much better!",
  E: "The good news is that you can do much better!",
  F: "Let's not hide it: it hurts. Time to act!",
  G: "Let's not hide it: it hurts. Time to act!",
 },
 // "[Left: 'bad result', Right: 'good result']"
 verdictParameters: {
  size: ["So light", "Too heavy"],
  nodes: ["Simple", "Too complex"],
  requests: ["Few requests", "Too many requests"],
 },
 // Paramètres du résultats valeurs min et max pour les plages
 resultParametersMinMaxValues: {
  size: { min: 0, max: 4.82, target: 1.024 },
  nodes: { min: 0, max: 1386, target: 600 },
  requests: { min: 0, max: 156, target: 40 },
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
