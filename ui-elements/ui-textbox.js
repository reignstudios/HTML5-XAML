class UITextBox extends UIElement
{
    get text()
    {
        if (this._input !== null) return this._input.value;
        return this._text;
    }
    set text(value)
    {
        this._text = value;
        if (this._input !== null) this._input.value = value;
    }

    get textColor() {return this._textColor;}
    set textColor(value)
    {
        this._textColor = value;
        if (this._input !== null) this._input.style.textColor = value;
    }

    get textAlign() {return this._textAlign;}
    set textAlign(value)
    {
        this._textAlign = value;
        if (this._input !== null) this._input.style.textAlign = value;
    }

    get type() {return this._type;}
    set type(value)
    {
        this._type = value;
        if (this._input !== null) this._input.type = value;
    }

	static get observedAttributes() { return UIElement.observedAttributes.concat(['text', 'text-color', 'text-align', 'type']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'text': this.text = newValue; break;
			case 'text-color': this.textColor = newValue; break;
			case 'text-align': this.textAlign = newValue; break;
            case 'type': this.type = newValue; break;
		}
	}

	constructor()
	{
		super();

        this._input = null;
		this._text = '';
		this._textColor = 'black';
		this._textAlign = 'left';
        this._type = 'text';
        this._color = 'white';

        // finish init after childeren added
		this._observer = new MutationObserver((child) => {this.childerenChanged(child);});
		this._observer.observe(this, {
            childList: true
		});
	}

    applySettings(child)
	{
        // move text content
        for (var c of this.childNodes)
        {
            if (c.nodeType === 3)// REF: https://www.w3schools.com/jsref/prop_node_nodetype.asp
            {
                this._text = c.nodeValue;
                c.nodeValue = '';
            }
        }

        // finish
        this.text = this._text;
        this.textColor = this._textColor;
        this.textAlign = this._textAlign;
        this.type = this._type;
        this.color = this._color;
	}

    childerenChanged()
	{
		this.applySettings();
	}

	connectedCallback()
	{
        super.connectedCallback();
        
        // create input child
        var container = document.createElement('div');
		this._input = document.createElement('input');
		container.appendChild(this._input);
        this.appendChild(container);

        container.style.position = 'absolute';
        container.style.top = '2px';
        container.style.bottom = '2px';
        container.style.left = '4px';
        container.style.right = '4px';

        this._input.style.position = 'absolute';
        this._input.style.width = '100%';
        this._input.style.height = '100%';
        this._input.style.padding = '0px';
        this._input.style.margin = '0px';
        this._input.style.outline = 'none';
        this._input.style.border = 'none';

        this.style.border = 'solid';
        this.style.borderWidth = '2px';
	}

    disconnectedCallback()
	{
		this._observer.disconnect();
	}
}

customElements.define('ui-textbox', UITextBox);