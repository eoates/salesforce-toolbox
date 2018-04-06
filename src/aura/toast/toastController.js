/**************************************************************************************************
 * toastController.js
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
	 * Fires the onclosebutton event when the user clicks the close button
	 */
	closeClick: function(component, event, helper) {
		event.stopPropagation();

		var closeEvent = component.getEvent('onclosebutton');
		closeEvent.setParam('arguments', {});
		closeEvent.fire();
	}
}) // eslint-disable-line semi