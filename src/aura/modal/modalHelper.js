({
	animations: [ 'fade-in-open', 'slide-up-open', 'slide-up-saving', 'slide-down-cancel' ],
	modalContainerId: 'c_modal_container',
	modalContainerZIndex: 9000,
	openModals: [],

	/**
	 * Displays a toast in the header of the modal
	 */
	showToast: function(component, toastArgs) {
		// If there is already a toast being displayed then dismiss it
		this.dismissToast(component);

		// If the modal is closed (i.e. not visible) then just fire the c:showToast event and let
		// a c:toaster component show it globally
		var visible = component.get('v.visible');
		if (!visible) {
			var toastEvent = $A.get('e.c:showToast');
			toastEvent.setParams(toastArgs);
			toastEvent.fire();
			return;
		}

		// Get toast attributes
		var attributes = {
			closeButton: (toastArgs.mode !== 'pester'),
			type: toastArgs.type,
			key: toastArgs.key,
			title: toastArgs.title,
			message: toastArgs.message,
			onclosebutton: component.getReference('c.dismissToast')
		};

		var duration = parseFloat(toastArgs.duration);
		if (isNaN(duration) || !isFinite(duration)) {
			duration = 5000;
		} else if (duration < 0) {
			duration = 0;
		}

		// Dynamically create a toast component
		var self = this;

		$A.createComponent('c:toast', attributes, function(toast, status, error) {
			if (status === 'SUCCESS') {
				// Add the created toast to the toast container
				var container = component.find('toastContainer');
				container.set('v.body', [ toast ]);

				// If the mode is not sticky, then set a timeout to dismiss the toast after the
				// specified duration
				if (toastArgs.mode !== 'sticky') {
					component.toastTimeoutId = setTimeout($A.getCallback(function() {
						component.toastTimeoutId = null;
						self.dismissToast(component);
					}), duration);
				}
			} else if (status === 'INCOMPLETE') {
				$A.warning('No response from server or client is offline.');
			} else if (status === 'ERROR') {
				$A.warning('Error: ' + error);
			}
		});
	},

	/**
	 * Dismisses a toast if one is being displayed
	 *
	 * @param {Aura.Component} component the modal component
	 * @return {void}
	 */
	dismissToast: function(component) {
		// Clear the current timeout
		if (component.toastTimeoutId) {
			clearTimeout(component.toastTimeoutId);
			component.toastTimeoutId = null;
		}

		// Get the container which holds the toast
		var container = component.find('toastContainer');

		// Destroy any toast components in the container
		var toasts = container.get('v.body');
		for (var i = 0, n = toasts.length; i < n; i++) {
			var toast = toasts[i];
			if (toast.isInstanceOf('c:toast')) {
				toast.destroy();
			}
		}

		container.set('v.body', []);
	},

	/**
	 * Returns the CSS class name to use for the specified animation. If the specified animation
	 * is not one of the valid animations then the defaultAnimation is used. If defaultAnimation
	 * is also invalid, then default to "slds-fade-in-open"
	 *
	 * @param {string} animation the name of the animation to use
	 * @param {string} defaultAnimation the animation to use if animation argument is invalid
	 * @return {string} the CSS class for the specified animation
	 */
	getAnimationClassName: function(animation, defaultAnimation) {
		if (this.animations.indexOf(animation) < 0) {
			animation = defaultAnimation;
			if (this.animations.indexOf(animation) < 0) {
				animation = this.animations[0];
			}
		}
		return 'slds-' + animation;
	},

	/**
	 * Returns all child elements for the specified parent
	 *
	 * @param {HTMLElement} parent the parent element
	 * @return {HTMLElement[]} the child elements
	 */
	getChildElements: function(parent) {
		var children = [];
		if (parent && parent.hasChildNodes()) {
			for (var i = 0, n = parent.childNodes.length; i < n; i++) {
				var child = parent.childNodes[i];
				children.push(child);
			}
		}
		return children;
	},

	/**
	 * Returns the body element
	 *
	 * @return {HTMLElement} the body element if it exists; otherwise, null
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
	 * Returns the modal container element
	 *
	 * @return {HTMLElement} the element which contains all modals
	 */
	getModalContainer: function() {
		return document.getElementById(this.modalContainerId);
	},

	/**
	 * Creates the modal container element
	 *
	 * @return {HTMLElement} an element which will be used to contain all of the modals
	 */
	createModalContainer: function() {
		var container = null;

		var body = this.getBodyElement();
		if (body) {
			container = document.createElement('div');
			container.id = this.modalContainerId;
			container.className = 'slds-scope';

			var modals = document.createElement('div');
			modals.id = this.modalContainerId + '_modals';
			container.appendChild(modals);

			var backdrop = document.createElement('div');
			backdrop.id = this.modalContainerId + '_backdrop';
			backdrop.className = 'slds-backdrop';
			backdrop.style.zIndex = this.modalContainerZIndex;
			container.appendChild(backdrop);

			body.appendChild(container);
		}

		return container;
	},

	/**
	 * Adds a modal to the container element
	 *
	 * @param {Aura.Component} component the modal component to be added to the container
	 * @return {void}
	 */
	addToModalContainer: function(component) {
		var componentId = component.getGlobalId();

		var container = this.getModalContainer();
		if (!container) {
			container = this.createModalContainer();
		}

		var modalId = componentId + '_modal';
		var modal = document.getElementById(modalId);
		if (!modal) {
			return;
		}

		var modalsId = this.modalContainerId + '_modals';
		var modals = document.getElementById(modalsId);
		if (!modals) {
			return;
		}

		var holderId = modalsId + '_' + componentId;
		var holder = document.getElementById(holderId);
		if (holder) {
			return;
		}

		holder = document.createElement('div');
		holder.id = holderId;
		modals.appendChild(holder);

		modal.parentNode.removeChild(modal);
		holder.appendChild(modal);
	},

	/**
	 * Removes a modal from the container element and places it back in its original container
	 *
	 * @param {Aura.Component} component the modal component to remove
	 * @return {void}
	 */
	removeFromModalContainer: function(component) {
		var componentId = component.getGlobalId();

		var modalsId = this.modalContainerId + '_modals';
		var modals = document.getElementById(modalsId);
		if (!modals) {
			return;
		}

		var holderId = modalsId + '_' + componentId;
		var holder = document.getElementById(holderId);
		if (!holder) {
			return;
		}

		var modalId = componentId + '_modal';
		var modal = document.getElementById(modalId);
		if (!modal) {
			return;
		}

		var rootId = componentId + '_root';
		var root = document.getElementById(rootId);
		if (!root) {
			return;
		}

		holder.removeChild(modal);
		root.appendChild(modal);
		modals.removeChild(holder);
	},

	/**
	 * Displays the modal backdrop. This is displayed when the first modal is opened and remains
	 * visible until the last modal is closed
	 *
	 * @return {void}
	 */
	showModalBackdrop: function() {
		var backdropId = this.modalContainerId + '_backdrop';
		var backdrop = document.getElementById(backdropId);
		if (backdrop) {
			$A.util.addClass(backdrop, 'slds-backdrop_open');
		}
	},

	/**
	 * Hides the modal backdrop
	 *
	 * @return {void}
	 */
	hideModalBackdrop: function() {
		var backdropId = this.modalContainerId + '_backdrop';
		var backdrop = document.getElementById(backdropId);
		if (backdrop) {
			$A.util.removeClass(backdrop, 'slds-backdrop_open');
		}
	},

	/**
	 * Sets the CSS z-index property for the specified modal
	 *
	 * @param {string} componentId the ID of the modal component
	 * @param {number} zIndex the value to use for the z-index property
	 * @return {void}
	 */
	setModalZIndex: function(componentId, zIndex) {
		var modalId = componentId + '_modal';
		var modal = document.getElementById(modalId);
		if (modal) {
			modal.style.zIndex = zIndex;
		}
	},

	/**
	 * Adjusts the CSS z-index property of the active modal so it appears above all other modals
	 *
	 * @return {void}
	 */
	bringActiveModalToFront: function() {
		if (this.openModals.length > 0) {
			var componentId = this.openModals[this.openModals.length - 1];
			this.setModalZIndex(componentId, this.modalContainerZIndex + 1);
		}
	},

	/**
	 * Adjusts the CSS z-index property of all inactive modals so they appear behind the active
	 * modal
	 *
	 * @return {void}
	 */
	sendInactiveModalsToBack: function() {
		if (this.openModals.length > 1) {
			var counter = 1;
			for (var i = this.openModals.length - 1; i >= 0; i--) {
				var componentId = this.openModals[i];
				this.setModalZIndex(componentId, this.modalContainerZIndex - counter++);
			}
		}
	},

	/**
	 * Handle the opening of a modal
	 *
	 * @param {Aura.Component} component the modal component
	 * @return {void}
	 */
	handleModalOpen: function(component) {
		var componentId = component.getGlobalId();

		var index = this.openModals.indexOf(componentId);
		if (index >= 0) {
			this.openModals.splice(index, 1);
		}

		this.openModals.push(componentId);

		this.sendInactiveModalsToBack();
		this.bringActiveModalToFront();

		if (this.openModals.length === 1) {
			this.showModalBackdrop();
		}
	},

	/**
	 * Handle the closing of a modal
	 *
	 * @param {Aura.Component} component the modal component
	 * @return {void}
	 */
	handleModalClose: function(component) {
		var componentId = component.getGlobalId();

		var index = this.openModals.indexOf(componentId);
		if (index >= 0) {
			this.openModals.splice(index, 1);
		}

		this.sendInactiveModalsToBack();
		this.bringActiveModalToFront();

		if (this.openModals.length === 0) {
			this.hideModalBackdrop();
		}
	},

	/**
	 * Open the specified modal
	 *
	 * @param {Aura.Component} component the modal component
	 * @return {void}
	 */
	openModal: function(component) {
		var visible = component.get('v.visible');
		if (visible) {
			return;
		}

		this.fireEvent(component, 'onbeforeopen');
		this.handleModalOpen(component);

		visible = true;
		component.set('v.visible', visible);

		// Use setTimeout to allow the modal to render before firing the 'onopen' event. This
		// ensures that the modal and its contents are visible before any event handlers run
		var self = this;
		setTimeout($A.getCallback(function() {
			var closeButton = component.find('closeButton');
			if (closeButton) {
				closeButton.focus();
			}

			self.fireEvent(component, 'onopen');
		}), 0);
	},

	/**
	 * Close the specified modal
	 *
	 * @param {Aura.Component} component the modal component
	 * @return {void}
	 */
	closeModal: function(component) {
		var visible = component.get('v.visible');
		if (!visible) {
			return;
		}

		this.fireEvent(component, 'onbeforeclose');
		this.handleModalClose(component);

		visible = false;
		component.set('v.visible', false);

		// Use setTimeout to allow the modal to render before firing the 'onclose' event. This
		// ensures that the modal and its contents are hidden before any event handlers run
		var self = this;
		setTimeout($A.getCallback(function() {
			self.fireEvent(component, 'onclose');
		}), 0);
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component the modal component
	 * @param {string} name the event name
	 * @param {Object} args optional event arguments
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
})