import Collapse from './Collapse';
import { t } from '../helpers/i18n';

const CATEGORY_ORDER = ['html', 'css', 'javascript', 'image', 'font', 'video', 'audio', 'other'];

type CategoryMetrics = {
	total_count?: number;
	total_size?: number;
};

type RequestItem = {
	url?: string;
	category?: string;
	status?: number;
	size?: number;
};

export type RequestsDetailData = {
	items?: RequestItem[];
	by_category?: Record<string, CategoryMetrics>;
	by_domain?: Record<string, CategoryMetrics>;
};

type CategorySummary = {
	key: string;
	total_count: number;
	total_size: number;
};

type DomainSummary = {
	domain: string;
	total_count: number;
	total_size: number;
};

type SortKey = 'url' | 'category' | 'status' | 'size';

type ElAttrs = Record<string, string | boolean | null | undefined>;

function or<T>(value: T | null | undefined, fallback: T): T {
	return value != null ? value : fallback;
}

/**
 * Interactive request-details panel for the result page.
 * Renders a weight breakdown by type, a domain table, and a filterable request list.
 */
class RequestDetails {
	el: HTMLElement;
	data: RequestsDetailData;
	host: string;
	locale: string;
	categoryFilter: string | 'all';
	sortKey: SortKey;
	sortDir: 'asc' | 'desc';
	numberFormatter: Intl.NumberFormat;
	percentFormatter: Intl.NumberFormat;
	tableBody: HTMLElement | null = null;
	listTableHead: HTMLElement | null = null;

	constructor(
		el: HTMLElement,
		data: RequestsDetailData,
		options: { host?: string; locale?: string } = {},
	) {
		this.el = el;
		this.data = data;
		this.host = or(options.host, '');
		this.locale = or(options.locale, or(document.documentElement.lang, 'fr'));
		this.categoryFilter = 'all';
		this.sortKey = 'size';
		this.sortDir = 'desc';
		this.numberFormatter = new Intl.NumberFormat(this.locale);
		this.percentFormatter = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 0 });

		this._render();
	}

	_render(): void {
		const items = or(this.data.items, []);
		const totalCount = items.length;
		const totalSize = items.reduce((sum, item) => sum + or(item.size, 0), 0);
		const categories = this._getActiveCategories();
		const domains = this._getSortedDomains();

		this.el.replaceChildren();
		this.el.classList.add('request-details', 'stack-l', '--s2');

		this.el.append(
			this._el('h2', { text: t('RequestDetailsTitle') }),
			this._el('p', { text: t('RequestDetailsIntro') }),
			this._renderSummary(totalCount, totalSize, categories),
			this._renderBreakdown(categories, domains),
			this._renderRequestList(totalCount, categories),
		);

		const collapseEl = this.el.querySelector('.js-collapse');
		if (collapseEl) {
			new Collapse(collapseEl);
		}
	}

	_renderSummary(
		totalCount: number,
		totalSize: number,
		categories: CategorySummary[],
	): HTMLElement {
		const totals = t('RequestDetailsTotals')
			.replace('##count##', this.numberFormatter.format(totalCount))
			.replace('##size##', this._formatSize(totalSize));

		const bar = this._el('div', {
			class: 'request-details-bar',
			role: 'img',
			'aria-label': t('RequestDetailsBarLabel'),
		});

		for (const category of categories) {
			const percent = totalSize > 0 ? (category.total_size / totalSize) * 100 : 0;
			if (percent <= 0) continue;
			bar.append(
				this._el('span', {
					class: `request-details-bar-segment --${category.key}`,
					style: `flex: ${percent} 0 0`,
					title: `${this._categoryLabel(category.key)} · ${this.percentFormatter.format(percent)}%`,
				}),
			);
		}

		const legendItems = categories.map((category) => {
			const percent = totalSize > 0 ? (category.total_size / totalSize) * 100 : 0;
			return this._el('li', { class: 'request-details-legend-item' }, [
				this._el('span', {
					class: `request-details-swatch --${category.key}`,
					'aria-hidden': 'true',
				}),
				this._el('span', {
					text: `${this._categoryLabel(category.key)} · ${this.percentFormatter.format(percent)}%`,
				}),
			]);
		});
		const legend = this._el('ul', { class: 'request-details-legend' }, legendItems);

		return this._el(
			'div',
			{ class: 'request-details-card request-details-summary stack-l --s-1' },
			[this._el('p', { class: 'request-details-totals', text: totals }), bar, legend],
		);
	}

	_renderBreakdown(categories: CategorySummary[], domains: DomainSummary[]): HTMLElement {
		const categoryTable = this._el('table', { class: 'request-details-table' });
		categoryTable.append(
			this._el('caption', { class: 'visually-hidden', text: t('RequestDetailsByCategory') }),
			this._el('thead', {}, [
				this._el('tr', {}, [
					this._el('th', { scope: 'col', text: t('RequestDetailsColCategory') }),
					this._el('th', {
						scope: 'col',
						class: 'request-details-num',
						text: t('RequestDetailsColCount'),
					}),
					this._el('th', {
						scope: 'col',
						class: 'request-details-num',
						text: t('RequestDetailsColSize'),
					}),
				]),
			]),
		);
		const categoryBody = this._el('tbody');
		for (const category of categories) {
			categoryBody.append(
				this._el('tr', {}, [
					this._el('td', {}, [
						this._el('span', { class: 'request-details-type' }, [
							this._el('span', {
								class: `request-details-swatch --${category.key}`,
								'aria-hidden': 'true',
							}),
							document.createTextNode(this._categoryLabel(category.key)),
						]),
					]),
					this._el('td', {
						class: 'request-details-num',
						text: this.numberFormatter.format(category.total_count),
					}),
					this._el('td', {
						class: 'request-details-num',
						text: this._formatSize(category.total_size),
					}),
				]),
			);
		}
		categoryTable.append(categoryBody);

		const domainTable = this._el('table', { class: 'request-details-table' });
		domainTable.append(
			this._el('caption', { class: 'visually-hidden', text: t('RequestDetailsByDomain') }),
			this._el('thead', {}, [
				this._el('tr', {}, [
					this._el('th', { scope: 'col', text: t('RequestDetailsColDomain') }),
					this._el('th', {
						scope: 'col',
						class: 'request-details-num',
						text: t('RequestDetailsColCount'),
					}),
					this._el('th', {
						scope: 'col',
						class: 'request-details-num',
						text: t('RequestDetailsColSize'),
					}),
				]),
			]),
		);
		const domainBody = this._el('tbody');
		const maxDomainSize = domains[0] ? or(domains[0].total_size, 0) : 0;
		for (const domain of domains) {
			const percent = maxDomainSize > 0 ? (domain.total_size / maxDomainSize) * 100 : 0;
			const meter = this._el(
				'span',
				{ class: 'request-details-meter', 'aria-hidden': 'true' },
				[this._el('span', { style: `width:${percent}%` })],
			);
			const domainCell = this._el('td', { class: 'request-details-domain-cell' }, [
				this._el('span', { class: 'request-details-domain', text: domain.domain }),
			]);
			if (this.host && !this._isFirstParty(domain.domain)) {
				domainCell.append(
					this._el('span', {
						class: 'request-details-badge',
						text: t('RequestDetailsThirdParty'),
					}),
				);
			}
			domainCell.append(meter);
			domainBody.append(
				this._el('tr', {}, [
					domainCell,
					this._el('td', {
						class: 'request-details-num',
						text: this.numberFormatter.format(domain.total_count),
					}),
					this._el('td', {
						class: 'request-details-num',
						text: this._formatSize(domain.total_size),
					}),
				]),
			);
		}
		domainTable.append(domainBody);

		return this._el('div', { class: 'request-details-grid' }, [
			this._el('section', { class: 'request-details-card stack-l --s-1' }, [
				this._el('h3', {
					class: 'request-details-heading',
					text: t('RequestDetailsByCategory'),
				}),
				this._el('div', { class: 'request-details-table-wrap' }, [categoryTable]),
			]),
			this._el('section', { class: 'request-details-card stack-l --s-1' }, [
				this._el('h3', {
					class: 'request-details-heading',
					text: t('RequestDetailsByDomain'),
				}),
				this._el('div', { class: 'request-details-table-wrap --domains' }, [domainTable]),
			]),
		]);
	}

	_renderRequestList(totalCount: number, categories: CategorySummary[]): HTMLElement {
		const toggleLabel = t('RequestDetailsListToggle').replace(
			'##count##',
			this.numberFormatter.format(totalCount),
		);

		const filters = this._el('div', {
			class: 'request-details-filters',
			role: 'group',
			'aria-label': t('RequestDetailsColCategory'),
		});
		const filterKeys = ['all', ...categories.map((category) => category.key)];
		for (const key of filterKeys) {
			const pressed = key === this.categoryFilter;
			const button = this._el('button', {
				type: 'button',
				class: 'request-details-filter',
				'data-category': key,
				'aria-pressed': pressed ? 'true' : 'false',
				text: key === 'all' ? t('RequestDetailsFilterAll') : this._categoryLabel(key),
			});
			button.addEventListener('click', () => {
				this.categoryFilter = key;
				this._updateFilters(filters);
				this._renderTableBody();
			});
			filters.append(button);
		}

		this.tableBody = this._el('tbody');
		this.listTableHead = this._el('thead', {}, [
			this._el('tr', {}, [
				this._sortHeader('url', t('RequestDetailsColUrl'), 'request-details-url'),
				this._sortHeader('category', t('RequestDetailsColCategory')),
				this._sortHeader('status', t('RequestDetailsColStatus')),
				this._sortHeader('size', t('RequestDetailsColSize'), 'request-details-num'),
			]),
		]);
		const table = this._el('table', { class: 'request-details-table' });
		table.append(
			this._el('caption', { class: 'visually-hidden', text: t('RequestDetailsListToggle') }),
			this.listTableHead!,
			this.tableBody!,
		);
		this._renderTableBody();

		const content = this._el(
			'div',
			{
				class: 'collapse-content js-collapse-content display:none stack-l --s-1',
				id: 'request-details-list',
			},
			[filters, this._el('div', { class: 'request-details-table-wrap --list' }, [table])],
		);

		const button = this._el('button', {
			type: 'button',
			class: 'collapse-button js-collapse-button button-default',
			'aria-expanded': 'false',
			'aria-controls': 'request-details-list',
		});
		button.append(document.createTextNode(toggleLabel + ' '), this._svgUse('icon-anchor-down'));

		return this._el('div', { class: 'request-details-card js-collapse' }, [button, content]);
	}

	_sortHeader(key: SortKey, label: string, extraClass = ''): HTMLElement {
		const th = this._el('th', {
			scope: 'col',
			class: extraClass,
			'aria-sort':
				this.sortKey === key
					? this.sortDir === 'asc'
						? 'ascending'
						: 'descending'
					: 'none',
		});
		const button = this._el('button', {
			type: 'button',
			class: 'request-details-sort',
			'data-sort': key,
			'data-label': label,
			text: this.sortKey === key ? `${label} ${this.sortDir === 'asc' ? '↑' : '↓'}` : label,
		});
		button.addEventListener('click', () => {
			if (this.sortKey === key) {
				this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
			} else {
				this.sortKey = key;
				this.sortDir = key === 'size' ? 'desc' : 'asc';
			}
			this._refreshSortHeaders();
			this._renderTableBody();
		});
		th.append(button);
		return th;
	}

	_renderTableBody(): void {
		if (!this.tableBody) return;
		this.tableBody.replaceChildren();
		const items = this._getSortedItems();
		if (items.length === 0) {
			this.tableBody.append(
				this._el('tr', {}, [
					this._el('td', { colspan: '4', text: t('RequestDetailsEmpty') }),
				]),
			);
			return;
		}
		for (const item of items) {
			const urlCell = this._el('td', { class: 'request-details-url' });
			const itemUrl = or(item.url, '');
			if (/^https?:/i.test(itemUrl)) {
				urlCell.append(
					this._el('a', {
						class: 'request-details-link',
						href: itemUrl,
						target: '_blank',
						rel: 'noopener noreferrer',
						title: itemUrl,
						text: itemUrl,
					}),
				);
			} else {
				urlCell.append(
					this._el('span', {
						class: 'request-details-link',
						title: itemUrl,
						text: itemUrl,
					}),
				);
			}

			const status = Number(item.status);
			this.tableBody.append(
				this._el('tr', {}, [
					urlCell,
					this._el('td', { text: this._categoryLabel(or(item.category, '')) }),
					this._el('td', {
						class:
							status >= 400
								? 'request-details-status is-error'
								: 'request-details-status',
						text: String(status),
					}),
					this._el('td', {
						class: 'request-details-num',
						text: this._formatSize(item.size),
					}),
				]),
			);
		}
	}

	_refreshSortHeaders(): void {
		if (!this.listTableHead) return;
		this.listTableHead.querySelectorAll('th').forEach((th) => {
			const button = th.querySelector('button');
			if (!(button instanceof HTMLButtonElement)) return;
			const key = button.dataset.sort as SortKey | undefined;
			const label = or(button.dataset.label, '');
			th.setAttribute(
				'aria-sort',
				this.sortKey === key
					? this.sortDir === 'asc'
						? 'ascending'
						: 'descending'
					: 'none',
			);
			button.textContent =
				this.sortKey === key ? `${label} ${this.sortDir === 'asc' ? '↑' : '↓'}` : label;
		});
	}

	_updateFilters(filtersEl: HTMLElement): void {
		filtersEl.querySelectorAll('button').forEach((button) => {
			if (!(button instanceof HTMLButtonElement)) return;
			button.setAttribute(
				'aria-pressed',
				button.dataset.category === this.categoryFilter ? 'true' : 'false',
			);
		});
	}

	_getActiveCategories(): CategorySummary[] {
		const byCategory = or(this.data.by_category, {});
		return CATEGORY_ORDER.map((key) => {
			const metrics = or(byCategory[key], { total_count: 0, total_size: 0 });
			return {
				key,
				total_count: or(metrics.total_count, 0),
				total_size: or(metrics.total_size, 0),
			};
		}).filter((category) => category.total_count > 0);
	}

	_getSortedDomains(): DomainSummary[] {
		const byDomain = or(this.data.by_domain, {});
		return Object.entries(byDomain)
			.map(([domain, metrics]) => ({
				domain,
				total_count: or(metrics.total_count, 0),
				total_size: or(metrics.total_size, 0),
			}))
			.sort((a, b) => b.total_size - a.total_size);
	}

	_getSortedItems(): RequestItem[] {
		let items = or(this.data.items, []);
		if (this.categoryFilter !== 'all') {
			items = items.filter((item) => item.category === this.categoryFilter);
		}
		const direction = this.sortDir === 'asc' ? 1 : -1;
		return [...items].sort((a, b) => {
			if (this.sortKey === 'size' || this.sortKey === 'status') {
				return (or(a[this.sortKey], 0) - or(b[this.sortKey], 0)) * direction;
			}
			return (
				String(or(a[this.sortKey], '')).localeCompare(
					String(or(b[this.sortKey], '')),
					this.locale,
				) * direction
			);
		});
	}

	_isFirstParty(domain: string): boolean {
		if (!this.host || !domain) return false;
		return (
			domain === this.host ||
			domain.endsWith(`.${this.host}`) ||
			this.host.endsWith(`.${domain}`)
		);
	}

	_categoryLabel(key: string): string {
		const labels: Record<string, string> = {
			html: t('RequestDetailsCategoryHtml'),
			css: t('RequestDetailsCategoryCss'),
			javascript: t('RequestDetailsCategoryJavascript'),
			image: t('RequestDetailsCategoryImage'),
			font: t('RequestDetailsCategoryFont'),
			video: t('RequestDetailsCategoryVideo'),
			audio: t('RequestDetailsCategoryAudio'),
			other: t('RequestDetailsCategoryOther'),
		};
		return or(labels[key], key);
	}

	_formatSize(bytes: number | undefined): string {
		const value = Number(bytes) || 0;
		if (value < 1000) {
			return `${this.numberFormatter.format(Math.round(value))} ${t('RequestDetailsUnitByte')}`;
		}
		if (value < 1000000) {
			const kb = Math.round((value / 1000) * 10) / 10;
			return `${this.numberFormatter.format(kb)} ${t('RequestDetailsUnitKb')}`;
		}
		const mb = Math.round((value / 1000000) * 100) / 100;
		return `${this.numberFormatter.format(mb)} ${t('RequestDetailsUnitMb')}`;
	}

	_svgUse(id: string): SVGSVGElement {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('class', 'icon-l');
		svg.setAttribute('focusable', 'false');
		svg.setAttribute('aria-hidden', 'true');
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
		use.setAttribute('href', `#${id}`);
		svg.append(use);
		return svg;
	}

	_el(
		tag: string,
		attrs: ElAttrs = {},
		children: (Node | string | false | null)[] = [],
	): HTMLElement {
		const node = document.createElement(tag);
		if (tag === 'th' || tag === 'td') {
			node.style.border = '0';
		}
		for (const [key, value] of Object.entries(attrs)) {
			if (value == null || value === false) continue;
			if (key === 'class') node.className = String(value);
			else if (key === 'text') node.textContent = String(value);
			else if (value === true) node.setAttribute(key, '');
			else node.setAttribute(key, String(value));
		}
		for (const child of children) {
			if (child) node.append(child);
		}
		return node;
	}
}

export default RequestDetails;
