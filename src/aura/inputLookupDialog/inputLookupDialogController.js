/**************************************************************************************************
 * inputLookupDialogController.js
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
	 * Opens the dialog. The initial value for searchText is passed in via a parameter
	 */
	open: function(component, event, helper) {
		var args = event.getParam('arguments');
		var searchText = helper.utils.trim(args.searchText);

		helper.reset(component);
		helper.setSearchText(component, searchText);
		helper.setSearchTextInputValue(component, searchText);
		helper.search(component, searchText);

		component.find('dialog').open();
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * Handles the open event for the dialog. Selects the text in the search text input and resizes
	 * the results table
	 */
	dialogOpen: function(component, event, helper) {
		var searchTextInputElement = helper.getSearchTextInputElement(component);
		if (searchTextInputElement) {
			searchTextInputElement.select();
		}

		helper.calculateResultsTableHeight(component);
	},

	/**
	 * Handles the close event for the dialog. Resets the dialog to its initial state
	 */
	dialogClose: function(component, event, helper) {
		helper.reset(component);
	},

	/**
	 * Handles the focusfirst event for the dialog. Sets focus to the search text input
	 */
	dialogFocusFirst: function(component, event, helper) {
		var searchTextInputElement = helper.getSearchTextInputElement(component);
		if (searchTextInputElement) {
			searchTextInputElement.focus();
		}
	},

	/**
	 * Handles the focuslast event for the dialog. Sets focus to the cancel button
	 */
	dialogFocusLast: function(component, event, helper) {
		component.find('closeButton').focus();
	},

	/**
	 * Handles the click event for the cancel button. Closes the dialog as long as it is not busy
	 */
	closeButtonClick: function(component, event, helper) {
		var workCounter = helper.getWorkCounter(component);
		if (workCounter > 0) {
			return;
		}

		helper.fireEvent(component, 'oncancel');
		component.find('dialog').close();
	},

	/**
	 * Handles the submit event for the search form. Begins the search
	 */
	searchFormSubmit: function(component, event, helper) {
		event.preventDefault();

		var searchText = helper.getSearchTextInputValue(component);
		helper.search(component, searchText);
	},

	/**
	 * Handles the click event for the search button. Begins the search
	 */
	searchButtonClick: function(component, event, helper) {
		var searchText = helper.getSearchTextInputValue(component);
		helper.search(component, searchText);
	},

	/**
	 * Handles the click event for the sort menu. Sorts the results by the selected field
	 */
	sortFieldOptionClick: function(component, event, helper) {
		var option = event.getSource();
		var label = option.get('v.label');
		var sortFieldOptions = helper.getSortFieldOptions(component);
		var sortFieldOption = helper.findSortFieldOptionByLabel(sortFieldOptions, label);
		if (sortFieldOption) {
			helper.sort(component, sortFieldOption.name);
		}
	},

	/**
	 * Handles the click event for the previous page button. Navigates to the previous page of items
	 */
	previousPageClick: function(component, event, helper) {
		var pageNumber = helper.getPageNumber(component);
		helper.goToPage(component, pageNumber - 1);
	},

	/**
	 * Handles the click event for the next page button. Navigates to the next page of items
	 */
	nextPageClick: function(component, event, helper) {
		var pageNumber = helper.getPageNumber(component);
		helper.goToPage(component, pageNumber + 1);
	},

	/**
	 * Handles the click event for a column in the results table. Sorts by the clicked field name
	 */
	columnHeaderClick: function(component, event, helper) {
		event.preventDefault();

		var element = event.target;
		while (element && !helper.utils.matchesSelector(element, 'th[data-column]')) {
			element = element.parentElement;
		}

		if (element) {
			var sortField = element.getAttribute('data-column');
			helper.sort(component, sortField);
		}
	},

	/**
	 * Handles the click event for an item. Selects the clicked item
	 */
	itemNameClick: function(component, event, helper) {
		event.preventDefault();

		var element = event.target;
		while (element && !helper.utils.matchesSelector(element, 'a[data-item]')) {
			element = element.parentElement;
		}

		if (element) {
			var itemId = element.getAttribute('data-item');
			var items = helper.getItems(component);
			var item = helper.findItemById(items, itemId);
			if (item) {
				var type = helper.getType(component);
				helper.fireEvent(component, 'onselect', {
					item: item
				});
				component.find('dialog').close();
			}
		}
	}
}) // eslint-disable-line semi