import ApiService from "../services/ApiService";
import A11yDialog from "a11y-dialog";
import { replaceKeyIn } from "../helpers/stringUtils";

const ERROR_MESSAGES = {
	422: `
{{- i18n "Error422" | markdownify -}}
`,
	429: `
{{- i18n "Error429" | markdownify -}}
`,
	500: `
{{- i18n "Error500" | markdownify  -}}
`,
	502: `
{{- i18n "Error502" | markdownify  -}}
`,
	504: `
{{- i18n "Error504" | markdownify  -}}
`,
	520: `
{{- i18n "Error520" | markdownify  -}}
`,
	521: `
{{- i18n "Error521" | markdownify  -}}
`,
};

/**
 * Simple collapse content component
 */
class EcoIndexDialog {
	#a11yDialog = null;
	#dialogEl = null;
	#titleEl = null;
	#bodyEl = null;
	#spinnerEl = null;
	#actionButtonEl = null;
	#btnEventListener = null;

	get ERROR_MESSAGES() {
		return ERROR_MESSAGES;
	}

	init(dialogId) {
		const dialogEl = (this.#dialogEl = document.getElementById(dialogId));
		this.#titleEl = dialogEl.querySelector("h1");
		this.#bodyEl = dialogEl.querySelector("#dialog-body");
		this.#spinnerEl = dialogEl.querySelector("#dialog-spinner");
		this.#actionButtonEl = dialogEl.querySelector("#action");
		const a11yDialog = (this.#a11yDialog = new A11yDialog(dialogEl));
		const html = document.documentElement;

		// prettier-ignore
		a11yDialog
			.on("show", () => (html.style.overflowY = "hidden"))
			.on("hide", () => (html.style.overflowY = ""));

		return this;
	}

	/**
	 * Open the modal dialog for a pending analysis
	 * with a loading spinner (abort possible)
	 *
	 * @param {string} url URL being analysed
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	openPendingAnalysis(url) {
		const a11yDialog = this.#a11yDialog;
		let title = `
{{- (i18n "AnalysisInProgressFor") -}}`;
		title = replaceKeyIn(title, "URL", url);

		this.#setAsLoadingRequest({ title });

		a11yDialog.show();
	}

	/**
	 * Open the modal dialog for an analysis retrieval
	 * with a loading spinner (abort possible)
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	openAnalysisRetrieval() {
		const a11yDialog = this.#a11yDialog;
		const title = `
{{- (i18n "AnalysisRetrieval") -}}`;

		this.#setAsLoadingRequest({ title });

		a11yDialog.show();
	}

	/**
	 * Open the modal dialog and display error information
	 *
	 * @param {string} errorCode Error code, e.g. 429
	 * @param {Object} details Details object given by request error response,
	 *                         e.g. {daily_limit_per_host, host, message}
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	openErrorMessage(errorCode, details) {
		const a11yDialog = this.#a11yDialog;
		if (!a11yDialog) {
			console.error("EcoIndexDialog not initialized.");
			return false;
		}
		this.#setAsErrorMessage(errorCode, details);

		a11yDialog.show();
		return true;
	}
	/**
	 * Close the modal dialog
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	close() {
		const a11yDialog = this.#a11yDialog;
		if (!a11yDialog) {
			console.error("EcoIndexDialog not initialized.");
			return false;
		}

		a11yDialog.hide();
		return true;
	}

	#setAsLoadingRequest(options) {
		// Title
		const title = this.#titleEl;
		title.textContent = options.title;

		// Spinner
		const spinnerClassList = this.#spinnerEl.classList;
		if (spinnerClassList.contains("display:none")) {
			spinnerClassList.remove("display:none");
		}

		// Body (message)
		this.#bodyEl.innerHTML = "";

		// Button
		const btn = this.#actionButtonEl;
		btn.textContent = "{{- i18n `Cancel` -}}";
		removeEventListener("click", this.#btnEventListener);
		this.#btnEventListener = btn.addEventListener("click", (e) => {
			ApiService.abortAnalysis();
			this.close();
		});
	}

	/**
	 *
	 * @param {int} [errorCode] Error code
	 * @param {Object} [details] Details object
	 */
	#setAsErrorMessage(errorCode, details) {
		// Title
		this.#titleEl.textContent = `
{{- (i18n "AnalysisErrorTitle") -}}`;

		// Spinner
		const spinnerClassList = this.#spinnerEl.classList;
		if (!spinnerClassList.contains("display:none")) {
			spinnerClassList.add("display:none");
		}

		// Body (message)
		let errorMessage = errorCode ? ERROR_MESSAGES[errorCode] : `{{- (i18n "AnalysisErrorDefaultMessage") -}}`;

		// Replace variables given in details object
		if (details instanceof Object) {
			for (const [key, value] of Object.entries(details)) {
				errorMessage = replaceKeyIn(errorMessage, key, value);
			}
		}
		this.#bodyEl.innerHTML = `<p>{{- (i18n "AnalysisErrorIntro") | safeHTML -}}</p><p>${errorMessage}</p>`;

		// Button
		const btn = this.#actionButtonEl;
		btn.textContent = "{{- i18n `Close` -}}";
		removeEventListener("click", this.#btnEventListener);
		this.#btnEventListener = btn.addEventListener("click", (e) => {
			this.close();
		});
	}
}

const EcoIndexDialogObj = new EcoIndexDialog();
export default EcoIndexDialogObj;
