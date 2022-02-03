/**
 * Simple collapse content component
 */
class Collapse {
	constructor(collapseElement) {
		this.button = collapseElement.querySelector(".js-collapse-button");
		this.content = collapseElement.querySelector(".js-collapse-content");

		window.addEventListener("click", (e) => !collapseElement.contains(e.target) && this.setCollapseVisibility(false));

		this.button.addEventListener("click", () => this.toggleCollapseVisibility());
		this.button.addEventListener("keydown", (e) => {
			if (e.keyCode == 27) {
				this.setCollapseVisibility(false);
			}
		});
	}

	/**
	 * Toggle collapse
	 */
	toggleCollapseVisibility() {
		const isCollapseExpanded = this.button.getAttribute("aria-expanded") === "true";
		this.setCollapseVisibility(!isCollapseExpanded);
	}

	/**
	 * Set input collapse visibility
	 * @param  {boolean} value
	 */
	setCollapseVisibility(value) {
		this.content.classList[value ? "remove" : "add"]("vh");
		this.button.setAttribute("aria-expanded", value ? "true" : "false");
	}
}
export default Collapse;
