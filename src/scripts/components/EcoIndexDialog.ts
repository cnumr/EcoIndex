import ApiService from '../services/ApiService';
import A11yDialog from 'a11y-dialog';
import { replaceKeyIn } from '../helpers/stringUtils';
import { t } from '../helpers/i18n';
import type { QueueTaskPayload } from '../types/api';

type DialogAction = {
	cb: () => void;
	label: string;
};

type CreateDialogOptions = {
	actions?: DialogAction[];
	body?: string;
	hasSpinner?: boolean;
	keepOpen?: boolean;
};

class EcoIndexDialog {
	static #a11yDialog: A11yDialog | null = null;
	static #quotaRedirectTimeoutId: number | null = null;
	static #quotaRedirectIntervalId: number | null = null;

	static get ERROR_MESSAGES(): Record<number, string> {
		return {
			400: t('Error400'),
			401: t('Error401'),
			403: t('Error403'),
			404: t('Error404'),
			422: t('Error422'),
			429: t('Error429'),
			500: t('Error500'),
			502: t('Error502'),
			504: t('Error504'),
			520: t('Error520'),
			521: t('Error521'),
		};
	}

	static openPendingAnalysis(url: string): void {
		let title = t('AnalysisInProgressFor');
		title = replaceKeyIn(title, 'URL', url);
		EcoIndexDialog.#openLoadingRequest(title, true);
	}

	static openAnalysisRetrieval(): void {
		EcoIndexDialog.#openLoadingRequest(t('AnalysisRetrieval'));
	}

	static updateQueueStatus(task: QueueTaskPayload = {}): void {
		const el = document.querySelector('#dialog-queue-status');
		if (!el) {
			return;
		}

		const queuePosition = task.queue_position;
		const tasksInProgress = task.tasks_in_progress;
		const parts: string[] = [];

		if (queuePosition === 0) {
			parts.push(t('AnalysisQueueNext'));
		} else if (typeof queuePosition === 'number') {
			parts.push(
				queuePosition === 1
					? t('AnalysisQueueWaitingOne')
					: t('AnalysisQueueWaiting', { POSITION: String(queuePosition) }),
			);
		} else {
			parts.push(t('AnalysisQueueRunning'));
		}

		if (typeof tasksInProgress === 'number' && tasksInProgress > 0) {
			parts.push(
				tasksInProgress === 1
					? t('AnalysisQueueBusyOne')
					: t('AnalysisQueueBusy', { COUNT: String(tasksInProgress) }),
			);
		}

		el.innerHTML = parts.join('<br>');
	}

	static openErrorMessage(errorCode?: string | number, details?: unknown): void {
		EcoIndexDialog.#createAndShowDialog(t('AnalysisErrorTitle'), {
			body: EcoIndexDialog.#buildErrorBody(errorCode ?? '', details),
		});
	}

	static openQuotaExceeded(
		details: Record<string, unknown>,
		onSeeLatestResult: () => void,
	): void {
		const redirectDelaySeconds = 3;
		const redirectMessageTemplate = t('RedirectToLatestResult');

		EcoIndexDialog.#clearQuotaRedirectTimers();

		const goToLatestResult = function () {
			EcoIndexDialog.#clearQuotaRedirectTimers();
			onSeeLatestResult();
		};

		EcoIndexDialog.#createAndShowDialog(t('AnalysisErrorTitle'), {
			body:
				EcoIndexDialog.#buildErrorBody(429, details) +
				`<p id="dialog-quota-redirect" class="dialog-quota-redirect" aria-live="polite">${replaceKeyIn(
					redirectMessageTemplate,
					'SECONDS',
					String(redirectDelaySeconds),
				)}</p>`,
			actions: [
				{
					cb: goToLatestResult,
					label: t('SeeLatestResult'),
				},
				{
					cb: function () {
						EcoIndexDialog.#clearQuotaRedirectTimers();
						EcoIndexDialog.close();
					},
					label: t('Close'),
				},
			],
		});

		let remainingSeconds = redirectDelaySeconds;
		EcoIndexDialog.#quotaRedirectIntervalId = window.setInterval(() => {
			remainingSeconds -= 1;
			const redirectEl = document.querySelector('#dialog-quota-redirect');
			if (!redirectEl || remainingSeconds <= 0) {
				return;
			}
			redirectEl.textContent = replaceKeyIn(
				redirectMessageTemplate,
				'SECONDS',
				String(remainingSeconds),
			);
		}, 1000);

		EcoIndexDialog.#quotaRedirectTimeoutId = window.setTimeout(
			goToLatestResult,
			redirectDelaySeconds * 1000,
		);
	}

	static #clearQuotaRedirectTimers(): void {
		if (EcoIndexDialog.#quotaRedirectTimeoutId != null) {
			window.clearTimeout(EcoIndexDialog.#quotaRedirectTimeoutId);
			EcoIndexDialog.#quotaRedirectTimeoutId = null;
		}
		if (EcoIndexDialog.#quotaRedirectIntervalId != null) {
			window.clearInterval(EcoIndexDialog.#quotaRedirectIntervalId);
			EcoIndexDialog.#quotaRedirectIntervalId = null;
		}
	}

	static #buildErrorBody(errorCode: string | number, details: unknown): string {
		const code = Number(errorCode);
		let errorMessage =
			code === 403 && EcoIndexDialog.#isExcludedHost(details)
				? t('Error403Excluded')
				: EcoIndexDialog.ERROR_MESSAGES[code] || t('AnalysisErrorDefaultMessage');

		for (const [key, value] of Object.entries(EcoIndexDialog.#flattenDetails(details))) {
			errorMessage = replaceKeyIn(errorMessage, key, value);
		}

		return `<p>${t('AnalysisErrorIntro')}</p><p>${EcoIndexDialog.#markdownInline(errorMessage)}</p>`;
	}

	/** Minimal markdown → HTML for error messages (links + line breaks), like Hugo markdownify. */
	static #markdownInline(text: string): string {
		return text
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
			.replace(/\n/g, '<br>');
	}

	static #isExcludedHost(details: unknown): boolean {
		const text =
			typeof details === 'string'
				? details
				: String(
						(details as { detail?: unknown; message?: unknown })?.detail ??
							(details as { message?: unknown })?.message ??
							'',
					);
		return String(text).toLowerCase().includes('excluded');
	}

	static #isScalar(value: unknown): value is string | number | boolean {
		return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
	}

	static #flattenDetails(details: unknown): Record<string, string> {
		if (details == null || typeof details !== 'object') {
			return {};
		}

		const interpolations: Record<string, string> = {};
		for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
			if (value != null && typeof value === 'object' && !Array.isArray(value)) {
				for (const [nestedKey, nestedValue] of Object.entries(
					value as Record<string, unknown>,
				)) {
					if (EcoIndexDialog.#isScalar(nestedValue)) {
						interpolations[nestedKey] = String(nestedValue);
					}
				}
			} else if (EcoIndexDialog.#isScalar(value)) {
				interpolations[key] = String(value);
			}
		}
		return interpolations;
	}

	static openResultSharing(url: string): void {
		const title = t('ShareTheResult');
		const body = `
<div class="with-sidebar-l --right-side --p75">
<div>
<input id="url-to-copy" type="text" readonly size="40" value="${url}">
<div><button id="copy-to-clipboard">${t('CopyURL')}</button></div>
</div>
</div>`;

		EcoIndexDialog.#createAndShowDialog(title, { body });
	}

	static close(): boolean {
		EcoIndexDialog.#clearQuotaRedirectTimers();

		const a11yDialog = EcoIndexDialog.#a11yDialog;
		if (!a11yDialog) {
			console.error('EcoIndexDialog not initialized.');
			return false;
		}
		a11yDialog.hide();
		return true;
	}

	static #openLoadingRequest(title: string, showQueueStatus = false): void {
		EcoIndexDialog.#createAndShowDialog(title, {
			actions: [
				{
					cb: function () {
						void ApiService.abortAnalysis();
						EcoIndexDialog.close();
					},
					label: t('Cancel'),
				},
			],
			body: showQueueStatus
				? '<p id="dialog-queue-status" class="dialog-queue-status" aria-live="polite"></p>'
				: '',
			hasSpinner: true,
			keepOpen: true,
		});
	}

	static #createAndShowDialog(title: string, options: CreateDialogOptions = {}): void {
		const {
			actions = [{ cb: EcoIndexDialog.close, label: t('Close') }],
			body = '',
			hasSpinner = false,
			keepOpen = false,
		} = options;
		const role = keepOpen ? 'alertdialog' : 'dialog';
		const overlayAttr = keepOpen ? '' : 'data-a11y-dialog-hide';
		const modalContainer = document.querySelector('#dialog-here');
		const dialogEl = document.querySelector('#dialog');
		const modal = document.createElement('div');

		modal.classList.add('dialog-container');
		modal.id = 'dialog';
		modal.setAttribute('aria-labelledby', 'dialog-title');
		modal.setAttribute('role', role);
		modal.innerHTML = `
<div class="dialog-overlay" ${overlayAttr}></div>
<div class="dialog-content stack-l --s3" role="document">
	<h1 id="dialog-title" class="cover-l__middle text-align:center" tabindex="0">${title}</h1>
	<div id="dialog-body">${body}</div>
	${hasSpinner ? '<div id="dialog-spinner" class="page-loading-spinner"></div>' : ''}
	<div class="dialog-buttons"></div>
</div>`;

		if (dialogEl) {
			dialogEl.replaceWith(modal);
		} else {
			modalContainer?.appendChild(modal);
		}

		const a11yDialog = (EcoIndexDialog.#a11yDialog = new A11yDialog(modal));
		const buttonsEl = modal.querySelector('.dialog-buttons');
		actions.forEach(function (action) {
			const btn = document.createElement('button');
			btn.name = 'action';
			btn.innerHTML = action.label;
			buttonsEl?.appendChild(btn);
			btn.addEventListener('click', action.cb);
		});

		const html = document.documentElement;
		a11yDialog
			.on('show', () => (html.style.overflowY = 'hidden'))
			.on('hide', function () {
				EcoIndexDialog.#clearQuotaRedirectTimers();
				html.style.overflowY = '';
				document.querySelector('#dialog')?.remove();
			});

		a11yDialog.show();
	}
}

export default EcoIndexDialog;
