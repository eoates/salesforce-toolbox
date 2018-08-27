/**************************************************************************************************
 * inputLookupDialogRenderer.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	/**
	 * Invoked after the component has been rendered for the first time
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		// Add the component instance to the dialogs array in the helper
		helper.dialogs.push(component);

		// If this was the first instance then add the window resize listener
		if (helper.dialogs.length === 1) {
			helper.addWindowResizeListener();
		}

		// Disable autocomplete and set the value of the input element
		helper.disableSearchTextInputAutocomplete(component);
		helper.setSearchTextInputValue(component, helper.getSearchText(component));
	},

	/**
	 * Invoked after the component has been destroyed and unrendered
	 */
	unrender: function(component, helper) {
		// Remove the component instance from the dialogs array in the helper
		var index = helper.dialogs.indexOf(component);
		if (index !== -1) {
			helper.dialogs.splice(index, 1);

			// If there are not more instances then remove the window resize listener
			if (helper.dialogs.length === 0) {
				helper.removeWindowResizeListener();
			}
		}

		this.superUnrender();
	}
}) // eslint-disable-line semi