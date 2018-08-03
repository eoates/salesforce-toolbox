/**************************************************************************************************
 * inputLookupController.js
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
	 * Sets focus on the component, if it can be focused
	 */
	focus: function(component, event, helper) {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.focus();
		}
	},

	/**
	 * Selects all the text in the input element
	 */
	select: function(component, event, helper) {
		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.select();
		}
	},

	/**
	 * Returns the selected items. Each item in the returned array has an id, name, and sObjectName
	 * property. This method is useful when using multiple types and you want to know the type of
	 * each selected item. If multiple = false this will return an array with a single element
	 */
	getSelectedItems: function(component, event, helper) {
		var selectedItems = helper.getSelectedItems(component);
		return selectedItems.map(function(selectedItem) {
			return {
				id: selectedItem.id,
				name: selectedItem.name,
				sObjectName: selectedItem.sObjectName
			};
		});
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);

		helper.initValueAndValues(component);

		helper.setSearchObjectsFromTypes(component);
		helper.setSelectedItemsFromValues(component);

		helper.loadSearchObjects(component);
		helper.loadRecentItems(component);
		helper.loadSelectedItems(component);
	},

	/**
	 * Handles change to the value attribute
	 */
	valueChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'value', function(value) {
			helper.setValuesFromValue(component);
			helper.setSelectedItemsFromValues(component);

			helper.loadSelectedItems(component);
		});
	},

	/**
	 * Handles change to the values attribute
	 */
	valuesChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'values', function(values) {
			helper.setValueFromValues(component);
			helper.setSelectedItemsFromValues(component);

			helper.loadSelectedItems(component);
		});
	},

	/**
	 * Handles change to the types attribute
	 */
	typesChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'types', function(types) {
			helper.cancelSearch(component);

			helper.setSearchObjectsFromTypes(component);

			helper.loadSearchObjects(component);
			helper.loadRecentItems(component);
			helper.loadSelectedItems(component);
		});
	},

	/**
	 * Handles change to the typeName attribute
	 */
	typeNameChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'typeName', function(typeName) {
			helper.cancelSearch(component);

			helper.setSearchObjectsFromTypes(component);

			helper.loadSearchObjects(component);
			helper.loadRecentItems(component);
			helper.loadSelectedItems(component);
		});
	},

	/**
	 * Handles change to the searchText attribute
	 */
	searchTextChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'searchText', function(searchText) {
			helper.cancelSearch(component);

			helper.setSearchTextInputValue(component, searchText);
			if (searchText) {
				helper.startSearchAfterDelay(component, searchText, true);
			}
		});
	},

	/**
	 * Sets the hasInputFocus flag when the component receives focus
	 */
	containerFocusIn: function(component, event, helper) {
		component.set('v.hasInputFocus', true);
	},

	/**
	 * Clears the hasInputFocus flag when the component loses focus
	 */
	containerFocusOut: function(component, event, helper) {
		component.set('v.hasInputFocus', false);
	},

	/**
	 * Handles the onselect event of the object switcher. Sets the selected search object
	 */
	objectSwitcherSelect: function(component, event, helper) {
		var args = event.getParam('arguments');
		var selectedType = args.selectedType;
		var name = selectedType && selectedType.name;
		if (name === helper.getSelectedSearchObjectName(component)) {
			return;
		}

		helper.cancelSearch(component);
		helper.setSearchText(component, '');
		helper.setSearchTextInputValue(component, '');

		helper.setSelectedSearchObjectByName(component, name);
		helper.setRecentItems(component, []);
		helper.setLookupItems(component, []);

		helper.loadRecentItems(component);
	},

	/**
	 * Handles the focus event of the searchTextInput element
	 */
	searchTextInputFocus: function(component, event, helper) {
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the searchTextInput element
	 */
	searchTextInputBlur: function(component, event, helper) {
		var inputElement = event.target;
		inputElement.value = helper.utils.trim(inputElement.value);

		helper.closeMenu(component);
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the searchTextInput element
	 */
	searchTextInputKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		switch (which) {
		case 9: // Tab
			helper.closeMenu(component);
			break;

		case 13: // Enter
			if (helper.isMenuOpen(component)) {
				var selectedItem = helper.getSelectedMenuItem(component);
				if (helper.handleMenuItemClick(component, selectedItem)) {
					event.preventDefault();
					helper.closeMenu(component);
				}
			} else {
				if (helper.openMenuIfNotEmpty(component)) {
					event.preventDefault();
				}
			}
			break;

		case 27: // Escape
			if (helper.isMenuOpen(component)) {
				event.preventDefault();
				helper.closeMenu(component);
			}
			break;

		case 38: // Arrow Up
			event.preventDefault();

			if (helper.isMenuOpen(component)) {
				helper.selectPreviousMenuItem(component);
			} else {
				helper.openMenuIfNotEmpty(component, true);
			}
			break;

		case 40: // Arrow Down
			event.preventDefault();

			if (helper.isMenuOpen(component)) {
				helper.selectNextMenuItem(component);
			} else {
				helper.openMenuIfNotEmpty(component, true);
			}
			break;
		}
	},

	/**
	 * Handles the input event of the searchTextInput element
	 */
	searchTextInputInput: function(component, event, helper) {
		var inputElement = event.target;
		var searchText = helper.utils.trim(inputElement.value);

		helper.openMenuIfNotEmpty(component, true);
		helper.startSearchAfterDelay(component, searchText, false, function() {
			helper.setSearchText(component, searchText);
			helper.openMenuIfNotEmpty(component, true);
			helper.closeMenuIfEmpty(component);
		});
	},

	/**
	 * Handles the click event of the searchTextInput element
	 */
	searchTextInputClick: function(component, event, helper) {
		helper.toggleMenu(component);
	},

	/**
	 * Handles the focus event of the selectedItemInput element
	 */
	selectedItemInputFocus: function(component, event, helper) {
		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the blur event of the selectedItemInput element
	 */
	selectedItemInputBlur: function(component, event, helper) {
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the selectedItemInput element
	 */
	selectedItemInputKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		switch (which) {
		case 8: // Backspace
		case 46: // Delete
			event.preventDefault();
			helper.handleSelectedItemRemoveButtonClick(component);
			break;
		}
	},

	/**
	 * Handles the click event of the selectedItemRemoveButton
	 */
	selectedItemRemoveButtonClick: function(component, event, helper) {
		helper.handleSelectedItemRemoveButtonClick(component);
	},

	/**
	 * Handles the mousedown event of the menu
	 */
	menuMouseDown: function(component, event, helper) {
		event.preventDefault();
	},

	/**
	 * Handles the mousedown event of an individual menu item
	 */
	menuItemMouseDown: function(component, event, helper) {
		var item = event.target;
		while (item && !helper.utils.matchesSelector(item, '.lookup-menu-item')) {
			item = item.parentElement;
		}

		if (item) {
			if (helper.handleMenuItemClick(component, item)) {
				event.preventDefault();
				helper.closeMenu(component);
			}
		}
	},

	/**
	 * Handles the remove event of an individual selected item pill
	 */
	selectedItemPillRemove: function(component, event, helper) {
		event.preventDefault();

		var disabled = component.get('v.disabled');
		if (disabled) {
			return;
		}

		var pill = event.getSource();
		var itemId = pill.get('v.name');
		helper.handleSelectedItemPillRemove(component, itemId);
	},

	/**
	 * Handles the select event of the search dialog
	 */
	searchDialogSelect: function(component, event, helper) {
		var args = event.getParam('arguments');
		var item = args.item;
		var items = [ item ];
		var searchObjects = helper.getSearchObjects(component);

		helper.updateItemIconNames(items, searchObjects);
		helper.addSelectedItemAndUpdate(component, item);

		component.focus();
	},

	/**
	 * Handles the cancel event of the search dialog
	 */
	searchDialogCancel: function(component, event, helper) {
		component.focus();
	}
}) // eslint-disable-line semi