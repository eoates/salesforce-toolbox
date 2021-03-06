/**************************************************************************************************
 * dialogRenderer.js
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
	 * When the component is rendered add it to the container
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		helper.addDialogToContainer(component);

		// If openAfterRender is true then automatically open the dialog
		if (component.openAfterRender) {
			component.openAfterRender = false;
			setTimeout($A.getCallback(function() {
				helper.openDialog(component);
			}), 0);
		}
	},

	/**
	 * When the component is unrendered/destroyed remove it from the container
	 */
	unrender: function(component, helper) {
		helper.closeDialog(component);
		helper.removeDialogFromContainer(component);

		this.superUnrender();
	}
}) // eslint-disable-line semi