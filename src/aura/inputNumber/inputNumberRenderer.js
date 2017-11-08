({
	/**
	 * Invoked after the component has been rendered for the first time
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.renderInputElement(component);
	},

	/**
	 * Invoked each time the component is rerendered
	 */
	rerender: function(component, helper) {
		this.superRerender();
		helper.renderInputElement(component);
	}
})