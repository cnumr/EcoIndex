const LOADER_LAYOUT_CLASSNAME = "js-loading-overlay";

// takes a layout an set it to visible or hidden
class LoaderLayoutService {
	constructor() {
		this._visible = false;
		this.loadingContainer = document.querySelector(`.${LOADER_LAYOUT_CLASSNAME}`);

		(async () => {
			this.loadingContainer = await this._getLoadingContainer();
		})();
	}

	set visible(value) {
		this.loadingContainer.style.visibility = value ? "visible" : "hidden";
		this.loadingContainer.style.opacity = value ? 1 : 0;
		this.loadingContainer.style.transform = `translateX(${value ? 0 : 999}%)`;
		this._visible = value;
	}

	get visible() {
		return this._visible;
	}

	set url(value) {
		this.loadingContainer.querySelector("[data-int='url']").textContent = value;
	}

	// get loading container
	async _getLoadingContainer() {
		return new Promise((resolve) => {
			const loadingContainer = document.querySelector(`.${LOADER_LAYOUT_CLASSNAME}`);
			if (loadingContainer) {
				resolve(loadingContainer);
			} else {
				document.addEventListener("DOMContentLoaded", () => {
					resolve(document.querySelector(`.${LOADER_LAYOUT_CLASSNAME}`));
				});
			}
		});
	}
}
export default new LoaderLayoutService();
