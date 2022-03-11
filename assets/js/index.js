import Collapse from "./components/Collapse";
import SiteAnalysisResult from "./components/SiteAnalysisResult";

// TODO: set from .env ? 
// NOTE : if cors problem temp proxy use : "https://cors-anywhere.herokuapp.com/https://ecoindex.p.rapidapi.com/v1/ecoindexes/"
const API_BASE_URL = "https://ecoindex.p.rapidapi.com/v1/ecoindexes/";

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initCollapses();
	initPageResult();
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
 * 
 */
function initPageResult() {
	const resultPageContentEl = document.querySelector(".js-result-container");
	if (!resultPageContentEl) return;
	new SiteAnalysisResult({ el: resultPageContentEl, apiUrl: API_BASE_URL });
}
