class UIImage extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes.concat(['src', 'fill']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'src':
				this.src = newValue;
				this.applySettings();
				break;

			case 'fill':
				this.fill = newValue;
				this.applySettings();
				break;
		}
	}

	applySettings()
	{
		if (this.img === null) return;

		this.img.src = this.src;
		if (this.fill !== 'stretch') this.img.style.objectFit = 'contain';
		else this.img.style.objectFit = 'fill';
	}

	constructor()
	{
		super();

		this.src = null;
		this.fill = null;
		this.img = null;
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.applyCenteredContentStyle();

		this.img = document.createElement('img');
		this.appendChild(this.img);
		this.img.style.width = '100%';
		this.img.style.height = '100%';
		this.img.draggable = false;
		this.applySettings();
	}
}

customElements.define('ui-image', UIImage);