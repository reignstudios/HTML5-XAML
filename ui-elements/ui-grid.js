class UIGrid extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-grid';
	}
}

customElements.define('ui-grid', UIGrid);