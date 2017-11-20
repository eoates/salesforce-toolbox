({
	/**
	 * Called when the component has been destroyed
	 */
	unrender: function(component, helper) {
		helper.destroy(component);
		this.superUnrender();
	}
})