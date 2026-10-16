/**
 * Simple collapse content component
 */
class Collapse {
	button: HTMLElement;
	content: HTMLElement;

	constructor(collapseElement: Element) {
		const button = collapseElement.querySelector('.js-collapse-button');
		const content = collapseElement.querySelector('.js-collapse-content');
		if (!(button instanceof HTMLElement) || !(content instanceof HTMLElement)) {
			throw new Error('Collapse: missing button or content element');
		}
		this.button = button;
		this.content = content;

		window.addEventListener('click', (e) => {
			if (!(e.target instanceof Node) || !collapseElement.contains(e.target)) {
				this.setCollapseVisibility(false);
			}
		});

		this.button.addEventListener('click', () => this.toggleCollapseVisibility());
		this.button.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				this.setCollapseVisibility(false);
			}
		});
	}

	toggleCollapseVisibility(): void {
		const isCollapseExpanded = this.button.getAttribute('aria-expanded') === 'true';
		this.setCollapseVisibility(!isCollapseExpanded);
	}

	setCollapseVisibility(value: boolean): void {
		this.content.classList[value ? 'remove' : 'add']('display:none');
		this.button.setAttribute('aria-expanded', value ? 'true' : 'false');
	}
}

export default Collapse;
