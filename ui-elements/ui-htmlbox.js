class UIHTMLBox extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }

	connectedCallback()
	{
		super.connectedCallback();
        this.className = 'ui-htmlbox';
        this.style.overflowX = 'auto';
        this.style.overflowY = 'auto';
        this.style.userSelect = 'text';
		this.style.cursor = 'auto';
	}
}

customElements.define('ui-htmlbox', UIHTMLBox);