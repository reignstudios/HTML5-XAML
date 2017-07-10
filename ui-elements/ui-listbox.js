class UIListBoxItem extends UIElement
{
	get selected() {return this._selected;}

	static get observedAttributes() { return UIElement.observedAttributes; }

	constructor()
	{
		super();

		this._selected = false;
		this._origColor = 'transparent';
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.style.position = 'relative';

		this.style.display = 'list-item';
		this.style.listStyleType = 'none';
		this.style.width = '100%';
		this.style.margin = '0px 0px 2px 0px';
		this._origColor = this.style.background;
	}
}

class UIListBox extends UIElement
{
	get backgroundColor() {return this._backgroundColor;}
	set backgroundColor(value)
    {
        this._backgroundColor = value;
        this.style.background = value;
    }

	get itemHoverColor() {return this._itemHoverColor;}
	set itemHoverColor(value)
    {
        this._itemHoverColor = value;
    }

	get itemSelectedColor() {return this._itemSelectedColor;}
	set itemSelectedColor(value)
    {
        this._itemSelectedColor = value;
    }

	get itemHeight() {return this._itemHeight;}
	set itemHeight(value)
    {
        this._itemHeight = value;
		if (this._itemHeight === null || this.children == null) return;
		for (var child of this.children)
		{
			child.style.height = this._itemHeight;
		}
    }

	static get observedAttributes() { return UIElement.observedAttributes.concat(['color-hover', 'color-selected', 'item-height']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'color': this.backgroundColor = newValue; break;
			case 'color-hover': this.itemHoverColor = newValue; break;
			case 'color-selected': this.itemSelectedColor = newValue; break;
			case 'item-height': this.itemHeight = newValue; break;
		}
	}

	constructor()
	{
		super();

		this._backgroundColor = 'white';
		this._itemHoverColor = 'lightgray';
		this._itemSelectedColor = 'gray';
		this._itemHeight = null;

		// finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
		  childList: true
		});
	}

	childerenChanged()
	{
		this.itemHeight = this._itemHeight;
		for (var child of this.children)
		{
			if (child.nodeName !== 'UI-LISTBOXITEM')
			{
				console.error('Must use ui-listboxitem. Unsuported: ' + child.nodeName);
				continue;
			}
			
			if (child.onmouseenter === null) child.onmouseenter = (e) => {this.child_onmouseenter(e);}
			if (child.onmouseleave === null) child.onmouseleave = (e) => {this.child_onmouseleave(e);}
			if (child.onmousedown === null) child.onmousedown = (e) => {this.child_onmousedown(e);}
		}
	}

	connectedCallback()
	{
		super.connectedCallback();

		this.style.padding = '4px';
		this.style.boxShadow = 'inset 0px 0px 0px 3px gray';
		this.style.background = this._backgroundColor;
		this.style.overflowY = 'auto';

		this.onmousedown = () => {this._onmousedown();}
	}

	disconnectedCallback()
	{
		this._observer.disconnect();
	}

	child_onmouseenter(e)
	{
		if (!e.target._selected) e.target.style.background = this._itemHoverColor;
	}

	child_onmouseleave(e)
	{
		if (!e.target._selected) e.target.style.background = e.target._origColor;
	}

	child_onmousedown(e)
	{
		e.cancelBubble = true;
		
		// find item target
		var target = null;
		for (var t of e.path)
		{
			if (t.nodeName === 'UI-LISTBOXITEM')
			{
				target = t;
				break;
			}
		}
		
		if (target === null) return;

		// apply state changes
		target.style.background = this._itemSelectedColor;
		target._selected = true;
		for (var child of this.children)
		{
			if (child == target) continue;

			child.style.background = child._origColor;
			child._selected = false;
		}
	}

	_onmousedown()
	{
		for (var child of this.children)
		{
			child.style.background = child._origColor;
			child._selected = false;
		}
	}
}

customElements.define('ui-listboxitem', UIListBoxItem);
customElements.define('ui-listbox', UIListBox);