/**************************************************************************************************
 * inputLookupRenderer.js
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
	 * Invoked after the component is rendered for the first time
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.disableSearchTextInputAutocomplete(component);
		helper.setSearchTextInputValue(component, helper.getSearchText(component));
		helper.showMenuItemsBasedOnSearchText(component);
	},

	/**
	 * Invoked after the component is rerendered due to an attribute change
	 */
	rerender: function(component, helper) {
		this.superRerender();

		helper.disableSearchTextInputAutocomplete(component);
		helper.showMenuItemsBasedOnSearchText(component);
		helper.closeMenuIfEmpty(component);
	}
}) // eslint-disable-line semi