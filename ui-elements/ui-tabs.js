class UITab extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-tab';
	}
}

class UITabGroup extends UIElement
{
	static get observedAttributes() { return UIElement.observedAttributes; }

	constructor()
	{
		super();

		this.tabButtons = [0];

		this._observer = new MutationObserver(() => {this.childerenChanged();});
		this._observer.observe(this, {
			childList: true
		});
	}

	childerenChanged()
	{
		for (var child of this.childNodes)
		{
			
		}
	}

	connectedCallback()
	{
		super.connectedCallback();
		this.className = 'ui-tabgroup';
		
	}
}

customElements.define('ui-tabgroup', UITabGroup);
customElements.define('ui-tab', UITab);