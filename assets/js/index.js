import Collapse from "./components/Collapse";
import SiteAnalysisResult from "./components/SiteAnalysisResult";
import SiteAnalysis from "./components/SiteAnalysis";

// TODO: import data with build : https://gohugo.io/hugo-pipes/js/#:~:text=params%20%5Bmap%20or,New%20in%20v0.78.0

// TODO: set from .env ?
const API_BASE_URL = "https://ecoindex.p.rapidapi.com/v1/ecoindexes";
// TODO: temp key, need to create specific one for app
const API_KEY = "3037e7e96fmsh12bedced9f019f8p1cd804jsn4967070f8bda";

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initCollapses();
	initPageResult();
	initPageAnalysis();
	initSubmitUrlForm();
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
	new SiteAnalysis({ loaderContainer: analysisPageContentEl, apiUrl: API_BASE_URL, apiKey: API_KEY });
}

// ------------------------------------------------------------------------- HOME SUBMIT URL FORM

function initSubmitUrlForm() {
	const submitSiteForm = document.querySelector(".js-analysis-submit-form");
	const loadingOverlayContainer = document.querySelector(".js-loading-overlay");

	if (!submitSiteForm || !loadingOverlayContainer) return;
	// TODO: add to separate file
	submitSiteForm.addEventListener("submit", function (e) {
		e.preventDefault();
		let url = e.target.querySelector("input[name='siteurl']").value;

		const domainNameRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

		// check if is only domain name create url
		if (!url.match(/^(http|https):\/\//) && domainNameRegex.test(url)) {
			url = `https://${url}`;
		}

		// check if is valid url
		if (!isValidHttpUrl(url)) {
			alert("Please enter a valid url");
			return;
		}

		// check if url is valid
		// if (!url || !url.match(/^(http|https):\/\//)) {
		// 	alert("Please enter a valid url");
		// 	return;
		// }

		new SiteAnalysis({
			analysisUrl: url,
			loadingContainer: loadingOverlayContainer,
			apiUrl: API_BASE_URL,
			apiKey: API_KEY,
		});

		// TODO: get url relative to language
		//window.location = `${window.location.origin}/chargement/?url=${url}`;
	});
}

// TODO: add to helpers
function isValidHttpUrl(string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}
