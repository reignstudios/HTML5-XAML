class UIButton extends UIElement
{
	get btnColor() {return this._btnColor;}
    set btnColor(value)
    {
        this._btnColor = value;
		this.style.backgroundColor = value;
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

	get textColor() {return this._textColor;}
    set textColor(value)
    {
		this._textColor = value;
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
		
		this._textColor = 'black';
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
		var textNodeFound = false;
		for (var c of this.childNodes)
        {
            if (c.nodeType === 3)// REF: https://www.w3schools.com/jsref/prop_node_nodetype.asp
            {
				this.applyCenteredContentStyle();
				textNodeFound = true;
            }
		}
		
		if (!textNodeFound) this.removeCenteredContentStyle();
	}

	connectedCallback()
	{
		super.connectedCallback();
		
		this.className = 'ui-button';
		var cssStyle = window.getComputedStyle(this);
		this._textColor = cssStyle.color;
		this._btnColor = cssStyle.backgroundColor;
		this._btnHoverColor = cssStyle.borderColor;

		this.style.borderColor = this._btnColor;
		this.style.backgroundColor = this._btnColor;
	}

	disconnectedCallback()
	{
		this._observer.disconnect();
	}

	_onmouseenter()
	{
		this.style.borderColor = this._btnHoverColor;
	}

	_onmouseleave()
	{
		this.style.borderColor = this._btnColor;
		this.style.backgroundColor = this._btnColor;
	}

	_onmousedown(e)
	{
		e.cancelBubble = true;
		this.style.backgroundColor = this._btnHoverColor;
	}

	_onmouseup()
	{
		this.style.backgroundColor = this._btnColor;
	}
}

customElements.define('ui-button', UIButton);