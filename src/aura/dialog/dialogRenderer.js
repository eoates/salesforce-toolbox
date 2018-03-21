/**************************************************************************************************
 * dialogRenderer.js
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
		helper.closeDialog(component);
		helper.removeDialogFromContainer(component);

		this.superUnrender();
	}
})