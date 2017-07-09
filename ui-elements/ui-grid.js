class UIGrid extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);
	}
}

customElements.define('ui-grid', UIGrid);