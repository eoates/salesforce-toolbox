({
	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
		helper.init(component);
		helper
			.loadSearchObjects(component)
			.then($A.getCallback(function() {
				// Once search objects have been loaded get recent items and selected records
				return Promise.all([
					helper.loadRecentItems(component),
					helper.loadRecords(component)
				]);
			}))
			.catch($A.getCallback(function(error) {
				// If an error occurs there isn't really much we can do about it
				helper.onError(component, 'Initialization of inputLookup failed', error);
			}))
			.then($A.getCallback(function() {
				// Set all loading flags to false. This is just in case an error occurred above
				// and the component was left in an invalid state
				component.set('v.loadingSearchObjects', false);
				component.set('v.loadingRecentItems', false);
				component.set('v.loadingLookupItems', false);
				component.set('v.loadingRecords', false);
			}));
	},

	/**
	 * Reset the component. Clears the search text and results. Closes the menu if it is open
	 */
	reset: function(component, event, helper) {
		helper.reset(component);
	},

	/**
	 * Set focus to the input element
	 */
	focus: function(component, event, helper) {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.focus();
		}
	},

	/**
	 * Returns all selected records
	 */
	getAllRecords: function(component, event, helper) {
		var records = component.get('v.records') || [];
		return helper.simplifyRecords(records);
	},

	/**
	 * Returns a selected record by ID
	 */
	getRecordById: function(component, event, helper) {
		var args = event.getParam('arguments');

		var record = helper.getRecordById(component, args.recordId);
		if (!record) {
			return undefined;
		}

		return helper.simplifyRecords([ record ])[0];
	},

	/**
	 * Handles change to the type attribute
	 */
	typeChange: function(component, event, helper) {
		helper.handleAttributeChange(component, 'type', function(type) {
			type = helper.utils.trim(type);

			var types = [];
			if (type.length > 0) {
				types = [ type ];
			}
			helper.setTypes(component, types);
			helper.handleTypesChange(component);
		});
	},

	/**
	 * Handles change to the types attribute
	 */
	typesChange: function(component, event, helper) {
		helper.handleAttributeChange(component, 'types', function(types) {
			var type;
			if (!helper.utils.isEmpty(types)) {
				type = types[0];
			}
			helper.setType(component, type);
			helper.handleTypesChange(component);
		});
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		helper.handleAttributeChange(component, 'value', function(value) {
			value = helper.utils.trim(value);

			var values = [];
			if (value.length > 0) {
				values = [ value ];
			}
			helper.setValues(component, values);
			helper.handleValuesChange(component);
		});
	},

	/**
	 * Handles change to the values attribute
	 */
	valuesChange: function(component, event, helper) {
		helper.handleAttributeChange(component, 'values', function(values) {
			var value;
			if (!helper.utils.isEmpty(values)) {
				value = values[0];
			}
			helper.setValue(component, value);
			helper.handleValuesChange(component);
		});
	},

	/**
	 * Handles the blur event of the object switcher trigger button. Closes the object switcher
	 * menu if it is open
	 */
	objectSwitcherTriggerBlur: function(component, event, helper) {
		helper.closeObjectSwitcher(component);
	},

	/**
	 * Handles the keydown event of the object switcher button. If the menu is not yet open then
	 * pressing UP ARROW or DOWN ARROW will open it. If the menu is open the pressing UP ARROW will
	 * move the current selection up, DOWN ARROW will move the current selection down, ENTER will
	 * select the highlighted object and ESCAPE will close the menu
	 */
	objectSwitcherTriggerKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		var handled = false;
		switch (which) {
			case 13: // Enter
				if (helper.isObjectSwitcherOpen(component)) {
					handled = true;

					helper.closeObjectSwitcher(component);

					var item = helper.getObjectSwitcherSelectedItem(component);
					if (item) {
						helper.handleObjectSwitcherItemClick(component, item);
					}
				}
				break;

			case 27: // Escape
				if (helper.isObjectSwitcherOpen(component)) {
					helper.closeObjectSwitcher(component);
					handled = true;
				}
				break;

			case 38: // Up arrow
				handled = true;
				if (!helper.isObjectSwitcherOpen(component)) {
					helper.openObjectSwitcher(component);
				} else {
					helper.selectPreviousObjectSwitcherItem(component);
				}
				break;

			case 40: // Down arrow
				handled = true;
				if (!helper.isObjectSwitcherOpen(component)) {
					helper.openObjectSwitcher(component);
				} else {
					helper.selectNextObjectSwitcherItem(component);
				}
				break;
		}

		if (handled) {
			event.stopPropagation();
			event.preventDefault();
		}
	},

	/**
	 * Handles the click event for the object switcher trigger button. Opens the menu if it is
	 * closed or closes it if it is open
	 */
	objectSwitcherTriggerClick: function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
		helper.toggleObjectSwitcher(component);
	},

	/**
	 * Handles the mousedown event for the object switcher menu. Prevents default behavior so the
	 * object switcher trigger button does not lose focus
	 */
	objectSwitcherMouseDown: function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
	},

	/**
	 * Handles the mousedown event for an individual object switcher menu item
	 */
	objectSwitcherItemMouseDown: function(component, event, helper) {
		event.stopPropagation();

		helper.closeObjectSwitcher(component);

		var item = event.target;
		while (item && (item.tagName !== 'LI')) {
			item = item.parentElement;
		}

		if (item) {
			event.preventDefault();
			helper.handleObjectSwitcherItemClick(component, item);
		}
	},

	/**
	 * Handles the focus event of the input element. Opens the lookup menu if it is closed
	 */
	inputFocus: function(component, event, helper) {
		var doOpenMenu = !component.doNotOpenMenu;
		component.doNotOpenMenu = false;

		var inputElement = event.target;
		var autoSelect = component.get('v.autoselect');
		if (autoSelect) {
			inputElement.select();
		}

		component.set('v.hasFocus', true);

		if (doOpenMenu) {
			helper.openMenuIfNotEmpty(component);
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the input element. Closes the lookup menu if it is open
	 */
	inputBlur: function(component, event, helper) {
		var inputElement = event.target;
		inputElement.value = helper.utils.trim(inputElement.value);

		component.set('v.hasFocus', false);
		helper.closeMenu(component);

		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the input element. If the lookup menu is not open the pressing
	 * UP ARROW or DOWN ARROW will open it. If the lookup menu is open then pressing UP ARROW will
	 * highlight the previous item, DOWN ARROW will highlight the next item, ENTER will select the
	 * highlighted item and ESCAPE will close the lookup menu
	 */
	inputKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		var handled = false;
		switch (which) {
			case 13: // Enter
				if (helper.isMenuOpen(component)) {
					handled = true;

					helper.closeMenu(component);

					var item = helper.getMenuSelectedItem(component);
					if (item) {
						helper.handleMenuItemClick(component, item);
					}
				}
				break;

			case 27: // Escape
				if (helper.isMenuOpen(component)) {
					handled = true;
					helper.closeMenu(component);
				}
				break;

			case 38: // Up arrow
				handled = true;
				if (helper.isMenuOpen(component)) {
					helper.selectPreviousMenuItem(component);
				} else {
					helper.openMenuIfNotEmpty(component);
				}
				break;

			case 40: // Down arrow
				handled  =true;
				if (helper.isMenuOpen(component)) {
					helper.selectNextMenuItem(component);
				} else {
					helper.openMenuIfNotEmpty(component);
				}
				break;
		}

		if (handled) {
			event.stopPropagation();
			event.preventDefault();
		}
	},

	/**
	 * Handles the input event of the input element
	 */
	inputInput: function(component, event, helper) {
		var inputElement = event.target;
		var searchText = inputElement.value;

		helper.startSearchAfterDelay(component, searchText);
	},

	/**
	 * Handles the mousedown event of the lookup menu. Prevents default behavior so that the input
	 * element does not lose focus
	 */
	menuMouseDown: function(component, event, helper) {
		event.stopPropagation();
		event.preventDefault();
	},

	/**
	 * Hanles the mousedown event of an individual lookup menu item
	 */
	menuItemMouseDown: function(component, event, helper) {
		event.stopPropagation();

		helper.closeMenu(component);

		var item = event.target;
		while (item && (item.tagName !== 'LI')) {
			item = item.parentElement;
		}

		if (item) {
			event.preventDefault();
			helper.handleMenuItemClick(component, item);
		}
	},

	/**
	 * Handles the focus event of the selectedItem input element. This is the read-only input that
	 * is displayed when a record is selected and multiple = false
	 */
	selectedItemFocus: function(component, event, helper) {
		component.doNotOpenMenu = false;

		var inputElement = event.target;
		var autoSelect = component.get('v.autoselect');
		if (autoSelect) {
			inputElement.select();
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the selectedItem input element
	 */
	selectedItemBlur: function(component, event, helper) {
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the selectedItem input element. Pressing BACKSPACE or DELETE
	 * will clear the selection
	 */
	selectedItemKeyDown: function(component, event, helper) {
		event.stopPropagation();

		var which = event.keyCode || event.which || 0;
		var handled = false;
		switch (which) {
			case 8: // Backspace
			case 46: // Delete
				helper.clear(component);
				helper.focusInputElementAfterRender(component);
				break;
		}

		if (handled) {
			event.preventDefault();
		}
	},

	/**
	 * Handles the click event of the remove button. Clears the selection
	 */
	removeSelectedItemClick: function(component, event, helper) {
		event.stopPropagation();

		helper.clear(component);
		helper.focusInputElementAfterRender(component);
	},

	/**
	 * Handles the click event for a pill that represents an individual record when multiple = true
	 */
	removeItemClick: function(component, event, helper) {
		event.preventDefault();

		var disabled = component.get('v.disabled');
		if (disabled) {
			return;
		}

		var pill = event.getSource();
		var recordId = pill.get('v.name');

		var record = helper.getRecordById(component, recordId);
		helper.remove(component, record);
	},

	/**
	 * Handles the select event for the search modal
	 */
	searchModalSelect: function(component, event, helper) {
		event.stopPropagation();

		var record = event.getParam('arguments').record;
		if (!record) {
			return;
		}

		var searchObject = helper.getSearchObjectByName(component, record.typeName);
		if (searchObject) {
			var transformedRecords = helper.transformRecords(component, [ record ]);
			var transformedRecord = transformedRecords[0];
			helper.select(component, transformedRecord);
		}
	},

	/**
	 * Handles the close event for the search modal
	 */
	searchModalClose: function(component, event, helper) {
		event.stopPropagation();

		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			component.doNotOpenMenu = true;
			inputElement.focus();
		}
	}
})