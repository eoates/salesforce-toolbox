/**************************************************************************************************
 * dialogHelper.js
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
	dialogContainerId: 'c_dialog_container',
	dialogContainerZIndex: 9000,
	openDialogs: [],

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Sets focus to the dialog's top element
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusTop: function(component) {
		var topId = component.getGlobalId() + '_top';
		var top = document.getElementById(topId);
		if (top) {
			top.focus();
		}
	},

	/**
	 * Sets focus to the dialog's top element without triggering its event handler
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusTopSilent: function(component) {
		component.ignoreFocusTrapTopFocus = true;
		try {
			this.focusTop(component);
		} finally {
			component.ignoreFocusTrapTopFocus = false;
		}
	},

	/**
	 * Sets focus to the dialog's bottom element
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusBottom: function(component) {
		var bottomId = component.getGlobalId() + '_bottom';
		var bottom = document.getElementById(bottomId);
		if (bottom) {
			bottom.focus();
		}
	},

	/**
	 * Sets focus to the dialog's bottom element without triggering its event handler
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusBottomSilent: function(component) {
		component.ignoreFocusTrapBottomFocus = true;
		try {
			this.focusBottom(component);
		} finally {
			component.ignoreFocusTrapBottomFocus = false;
		}
	},

	/**
	 * Set focus to the first element in the dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusFirstElement: function(component) {
		// Make sure some element within the dialog has focus. If we have a close button then use
		// that; otherwise, use the top focus trap
		var closeButton = component.find('closeButton');
		if (closeButton) {
			closeButton.focus();
		} else {
			this.focusTopSilent(component);
		}
	},

	/**
	 * Set focus to the last element in the dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	focusLastElement: function(component) {
		// Make sure some element within the dialog has focus. If we have a close button then use
		// that; otherwise, use the bottom focus trap
		var closeButton = component.find('closeButton');
		if (closeButton) {
			closeButton.focus();
		} else {
			this.focusBottomSilent(component);
		}
	},

	/**
	 * Returns the body element
	 *
	 * @return {HTMLElement} The body element
	 */
	getBodyElement: function() {
		var body = document.body;
		if (!body) {
			var elements = document.getElementsByTagName('body');
			if (elements && elements.length > 0) {
				body = elements[0];
			}
		}
		return body;
	},

	/**
	 * Returns the dialog container element
	 *
	 * @return {HTMLElement} The element which contains all dialogs
	 */
	getDialogContainer: function() {
		return document.getElementById(this.dialogContainerId);
	},

	/**
	 * Creates the dialog container element
	 *
	 * @return {HTMLElement} An element which will be used to contain all of the dialogs
	 */
	createDialogContainer: function() {
		var container;

		var body = this.getBodyElement();
		if (body) {
			container = document.createElement('div');
			container.id = this.dialogContainerId;
			container.className = 'slds-scope';

			var dialogs = document.createElement('div');
			dialogs.id = this.dialogContainerId + '_dialogs';
			container.appendChild(dialogs);

			var backdrop = document.createElement('div');
			backdrop.id = this.dialogContainerId + '_backdrop';
			backdrop.className = 'slds-backdrop';
			backdrop.style.zIndex = this.dialogContainerZIndex;
			container.appendChild(backdrop);

			body.appendChild(container);

			var topFocusTrap = this.createTopFocusTrap();
			body.insertBefore(topFocusTrap, body.childNodes[0]);

			var bottomFocusTrap = this.createBottomFocusTrap();
			body.appendChild(bottomFocusTrap);
		}

		return container;
	},

	/**
	 * Creates a focus trap element. A focus trap element is used to prevent focus from leaving the
	 * active dialog. We create 2 focus traps: a top and a bottom. When the top focus trap receives
	 * focus then it finds the active dialog and notifies it to set focus to its first element.
	 * Similarly, when the bottom focus trap receives focus it finds the active dialog and notifies
	 * it to set focus to its last element
	 *
	 * @param {string} trapId - The ID to use for the created element
	 *
	 * @return {HTMLElement} The focus trap element
	 */
	createFocusTrap: function(trapId) {
		var trap = document.createElement('button');
		trap.id = trapId;
		trap.type = 'button';
		trap.innerText = trapId;
		trap.style.overflow = 'hidden';
		trap.style.position = 'absolute';
		trap.style.width = '0';
		trap.style.height = '0';
		trap.style.padding = '0';
		trap.style.border = 'none';
		trap.style.background = 'none';
		trap.style.display = 'none';
		return trap;
	},

	/**
	 * Creates the top focus trap element. It has its tab index set to 1 so it should be the first
	 * element to receive focus if the user tabs into the window from outside (for example the
	 * browser's location/address field)
	 *
	 * @return {HTMLElement} The top focus trap element
	 */
	createTopFocusTrap: function() {
		var self = this;

		var trap = this.createFocusTrap(this.dialogContainerId + '_top');
		trap.tabIndex = 1;
		trap.addEventListener('focus', $A.getCallback(function() {
			var activeDialog = self.getActiveDialog();
			if (activeDialog) {
				self.focusFirstElement(activeDialog);
				self.fireEvent(activeDialog, 'onfocusfirst');
			}
		}));

		return trap;
	},

	/**
	 * Creates the bottom focus trap element
	 *
	 * @return {HTMLElement} The bottom focus trap element
	 */
	createBottomFocusTrap: function() {
		var self = this;

		var trap = this.createFocusTrap(this.dialogContainerId + '_bottom');
		trap.addEventListener('focus', $A.getCallback(function() {
			var activeDialog = self.getActiveDialog();
			if (activeDialog) {
				self.focusLastElement(activeDialog);
				self.fireEvent(activeDialog, 'onfocuslast');
			}
		}));

		return trap;
	},

	/**
	 * Adds a dialog to the container element
	 *
	 * @param {Aura.Component} component - The dialog component to be added to the container
	 *
	 * @return {void}
	 */
	addDialogToContainer: function(component) {
		var componentId = component.getGlobalId();

		var container = this.getDialogContainer();
		if (!container) {
			container = this.createDialogContainer();
		}

		var dialogId = componentId + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		var dialogsId = this.dialogContainerId + '_dialogs';
		var dialogs = document.getElementById(dialogsId);
		if (!dialogs) {
			return;
		}

		var holderId = dialogsId + '_' + componentId;
		var holder = document.getElementById(holderId);
		if (holder) {
			return;
		}

		holder = document.createElement('div');
		holder.id = holderId;
		dialogs.appendChild(holder);

		var rootId = componentId + '_root';
		var root = document.getElementById(rootId);
		if (root) {
			this.utils.addClass(holder, root.className);
		}

		dialog.parentNode.removeChild(dialog);
		holder.appendChild(dialog);
	},

	/**
	 * Removes a dialog from the container element and places it back in its original container
	 *
	 * @param {Aura.Component} component - The dialog component to remove
	 *
	 * @return {void}
	 */
	removeDialogFromContainer: function(component) {
		var componentId = component.getGlobalId();

		var dialogsId = this.dialogContainerId + '_dialogs';
		var dialogs = document.getElementById(dialogsId);
		if (!dialogs) {
			return;
		}

		var holderId = dialogsId + '_' + componentId;
		var holder = document.getElementById(holderId);
		if (!holder) {
			return;
		}

		var dialogId = componentId + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		var rootId = componentId + '_root';
		var root = document.getElementById(rootId);
		if (!root) {
			return;
		}

		holder.removeChild(dialog);
		root.appendChild(dialog);
		dialogs.removeChild(holder);
	},

	/**
	 * Scroll the content area of a dialog to the top so the first element is visible
	 *
	 * @param {Aura.Component} component - the dialog component
	 *
	 * @return {void}
	 */
	scrollDialogContentToTop: function(component) {
		var contentId = component.getGlobalId() + '_content';
		var content = document.getElementById(contentId);
		if (content) {
			content.scrollTop = 0;
			content.scrollLeft = 0;
		}
	},

	/**
	 * Displays the dialog backdrop. This is displayed when the first dialog is opened and remains
	 * visible until the last dialog is closed
	 *
	 * @return {void}
	 */
	showDialogBackdrop: function() {
		var backdropId = this.dialogContainerId + '_backdrop';
		var backdrop = document.getElementById(backdropId);
		if (backdrop) {
			this.utils.addClass(backdrop, 'slds-backdrop_open');

			this.showTopFocusTrap();
			this.showBottomFocusTrap();
		}
	},

	/**
	 * Hides the dialog backdrop
	 *
	 * @return {void}
	 */
	hideDialogBackdrop: function() {
		var backdropId = this.dialogContainerId + '_backdrop';
		var backdrop = document.getElementById(backdropId);
		if (backdrop) {
			this.utils.removeClass(backdrop, 'slds-backdrop_open');

			this.hideTopFocusTrap();
			this.hideBottomFocusTrap();
		}
	},

	/**
	 * Shows the top focus trap. In addition to showing the element this method also ensures it
	 * appears as early in the DOM as possible. Unfortunately, due to security implemented within
	 * Lightning elements in components outside or our namespace are not returned via
	 * body.childNodes so it is still possible for other elements to appear in the DOM before our
	 * element. At this time there really isn't anything we can do about it. Luckily, because we
	 * set the tab index to 1 it should be the first element to receive focus
	 *
	 * @return {void}
	 */
	showTopFocusTrap: function() {
		var trapId = this.dialogContainerId + '_top';
		var trap = document.getElementById(trapId);
		if (trap) {
			trap.style.display = '';

			var body = this.getBodyElement();
			if (body) {
				if (body.childNodes[0] !== trap) {
					body.removeChild(trap);
					body.insertBefore(trap, body.childNodes[0]);
				}
			}
		}
	},

	/**
	 * Hides the top focus trap
	 *
	 * @return {void}
	 */
	hideTopFocusTrap: function() {
		var trapId = this.dialogContainerId + '_top';
		var trap = document.getElementById(trapId);
		if (trap) {
			trap.style.display = 'none';
		}
	},

	/**
	 * Shows the bottom focus trap. In addition to showing the element this method also ensures it
	 * appears at the end of the DOM
	 *
	 * @return {void}
	 */
	showBottomFocusTrap: function() {
		var trapId = this.dialogContainerId + '_bottom';
		var trap = document.getElementById(trapId);
		if (trap) {
			trap.style.display = '';

			var body = this.getBodyElement();
			if (body) {
				if (body.childNodes[body.childNodes.length - 1] !== trap) {
					body.removeChild(trap);
					body.appendChild(trap);
				}
			}
		}
	},

	/**
	 * Hides the bottom focus trap
	 *
	 * @return {void}
	 */
	hideBottomFocusTrap: function() {
		var trapId = this.dialogContainerId + '_bottom';
		var trap = document.getElementById(trapId);
		if (trap) {
			trap.style.display = 'none';
		}
	},

	/**
	 * Sets the CSS z-index property for the specified dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 * @param {number}         zIndex    - Index property
	 *
	 * @return {void}
	 */
	setDialogZIndex: function(component, zIndex) {
		var dialogId = component.getGlobalId() + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (dialog) {
			dialog.style.zIndex = zIndex;
		}
	},

	/**
	 * Adjusts the CSS z-index property of the active dialog so it appears above all other dialogs
	 *
	 * @return {void}
	 */
	bringActiveDialogToFront: function() {
		if (this.openDialogs.length > 0) {
			var component = this.openDialogs[this.openDialogs.length - 1];
			this.setDialogZIndex(component, this.dialogContainerZIndex + 1);
		}
	},

	/**
	 * Adjusts the CSS z-index property of all inactive dialogs so they appear behind the active
	 * dialog
	 *
	 * @return {void}
	 */
	sendInactiveDialogsToBack: function() {
		if (this.openDialogs.length > 1) {
			var counter = 1;
			for (var i = this.openDialogs.length - 1; i >= 0; i--) {
				var component = this.openDialogs[i];
				this.setDialogZIndex(component, this.dialogContainerZIndex - counter++);
			}
		}
	},

	/**
	 * Returns a reference to the active dialog. The active dialog is the dialog that was opened
	 * most recently
	 *
	 * @return {Aura.Component} The active dialog or undefined if there are no open dialogs
	 */
	getActiveDialog: function() {
		var activeDialog;
		if (this.openDialogs.length > 0) {
			activeDialog = this.openDialogs[this.openDialogs.length - 1];
		}
		return activeDialog;
	},

	/**
	 * Returns the index of the specified dialog component within the list of open dialogs. If the
	 * dialog is not open then -1 is returned
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {number} The index of the dialog within the list of open dialogs if it is open or -1
	 *                  if it is not open
	 */
	indexOfDialog: function(component) {
		var index = -1;
		for (var i = 0, n = this.openDialogs.length; i < n; i++) {
			if (this.openDialogs[i] === component) {
				index = i;
				break;
			}
		}
		return index;
	},

	/**
	 * Handle the opening of a dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	handleDialogOpen: function(component) {
		var index = this.indexOfDialog(component);
		if (index >= 0) {
			this.openDialogs.splice(index, 1);
		}

		this.openDialogs.push(component);

		this.sendInactiveDialogsToBack();
		this.bringActiveDialogToFront();

		if (this.openDialogs.length === 1) {
			this.showDialogBackdrop();
		}
	},

	/**
	 * Handle the closing of a dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	handleDialogClose: function(component) {
		var index = this.indexOfDialog(component);
		if (index === -1) {
			return;
		}

		this.openDialogs.splice(index, 1);

		this.sendInactiveDialogsToBack();
		this.bringActiveDialogToFront();

		if (this.openDialogs.length === 0) {
			this.hideDialogBackdrop();
		}
	},

	/**
	 * Open the specified dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	openDialog: function(component) {
		var dialogId = component.getGlobalId() + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		var index = this.indexOfDialog(component);
		if (index === -1) {
			this.fireEvent(component, 'onbeforeopen');

			this.handleDialogOpen(component);
			this.utils.addClass(dialog, 'slds-fade-in-open');

			this.scrollDialogContentToTop(component);
			this.focusFirstElement(component);
			this.fireEvent(component, 'onopen');
			this.fireEvent(component, 'onfocusfirst');
		} else {
			this.handleDialogOpen(component);

			this.focusFirstElement(component);
			this.fireEvent(component, 'onfocusfirst');
		}

		component.set('v.visible', true);
	},

	/**
	 * Close the specified dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 * @param {boolean}        [silent]  - If true no events will be fired
	 *
	 * @return {void}
	 */
	closeDialog: function(component, silent) {
		var dialogId = component.getGlobalId() + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		var index = this.indexOfDialog(component);
		if (index === -1) {
			return;
		}

		if (!silent) {
			this.fireEvent(component, 'onbeforeclose');
		}

		this.handleDialogClose(component);
		this.utils.removeClass(dialog, 'slds-fade-in-open');

		if (!silent) {
			this.fireEvent(component, 'onclose');

			var activeDialog = this.getActiveDialog();
			if (activeDialog) {
				this.focusFirstElement(activeDialog);
				this.fireEvent(activeDialog, 'onfocusfirst');
			}
		}

		component.set('v.visible', false);
	},

	/**
	 * This method is intended to close all open dialogs in response to an aura:locationChange event
	 * which is typically fired when the user navigates from one view to another within the mobile
	 * site (or the Salesforce 1 app). The mobile site does not always destroy components
	 * immediately when navigating between views. If the user opens a dialog and clicks the back
	 * button in their browser or on their device the dialog remains open blocking other content. In
	 * order to prevent this we handle the aura:locationChange event and close all open dialogs.
	 * Since we are closing the dialogs because the user has changed views we don't fire the dialog
	 * events such as onbeforeclose and onclose. The drawback to this approach is that if a dialog
	 * contains an anchor element with a href of "#" and event.preventDefault() is not called in its
	 * onclick event handler then the dialog will close and it may not be obvious why. That said,
	 * this seems like a reasonable trade-off to make as it seems far more likely that a user may
	 * inadvertently click the back button while a dialog is open than it is that a developer may
	 * use an anchor element with a href of "#" without calling event.preventDefault() in the
	 * onclick event handler. The bad anchor element can be fixed, but we cannot prevent the use of
	 * the back button
	 *
	 * @return {void}
	 */
	closeAll: function() {
		var dialogs = this.openDialogs.slice();
		for (var i = (dialogs.length - 1); i >= 0; i--) {
			var dialog = dialogs[i];
			this.closeDialog(dialog, true);
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The dialog component
	 * @param {string}         name      - The event name
	 * @param {Object}         args      - Optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})