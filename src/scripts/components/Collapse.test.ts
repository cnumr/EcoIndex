import { describe, expect, it } from 'vitest';
import Collapse from './Collapse';

function createCollapseDom(expanded = false): HTMLElement {
	const root = document.createElement('div');
	root.className = 'js-collapse';
	root.innerHTML = `
		<button class="js-collapse-button" aria-expanded="${expanded}" type="button">Toggle</button>
		<div class="js-collapse-content ${expanded ? '' : 'display:none'}">Content</div>
	`;
	document.body.appendChild(root);
	return root;
}

describe('Collapse', () => {
	it('throws when required elements are missing', () => {
		expect(() => new Collapse(document.createElement('div'))).toThrow(
			'Collapse: missing button or content element',
		);
	});

	it('toggles visibility on button click', () => {
		const root = createCollapseDom(false);
		const collapse = new Collapse(root);
		const button = root.querySelector('.js-collapse-button') as HTMLElement;
		const content = root.querySelector('.js-collapse-content') as HTMLElement;

		button.click();
		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(content.classList.contains('display:none')).toBe(false);

		collapse.toggleCollapseVisibility();
		expect(button.getAttribute('aria-expanded')).toBe('false');
		expect(content.classList.contains('display:none')).toBe(true);
	});

	it('closes on Escape', () => {
		const root = createCollapseDom(true);
		new Collapse(root);
		const button = root.querySelector('.js-collapse-button') as HTMLElement;
		const content = root.querySelector('.js-collapse-content') as HTMLElement;
		content.classList.remove('display:none');

		button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(button.getAttribute('aria-expanded')).toBe('false');
		expect(content.classList.contains('display:none')).toBe(true);
	});
});
