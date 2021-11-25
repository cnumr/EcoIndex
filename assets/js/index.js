// TODO: split js like css

// ------------------------------------------------------------------------- INIT APP

function initApp() {
	initMenu();
	initToolTips();
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

// ------------------------------------------------------------------------- TOOLTIPS

/*
 * Init all interactive tooltips on page
 */
function initToolTips() {
	const toolTipElements = document.querySelectorAll(".js-tooltip");
	toolTipElements.forEach((tooltipElement) => new Tooltip(tooltipElement));
}

class Tooltip {
	constructor(tooltipElement) {
		this.button = tooltipElement.querySelector(".js-tooltip-button");
		this.content = tooltipElement.querySelector(".js-tooltip-content");

		["mouseover", "focus"].forEach((eventName) =>
			this.button.addEventListener(eventName, () => this.setToolTipVisibility(true))
		);
		["mouseout", "blur"].forEach((eventName) =>
			this.button.addEventListener(eventName, () => this.setToolTipVisibility(false))
		);
		this.button.addEventListener("keydown", (e) => {
			if (e.keyCode == 27) {
				this.setToolTipVisibility(false);
			}
		});
	}

	/**
	 * Toggle tooltip
	 */
	toggleToolTipVisibility() {
		const isTooltipExpanded = this.button.getAttribute("aria-expanded") == "true";
		this.setToolTipVisibility(this.button, this.content, !isTooltipExpanded);
	}

	/**
	 * Set input tooltip visibility
	 * @param  {boolean} value
	 */
	setToolTipVisibility(value) {
		this.content.classList[value ? "remove" : "add"]("visually-hidden");
		this.button.setAttribute("aria-expanded", value ? "true" : "false");
	}
}
