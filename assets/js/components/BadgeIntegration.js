const BFF_BASE = "https://bff.ecoindex.fr";
const BADGE_JS_SRC =
	"https://cdn.jsdelivr.net/gh/cnumr/ecoindex_badge@3/assets/js/ecoindex-badge.js";

const I18N = {
	BadgeCopy: `{{- i18n "BadgeCopy" -}}`,
	BadgeCopied: `{{- i18n "BadgeCopied" -}}`,
};

function t(key) {
	return I18N[key] != null ? I18N[key] : key;
}

/**
 * Interactive EcoIndex badge snippet builder for the result page.
 * Mirrors the browser-extension popup behaviour (preview + theme + copyable HTML).
 */
class BadgeIntegration {
	/**
	 * @param {HTMLElement} root
	 */
	constructor(root) {
		this.root = root;
		this.url = "";
		this.themeEl = root.querySelector(".js-badge-theme");
		this.versionEl = root.querySelector(".js-badge-version");
		this.snippetEl = root.querySelector(".js-badge-snippet");
		this.previewLinkEl = root.querySelector(".js-badge-preview-link");
		this.previewImgEl = root.querySelector(".js-badge-preview-img");
		this.copyBtnEl = root.querySelector(".js-badge-copy");

		this.themeEl?.addEventListener("change", () => this.update());
		this.versionEl?.addEventListener("change", () => this.update());
		this.copyBtnEl?.addEventListener("click", () => this.copySnippet());
	}

	/**
	 * @param {string} url Analysed page URL
	 */
	setUrl(url) {
		this.url = url;
		this.root.hidden = false;
		this.update();
	}

	/**
	 * @returns {"light" | "dark"}
	 */
	getTheme() {
		return this.themeEl?.value === "dark" ? "dark" : "light";
	}

	/**
	 * @returns {"static" | "js"}
	 */
	getVersion() {
		return this.versionEl?.value === "js" ? "js" : "static";
	}

	update() {
		if (!this.url) return;

		const theme = this.getTheme();
		const version = this.getVersion();
		const redirectUrl = `${BFF_BASE}/redirect/?url=${encodeURIComponent(this.url)}`;
		const badgeUrl = `${BFF_BASE}/badge/?theme=${theme}&url=${encodeURIComponent(this.url)}`;

		this.previewLinkEl?.setAttribute("href", redirectUrl);
		this.previewImgEl?.setAttribute("src", badgeUrl);

		if (this.snippetEl) {
			this.snippetEl.textContent =
				version === "js" ? this.#buildJsSnippet(theme) : this.#buildStaticSnippet(redirectUrl, badgeUrl);
		}

		if (this.copyBtnEl) {
			this.copyBtnEl.textContent = t("BadgeCopy");
		}
	}

	/**
	 * @param {string} redirectUrl
	 * @param {string} badgeUrl
	 * @returns {string}
	 */
	#buildStaticSnippet(redirectUrl, badgeUrl) {
		return `<a href="${redirectUrl}" target="_blank">
    <img src="${badgeUrl}" alt="Ecoindex Badge" />
</a>`;
	}

	/**
	 * @param {"light" | "dark"} theme
	 * @returns {string}
	 */
	#buildJsSnippet(theme) {
		const themeAttr = theme === "dark" ? ' data-theme="dark"' : "";
		return `<div id="ecoindex-badge"${themeAttr}></div>
<script src="${BADGE_JS_SRC}" defer></script>`;
	}

	async copySnippet() {
		const text = this.snippetEl?.textContent;
		if (!text || !this.copyBtnEl) return;

		try {
			await navigator.clipboard.writeText(text);
			this.copyBtnEl.textContent = t("BadgeCopied");
			window.setTimeout(() => {
				this.copyBtnEl.textContent = t("BadgeCopy");
			}, 2000);
		} catch {
			const range = document.createRange();
			range.selectNodeContents(this.snippetEl);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}
}

export default BadgeIntegration;
