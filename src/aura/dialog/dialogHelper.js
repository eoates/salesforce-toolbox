({
	dialogContainerId: 'c_dialog_container',
	dialogContainerZIndex: 9000,
	openDialogs: [],

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
			// Set focus to close button
			closeButton.focus();
		} else {
			// Set focus to top focus trap. Set the ignoreFocusTrapTopFocus flag to true so the
			// element's focus handler does not try to fire the onfocuslast event
			var topId = component.getGlobalId() + '_top';
			var top = document.getElementById(topId);
			if (top) {
				component.ignoreFocusTrapTopFocus = true;
				try {
					top.focus();
				} finally {
					component.ignoreFocusTrapTopFocus = false;
				}
			}
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
		}

		return container;
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
			$A.util.addClass(holder, root.className);
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
	 * Displays the dialog backdrop. This is displayed when the first dialog is opened and remains
	 * visible until the last dialog is closed
	 *
	 * @return {void}
	 */
	showDialogBackdrop: function() {
		var backdropId = this.dialogContainerId + '_backdrop';
		var backdrop = document.getElementById(backdropId);
		if (backdrop) {
			$A.util.addClass(backdrop, 'slds-backdrop_open');
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
			$A.util.removeClass(backdrop, 'slds-backdrop_open');
		}
	},

	/**
	 * Sets the CSS z-index property for the specified dialog
	 *
	 * @param {string} componentId - The ID of the dialog component
	 * @param {number} zIndex      - Index property
	 *
	 * @return {void}
	 */
	setDialogZIndex: function(componentId, zIndex) {
		var dialogId = componentId + '_dialog';
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
			var componentId = this.openDialogs[this.openDialogs.length - 1];
			this.setDialogZIndex(componentId, this.dialogContainerZIndex + 1);
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
				var componentId = this.openDialogs[i];
				this.setDialogZIndex(componentId, this.dialogContainerZIndex - counter++);
			}
		}
	},

	/**
	 * Handle the opening of a dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	handleDialogOpen: function(component) {
		var componentId = component.getGlobalId();

		var index = this.openDialogs.indexOf(componentId);
		if (index >= 0) {
			this.openDialogs.splice(index, 1);
		}

		this.openDialogs.push(componentId);

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
		var componentId = component.getGlobalId();

		var index = this.openDialogs.indexOf(componentId);
		if (index >= 0) {
			this.openDialogs.splice(index, 1);
		}

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
		if (component.visible) {
			return;
		}

		var dialogId = component.getGlobalId() + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		this.fireEvent(component, 'onbeforeopen');
		this.handleDialogOpen(component);

		component.visible = true;
		$A.util.addClass(dialog, 'slds-fade-in-open');

		this.focusFirstElement(component);

		this.fireEvent(component, 'onopen');
		this.fireEvent(component, 'onfocusfirst');
	},

	/**
	 * Close the specified dialog
	 *
	 * @param {Aura.Component} component - The dialog component
	 *
	 * @return {void}
	 */
	closeDialog: function(component) {
		if (!component.visible) {
			return;
		}

		var dialogId = component.getGlobalId() + '_dialog';
		var dialog = document.getElementById(dialogId);
		if (!dialog) {
			return;
		}

		this.fireEvent(component, 'onbeforeclose');
		this.handleDialogClose(component);

		component.visible = false;
		$A.util.removeClass(dialog, 'slds-fade-in-open');

		this.fireEvent(component, 'onclose');
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