class UIImage extends UIElement
{
	get src() {return this._src;}
    set src(value)
    {
        this._src = value;
		if (this._img !== null) this._img.src = value;
    }

	get fill() {return this._fill;}
    set fill(value)
    {
        this._fill = value;
		if (this._img !== null)
		{
			if (value !== 'stretch') this._img.style.objectFit = 'contain';
			else this._img.style.objectFit = 'fill';
		}
    }

	static get observedAttributes() { return UIElement.observedAttributes.concat(['src', 'fill']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'src': this.src = newValue; break;
			case 'fill': this.fill = newValue; break;
		}
	}

	applySettings()
	{
		this.src = this._src;
		this.fill = this._fill;
	}

	constructor()
	{
		super();

		this._src = null;
		this._fill = null;
		this._img = null;
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.applyCenteredContentStyle();

		this._img = document.createElement('img');
		this.appendChild(this._img);
		this._img.style.width = '100%';
		this._img.style.height = '100%';
		this._img.draggable = false;
		this.applySettings();
	}
}

customElements.define('ui-image', UIImage);