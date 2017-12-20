({
	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		helper.importModules(component);
	},

	/**
	 * Opens the modal
	 */
	open: function(component, event, helper) {
		var args = event.getParam('arguments');

		component.set('v.title', args.title);
		component.set('v.type', args.type);
		component.set('v.searchText', args.searchText);
		component.set('v.selectedRecordIds', args.selectedRecordIds);
		component.set('v.searchObject', undefined);
		component.set('v.recordCount', 0);
		//component.set('v.pageSize', 10);
		component.set('v.pageNumber', 1);
		component.set('v.pageCount', 1);
		component.set('v.records', []);
		component.set('v.sortField', undefined);
		component.set('v.sortAsc', true);
		component.set('v.searching', true);

		var dialog = component.find('dialog');
		dialog.open();

		helper
			.loadSearchObject(component)
			.then($A.getCallback(function() {
				return helper.loadSearchResult(component, args.searchText, 1, undefined, true);
			}))
			.then($A.getCallback(function() {
				component.set('v.searching', false);
			}))
			.catch($A.getCallback(function(error) {
				component.set('v.searching', false);
				dialog.showToast('error', undefined, 'Search Error', error.message);
			}));
	},

	/**
	 * Closes the modal
	 */
	close: function(component, event, helper) {
		component.find('dialog').close();
	},

	/**
	 * Handles the open event of the modal. Sets focus to the input element
	 */
	dialogOpen: function(component, event, helper) {
		event.stopPropagation();

		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			inputElement.value = component.get('v.searchText');
			inputElement.focus();
		}

		helper.setAllowSearchBasedOnInput(component);
	},

	/**
	 * Handles the close event of the modal
	 */
	dialogClose: function(component, event, helper) {
		event.stopPropagation();
		helper.fireEvent(component, 'onclose');
	},

	/**
	 * Handles the closebutton event of the modal. Closes the modal as long as a search is not
	 * actively being performed
	 */
	dialogCloseButton: function(component, event, helper) {
		event.stopPropagation();

		var searching = component.get('v.searching');
		if (searching) {
			return;
		}

		component.close();
	},

	/**
	 * Handles the focus event of the input element
	 */
	inputFocus: function(component, event, helper) {
		event.stopPropagation();

		var inputElement = event.target;
		inputElement.select();
	},

	/**
	 * Handles the blur event of the input element
	 */
	inputBlur: function(component, event, helper) {
		event.stopPropagation();

		var inputElement = event.target;
		inputElement.value = helper.utils.trim(inputElement.value);
	},

	/**
	 * Handles the keydown event of the input element. If SHIFT+TAB is pressed then we set focus to
	 * the last element (the cancel button) to prevent focus from exiting the modal. If ENTER is
	 * pressed and the search button is enabled then a search is performed
	 */
	inputKeyDown: function(component, event, helper) {
		var inputElement = event.target;
		var searchText = helper.utils.trim(inputElement.value);

		var which = event.keyCode || event.which || 0;
		var handled = false;
		switch (which) {
			case 9: // Tab
				if (event.shiftKey) {
					// Set focus to cancel button to prevent modal from losing focus
					event.preventDefault();

					var cancelButton = component.find('cancelButton').getElement();
					cancelButton.focus();
				}
				break;

			case 13: // Enter
				// If not searching and the search button is enabled then search
				var searching = component.get('v.searching');
				var allowSearch = component.get('v.allowSearch');
				if (!searching && allowSearch) {
					helper.search(component, searchText, 1);
				}
				handled = true;
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
		helper.setAllowSearchBasedOnInput(component);
	},

	/**
	 * Handles the click event of the search button
	 */
	searchButtonClick: function(component, event, helper) {
		event.stopPropagation();

		var inputElement = helper.getInputElement(component);
		if (inputElement) {
			var searchText = helper.utils.trim(inputElement.value);
			helper.search(component, searchText, 1);
		}
	},

	/**
	 * Handles column header clicks. Sorts the results
	 */
	columnHeaderClick: function(component, event, helper) {
		event.preventDefault();

		var searching = component.get('v.searching');
		if (searching) {
			return;
		}

		var column = event.target;
		while (column && (column.tagName !== 'TH')) {
			column = column.parentElement;
		}

		if (column) {
			var fieldName = column.getAttribute('data-field');
			var searchObject = component.get('v.searchObject');
			var field = helper.utils.find(searchObject.fields, function(field) {
				return field.name === fieldName;
			});

			if (field.sortable) {
				helper.setSortField(component, field.name);
			}
		}
	},

	/**
	 * Handles record clicks. Selects a record
	 */
	rowClick: function(component, event, helper) {
		event.preventDefault();

		var searching = component.get('v.searching');
		if (searching) {
			return;
		}

		var item = event.target;
		while (item && (item.tagName !== 'A')) {
			item = item.parentElement;
		}

		if (item) {
			var recordId = item.getAttribute('data-recordid');
			var records = component.get('v.records');
			var record = helper.utils.find(records, function(r) {
				return r.recordId === recordId;
			});
			if (record) {
				helper.select(component, record);
			}
		}
	},

	/**
	 * Loads the first page of results
	 */
	pagerFirstClick: function(component, event, helper) {
		helper.search(component, undefined, 1);
	},

	/**
	 * Loads the previous page of results
	 */
	pagerPrevClick: function(component, event, helper) {
		var pageNumber = component.get('v.pageNumber');
		helper.search(component, undefined, pageNumber - 1);
	},

	/**
	 * Loads the next page of results
	 */
	pagerNextClick: function(component, event, helper) {
		var pageNumber = component.get('v.pageNumber');
		helper.search(component, undefined, pageNumber + 1);
	},

	/**
	 * Loads the last page of results
	 */
	pagerLastClick: function(component, event, helper) {
		var pageCount = component.get('v.pageCount');
		helper.search(component, undefined, pageCount);
	},

	/**
	 * Handles the keydown event of the cancel button. If TAB is pressed (and SHIFT is not pressed)
	 * then sets focus to the input element to prevent the modal from losing the focus
	 */
	cancelButtonKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		if ((which === 9) && !event.shiftKey) {
			event.preventDefault();

			var inputElement = helper.getInputElement(component);
			inputElement.focus();
		}
	},

	/**
	 * Handles the click event of the cancel button. Closes the modal as long as a search is not
	 * actively being performed
	 */
	cancelButtonClick: function(component, event, helper) {
		event.stopPropagation();

		var searching = component.get('v.searching');
		if (searching) {
			return;
		}

		component.close();
	}
})