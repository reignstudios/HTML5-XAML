class UIButton extends UIElement
{
	get btnColor() {return this._btnColor;}
    set btnColor(value)
    {
        this._btnColor = value;
		this.style.background = value;
    }

	get btnHoverColor() {return this._btnHoverColor;}
    set btnHoverColor(value)
    {
        this._btnHoverColor = value;
    }

	get text() {return this.textContent;}
    set text(value)
    {
        this.textContent = value;
		this.applyCenteredContentStyle();
    }

	get textColor() {return this.style.color;}
    set textColor(value)
    {
        this.style.color = value;
    }

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
				this.text = newValue;
				break;

			case 'text-color':
				this.textColor = newValue;
				break;
		}
	}

	constructor()
	{
		super();
		
		this._btnColor = 'darkgray';
		this._btnHoverColor = 'gray';

		this.onmouseenter = () => {this._onmouseenter();}
		this.onmouseleave = () => {this._onmouseleave();}
		this.onmousedown = (e) => {this._onmousedown(e);}
		this.onmouseup = () => {this._onmouseup();}

		// finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
		  childList: true
		});
	}

	childerenChanged()
	{
		if (this.textContent !== null && this.textContent.length !== 0) this.applyCenteredContentStyle();
		else this.removeCenteredContentStyle();
	}

	connectedCallback()
	{
		super.connectedCallback();
		
		this.style.boxShadow = 'inset 0px 0px 0px 0px ' + this._btnHoverColor;
		this.style.background = this._btnColor;
	}

	disconnectedCallback()
	{
		this._observer.disconnect();
	}

	_onmouseenter()
	{
		this.style.boxShadow = 'inset 0px 0px 0px 3px ' + this._btnHoverColor;
	}

	_onmouseleave()
	{
		this.style.boxShadow = 'inset 0px 0px 0px 0px ' + this._btnHoverColor;
		this.style.background = this._btnColor;
	}

	_onmousedown(e)
	{
		e.cancelBubble = true;
		this.style.background = this._btnHoverColor;
	}

	_onmouseup()
	{
		this.style.background = this._btnColor;
	}
}

customElements.define('ui-button', UIButton);