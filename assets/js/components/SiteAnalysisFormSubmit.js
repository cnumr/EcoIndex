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
		this.submitButton = this.form.querySelector(".js-site-analysis-submit");
		this.form.addEventListener("submit", (e) => this.submitForm(e));
	}
	submitForm(e) {
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

		this.onFormSubmit(url);
	}
}

export default SiteAnalysisFormSubmit;
