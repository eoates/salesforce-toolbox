({
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.addToModalContainer(component);
	},

	unrender: function(component, helper) {
		helper.removeFromModalContainer(component);
		helper.handleModalClose(component);

		this.superUnrender();
	}
})