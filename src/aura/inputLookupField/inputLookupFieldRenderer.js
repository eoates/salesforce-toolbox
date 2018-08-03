/**************************************************************************************************
 * inputLookupFieldRenderer.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-08-03
 * @version  1.0.0
 *
 **************************************************************************************************/
({
	/**
	 * Formats the value after the component has been rendered
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.formatValue(component);
	},

	/**
	 * Formats the value after the component is rerendered
	 */
	rerender: function(component, helper) {
		this.superRerender();
		helper.formatValue(component);
	}
}) // eslint-disable-line semi