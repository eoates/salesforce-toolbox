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

		helper.openModal(component);
	},

	/**
	 * Closes the modal
	 */
	close: function(component, event, helper) {
		helper.closeModal(component);
	},

	/**
	 * Raises the onclosebutton event to signal that the close button was clicked
	 */
	closeButtonClick: function(component, event, helper) {
		event.stopPropagation();
		helper.fireEvent(component, 'onclosebutton');
	}
})