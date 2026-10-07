import Collapse from "./Collapse";

const STATUS_ORDER = ["fail", "warn", "ok"];
const CATEGORY_ORDER = ["network", "user-device", "datacenter", "other"];

const I18N = {
	BestPracticesTitle: `{{- i18n "BestPracticesTitle" -}}`,
	BestPracticesIntro: `{{- i18n "BestPracticesIntro" | safeHTML -}}`,
	BestPracticesTotals: `{{- i18n "BestPracticesTotals" -}}`,
	BestPracticesBarLabel: `{{- i18n "BestPracticesBarLabel" -}}`,
	BestPracticesFilterAll: `{{- i18n "BestPracticesFilterAll" -}}`,
	BestPracticesStatusOk: `{{- i18n "BestPracticesStatusOk" -}}`,
	BestPracticesStatusWarn: `{{- i18n "BestPracticesStatusWarn" -}}`,
	BestPracticesStatusFail: `{{- i18n "BestPracticesStatusFail" -}}`,
	BestPracticesCategoryNetwork: `{{- i18n "BestPracticesCategoryNetwork" -}}`,
	BestPracticesCategoryUserDevice: `{{- i18n "BestPracticesCategoryUserDevice" -}}`,
	BestPracticesCategoryDatacenter: `{{- i18n "BestPracticesCategoryDatacenter" -}}`,
	BestPracticesCategoryOther: `{{- i18n "BestPracticesCategoryOther" -}}`,
	BestPracticesValue: `{{- i18n "BestPracticesValue" -}}`,
	BestPracticesThresholds: `{{- i18n "BestPracticesThresholds" -}}`,
	BestPracticesLearnMore: `{{- i18n "BestPracticesLearnMore" -}}`,
	BestPracticesDetailsToggle: `{{- i18n "BestPracticesDetailsToggle" -}}`,
	BestPracticesCategoryToggle: `{{- i18n "BestPracticesCategoryToggle" -}}`,
	BestPracticesEmpty: `{{- i18n "BestPracticesEmpty" -}}`,
	BestPracticesRwebId: `{{- i18n "BestPracticesRwebId" -}}`,
};

function t(key) {
	return I18N[key] != null ? I18N[key] : key;
}

function or(value, fallback) {
	return value != null ? value : fallback;
}

/**
 * Best-practices panel for the result page.
 * Shows RWEB rule evaluation summary and a filterable list of rule results.
 */
class BestPractices {
	/**
	 * @param {HTMLElement} el
	 * @param {object} data BestPracticesAnalysisResponse
	 * @param {object} [options]
	 * @param {string} [options.locale]
	 */
	constructor(el, data, options = {}) {
		this.el = el;
		this.data = data;
		this.locale = or(options.locale, or(document.documentElement.lang, "fr"));
		this.statusFilter = "all";
		/** @type {Record<string, boolean>} */
		this.categoryExpanded = {};
		this.numberFormatter = new Intl.NumberFormat(this.locale, { maximumFractionDigits: 2 });

		this._render();
	}

	_render() {
		const results = or(this.data.results, []);
		const okCount = or(this.data.ok_count, results.filter((r) => r.status === "ok").length);
		const warnCount = or(this.data.warn_count, results.filter((r) => r.status === "warn").length);
		const failCount = or(this.data.fail_count, results.filter((r) => r.status === "fail").length);

		this.el.replaceChildren();
		this.el.classList.add("best-practices", "stack-l", "--s2");

		const intro = this._el("p");
		intro.innerHTML = t("BestPracticesIntro");

		this.el.append(
			this._el("h2", { text: t("BestPracticesTitle") }),
			intro,
			this._renderSummary(okCount, warnCount, failCount),
			this._renderList(results, okCount, warnCount, failCount),
		);
	}

	_renderSummary(okCount, warnCount, failCount) {
		const total = okCount + warnCount + failCount;
		const totals = t("BestPracticesTotals")
			.replace("##ok##", this.numberFormatter.format(okCount))
			.replace("##warn##", this.numberFormatter.format(warnCount))
			.replace("##fail##", this.numberFormatter.format(failCount));

		const bar = this._el("div", {
			class: "best-practices-bar",
			role: "img",
			"aria-label": t("BestPracticesBarLabel"),
		});

		const segments = [
			{ key: "fail", count: failCount },
			{ key: "warn", count: warnCount },
			{ key: "ok", count: okCount },
		];
		for (const segment of segments) {
			if (segment.count <= 0 || total <= 0) continue;
			const percent = (segment.count / total) * 100;
			bar.append(
				this._el("span", {
					class: `best-practices-bar-segment --${segment.key}`,
					style: `flex: ${percent} 0 0`,
					title: `${this._statusLabel(segment.key)} · ${this.numberFormatter.format(segment.count)}`,
				}),
			);
		}

		const legendItems = segments
			.filter((segment) => segment.count > 0)
			.map((segment) =>
				this._el("li", { class: "best-practices-legend-item" }, [
					this._el("span", {
						class: `best-practices-swatch --${segment.key}`,
						"aria-hidden": "true",
					}),
					this._el("span", {
						text: `${this._statusLabel(segment.key)} · ${this.numberFormatter.format(segment.count)}`,
					}),
				]),
			);
		const legend = this._el("ul", { class: "best-practices-legend" }, legendItems);

		return this._el("div", { class: "best-practices-card best-practices-summary stack-l --s-1" }, [
			this._el("p", { class: "best-practices-totals", text: totals }),
			bar,
			legend,
		]);
	}

	_renderList(results, okCount, warnCount, failCount) {
		const filters = this._el("div", {
			class: "best-practices-filters",
			role: "group",
			"aria-label": t("BestPracticesBarLabel"),
		});

		const filterDefs = [
			{ key: "all", label: t("BestPracticesFilterAll"), count: results.length },
			{ key: "fail", label: this._statusLabel("fail"), count: failCount },
			{ key: "warn", label: this._statusLabel("warn"), count: warnCount },
			{ key: "ok", label: this._statusLabel("ok"), count: okCount },
		];

		for (const filter of filterDefs) {
			if (filter.key !== "all" && filter.count <= 0) continue;
			const button = this._el("button", {
				type: "button",
				class: "best-practices-filter",
				"data-status": filter.key,
				"aria-pressed": filter.key === this.statusFilter ? "true" : "false",
				text: `${filter.label} (${this.numberFormatter.format(filter.count)})`,
			});
			button.addEventListener("click", () => {
				this.statusFilter = filter.key;
				this._updateFilters(filters);
				this._renderRules(this.rulesContainer);
			});
			filters.append(button);
		}

		this.rulesContainer = this._el("div", { class: "best-practices-rules stack-l --s-1" });
		this._renderRules(this.rulesContainer);

		return this._el("div", { class: "best-practices-card stack-l --s-1" }, [filters, this.rulesContainer]);
	}

	_renderRules(container) {
		container.replaceChildren();
		const items = this._getFilteredResults();
		if (items.length === 0) {
			container.append(this._el("p", { class: "best-practices-empty", text: t("BestPracticesEmpty") }));
			return;
		}

		const groups = this._groupByCategory(items);
		for (const group of groups) {
			container.append(this._renderCategoryGroup(group));
		}

		container.querySelectorAll(".js-collapse").forEach((collapseEl) => {
			new Collapse(collapseEl);
		});
	}

	/**
	 * Group filtered results by category, sorted by status then title.
	 * @param {object[]} items
	 */
	_groupByCategory(items) {
		/** @type {Map<string, object[]>} */
		const byCategory = new Map();
		for (const item of items) {
			const key = this._normalizeCategory(item.category);
			if (!byCategory.has(key)) byCategory.set(key, []);
			byCategory.get(key).push(item);
		}

		const known = CATEGORY_ORDER.filter((key) => byCategory.has(key));
		const extras = [...byCategory.keys()].filter((key) => !CATEGORY_ORDER.includes(key));
		return [...known, ...extras].map((key) => ({
			key,
			items: byCategory.get(key).sort((a, b) => {
				const statusDiff = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
				if (statusDiff !== 0) return statusDiff;
				return String(or(a.title, "")).localeCompare(String(or(b.title, "")), this.locale);
			}),
		}));
	}

	/**
	 * Render one collapsible category section.
	 * @param {object} group
	 * @param {string} group.key
	 * @param {object[]} group.items
	 */
	_renderCategoryGroup(group) {
		const expanded =
			this.categoryExpanded[group.key] != null ? this.categoryExpanded[group.key] : false;
		this.categoryExpanded[group.key] = expanded;

		const contentId = `best-practices-category-${group.key}`;
		const rules = this._el(
			"div",
			{ class: "best-practices-category-rules stack-l --s-1" },
			group.items.map((item) => this._renderRule(item)),
		);
		const content = this._el(
			"div",
			{
				class: `collapse-content js-collapse-content${expanded ? "" : " display:none"}`,
				id: contentId,
			},
			[rules],
		);

		const failCount = group.items.filter((item) => item.status === "fail").length;
		const warnCount = group.items.filter((item) => item.status === "warn").length;
		const okCount = group.items.filter((item) => item.status === "ok").length;
		const statusBits = [];
		if (failCount) statusBits.push(`${this.numberFormatter.format(failCount)} ${this._statusLabel("fail")}`);
		if (warnCount) statusBits.push(`${this.numberFormatter.format(warnCount)} ${this._statusLabel("warn")}`);
		if (okCount) statusBits.push(`${this.numberFormatter.format(okCount)} ${this._statusLabel("ok")}`);

		const toggleLabel = t("BestPracticesCategoryToggle")
			.replace("##category##", this._categoryLabel(group.key))
			.replace("##count##", this.numberFormatter.format(group.items.length));

		const button = this._el("button", {
			type: "button",
			class: "collapse-button js-collapse-button button-default best-practices-category-toggle",
			"aria-expanded": expanded ? "true" : "false",
			"aria-controls": contentId,
		});
		button.append(
			this._el("span", { class: "best-practices-category-toggle-label", text: toggleLabel }),
		);
		if (statusBits.length) {
			button.append(
				this._el("span", { class: "best-practices-category-toggle-status", text: statusBits.join(" · ") }),
			);
		}
		button.append(this._svgUse("icon-anchor-down"));
		button.addEventListener("click", () => {
			// Persist open/closed after Collapse toggles aria-expanded on the next tick.
			requestAnimationFrame(() => {
				this.categoryExpanded[group.key] = button.getAttribute("aria-expanded") === "true";
			});
		});

		return this._el("section", { class: `best-practices-category js-collapse --${group.key}` }, [
			button,
			content,
		]);
	}

	_renderRule(item) {
		const status = or(item.status, "ok");
		const titleText = or(item.title, item.rule_id);
		const titleChildren = [];

		if (item.url) {
			titleChildren.push(
				this._el("a", {
					class: "best-practices-rule-link",
					href: item.url,
					target: "_blank",
					rel: "noopener noreferrer",
					text: titleText,
				}),
			);
		} else {
			titleChildren.push(document.createTextNode(titleText));
		}

		const metaParts = [
			this._el("span", {
				class: `best-practices-badge --${status}`,
				text: this._statusLabel(status),
			}),
		];
		if (item.rweb_id) {
			metaParts.push(
				this._el("span", {
					class: "best-practices-rweb",
					text: t("BestPracticesRwebId").replace("##id##", item.rweb_id),
				}),
			);
		}

		const header = this._el("div", { class: "best-practices-rule-header" }, [
			this._el("div", { class: "best-practices-rule-meta" }, metaParts),
			this._el("h3", { class: "best-practices-rule-title" }, titleChildren),
		]);

		const bodyChildren = [];
		if (item.message) {
			bodyChildren.push(this._el("p", { class: "best-practices-rule-message", text: item.message }));
		}

		const metrics = [];
		if (item.value != null) {
			metrics.push(
				this._el("li", {
					text: t("BestPracticesValue").replace("##value##", this.numberFormatter.format(item.value)),
				}),
			);
		}
		if (item.threshold_warn != null || item.threshold_fail != null) {
			const warn = item.threshold_warn != null ? this.numberFormatter.format(item.threshold_warn) : "—";
			const fail = item.threshold_fail != null ? this.numberFormatter.format(item.threshold_fail) : "—";
			metrics.push(
				this._el("li", {
					text: t("BestPracticesThresholds").replace("##warn##", warn).replace("##fail##", fail),
				}),
			);
		}
		if (metrics.length > 0) {
			bodyChildren.push(this._el("ul", { class: "best-practices-metrics" }, metrics));
		}

		if (item.description) {
			bodyChildren.push(this._el("p", { class: "best-practices-rule-description", text: item.description }));
		}

		const details = or(item.details, []);
		if (details.length > 0) {
			const detailsId = `best-practices-details-${or(item.rule_id, "rule")}-${or(item.id, Math.random().toString(36).slice(2))}`;
			const list = this._el(
				"ul",
				{ class: "best-practices-details-list" },
				details.map((detail) => {
					if (/^https?:/i.test(detail)) {
						return this._el("li", {}, [
							this._el("a", {
								class: "best-practices-detail-link",
								href: detail,
								target: "_blank",
								rel: "noopener noreferrer",
								title: detail,
								text: detail,
							}),
						]);
					}
					return this._el("li", { text: detail });
				}),
			);
			const content = this._el("div", {
				class: "collapse-content js-collapse-content display:none",
				id: detailsId,
			}, [list]);
			const button = this._el("button", {
				type: "button",
				class: "collapse-button js-collapse-button button-default best-practices-details-toggle",
				"aria-expanded": "false",
				"aria-controls": detailsId,
			});
			button.append(
				document.createTextNode(
					t("BestPracticesDetailsToggle").replace("##count##", this.numberFormatter.format(details.length)) +
						" ",
				),
				this._svgUse("icon-anchor-down"),
			);
			bodyChildren.push(this._el("div", { class: "js-collapse" }, [button, content]));
		}

		if (item.url) {
			bodyChildren.push(
				this._el("p", { class: "best-practices-learn-more" }, [
					this._el("a", {
						href: item.url,
						target: "_blank",
						rel: "noopener noreferrer",
						text: t("BestPracticesLearnMore"),
					}),
				]),
			);
		}

		return this._el("article", { class: `best-practices-rule --${status}` }, [
			header,
			this._el("div", { class: "best-practices-rule-body stack-l --s-1" }, bodyChildren),
		]);
	}

	_updateFilters(filtersEl) {
		filtersEl.querySelectorAll("button").forEach((button) => {
			button.setAttribute(
				"aria-pressed",
				button.dataset.status === this.statusFilter ? "true" : "false",
			);
		});
	}

	_getFilteredResults() {
		const results = or(this.data.results, []);
		if (this.statusFilter === "all") return results;
		return results.filter((item) => item.status === this.statusFilter);
	}

	_normalizeCategory(category) {
		const key = String(or(category, "other")).toLowerCase();
		if (key === "user-device" || key === "user_device" || key === "userdevice") return "user-device";
		if (key === "network") return "network";
		if (key === "datacenter" || key === "data-center" || key === "data_center") return "datacenter";
		return "other";
	}

	_statusLabel(status) {
		const labels = {
			ok: t("BestPracticesStatusOk"),
			warn: t("BestPracticesStatusWarn"),
			fail: t("BestPracticesStatusFail"),
		};
		return or(labels[status], status);
	}

	_categoryLabel(category) {
		const labels = {
			network: t("BestPracticesCategoryNetwork"),
			"user-device": t("BestPracticesCategoryUserDevice"),
			datacenter: t("BestPracticesCategoryDatacenter"),
			other: t("BestPracticesCategoryOther"),
		};
		return or(labels[category], category);
	}

	_svgUse(id) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("class", "icon-l");
		svg.setAttribute("focusable", "false");
		svg.setAttribute("aria-hidden", "true");
		const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
		use.setAttribute("href", `#${id}`);
		svg.append(use);
		return svg;
	}

	/**
	 * @param {string} tag
	 * @param {Record<string, string>} [attrs]
	 * @param {Array<Node|string>} [children]
	 * @returns {HTMLElement}
	 */
	_el(tag, attrs = {}, children = []) {
		const node = document.createElement(tag);
		if (tag === "th" || tag === "td") {
			node.style.border = "0";
		}
		for (const [key, value] of Object.entries(attrs)) {
			if (value == null || value === false) continue;
			if (key === "class") node.className = value;
			else if (key === "text") node.textContent = value;
			else if (value === true) node.setAttribute(key, "");
			else node.setAttribute(key, value);
		}
		for (const child of children) {
			if (child) node.append(child);
		}
		return node;
	}
}

export default BestPractices;
