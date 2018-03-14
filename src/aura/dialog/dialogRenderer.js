({
	/**
	 * When the component is rendered add it to the container
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.addDialogToContainer(component);
	},

	/**
	 * When the component is unrendered/destroyed remove it from the container
	 */
	unrender: function(component, helper) {
		helper.removeDialogFromContainer(component);
		helper.handleDialogClose(component);

		this.superUnrender();
	}
})