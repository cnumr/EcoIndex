import { t } from '../helpers/i18n';

const BFF_BASE = 'https://bff.ecoindex.fr';
const BADGE_JS_SRC =
	'https://cdn.jsdelivr.net/gh/cnumr/ecoindex_badge@3/assets/js/ecoindex-badge.js';

/**
 * Interactive EcoIndex badge snippet builder for the result page.
 */
class BadgeIntegration {
	root: HTMLElement;
	url: string;
	themeEl: HTMLSelectElement | null;
	versionEl: HTMLSelectElement | null;
	snippetEl: HTMLElement | null;
	previewLinkEl: HTMLAnchorElement | null;
	previewImgEl: HTMLImageElement | null;
	copyBtnEl: HTMLElement | null;

	constructor(root: HTMLElement) {
		this.root = root;
		this.url = '';
		this.themeEl = root.querySelector('.js-badge-theme');
		this.versionEl = root.querySelector('.js-badge-version');
		this.snippetEl = root.querySelector('.js-badge-snippet');
		this.previewLinkEl = root.querySelector('.js-badge-preview-link');
		this.previewImgEl = root.querySelector('.js-badge-preview-img');
		this.copyBtnEl = root.querySelector('.js-badge-copy');

		this.themeEl?.addEventListener('change', () => this.update());
		this.versionEl?.addEventListener('change', () => this.update());
		this.copyBtnEl?.addEventListener('click', () => this.copySnippet());
	}

	setUrl(url: string): void {
		this.url = url;
		this.root.hidden = false;
		this.update();
	}

	getTheme(): 'light' | 'dark' {
		return this.themeEl?.value === 'dark' ? 'dark' : 'light';
	}

	getVersion(): 'static' | 'js' {
		return this.versionEl?.value === 'js' ? 'js' : 'static';
	}

	update(): void {
		if (!this.url) return;

		const theme = this.getTheme();
		const version = this.getVersion();
		const redirectUrl = `${BFF_BASE}/redirect/?url=${encodeURIComponent(this.url)}`;
		const badgeUrl = `${BFF_BASE}/badge/?theme=${theme}&url=${encodeURIComponent(this.url)}`;

		this.previewLinkEl?.setAttribute('href', redirectUrl);
		this.previewImgEl?.setAttribute('src', badgeUrl);

		if (this.snippetEl) {
			this.snippetEl.textContent =
				version === 'js'
					? this.#buildJsSnippet(theme)
					: this.#buildStaticSnippet(redirectUrl, badgeUrl);
		}

		if (this.copyBtnEl) {
			this.copyBtnEl.textContent = t('BadgeCopy');
		}
	}

	#buildStaticSnippet(redirectUrl: string, badgeUrl: string): string {
		return `<a href="${redirectUrl}" target="_blank">
    <img src="${badgeUrl}" alt="Ecoindex Badge" />
</a>`;
	}

	#buildJsSnippet(theme: 'light' | 'dark'): string {
		const themeAttr = theme === 'dark' ? ' data-theme="dark"' : '';
		return `<div id="ecoindex-badge"${themeAttr}></div>
<script src="${BADGE_JS_SRC}" defer></script>`;
	}

	async copySnippet(): Promise<void> {
		const text = this.snippetEl?.textContent;
		if (!text || !this.copyBtnEl) return;

		try {
			await navigator.clipboard.writeText(text);
			this.copyBtnEl.textContent = t('BadgeCopied');
			window.setTimeout(() => {
				if (this.copyBtnEl) this.copyBtnEl.textContent = t('BadgeCopy');
			}, 2000);
		} catch {
			if (!this.snippetEl) return;
			const range = document.createRange();
			range.selectNodeContents(this.snippetEl);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}
}

export default BadgeIntegration;
