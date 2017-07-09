class UIElement extends HTMLElement
{
	static get observedAttributes()
	{return[
		'x', 'y',
		'width', 'height',
		'h-align', 'v-align',
		'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
		'color'
	];}

	attributeChangedCallback(attr, oldValue, newValue)
	{
		switch (attr)
		{
			case 'x': this.setAxisX(newValue); break;
			case 'y': this.setAxisY(newValue); break;
			case 'width': super.style.width = newValue; break;
			case 'height': super.style.height = newValue; break;

			case 'h-align':
				this.hAlign = newValue;
				this.setAxisX(this.x);
				break;

			case 'v-align':
				this.vAlign = newValue;
				this.setAxisY(this.y);
				break;

			case 'margin-left': super.style.left = newValue; break;
			case 'margin-right': super.style.right = newValue; break;
			case 'margin-top': super.style.top = newValue; break;
			case 'margin-bottom': super.style.bottom = newValue; break;
			case 'color': super.style.background = newValue; break;
		}
	}

	setTransform()
	{
		var t = '';
		if (this.hAlign === 'center') t += `translateX(-50%) translateX(${this.x})`;
		if (this.vAlign === 'center') t += `translateY(-50%) translateY(${this.y})`;
		this.style.transform = t;
	}

	setAxisX(newValue)
	{
		this.x = newValue;
		if (this.hAlign === 'center')
		{
			this.style.right = null;
			this.style.left = '50%';
		}
		else if (this.hAlign !== 'right')
		{
			this.style.right = null;
			this.style.left = newValue;
		}
		else
		{
			this.style.left = null;
			this.style.right = newValue;
		}

		this.setTransform();
	}

	setAxisY(newValue)
	{
		this.y = newValue;
		if (this.vAlign === 'center')
		{
			this.style.bottom = null;
			this.style.top = '50%';
		}
		else if (this.vAlign !== 'bottom')
		{
			this.style.bottom = null;
			this.style.top = newValue;
		}
		else
		{
			this.style.top = null;
			this.style.bottom = newValue;
		}

		this.setTransform();
	}

	constructor()
	{
		super();
		this.x = '0px';
		this.y = '0px';
		this.hAlign = 'left';
		this.vAlign = 'top';
	}

	connectedCallback()
	{
		this.style.position = 'absolute';
		this.style.userSelect = 'none';
		this.style.cursor = 'default';
	}

	applyCenteredContentStyle()
	{
		this.style.display = 'flex';
		this.style.textAlign = 'center';
		this.style.justifyContent = 'center';
		this.style.alignItems = 'center';
	}
}