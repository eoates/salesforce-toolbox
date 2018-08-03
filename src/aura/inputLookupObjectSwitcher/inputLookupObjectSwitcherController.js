/**************************************************************************************************
 * inputLookupObjectSwitcherController.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-08-03
 * @version  1.0.0
 *
 **************************************************************************************************/
({
	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * When the object switcher loses focus close the menu
	 */
	objectSwitcherTriggerBlur: function(component, event, helper) {
		helper.closeObjectSwitcher(component);
	},

	/**
	 * Handles key down events in the object switcher menu
	 */
	objectSwitcherTriggerKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		switch (which) {
		case 9: // Tab
			helper.closeObjectSwitcher(component);
			break;

		case 13: // Enter
			if (helper.isObjectSwitcherOpen(component)) {
				var selectedItem = helper.getSelectedObjectSwitcherItem(component);
				if (helper.handleObjectSwitcherItemClick(component, selectedItem)) {
					event.preventDefault();
					helper.closeObjectSwitcher(component);
				}
			}
			break;

		case 27: // Escape
			if (helper.isObjectSwitcherOpen(component)) {
				event.preventDefault();
				helper.closeObjectSwitcher(component);
			}
			break;

		case 38: // Arrow Up
			event.preventDefault();

			if (!helper.isObjectSwitcherOpen(component)) {
				helper.openObjectSwitcher(component);
			} else {
				helper.selectPreviousObjectSwitcherItem(component);
			}
			break;

		case 40: // Arrow Down
			event.preventDefault();

			if (!helper.isObjectSwitcherOpen(component)) {
				helper.openObjectSwitcher(component);
			} else {
				helper.selectNextObjectSwitcherItem(component);
			}
			break;
		}
	},

	/**
	 * Handles click events in the object switcher menu
	 */
	objectSwitcherTriggerClick: function(component, event, helper) {
		helper.toggleObjectSwitcher(component);
	},

	/**
	 * Prevent mouse down events in the object switcher menu. This prevents the object switcher from
	 * closing when the user clicks on an individual item
	 */
	objectSwitcherMouseDown: function(component, event, helper) {
		event.preventDefault();
	},

	/**
	 * Handles mouse down events for individual object switcher menu items
	 */
	objectSwitcherItemMouseDown: function(component, event, helper) {
		var item = event.target;
		while (item && !helper.utils.matchesSelector(item, '.object-switcher-item')) {
			item = item.parentElement;
		}

		if (item) {
			if (helper.handleObjectSwitcherItemClick(component, item)) {
				event.preventDefault();
				helper.closeObjectSwitcher(component);
			}
		}
	}
}) // eslint-disable-line semi