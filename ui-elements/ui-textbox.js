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
		}
	}

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
		this.applyCenteredContentStyle();

        // copy text content to text buff
        if (this.textContent !== null && this.textContent.length !== 0) this.text = this.textContent;
        this.textContent = null;

        // create input child
		this.input = document.createElement('input');
		this.appendChild(this.input);
		this.input.style.width = '100%';
		this.input.style.height = '100%';
        this.applySettings();
	}

    disconnectedCallback()
	{
		this._observer.disconnect();
	}
}

customElements.define('ui-textbox', UITextBox);