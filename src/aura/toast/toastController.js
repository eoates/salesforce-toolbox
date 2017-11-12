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
})