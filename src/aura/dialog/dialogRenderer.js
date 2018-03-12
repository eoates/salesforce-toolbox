({
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.addDialogToContainer(component);
	},

	unrender: function(component, helper) {
		helper.removeDialogFromContainer(component);
		helper.handleDialogClose(component);

		this.superUnrender();
	}
})