({
	animations: [ 'fade-in-open', 'slide-up-open', 'slide-up-saving', 'slide-down-cancel' ],
	modalContainerId: 'c_modal_container',
	modalContainerZIndex: 9000,
	openModals: [],

	/**
	 * Returns the CSS class name to use for the specified animation. If the specified animation
	 * is not one of the valid animations then the defaultAnimation is used. If defaultAnimation
	 * is also invalid, then default to "slds-fade-in-open"
	 *
	 * @param {string} animation the name of the animation to use
	 * @param {string} defaultAnimation the animation to use if animation argument is invalid
	 * @returns {string} the CSS class for the specified animation
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
	 * @returns {HTMLElement[]} the child elements
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
	 * @returns {HTMLElement} the body element if it exists; otherwise, null
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
	 * @returns {HTMLElement} the element which contains all modals
	 */
	getModalContainer: function() {
		return document.getElementById(this.modalContainerId);
	},

	/**
	 * Creates the modal container element
	 *
	 * @returns {HTMLElement} an element which will be used to contain all of the modals
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
	 * @param {aura.Component} component the modal component to be added to the container
	 * @returns {void}
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
	 * @param {aura.Component} component the modal component to remove
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {void}
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
	 * @returns {void}
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
	 * @param {aura.Component} component the modal component
	 * @returns {void}
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
	 * @param {aura.Component} component the modal component
	 * @returns {void}
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
	 * @param {aura.Component} component the modal component
	 * @returns {void}
	 */
	openModal: function(component) {
		var visible = component.get('v.visible');
		if (visible) {
			return;
		}

		var result = this.fireEvent(component, 'onbeforeopen');
		this.handleModalOpen(component);

		visible = true;
		component.set('v.visible', visible);

		// Use setTimeout to allow the modal to render before firing the 'onopen' event. This
		// ensures that the modal and its contents are visible before any event handlers run
		var self = this;
		setTimeout($A.getCallback(function() {
			self.fireEvent(component, 'onopen');
		}), 0);
	},

	/**
	 * Close the specified modal
	 *
	 * @param {aura.Component} component the modal component
	 * @returns {void}
	 */
	closeModal: function(component) {
		var visible = component.get('v.visible');
		if (!visible) {
			return;
		}

		var result = this.fireEvent(component, 'onbeforeclose');
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
	 * @param {aura.Component} component the modal component
	 * @param {string} name the event name
	 * @param {object} args optional event arguments
	 * @returns {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParams({
			name: name,
			args: args || {}
		});
		event.fire();
	}
})