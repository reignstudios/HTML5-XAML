class UILabel extends UIElement
{
	get text() {return this.textContent;}
    set text(value)
    {
        this.textContent = value;
    }

	get textColor() {return this.style.color;}
    set textColor(value)
    {
        this.style.color = value;
    }

	get textAlign() {return this.style.textAlign;}
    set textAlign(value)
    {
        this.style.textAlign = value;
    }
	
	static get observedAttributes() { return UIElement.observedAttributes.concat(['text', 'text-color', 'text-align']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'text': this.text = newValue; break;
			case 'text-color': this.textColor = newValue; break;
			case 'text-align': this.textAlign = newValue; break;
		}
	}
}

customElements.define('ui-label', UILabel);