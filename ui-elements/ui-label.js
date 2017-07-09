class UILabel extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes.concat(['text', 'text-color', 'text-align']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'text':
				this.textContent = newValue;
				break;

			case 'text-color':
				this.style.color = newValue;
				break;

			case 'text-align':
				this.style.textAlign = newValue;
				break;
		}
	}

	connectedCallback()
	{
		super.connectedCallback();
	}
}

customElements.define('ui-label', UILabel);