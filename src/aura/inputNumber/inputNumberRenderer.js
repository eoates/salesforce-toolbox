/**************************************************************************************************
 * inputNumberRenderer.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  1.0.0
 *
 **************************************************************************************************/
({
	/**
	 * Invoked after the component has been rendered for the first time
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.updateInputElement(component);
		helper.setInputElementAttributesForMobile(component);
	},

	/**
	 * Invoked each time the component is rerendered
	 */
	rerender: function(component, helper) {
		this.superRerender();
		helper.setInputElementAttributesForMobile(component);
	}
})