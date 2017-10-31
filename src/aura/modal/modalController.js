({
	/**
	 * Opens the modal
	 */
	open: function(component, event, helper) {
		var args = event.getParam('arguments');

		var animation = args.animation;
		var defaultAnimation = component.get('v.animation');
		var currentAnimation = helper.getAnimationClassName(animation, defaultAnimation);
		component.set('v.currentAnimation', currentAnimation);

		helper.dismissToast(component);
		helper.openModal(component);
	},

	/**
	 * Closes the modal
	 */
	close: function(component, event, helper) {
		helper.closeModal(component);
	},

	/**
	 * Displays a toast message in the header of the modal
	 */
	showToast: function(component, event, helper) {
		var args = event.getParam('arguments');
		helper.showToast(component, args);
	},

	/**
	 * Handles the onclosebutton event for the displayed toast
	 */
	dismissToast: function(component, event, helper) {
		event.stopPropagation();
		helper.dismissToast(component);
	},

	/**
	 * Check for ESC or ENTER and raise the appropriate event
	 */
	modalKeyDown: function(component, event, helper) {
		event.stopPropagation();

		// Do nothing if the event has already been canceled
		if (event.defaultPrevented) {
			return;
		}

		var which = event.keyCode || event.which || 0;
		var handled = false;

		// Escape
		if (which === 27) {
			var busy = component.get('v.busy');
			var closeButton = component.get('v.closeButton');
			if (closeButton && !busy) {
				helper.fireEvent(component, 'onclosebutton');
				handled = true;
			}
		}

		// Enter
		if (which === 13) {
			var busy = component.get('v.busy');
			if (!busy) {
				helper.fireEvent(component, 'onaction');
				handled = true;
			}
		}

		// If we handled the event then cancel it
		if (handled) {
			event.preventDefault();
		}
	},

	/**
	 * Raises the onclosebutton event to signal that the close button was clicked
	 */
	closeButtonClick: function(component, event, helper) {
		event.stopPropagation();
		helper.fireEvent(component, 'onclosebutton');
	}
})