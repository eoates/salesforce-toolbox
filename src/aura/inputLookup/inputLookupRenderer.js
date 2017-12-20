({
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.reset(component);
	},
})