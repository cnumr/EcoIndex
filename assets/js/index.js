import Collapse from "./components/Collapse";
import A11yDialog from "a11y-dialog";
import SiteAnalysisResult from "./components/SiteAnalysisResult";
import SiteAnalysisFormSubmit from "./components/SiteAnalysisFormSubmit";
import SiteAnalysis from "./components/SiteAnalysis";
import resultCacheService from "./services/resultCacheService";

// TODO: import data with build : https://gohugo.io/hugo-pipes/js/#:~:text=params%20%5Bmap%20or,New%20in%20v0.78.0

// TODO: set from .env ?
const API_BASE_URL = "https://ecoindex.p.rapidapi.com/v1/ecoindexes";
// TODO: temp key, need to create specific one for app
const API_KEY = "3037e7e96fmsh12bedced9f019f8p1cd804jsn4967070f8bda";

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initCollapses();
	initDialog();
	initPageResult();
	initPageAnalysis();
	initSubmitUrlForm();
	initButtonRemakeAnalysis();
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

// ------------------------------------------------------------------------- DIALOG TODO

/**
 * TODO
 */
function initDialog() {
	const dialogEl = document.getElementById("analysis-dialog");
	if (!dialogEl) return;

	const dialog = new A11yDialog(dialogEl);
	const html = document.documentElement;

	dialog
		.on("show", function (dialogEl2, triggerEl) {
			html.style.overflowY = "hidden";
		})
		.on("hide", () => (html.style.overflowY = ""));
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

/**
 * Remake analysis button
 * Takes last analysis done and run an update to analysis
 */
function initButtonRemakeAnalysis() {
	const buttonRemakeEl = document.querySelector(".js-button-retest");
	const loadingOverlayContainer = document.querySelector(".js-loading-overlay");

	if (!buttonRemakeEl || !loadingOverlayContainer) return;
	buttonRemakeEl.addEventListener("click", (e) => {
		e.preventDefault();
		new SiteAnalysis({
			analysisUrl: resultCacheService.getLast().url,
			loadingContainer: loadingOverlayContainer,
			apiUrl: API_BASE_URL,
			apiKey: API_KEY,
		});
	});
}

// ------------------------------------------------------------------------- ANALYSIS PAGE

//TODO: remove
/**
 * Init page analysis post analysis url and get data for result page
 */
function initPageAnalysis() {
	const analysisPageContentEl = document.querySelector(".js-analysis-container");
	if (!analysisPageContentEl) return;
	new SiteAnalysis({
		loaderContainer: analysisPageContentEl,
		apiUrl: API_BASE_URL,
		apiKey: API_KEY,
	});
}

// ------------------------------------------------------------------------- HOME SUBMIT URL FORM

function initSubmitUrlForm() {
	const submitSiteForm = document.querySelector(".js-analysis-submit-form");
	const loadingOverlayContainer = document.querySelector(".js-loading-overlay");

	if (!submitSiteForm || !loadingOverlayContainer) return;
	new SiteAnalysisFormSubmit(submitSiteForm, (url) => {
		new SiteAnalysis({
			analysisUrl: url,
			loadingContainer: loadingOverlayContainer,
			apiUrl: API_BASE_URL,
			apiKey: API_KEY,
		});
	});
}
