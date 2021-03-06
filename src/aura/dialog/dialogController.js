/**************************************************************************************************
 * dialogController.js
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
	 * Opens the dialog
	 */
	open: function(component, event, helper) {
		helper.openDialog(component);
	},

	/**
	 * Closes the dialog
	 */
	close: function(component, event, helper) {
		helper.closeDialog(component);
	},

	/**
	 * Sets focus to the dialog's close button if it has one. Useful in onfocusfirst and
	 * onfocuslast event handlers when a dialog has no focusable elements of its own
	 */
	focusCloseButton: function(component, event, helper) {
		var index = helper.indexOfDialog(component);
		if (index === -1) {
			// Dialig is not open
			return;
		}

		var closeButton = component.find('closeButton');
		if (closeButton) {
			closeButton.focus();
		}
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * When the hash part of the URL changes close all open dialogs
	 */
	locationChange: function(component, event, helper) {
		helper.closeAll();
	},

	/**
	 * Fire the onclosebutton event when ESCAPE is pressed and a close button is present
	 */
	dialogKeyDown: function(component, event, helper) {
		// Do nothing if the event has already been cancelled
		if (event.defaultPrevented) {
			return;
		}

		var keyCode = event.keyCode || event.which || 0;
		if (keyCode === 27) {
			// Escape was pressed. If the closeButton attribute is true then fire the onclosebutton
			// event. It is the dialog owner's responsibility to handle this event and actually
			// close the dialog. The reason we don't just close the dialog automatically is that
			// there could be reasons the dialog owner may wish the dialog to remain open
			var closeButton = component.get('v.closeButton');
			if (closeButton) {
				event.stopPropagation();
				event.preventDefault();
				helper.fireEvent(component, 'onclosebutton');
			}
		}
	},

	/**
	 * When the user presses the mouse button outside of the container we want to prevent the
	 * .slds-modal element from receiving focus. This keeps the user from being able to click
	 * outside the dialog and then press the TAB key to navigate to elements behind the dialog
	 */
	dialogMouseDown: function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
	},

	/**
	 * When the user presses the mouse button inside of the slds-modal__header element we stop
	 * propagation of the event so it does not get suppressed by the parent .slds-modal element
	 */
	headerMouseDown: function(component, event, helper) {
		event.stopPropagation();
	},

	/**
	 * When the user presses the mouse button inside of the slds-modal__content element we stop
	 * propagation of the event so it does not get suppressed by the parent .slds-modal element
	 */
	contentMouseDown: function(component, event, helper) {
		event.stopPropagation();
	},

	/**
	 * When the user presses the mouse button inside of the slds-modal__footer element we stop
	 * propagation of the event so it does not get suppressed by the parent .slds-modal element
	 */
	footerMouseDown: function(component, event, helper) {
		event.stopPropagation();
	},

	/**
	 * Fire the onclosebutton event when the close button is clicked
	 */
	closeButtonClick: function(component, event, helper) {
		event.stopPropagation();
		helper.fireEvent(component, 'onclosebutton');
	},

	/**
	 * Fire the ondefaultaction event when the form is submitted
	 */
	formSubmit: function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
		helper.fireEvent(component, 'ondefaultaction');
	},

	/**
	 * When the top focus trap element receives focus that means the user pressed SHIFT+TAB while
	 * the first element in the dialog had focus. Fire the onfocuslast event to signal to the parent
	 * that it should set focus to the last focusable element in the dialog
	 */
	focusTrapTopFocus: function(component, event, helper) {
		var activeDialog = helper.getActiveDialog();
		if (activeDialog && (activeDialog !== component)) {
			helper.focusTop(activeDialog);
			return;
		}

		if (component.ignoreFocusTrapTopFocus) {
			return;
		}
		helper.fireEvent(component, 'onfocuslast');
	},

	/**
	 * We want to keep the user from changing the focus to an element outside of the dialog. Here we
	 * check to see if the user presses SHIFT+TAB and, if so, prevent the focus change. We also fire
	 * the onfocuslast event to signal to the parent that it hould set focus to the last focusable
	 * element in the dialog
	 */
	focusTrapTopKeyDown: function(component, event, helper) {
		var keyCode = event.keyCode || event.which || 0;
		if ((keyCode === 9) && event.shiftKey) {
			event.stopPropagation();
			event.preventDefault();
			helper.fireEvent(component, 'onfocuslast');
		}
	},

	/**
	 * When the bottom focus trap element receives focus that means the user pressed TAB while the
	 * last focusable element in the dialog had focus. If a close button is present then set focus
	 * to it; otherwise, fire the onfocusfirst event to signal to the parent that it should set
	 * focus to the first focusable element in the dialog
	 */
	focusTrapBottomFocus: function(component, event, helper) {
		var activeDialog = helper.getActiveDialog(component);
		if (activeDialog && (activeDialog !== component)) {
			helper.focusBottom(activeDialog);
			return;
		}

		if (component.ignoreFocusTrapBottomFocus) {
			return;
		}

		var closeButton = component.find('closeButton');
		if (closeButton) {
			closeButton.focus();
		} else {
			helper.fireEvent(component, 'onfocusfirst');
		}
	},

	/**
	 * We want to keep the user from changing the focus to an element outside of the dialog. Here we
	 * check to see if the user presses TAB and, if so, prevent the focus change. We also fire the
	 * onfocusfirst event to signal to the parent that it hould set focus to the first focusable
	 * element in the dialog
	 */
	focusTrapBottomKeyDown: function(component, event, helper) {
		var keyCode = event.keyCode || event.which || 0;
		if ((keyCode === 9) && !event.shiftKey) {
			event.stopPropagation();
			event.preventDefault();
			helper.fireEvent(component, 'onfocusfirst');
		}
	}
}) // eslint-disable-line semi