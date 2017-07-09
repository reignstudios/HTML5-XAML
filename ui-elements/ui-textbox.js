class UITextBox extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes.concat(['text', 'text-color', 'text-align', 'type']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'text':
				this.text = newValue;
                this.applySettings();
				break;

			case 'text-color':
				this.textColor = newValue;
                this.applySettings();
				break;

			case 'text-align':
				this.textAlign = newValue;
                this.applySettings();
				break;

            case 'type':
				this.type = newValue;
                this.applySettings();
				break;

            case 'color':
                this.color = newValue;
                break;
		}
	}

    /*set text(value)// TODO: add properties (text backed by this._text)
    {
        alert(value);
        return null;
    }*/

	applySettings()
	{
		if (this.input === null) return;

        this.input.value = this.text;
        this.input.type = this.type;
        this.input.style.color = this.textColor;
        this.input.style.textAlign = this.textAlign;
	}

	constructor()
	{
		super();

        this.input = null;
		this.text = '';
		this.textColor = 'black';
		this.textAlign = 'left';
        this.type = 'text';
        this.color = 'white';

        // finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
		  childList: true
		});
	}

    childerenChanged()
	{
		this.applySettings();
	}

	connectedCallback()
	{
		super.connectedCallback();

        // copy text content to text buff
        if (this.textContent !== null && this.textContent.length !== 0) this.text = this.textContent;
        this.textContent = null;

        // create input child
		this.input = document.createElement('input');
		this.appendChild(this.input);
        this.input.style.position = 'absolute';
        this.input.style.padding = '0px';
        this.input.style.margin = '0px';
        this.input.style.top = '2px';
        this.input.style.bottom = '2px';
        this.input.style.left = '4px';
        this.input.style.right = '4px';
        this.input.style.outline = 'none';
        this.style.boxShadow = 'inset 0px 0px 0px 1px ' + this.input.style.borderColor;
        this.input.style.border = '0px';
        this.style.background = this.color;

        this.applySettings();
	}

    disconnectedCallback()
	{
		this._observer.disconnect();
	}
}

customElements.define('ui-textbox', UITextBox);