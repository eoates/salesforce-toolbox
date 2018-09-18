/**************************************************************************************************
 * inputLookupController.js
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
	 * Sets focus on the component, if it can be focused
	 */
	focus: function(component, event, helper) {
		if (helper.mobileEnabled(component)) {
			helper.mobileFocus(component);
		} else {
			var inputElement = helper.getInputElement(component);
			if (inputElement) {
				inputElement.focus();
			}
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
	 * Handles change to the multiple attribute
	 */
	multipleChange: function(component, event, helper) {
		helper.handleComponentAttributeChange(component, 'multiple', function(multiple) {
			helper.mobileHideSearchOverlay(component);
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
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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
		if (!helper.isDisabledOrReadOnly(component)) {
			var inputElement = event.target;
			inputElement.value = helper.utils.trim(inputElement.value);
		}

		helper.closeMenu(component);
		helper.fireEvent(component, 'onblur');
	},

	/**
	 * Handles the keydown event of the searchTextInput element
	 */
	searchTextInputKeyDown: function(component, event, helper) {
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

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

		if (helper.isDisabledOrReadOnly(component)) {
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
	},

	/**
	 * Handles the aura:locationChange application event. This event is fired as the user navigates
	 * between pages/views. We need to close the search overlay if it is visible; otherwise, the
	 * overlay will remain visible and the user will not be able to see the page/view transition
	 */
	locationChange: function(component, event, helper) {
		helper.mobileHideSearchOverlay(component);
	},

	/**
	 * When the user clicks the selected item input field (or the search icon) we want to open the
	 * search overlay to allow the user to find a record
	 */
	mobileSelectedItemInputClick: function(component, event, helper) {
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

		var searchText = '';
		var selectedItems = helper.getSelectedItems(component);
		if (selectedItems.length > 0) {
			searchText = selectedItems[0].name;
		}

		helper.mobileSetSearchTextInputValue(component, searchText);
		helper.mobileToggleClearSearchTextButton(component, searchText);
		helper.mobileHideSearchButton(component);
		helper.mobileHideEmptyListItem(component);
		helper.mobileFilterRecentItems(component, searchText, true);
		helper.mobileShowSearchOverlay(component);
		helper.mobileFocus(component);

		// Just in case the user somehow changed the text
		component.find('mobileSelectedItemInput').getElement().value = searchText;
	},

	/**
	 * When the user clicks on the search/clear button within the selected item input field we
	 * perform a context-sensitive action. If a record is not currently selected then we open the
	 * search overlay to allow the user to find a record. If a record is selected, however, then we
	 * remove the selected item and fire the "onchange" event
	 */
	mobileSelectedItemSearchOrClearButtonClick: function(component, event, helper) {
		if (helper.isDisabledOrReadOnly(component)) {
			return;
		}

		var selectedItems = helper.getSelectedItems(component);
		if (selectedItems.length === 0) {
			helper.mobileSetSearchTextInputValue(component, '');
			helper.mobileToggleClearSearchTextButton(component, '');
			helper.mobileHideSearchButton(component);
			helper.mobileHideEmptyListItem(component);
			helper.mobileFilterRecentItems(component, '', false);
			helper.mobileShowSearchOverlay(component);
			helper.mobileFocus(component);
		} else {
			helper.setSelectedItems(component, []);
			helper.setValue(component, undefined);
			helper.setValues(component, []);
			helper.mobileFocus(component);

			helper.fireEvent(component, 'onchange');
		}
	},

	/**
	 * When the user presses the ESCAPE key while the search overlay is visible we want to cancel
	 * the search and close the overlay
	 */
	mobileSearchOverlayKeyDown: function(component, event, helper) {
		if (event.defaultPrevented) {
			return;
		}

		var keyCode = event.keyCode || event.which || 0;
		if (keyCode === 27) {
			event.preventDefault();
			event.stopPropagation();

			helper.mobileHideSearchOverlay(component);
			helper.mobileResetSelectedSearchObject(component);
			helper.setLookupItems(component, []);
			helper.mobileFocus(component);
		}
	},

	/**
	 * When the user clicks the "Cancel" button in the search overlay header we cancel the search
	 * and close the search overlay
	 */
	mobileCancelSearchButtonClick: function(component, event, helper) {
		helper.mobileHideSearchOverlay(component);
		helper.mobileResetSelectedSearchObject(component);
		helper.setLookupItems(component, []);
		helper.mobileFocus(component);
	},

	/**
	 * As the user enters data into the search text field we filter the recent items to display only
	 * items that match the entered text
	 */
	mobileSearchTextInputInput: function(component, event, helper) {
		var searchText = helper.mobileGetSearchTextInputValue(component);
		helper.mobileToggleClearSearchTextButton(component, searchText);
		helper.mobileToggleSearchButton(component, searchText);
		helper.mobileHideEmptyListItem(component);
		helper.mobileFilterRecentItems(component, searchText, false);
	},

	/**
	 * When the user clicks on the search/clear button within the search text input field we perform
	 * a context-sensitive action. If the field contains text then the text is cleared and the
	 * item list is updated. If the field is empty, however, then nothing happens
	 */
	mobileSearchTextSearchOrClearButtonClick: function(component, event, helper) {
		var searchText = helper.mobileGetSearchTextInputValue(component);
		if (searchText) {
			helper.mobileSetSearchTextInputValue(component, '');
			helper.mobileToggleClearSearchTextButton(component, '');
			helper.mobileToggleSearchButton(component, '');
			helper.mobileHideEmptyListItem(component);
			helper.mobileFilterRecentItems(component, '', false);
		}
	},

	/**
	 * When the user selects a different object type to search for we refresh the list of recent
	 * items and filter the list based on the currently entered search text
	 */
	mobileObjectSwitcherSelectChange: function(component, event, helper) {
		var name = event.target.value;
		if (name === helper.getSelectedSearchObjectName(component)) {
			return;
		}

		helper.mobileHideSearchButton(component);
		helper.mobileHideEmptyListItem(component);
		helper.setSelectedSearchObjectByName(component, name);
		helper.setLookupItems(component, []);
		helper.setRecentItems(component, []);
		helper.loadRecentItems(component, function() {
			var searchText = helper.mobileGetSearchTextInputValue(component);
			helper.mobileFilterRecentItems(component, searchText, false);
		});
	},

	/**
	 * When the user clicks on an item in the items list we select that item and fire the "onchange"
	 * event
	 */
	mobileLookupItemClick: function(component, event, helper) {
		event.preventDefault();

		var changed = false;
		var itemId = event.currentTarget.getAttribute('data-value');
		var items = helper.getLookupItems(component);
		var item = helper.findItemById(items, itemId);
		if (item) {
			helper.setSelectedItems(component, [ item ]);
			helper.setValue(component, item.id);
			helper.setValues(component, [ item.id ]);
			changed = true;
		}

		helper.mobileHideSearchOverlay(component);
		helper.setLookupItems(component, []);
		helper.mobileFocus(component);

		if (changed) {
			helper.fireEvent(component, 'onchange');
		}
	},

	/**
	 * When the user clicks on the search button in the items list we perform a search with the
	 * entered text
	 */
	mobileSearchButtonClick: function(component, event, helper) {
		event.preventDefault();

		var searchText = helper.mobileGetSearchTextInputValue(component);
		var simplifiedSearchText = helper.stripSpecialChars(searchText);
		if (simplifiedSearchText.length < helper.minSearchTextLength) {
			return;
		}

		helper.setSearchText(component, searchText);
		helper.mobileHideSearchButton(component);
		helper.setLookupItems(component, []);
		helper.loadLookupItems(component, searchText, function() {
			helper.mobileToggleEmptyListItem(component);
		});
	},

	/**
	 * When the user clicks on the add button in the items list we close the search overlay and fire
	 * the "onadd" event
	 */
	mobileAddButtonClick: function(component, event, helper) {
		event.preventDefault();

		var selectedSearchObject = helper.getSelectedSearchObject(component);
		if (!selectedSearchObject || !selectedSearchObject.allowAdd) {
			return;
		}

		helper.mobileHideSearchOverlay(component);
		helper.setLookupItems(component, []);
		helper.mobileFocus(component);

		helper.fireEvent(component, 'onadd', {
			type: selectedSearchObject.name,
			text: helper.getSearchText(component)
		});
	}
}) // eslint-disable-line semi