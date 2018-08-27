/**************************************************************************************************
 * inputSelectRenderer.js
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

		helper.updateOptionElements(component);
		helper.setSelectedIndexFromValue(component);
		helper.updateInputAndSelectElements(component);
	}
}) // eslint-disable-line semi