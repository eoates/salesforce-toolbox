({
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.renderInputElement(component);
	},

	rerender: function(component, helper) {
		this.superRerender();
		helper.renderInputElement(component);
	}
})