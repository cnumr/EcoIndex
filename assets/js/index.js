import Collapse from "./components/Collapse";
import SiteAnalysisResult from "./components/SiteAnalysisResult";
import SiteAnalysis from "./components/SiteAnalysis";

// TODO: import data with build : https://gohugo.io/hugo-pipes/js/#:~:text=params%20%5Bmap%20or,New%20in%20v0.78.0

// TODO: set from .env ?
const API_BASE_URL = "https://ecoindex.p.rapidapi.com/v1/ecoindexes";
// TODO: temp key, need to create specific one for app
const API_KEY = "51197e770dmsh4bb4d48dd9356f7p180b7ajsn3f92a9e6a2ce";

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initCollapses();
	initPageResult();
	initPageAnalysis();
}

// init app on dom loaded
window.addEventListener("DOMContentLoaded", initApp);

// ------------------------------------------------------------------------- MENU

function initMenu() {
	// Menu toggle button
	const menuBtn = document.querySelector(".menu-btn");
	const mainNavContainer = document.querySelector(".main-nav-container");

	menuBtn &&
		menuBtn.addEventListener("click", function () {
			let expanded = menuBtn.getAttribute("aria-expanded") === "true";
			menuBtn.setAttribute("aria-expanded", !expanded);
			mainNavContainer.dataset["open"] = !expanded;
		});
}

// ------------------------------------------------------------------------- COLLAPSES

/*
 * Init all interactive collapses on page
 */
function initCollapses() {
	const collapseElements = document.querySelectorAll(".js-collapse");
	collapseElements.forEach((collapseElement) => new Collapse(collapseElement));
}

// ------------------------------------------------------------------------- RESULT PAGE

/**
 * Init page result interactive data from api or url params
 */
function initPageResult() {
	const resultPageContentEl = document.querySelector(".js-result-container");
	if (!resultPageContentEl) return;
	new SiteAnalysisResult({ el: resultPageContentEl, apiUrl: API_BASE_URL, apiKey: API_KEY });
}

// ------------------------------------------------------------------------- ANALYSIS PAGE

/**
 * Init page analysis post analysis url and get data for result page
 */
function initPageAnalysis() {
	const analysisPageContentEl = document.querySelector(".js-analysis-container");
	if (!analysisPageContentEl) return;
	new SiteAnalysis({ el: analysisPageContentEl, apiUrl: API_BASE_URL, apiKey: API_KEY });
}
