"use strict";

class UILabel extends UIElement
{
	get text() {return this.textContent;}
    set text(value)
    {
        this.textContent = value;
    }

	get textColor() {return this._textColor;}
    set textColor(value)
    {
		this._textColor = value;
        this.style.color = value;
    }

	get textAlign() {return this._textAlign;}
    set textAlign(value)
    {
		this._textAlign = value;
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

	constructor()
	{
		super();

		this._textColor = 'black';
		this._textAlign = 'left';
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-label';
		var cssStyle = window.getComputedStyle(this);
		this._textColor = cssStyle.color;
		this._textAlign = cssStyle.textAlign;
	}
}

customElements.define('ui-label', UILabel);