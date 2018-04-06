/**************************************************************************************************
 * inputNumberBehaviorRenderer.js
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
	 * Called when the component has been destroyed
	 */
	unrender: function(component, helper) {
		helper.destroy(component);
		this.superUnrender();
	}
}) // eslint-disable-line semi