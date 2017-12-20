({
	/**
	 * Invoked after the component has been rendered for the first time
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.updateOptionElements(component);
		helper.setSelectedIndexFromValue(component);
		helper.updateInputAndSelectElements(component);
	}
})