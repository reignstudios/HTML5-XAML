class UIComboBoxItem extends UIElement
{
	get selected() {return this._selected;}

	static get observedAttributes() { return UIElement.observedAttributes; }

	constructor()
	{
		super();
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
		this._origColor = this.style.backgroundColor;
	}
}

class UIComboBox extends UIElement
{
	get itemHoverColor() {return this._itemHoverColor;}
	set itemHoverColor(value)
    {
        this._itemHoverColor = value;
    }

	get selectedValue() {return this._selectedValue;}
	set selectedValue(value)
    {
        this._selectedValue = value;// TODO
    }

    get selectedItem() {return this._selectedItem;}
	set selectedItem(value)
    {
        this._selectedItem = value;// TODO
    }

	get itemHeight() {return this._itemHeight;}
	set itemHeight(value)
    {
        this._itemHeight = value;
		if (this._itemHeight === null || this.childNodes == null) return;
		for (var child of this.childNodes)
		{
			if (child.nodeType === 3) continue;
			child.style.height = this._itemHeight;
		}
    }

	static get observedAttributes() { return UIElement.observedAttributes.concat(['color-hover', 'item-selected', 'item-height']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'color': this.backgroundColor = newValue; break;
			case 'color-hover': this.itemHoverColor = newValue; break;
			case 'item-selected': this.selectedItem = newValue; break;// TODO
			case 'item-height': this.itemHeight = newValue; break;
		}
	}

	constructor()
	{
		super();

		this._itemHoverColor = 'lightgray';
        this._selectedValue = null;
        this._selectedItem = null;
        this._itemHeight = null;
        this._itemList = null;
        this._itemListContainer = null;
        this._itemListOpen = false;

		// finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
            childList: true
		});
	}

	childerenChanged()
	{
		this.itemHeight = this._itemHeight;
		for (var child of this.childNodes)
		{
			if (child.nodeType === 3 || child === this._itemListContainer) continue;
			if (child.nodeName !== 'UI-COMBOBOXITEM')
			{
				console.error('Must use ui-comboboxitem. Unsuported: ' + child.nodeName);
				continue;
            }
            
            this.removeChild(child);
            this._itemListContainer.appendChild(child);
			
			if (child.onmouseenter === null) child.onmouseenter = (e) => {this.child_onmouseenter(e);}
			if (child.onmouseleave === null) child.onmouseleave = (e) => {this.child_onmouseleave(e);}
			if (child.onmousedown === null) child.onmousedown = (e) => {this.child_onmousedown(e);}
		}
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-combobox';
		this.style.overflowX = 'visible';
        this.style.overflowY = 'visible';// REF char: ▼
        
        this._itemListContainer = document.createElement('div');
        this._itemListContainer.style.visibility = 'hidden';
        this._itemListContainer.style.padding = '2px';
        this._itemListContainer.style.zIndex = '1';
        this._itemListContainer.style.backgroundColor = 'blue';
        this._itemListContainer.style.overflowX = 'hidden';
        this._itemListContainer.style.overflowY = 'auto';
        this._itemListContainer.style.position = 'absolute';
        this._itemListContainer.style.left = '0px';
        this._itemListContainer.style.top = '100%';
        this._itemListContainer.style.minWidth = '100%';
        this._itemListContainer.style.maxHeight = '128px';
        this.appendChild(this._itemListContainer);

        this._itemListContainer.onmousedown = () => {this._container_onmousedown();}
		this.onmousedown = () => {this._onmousedown();}
	}

	disconnectedCallback()
	{
		this._observer.disconnect();
	}

	child_onmouseenter(e)
	{
		if (!e.target._selected) e.target.style.backgroundColor = this._itemHoverColor;
	}

	child_onmouseleave(e)
	{
		if (!e.target._selected) e.target.style.backgroundColor = e.target._origColor;
	}

	child_onmousedown(e)
	{
		
    }
    
    _container_onmousedown()
	{

	}

	_onmousedown()
	{
        this._itemListOpen = !this._itemListOpen;
        this._itemListContainer.style.visibility = this._itemListOpen ? 'visible' : 'hidden';
	}
}

customElements.define('ui-comboboxitem', UIComboBoxItem);
customElements.define('ui-combobox', UIComboBox);