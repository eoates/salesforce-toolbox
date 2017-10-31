({
	/**
	 * Handles the showToast application event. If force:showToast is available then the component
	 * assumes that it is running in the one.app container and will simply raise a force:showToast
	 * event with the same parameter values as the c:showToast event
	 */
	showToast: function(component, event, helper) {
		if (component !== helper.toasters[0]) {
			return;
		}

		var params = event.getParams(),
		    type = params.type,
		    key = params.key,
		    title = params.title,
		    message = params.message,
		    mode = params.mode,
		    duration = params.duration;

		var toastEvent = $A.get('e.force:showToast');
		if (toastEvent) {
			// force:showToast is available. Assume we are running in the one.app container and use
			// the standard force:showToast event with the same parameter values
			toastEvent.setParams(params);
			toastEvent.fire();
		} else {
			// force:showToast is not available. We'll have to handle this ourselves
			helper.createToast(component, type, key, title, message, mode, duration);
		}
	},

	/**
	 * Handles the click event for the Close button on an individual toast. Removes the toast from
	 * the list of displayed toasts and attempts to display the next toast in the queue if one
	 * exists
	 */
	dismissToast: function(component, event, helper) {
		var toast = event.getSource(),
		    name = toast.get('v.value');

		event.stopPropagation();
		helper.removeToast(component, name);
		helper.showNextToastInQueue(component);
	}
})