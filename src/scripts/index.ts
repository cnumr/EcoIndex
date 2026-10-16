import AnalysisService from './services/AnalysisService';
import Collapse from './components/Collapse';
import EcoIndexDialog from './components/EcoIndexDialog';
import ResultCacheService from './services/ResultCacheService';
import SiteAnalysisResult from './components/SiteAnalysisResult';
import { t } from './helpers/i18n';

function initApp(): void {
	const currentLocale = document.getElementsByTagName('html')[0]?.getAttribute('lang') ?? 'fr';
	initMenu();
	initCollapses();
	initPageResult(currentLocale);
	initSubmitUrlForm();
	void initButtonRemakeAnalysis();
	void initButtonShareURL();
}

window.addEventListener('DOMContentLoaded', initApp);

function initMenu(): void {
	const menuBtn = document.querySelector('.menu-btn');
	const mainNavContainer = document.querySelector('.main-nav-container');

	if (!(menuBtn instanceof HTMLElement) || !(mainNavContainer instanceof HTMLElement)) return;

	menuBtn.addEventListener('click', function () {
		const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
		menuBtn.setAttribute('aria-expanded', String(!expanded));
		mainNavContainer.dataset['open'] = String(!expanded);
	});
}

function initCollapses(): void {
	const collapseElements = document.querySelectorAll('.js-collapse');
	collapseElements.forEach((collapseElement) => new Collapse(collapseElement));
}

function initPageResult(currentLocale: string): void {
	const resultPageContentEl = document.querySelector('.js-result-container');
	if (!resultPageContentEl) return;
	new SiteAnalysisResult(resultPageContentEl, currentLocale);
}

async function initButtonRemakeAnalysis(): Promise<void> {
	const buttonRemakeEl = document.querySelector('.js-button-retest');
	if (!buttonRemakeEl) return;
	buttonRemakeEl.addEventListener('click', async (e) => {
		e.preventDefault();

		const last = ResultCacheService.getLast();
		if (!last?.url) return;
		await AnalysisService.launchAnalysisByURL(last.url, window.location.pathname);
	});
}

async function initButtonShareURL(): Promise<void> {
	const shareBtnEl = document.querySelector('#share-btn');
	if (!shareBtnEl) return;
	shareBtnEl.addEventListener('click', async (e) => {
		e.preventDefault();

		EcoIndexDialog.openResultSharing(window.location.href);
		initButtonCopyToClipboard();
	});
}

function initButtonCopyToClipboard(): void {
	const copyBtnEl = document.querySelector('#copy-to-clipboard');
	if (!copyBtnEl) return;
	copyBtnEl.addEventListener('click', async (e) => {
		e.preventDefault();
		const copyText = document.getElementById('url-to-copy');
		if (!(copyText instanceof HTMLInputElement)) return;

		copyText.select();
		copyText.setSelectionRange(0, 99999);

		await navigator.clipboard.writeText(copyText.value);
	});
}

function initSubmitUrlForm(): void {
	const form = document.querySelector('.js-analysis-submit-form');
	if (!(form instanceof HTMLFormElement)) return;

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		const input = form.querySelector("input[name='siteurl']");
		if (!(input instanceof HTMLInputElement)) return;
		const url = input.value;
		const resultUrlPrefix = form.getAttribute('action') ?? '';
		void launchAnalysisByURL(url, resultUrlPrefix);
	});
}

async function launchAnalysisByURL(url: string, resultUrlPrefix: string): Promise<void> {
	try {
		await AnalysisService.launchAnalysisByURL(url, resultUrlPrefix);
		updateFormMessages({ success: true });
	} catch (error) {
		updateFormMessages({ success: false, error });
	}
}

function updateFormMessages(options: { success: boolean; error?: unknown }): void {
	const form = document.querySelector('.js-analysis-submit-form');
	if (!(form instanceof HTMLFormElement)) return;
	if (options.success) {
		form.setAttribute('aria-invalid', 'false');
	} else {
		const errorMessage = t('EcoIndexFormInputInvalid');
		if (!form.querySelector('.form-error')) {
			form.insertAdjacentHTML('afterbegin', `<p class="form-error">${errorMessage}</p>`);
		}
		form.setAttribute('aria-invalid', 'true');
	}
}
