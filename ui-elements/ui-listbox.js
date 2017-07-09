class UIListBoxItem extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }

	constructor()
	{
		super();

		this.selected = false;
		this.origColor = 'transparent';
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.style.position = 'relative';

		this.style.display = 'list-item';
		this.style.listStyleType = 'none';
		//this.style.display = 'list-item';
		this.style.width = '100%';
		this.style.margin = '0px 0px 2px 0px';
		this.origColor = this.style.background;
	}
}

class UIListBox extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes.concat(['color-hover', 'item-height']); }
	attributeChangedCallback(attr, oldValue, newValue)
	{
		super.attributeChangedCallback(attr, oldValue, newValue);

		switch (attr)
		{
			case 'color':
				this.backgroundColor = newValue;
				break;

			case 'color-hover':
				this.itemHoverColor = newValue;
				break;

			case 'item-height':
				this.itemHeight = newValue;
				break;
		}
	}

	constructor()
	{
		super();

		this.isInit = false;
		this.backgroundColor = 'white';
		this.itemHoverColor = 'lightgray';
		this.itemSelectedColor = 'gray';
		this.itemHeight = '24px';

		// finish init after childeren added
		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
		  childList: true
		});
	}

	childerenChanged()
	{
		for (var child of this.children)
		{
			if (child.nodeName !== 'UI-LISTBOXITEM')
			{
				console.error('Must use ui-listboxitem. Unsuported: ' + child.nodeName);
				continue;
			}
			
			//child.style.height = this.itemHeight;
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
		this.style.background = this.backgroundColor;

		this.onmousedown = () => {this._onmousedown();}
	}

	disconnectedCallback()
	{
		this._observer.disconnect();
	}

	child_onmouseenter(e)
	{
		if (!e.target.selected) e.target.style.background = this.itemHoverColor;
	}

	child_onmouseleave(e)
	{
		if (!e.target.selected) e.target.style.background = e.target.origColor;
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
		target.style.background = this.itemSelectedColor;
		target.selected = true;
		for (var child of this.children)
		{
			if (child == target) continue;

			child.style.background = child.origColor;
			child.selected = false;
		}
	}

	_onmousedown()
	{
		for (var child of this.children)
		{
			child.style.background = child.origColor;
			child.selected = false;
		}
	}
}

customElements.define('ui-listboxitem', UIListBoxItem);
customElements.define('ui-listbox', UIListBox);