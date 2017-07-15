class UIElement extends HTMLElement
{
	setTransform()
	{
		var t = '';
		if (this._hAlign === 'center') t += `translateX(-50%) translateX(${this._x})`;
		if (this._vAlign === 'center') t += `translateY(-50%) translateY(${this._y})`;
		this.style.transform = t;
	}

	get x() {return this._x;}
    set x(value)
    {
        this._x = value;
		if (this._hAlign === 'center')
		{
			this.style.right = null;
			this.style.left = '50%';
		}
		else if (this._hAlign !== 'right')
		{
			this.style.right = null;
			this.style.left = value;
		}
		else
		{
			this.style.left = null;
			this.style.right = value;
		}

		this.setTransform();
    }

	get y() {return this._y;}
    set y(value)
    {
        this._y = value;
		if (this._vAlign === 'center')
		{
			this.style.bottom = null;
			this.style.top = '50%';
		}
		else if (this._vAlign !== 'bottom')
		{
			this.style.bottom = null;
			this.style.top = value;
		}
		else
		{
			this.style.top = null;
			this.style.bottom = value;
		}

		this.setTransform();
    }

	get width() {return this._width;}
    set width(value)
    {
        this._width = value;
		this.style.width = value;
    }

	get height() {return this._height;}
    set height(value)
    {
        this._height = value;
		this.style.height = value;
    }

	get hAlign() {return this._hAlign;}
    set hAlign(value)
    {
        this._hAlign = value;
		this.x = this._x;
    }

	get vAlign() {return this._vAlign;}
    set vAlign(value)
    {
        this._vAlign = value;
		this.y = this._y;
    }

	get marginLeft() {return this.style.left;}
    set marginLeft(value)
    {
        this.style.left = value;
    }

	get marginRight() {return this.style.right;}
    set marginRight(value)
    {
        this.style.right = value;
    }

	get marginTop() {return this.style.top;}
    set marginTop(value)
    {
        this.style.top = value;
    }

	get marginBottom() {return this.style.bottom;}
    set marginBottom(value)
    {
        this.style.bottom = value;
    }

	get color() {return this.style.backgroundColor;}
    set color(value)
    {
        this.style.backgroundColor = value;
    }

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
			case 'x': this.x = newValue; break;
			case 'y': this.y = newValue; break;
			case 'width': this.width = newValue; break;
			case 'height': this.height = newValue; break;
			case 'h-align': this.hAlign = newValue; break;
			case 'v-align': this.vAlign = newValue; break;
			case 'margin-left': this.marginLeft = newValue; break;
			case 'margin-right': this.marginRight = newValue; break;
			case 'margin-top': this.marginTop = newValue; break;
			case 'margin-bottom': this.marginBottom = newValue; break;
			case 'color': this.color = newValue; break;
		}
	}

	constructor()
	{
		super();
		this._x = '0px';
		this._y = '0px';
		this._hAlign = 'left';
		this._vAlign = 'top';
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

	removeCenteredContentStyle()
	{
		this.style.display = 'initial';
		this.style.textAlign = 'initial';
		this.style.justifyContent = 'initial';
		this.style.alignItems = 'initial';
	}
}