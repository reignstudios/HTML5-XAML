class UIButton extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes.concat(['color-hover', 'text', 'text-color']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);
		
		switch (attr)
		{
			case 'color':
				this.btnColor = newValue;
				break;

			case 'color-hover':
				this.btnHoverColor = newValue;
				break;

			case 'text':
				this.textContent = newValue;
				this.applyCenteredContentStyle();
				break;

			case 'text-color':
				this.style.color = newValue;
				break;
		}
	}

	constructor()
	{
		super();
		
		this.btnColor = 'darkgray';
		this.btnHoverColor = 'gray';

		this.onmouseenter = () => {this._onmouseenter();}
		this.onmouseleave = () => {this._onmouseleave();}
		this.onmousedown = (e) => {this._onmousedown(e);}
		this.onmouseup = () => {this._onmouseup();}
	}

	connectedCallback()
	{
		super.connectedCallback();
		if (this.textContent !== null && this.textContent.length !== 0) this.applyCenteredContentStyle();
		
		this.style.boxShadow = 'inset 0px 0px 0px 0px ' + this.btnHoverColor;
		this.style.background = this.btnColor;
	}

	_onmouseenter()
	{
		this.style.boxShadow = 'inset 0px 0px 0px 3px ' + this.btnHoverColor;
	}

	_onmouseleave()
	{
		this.style.boxShadow = 'inset 0px 0px 0px 0px ' + this.btnHoverColor;
		this.style.background = this.btnColor;
	}

	_onmousedown(e)
	{
		e.cancelBubble = true;
		this.style.background = this.btnHoverColor;
	}

	_onmouseup()
	{
		this.style.background = this.btnColor;
	}
}

customElements.define('ui-button', UIButton);