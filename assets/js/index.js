import Collapse from "./components/Collapse";
import ResultRangeSlider from "./components/ResultRangeSlider";

// ------------------------------------------------------------------------- INIT APP

// TODO: TEMP data json
const tempResultData = {
	size: 2.67,
	nodes: 1063,
	requests: 19
};

function initApp() {
	initMenu();
	initCollapses();
	initResultRangeSliders(tempResultData);
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
	const toolTipElements = document.querySelectorAll(".js-collapse");
	toolTipElements.forEach((collapseElement) => new Collapse(collapseElement));
}

// ------------------------------------------------------------------------- RESULT SLIDERS

function initResultRangeSliders(data) {
	const sliderEls = document.querySelectorAll(".js-rlr-slider");
	sliderEls.forEach((sliderEl) => new ResultRangeSlider({ sliderEl, data }));
}