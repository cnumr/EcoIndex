import { isValidHttpUrl } from "../helpers/urlUtils";

/**
 * Create a new site analysis form submit controller
 * @class
 */
class SiteAnalysisFormSubmit {
	/**
	 * Constructor of SiteAnalysisFormSubmit
	 * @param {HTMLFormElement} form - Form element
	 * @param {Function} onFormSubmit - Callback on form submit with url as param
	 */
	constructor(form, onFormSubmit) {
		this.form = form;
		this.onFormSubmit = onFormSubmit;
		this.inputUrl = this.form.elements.siteurl;
		this.submitButton = this.form.querySelector(".js-site-analysis-submit");
		this.form.addEventListener("submit", (e) => this.submitForm(e));
	}
	submitForm(e) {
		e.preventDefault();
		let url = e.target.querySelector("input[name='siteurl']").value;

		const domainNameRegex =
			/^([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9]{1})?)?(\.[a-zA-Z]{2,4})+$/;

		// check if is only domain name create url
		if (!url.match(/^(http|https):\/\//) && domainNameRegex.test(url)) {
			url = `https://${url}`;
		}

		// check if is valid url
		if (!isValidHttpUrl(url)) {
			// Get error message from input url title and insert at end of form
			const errorMessage = this.inputUrl.title;
			if (!this.form.querySelector(".form-error")) {
				this.form.insertAdjacentHTML("beforeend", `<p class="form-error">${errorMessage}</p>`);
			}
			this.inputUrl.setAttribute("aria-invalid", "true");

			return;
		}

		this.inputUrl.setAttribute("aria-invalid", "false");

		this.onFormSubmit(url);
	}
}

export default SiteAnalysisFormSubmit;
