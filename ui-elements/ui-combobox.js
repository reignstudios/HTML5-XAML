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
    get selectedItem() {return this._selectedItem;}
	set selectedItem(value)
    {
        this.selectItem(value);
	}
	
	get selectedIndex() {return this._selectedIndex;}
	set selectedIndex(value)
    {
		if (value >= 0 && value < this._itemList.length)
		{
			this._selectedIndex = value;
			this.selectItem(this._itemList[this._selectedIndex]);
		}
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
			case 'item-selected': this._selectedIndex = newValue; break;
			case 'item-height': this.itemHeight = newValue; break;
		}
	}

	constructor()
	{
		super();

		this._selectedIndex = -1;
        this._selectedValue = null;
        this._selectedItem = null;
        this._selectedValueContainer = null;

        this._itemHoverColor = 'lightgray';
        this._itemHeight = null;
        this._itemList = [];
        this._itemListContainer = null;
		this._itemListOpen = false;
		this._prefix = '▼ ';

		// finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
            childList: true
		});
	}

	childerenChanged()
	{
		for (var child of this.childNodes)
		{
			if (child.nodeType === 3 || child === this._itemListContainer || child === this._selectedValueContainer) continue;
			if (child.nodeName !== 'UI-COMBOBOXITEM')
			{
				console.error('Must use ui-comboboxitem. Unsuported: ' + child.nodeName);
				continue;
            }
			
			this._itemList.push(child);
            this.removeChild(child);
			this._itemListContainer.appendChild(child);
			child.style.whiteSpace = 'nowrap';
			
			// bind mouse events
			if (child.onmouseenter === null) child.onmouseenter = (e) => {this.child_onmouseenter(e);}
			if (child.onmouseleave === null) child.onmouseleave = (e) => {this.child_onmouseleave(e);}
			if (child.onmousedown === null) child.onmousedown = (e) => {this.child_onmousedown(e);}
		}

		this.itemHeight = this._itemHeight;
		this.selectedIndex = this._selectedIndex;
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-combobox';
		this.style.overflowX = 'visible';
		this.style.overflowY = 'visible';
        var cssStyle = window.getComputedStyle(this);
        
        // item list container
		this._itemListContainer = document.createElement('div');
		this._itemListContainer.className = 'popup';
        this._itemListContainer.style.visibility = 'hidden';
        this._itemListContainer.style.zIndex = '1';
        this._itemListContainer.style.overflowX = 'hidden';
        this._itemListContainer.style.overflowY = 'auto';
        this._itemListContainer.style.position = 'absolute';
        this._itemListContainer.style.left = '-' + cssStyle.borderWidth;
        this._itemListContainer.style.top = `calc(100% + ${cssStyle.borderWidth})`;
		var values = this.getValueComponents(cssStyle.borderWidth);
		values[0] *= 2;
		this._itemListContainer.style.minWidth = `calc(100% - ${values[0]}${values[1]})`;
		this._itemListContainer.style.maxWidth = '200%';
        this._itemListContainer.style.maxHeight = '128px';
        this.appendChild(this._itemListContainer);

        // selected value container
        this._selectedValueContainer = document.createElement('div');
		this._selectedValueContainer.style.width = '100%';
		this._selectedValueContainer.style.height = '100%';
		this._selectedValueContainer.style.whiteSpace = 'nowrap';
		this._selectedValueContainer.style.overflow = 'hidden';
		this._selectedValueContainer.innerHTML = this._prefix;
		this.appendChild(this._selectedValueContainer);
		
		// bind mouse events
		this.onmousedown = () => {this._onmousedown();}
		this._itemListContainer.onmousedown = (e) => {this._container_onmousedown(e);}
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
		this.selectItem(e.target);
		this._itemListOpen = false;
        this._itemListContainer.style.visibility = 'hidden';
    }

	_onmousedown()
	{
        this._itemListOpen = !this._itemListOpen;
		this._itemListContainer.style.visibility = this._itemListOpen ? 'visible' : 'hidden';
		
		if (this._itemListOpen)
		{
			var cssStyle = window.getComputedStyle(this);
			this._itemListContainer.style.top = `calc(100% + ${cssStyle.borderWidth})`;
			var rect = this._itemListContainer.getBoundingClientRect();
			if (rect.bottom > window.innerHeight)
			{
				this._itemListContainer.style.top = `calc(${-rect.height}px - ${cssStyle.borderWidth})`;
			}
		}
	}

	_container_onmousedown(e)
	{
		e.cancelBubble = true;
	}

	selectItem(item)
	{
		if (item === null)
		{
			this._selectedItem = null;
			this._selectedValue = null;
			this._selectedIndex = -1;
			if (this._selectedValueContainer !== null) this._selectedValueContainer.innerHTML = this._prefix;
			return;
		}

		this._selectedItem = item;
		this._selectedValue = item.innerHTML;
		this._selectedValueContainer.innerHTML = this._prefix + this._selectedValue;

		var i = 0;
		for (var it of this._itemList)
		{
			if (it === item)
			{
				this._selectedIndex = i;
				break;
			}

			i += 1;
		}
	}

	addItem(item)
	{
		this._itemList.push(item);
	}

	removeItem(item)
	{
		var i = 0;
		for (var it of this._itemList)
		{
			if (it === item)
			{
				this._itemList.splice(i, 1);
				break;
			}

			i += 1;
		}
	}
}

customElements.define('ui-comboboxitem', UIComboBoxItem);
customElements.define('ui-combobox', UIComboBox);