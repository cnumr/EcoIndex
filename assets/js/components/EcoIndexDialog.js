import ApiService from "../services/ApiService";
import A11yDialog from "a11y-dialog";
import { replaceKeyIn } from "../helpers/stringUtils";

/**
 * Simple collapse content component
 */
class EcoIndexDialog {
	static #a11yDialog = null;

	static ERROR_MESSAGES = {
		401: `{{- i18n "Error401" | markdownify -}}`,
		403: `{{- i18n "Error403" | markdownify -}}`,
		404: `{{- i18n "Error404" | markdownify -}}`,
		422: `{{- i18n "Error422" | markdownify -}}`,
		429: `{{- i18n "Error429" | markdownify -}}`,
		500: `{{- i18n "Error500" | markdownify  -}}`,
		502: `{{- i18n "Error502" | markdownify  -}}`,
		504: `{{- i18n "Error504" | markdownify  -}}`,
		520: `{{- i18n "Error520" | markdownify  -}}`,
		521: `{{- i18n "Error521" | markdownify  -}}`,
	};

	/**
	 * Open the modal dialog for a pending analysis
	 * with a loading spinner (abort possible)
	 *
	 * @param {string} url URL being analysed
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	static openPendingAnalysis(url) {
		let title = `{{- (i18n "AnalysisInProgressFor") -}}`;
		title = replaceKeyIn(title, "URL", url);

		EcoIndexDialog.#openLoadingRequest(title);
	}

	/**
	 * Open the modal dialog for an analysis retrieval
	 * with a loading spinner (abort possible)
	 */
	static openAnalysisRetrieval() {
		const title = `{{- (i18n "AnalysisRetrieval") -}}`;

		EcoIndexDialog.#openLoadingRequest(title);
	}

	/**
	 * Open the modal dialog and display error information
	 *
	 * @param {string} errorCode Error code, e.g. 429
	 * @param {Object} details Details object given by request error response,
	 *                         e.g. {daily_limit_per_host, host, message}
	 */
	static openErrorMessage(errorCode, details) {
		// Title
		const title = `{{- (i18n "AnalysisErrorTitle") -}}`;

		// Body (message)
		let errorMessage = errorCode
			? EcoIndexDialog.ERROR_MESSAGES[errorCode]
			: `{{- (i18n "AnalysisErrorDefaultMessage") -}}`;
		// Replace variables given in details object
		if (details instanceof Object) {
			for (const [key, value] of Object.entries(details)) {
				errorMessage = replaceKeyIn(errorMessage, key, value);
			}
		}

		EcoIndexDialog.#createAndShowDialog(title, {
			body: `<p>{{- (i18n "AnalysisErrorIntro") | safeHTML -}}</p><p>${errorMessage}</p>`,
		});
	}

	/**
	 * Open the modal dialog to share results with
	 * a text and a "copy to clipboard" button
	 *
	 * @param {string} url Results URL to be shared
	 */
	static openResultSharing(url) {
		// Title
		const title = `{{- (i18n "ShareTheResult") -}}`;

		// Body (message)
		const body = `
<div class="with-sidebar-l --right-side --p75">
<div>
<input id="url-to-copy" type="text" readonly size="40" value="${url}"">
<div><button id="copy-to-clipboard">{{- i18n "CopyURL" -}}</button></div>
</div>
</div>
`;

		EcoIndexDialog.#createAndShowDialog(title, { body });
	}

	/**
	 * Close the modal dialog
	 *
	 * @returns {boolean} true if success, otherwise true
	 */
	static close() {
		const a11yDialog = EcoIndexDialog.#a11yDialog;
		if (!a11yDialog) {
			console.error("EcoIndexDialog not initialized.");
			return false;
		}

		a11yDialog.hide();
		return true;
	}

	/**
	 * Opens the modal dialog to display a "loading in progress" message
	 * with a spinner animation
	 * @param title Title to be displayed on the modal
	 */
	static #openLoadingRequest(title) {
		EcoIndexDialog.#createAndShowDialog(title, {
			actions: [
				{
					cb: function (e) {
						ApiService.abortAnalysis();
						EcoIndexDialog.close();
					},
					label: "{{- i18n `Cancel` -}}",
				},
			],
			hasSpinner: true,
			keepOpen: true,
		});
	}

	/**
	 * Builds HTML content for a modal dialog and attaches it to the DOM
	 *
	 * @param {string}    title - Modal dialog title (mandatory)
	 * @param {Object}    options - The options for the modal dialog
	 * @param {string[]}  [options.actions=[{cb, label}]] - An array of action objects
	 * @param {function}  [options.actions[].cb=close] - The action callback function
	 * @param {string}    [options.actions[].label="{{- i18n `Close` -}}"] - The action label
	 * @param {string}    [options.body=""] - The modal dialog body content (HTML)
	 * @param {boolean}   [options.hasSpinner=false] - Tells if the modal dialog needs a spinner
	 * @param {boolean}   [options.keepOpen=false] - Tells if the modal dialog needs to be kept open
	 *                                               until a button is explicitly activated.
	 *                                               If set to true, [ESC] key and clic on the
	 *                                               overlay panel won't close the modal dialog.
	 */
	static #createAndShowDialog(
		title,
		{
			actions = [{ cb: EcoIndexDialog.close, label: "{{- i18n `Close` -}}" }],
			body = "",
			hasSpinner = false,
			keepOpen = false,
		} = {}
	) {
		const role = keepOpen ? "alertdialog" : "dialog";
		const overlayAttr = keepOpen ? "" : "data-a11y-dialog-hide";
		const modalContainer = document.querySelector("#dialog-here");
		const dialogEl = document.querySelector("#dialog");
		const modal = document.createElement("div");

		modal.classList.add("dialog-container");
		modal.id = "dialog";
		modal.setAttribute("aria-labelledby", "dialog-title");
		modal.setAttribute("role", role);
		modal.innerHTML = `
<div class="dialog-overlay" ${overlayAttr}></div>
<div class="dialog-content stack-l --s3" role="document">
	<h1 id="dialog-title" class="cover-l__middle text-align:center" tabindex="0">${title}</h1>
	<div id="dialog-body">
		${body}
	</div>
	${hasSpinner ? '<div id="dialog-spinner" class="page-loading-spinner"></div>' : ""}
	<div class="dialog-buttons"></div>
</div>
`;

		if (dialogEl) {
			dialogEl.replaceWith(modal);
		} else {
			modalContainer.appendChild(modal);
		}

		const a11yDialog = (EcoIndexDialog.#a11yDialog = new A11yDialog(modal));

		// buttons
		const buttonsEl = modal.querySelector(".dialog-buttons");
		actions.forEach(function (action) {
			const btn = document.createElement("button");
			btn.name = "action";
			btn.innerHTML = action.label;
			buttonsEl.appendChild(btn);
			btn.addEventListener("click", action.cb);
		});

		// Prevent scroll behind the modal
		const html = document.documentElement;
		// prettier-ignore
		a11yDialog
			.on("show", () => (html.style.overflowY = "hidden"))
			.on("hide", function(e) {
				html.style.overflowY = "";
				const dialogEl = document.querySelector("#dialog");
				dialogEl.remove();
			});

		a11yDialog.show();
	}
}

export default EcoIndexDialog;
