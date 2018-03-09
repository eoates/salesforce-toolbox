({
	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.setThemeAndIconInfo(component);
	},

	/**
	 * Updates the theme and icon attributes when the type changes
	 */
	typeChange: function(component, event, helper) {
		helper.setThemeAndIconInfo(component);
	}
})