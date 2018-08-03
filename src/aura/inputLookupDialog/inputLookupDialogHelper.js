/**************************************************************************************************
 * inputLookupDialogHelper.js
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
	/** Contains component instances */
	dialogs: [],

	/** Time (in milliseconds) to wait before handling a window resize event */
	resizeDelay: 300,

	/** Minimum number of characters that must be entered to perform a search */
	minSearchTextLength: 3,

	/** The value of the "Relevance" sort field option */
	relevanceValue: '',

	/** The label for the "Relevance" sort field option */
	relevanceLabel: 'Relevance',

	/** Sort direction ascending */
	sortAscending: 'asc',

	/** Sort direction descending */
	sortDescending: 'desc',

	/** Number of items displayed per page */
	pageSize: 25,

	/** Maximum number of items returned by a search */
	maxItems: 500,

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
		if (!this.apex) {
			this.apex = component.find('apex').getModule();
		}
	},

	/**
	 * Adds a resize event handler to the window object. We only add this handler once when the
	 * first inputLookupDialog instance is rendered. The handler will handle notifying each
	 * inputLookupDialog instance
	 *
	 * @return {void}
	 */
	addWindowResizeListener: function() {
		if (this.windowResizeListener) {
			return;
		}

		var listener = this.handleWindowResize;
		listener = this.utils.bind(listener, this);
		listener = this.utils.debounce(this.resizeDelay, listener);
		listener = $A.getCallback(listener);

		window.addEventListener('resize', listener, { passive: true });
		this.windowResizeListener = listener;
	},

	/**
	 * Removes the resize event handler from the window object when the last inputLookupDialog
	 * instance is destroyed
	 *
	 * @return {void}
	 */
	removeWindowResizeListener: function() {
		if (!this.windowResizeListener) {
			return;
		}
		window.removeEventListener('resize', this.windowResizeListener);
		this.windowResizeListener = undefined;
	},

	/**
	 * Handle the window resize event. When the window is resized we need to recalculate the height
	 * of the results table
	 *
	 * @return {void}
	 */
	handleWindowResize: function() {
		var i, n, component;
		for (i = 0, n = this.dialogs.length; i < n; i++) {
			component = this.dialogs[i];
			this.calculateResultsTableHeight(component, true);
		}
	},

	/**
	 * Sets the height of the results table so it fills up all of the available space in the dialog
	 * instead of using a hard-coded height
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {boolean}        [resize]  - true if the method is being called as a result of the
	 *                                     window being resized; otherwise, false
	 *
	 * @return {void}
	 */
	calculateResultsTableHeight: function(component, resize) {
		var globalId = component.getGlobalId();
		var container = document.getElementById(globalId + '_results_container');
		var table = document.getElementById(globalId + '_results_table');
		if (!container || !table) {
			return;
		}

		var extra = resize ? 0 : 98;
		var height = Math.max(container.clientHeight - table.offsetTop - extra, 62);
		table.style.height = height + 'px';
	},

	/**
	 * Returns the value of the type attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {Object} The value of the type attribute
	 */
	getType: function(component) {
		return component.get('v.type');
	},

	/**
	 * Returns the value of the searchText attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {string} The value of the searchText attribute
	 */
	getSearchText: function(component) {
		return this.utils.trim(component.get('v.searchText'));
	},

	/**
	 * Returns the value of the pageNumber attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {number} The value of the pageNumber attribute
	 */
	getPageNumber: function(component) {
		return component.get('v.pageNumber');
	},

	/**
	 * Returns the value of the sortField attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {string} The value of the sortField attribute
	 */
	getSortField: function(component) {
		return this.utils.trim(component.get('v.sortField'));
	},

	/**
	 * Returns the value of the sortDirection attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {string} The value of the sortDirection attribute
	 */
	getSortDirection: function(component) {
		return this.utils.trim(component.get('v.sortDirection'));
	},

	/**
	 * Returns the value of the sortFieldOptions attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {Object[]} The value of the sortFieldOptions attribute
	 */
	getSortFieldOptions: function(component) {
		return component.get('v.sortFieldOptions');
	},

	/**
	 * Returns the value of the columns attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {Object[]} The value of the columns attribute
	 */
	getColumns: function(component) {
		return component.get('v.columns');
	},

	/**
	 * Returns the value of the items attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {Object[]} The value of the items attribute
	 */
	getItems: function(component) {
		return component.get('v.items');
	},

	/**
	 * Returns the value of the workCounter attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {number} The value of the workCounter attribute
	 */
	getWorkCounter: function(component) {
		return component.get('v.workCounter');
	},

	/**
	 * Sets the value of the searchText attribute
	 *
	 * @param {Aura.Component} component  - The inputLookupDialog component
	 * @param {string}         searchText - The attribute value
	 *
	 * @return {void}
	 */
	setSearchText: function(component, searchText) {
		searchText = this.utils.trim(searchText);
		component.set('v.searchText', searchText);
	},

	/**
	 * Sets the value of the pageNumber attribute
	 *
	 * @param {Aura.Component} component  - The inputLookupDialog component
	 * @param {number}         pageNumber - The attribute value
	 *
	 * @return {void}
	 */
	setPageNumber: function(component, pageNumber) {
		component.set('v.pageNumber', pageNumber);
	},

	/**
	 * Sets the value of the pageCount attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {number}         pageCount - The attribute value
	 *
	 * @return {void}
	 */
	setPageCount: function(component, pageCount) {
		component.set('v.pageCount', pageCount);
	},

	/**
	 * Sets the value of the itemCount attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {number}         itemCount - The attribute value
	 *
	 * @return {void}
	 */
	setItemCount: function(component, itemCount) {
		component.set('v.itemCount', itemCount);
	},

	/**
	 * Sets the value of the sortField attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {string}         sortField - The attribute value
	 *
	 * @return {void}
	 */
	setSortField: function(component, sortField) {
		sortField = this.utils.trim(sortField);
		component.set('v.sortField', sortField);
	},

	/**
	 * Sets the value of the sortDirection attribute
	 *
	 * @param {Aura.Component} component     - The inputLookupDialog component
	 * @param {string}         sortDirection - The attribute value
	 *
	 * @return {void}
	 */
	setSortDirection: function(component, sortDirection) {
		sortDirection = this.utils.trim(sortDirection);
		component.set('v.sortDirection', sortDirection);
	},

	/**
	 * Sets the value of the sortFieldOptions attribute
	 *
	 * @param {Aura.Component} component        - The inputLookupDialog component
	 * @param {Object[]}       sortFieldOptions - The attribute value
	 *
	 * @return {void}
	 */
	setSortFieldOptions: function(component, sortFieldOptions) {
		component.set('v.sortFieldOptions', sortFieldOptions || []);
	},

	/**
	 * Sets the value of the sortFieldLabel attribute
	 *
	 * @param {Aura.Component} component      - The inputLookupDialog component
	 * @param {string}         sortFieldLabel - The attribute value
	 *
	 * @return {void}
	 */
	setSortFieldLabel: function(component, sortFieldLabel) {
		sortFieldLabel = this.utils.trim(sortFieldLabel);
		component.set('v.sortFieldLabel', sortFieldLabel);
	},

	/**
	 * Sets the value of the columns attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {Object[]}       columns   - The attribute value
	 *
	 * @return {void}
	 */
	setColumns: function(component, columns) {
		component.set('v.columns', columns || []);
	},

	/**
	 * Sets the value of the items attribute
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {Object[]}       items     - The attribute value
	 *
	 * @return {void}
	 */
	setItems: function(component, items) {
		component.set('v.items', items || []);
	},

	/**
	 * Sets the value of the searchError attribute
	 *
	 * @param {Aura.Component} component   - The inputLookupDialog component
	 * @param {string}         searchError - The attribute value
	 *
	 * @return {void}
	 */
	setSearchError: function(component, searchError) {
		searchError = this.utils.trim(searchError);
		component.set('v.searchError', searchError);
	},

	/**
	 * Sets the value of the workCounter attribute
	 *
	 * @param {Aura.Component} component   - The inputLookupDialog component
	 * @param {number}         workCounter - The attribute value
	 *
	 * @return {void}
	 */
	setWorkCounter: function(component, workCounter) {
		component.set('v.workCounter', workCounter);
	},

	/**
	 * Loads search results from the database
	 *
	 * @param {Aura.Component} component     - The inputLookupDialog component
	 * @param {string}         searchText    - The text to search for
	 * @param {number}         pageNumber    - The page number
	 * @param {string}         sortField     - The field to sort by
	 * @param {string}         sortDirection - The direction of the sort
	 *
	 * @return {void}
	 */
	loadItems: function(component, searchText, pageNumber, sortField, sortDirection) {
		// If we have no type information then do nothing
		var type = this.getType(component);
		if (!type) {
			return;
		}

		// If a search is already in progress do nothing
		var workCounter = this.getWorkCounter(component);
		if (workCounter > 0) {
			return;
		}

		// Make sure the search text contains the minimum number of characters
		var simplifiedSearchText = this.stripSpecialChars(searchText);
		if (simplifiedSearchText.length < this.minSearchTextLength) {
			this.clearItems(component);
			this.setSearchError(
				component,
				'You must enter at least ' + this.minSearchTextLength + ' character(s) to search'
			);
			return;
		}

		// Execute server-side Apex
		this.incrementWorkCounter(component);
		this.setSearchError(component, '');

		this.apex.execute(component, 'search', {
			context: this,
			abortable: true,
			params: {
				sObjectName: type.name,
				fieldNames: type.fieldNames,
				searchText: searchText,
				sortField: sortField,
				sortAscending: sortDirection === this.sortAscending,
				pageSize: this.pageSize,
				pageNumber: pageNumber,
				filter: type.filter,
				withoutSharing: type.withoutSharing,
				howMany: this.maxItems,
				providerName: type.providerName
			},
			success: function(result) {
				// Success
				this.setSearchText(component, searchText);
				this.setSortField(component, sortField);
				this.setSortDirection(component, sortDirection);
				this.setPageNumber(component, result.pageNumber);
				this.setPageCount(component, result.pageCount);
				this.setItemCount(component, result.itemCount);

				// Columns
				var columns = [];
				if (result.items.length > 0) {
					columns = this.makeColumns(result.items[0].fields);
				}
				this.setColumns(component, columns);

				// Items
				this.setItems(component, result.items);

				// Sort options
				var sortFieldOptions = this.makeSortFieldOptions(columns, sortField);
				this.setSortFieldOptions(component, sortFieldOptions);

				var sortFieldOption = this.findSortFieldOptionByName(sortFieldOptions, sortField);
				var sortFieldLabel = sortFieldOption && sortFieldOption.label;
				this.setSortFieldLabel(component, sortFieldLabel || sortField);
			},
			failure: function(error) {
				// Display error message
				this.clearItems(component);
				this.setSearchError(component, error.message);
			},
			complete: function() {
				// Decrement the work counter when the callout is complete
				this.decrementWorkCounter(component);
			}
		});
	},

	/**
	 * Clears the results table
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	clearItems: function(component) {
		this.setSortFieldOptions(component, []);
		this.setColumns(component, []);
		this.setItems(component, []);
	},

	/**
	 * Resets the component to its initial state
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	reset: function(component) {
		this.setSearchText(component, '');
		this.setSearchTextInputValue(component, '');
		this.setPageNumber(component, 1);
		this.setPageCount(component, 1);
		this.setItemCount(component, 0);
		this.setSortField(component, this.relevanceValue);
		this.setSortFieldLabel(component, this.relevanceLabel);
		this.setSortDirection(component, this.sortAscending);
		this.setSearchError(component, '');
		this.clearItems(component);
	},

	/**
	 * Returns the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {HTMLElement} The input element
	 */
	getSearchTextInputElement: function(component) {
		var searchTextInput = component.find('searchTextInput');
		return searchTextInput && searchTextInput.getElement();
	},

	/**
	 * Returns the value of the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {string} The value of the input element
	 */
	getSearchTextInputValue: function(component) {
		var inputElement = this.getSearchTextInputElement(component);
		return inputElement ? inputElement.value : '';
	},

	/**
	 * Sets the value of the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {string}         value     - The value
	 *
	 * @return {void}
	 */
	setSearchTextInputValue: function(component, value) {
		var inputElement = this.getSearchTextInputElement(component);
		if (inputElement) {
			inputElement.value = this.utils.trim(value);
		}
	},

	/**
	 * Disables autocomplete for the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	disableSearchTextInputAutocomplete: function(component) {
		var inputElement = this.getSearchTextInputElement(component);
		if (inputElement) {
			inputElement.setAttribute('autocomplete', 'off');
		}
	},

	/**
	 * Increments the workCounter attribute by 1
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	incrementWorkCounter: function(component) {
		var workCounter = this.getWorkCounter(component);
		this.setWorkCounter(component, workCounter + 1);
	},

	/**
	 * Decrements the workCounter attribute by 1
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 *
	 * @return {void}
	 */
	decrementWorkCounter: function(component) {
		var workCounter = this.getWorkCounter(component);
		this.setWorkCounter(component, Math.max(workCounter - 1, 0));
	},

	/**
	 * Removes special search characters
	 *
	 * @param {string} searchText - The search text
	 *
	 * @return {string} The search text with special characters removed
	 */
	stripSpecialChars: function(searchText) {
		searchText = this.utils.trim(searchText);
		searchText = searchText.replace(new RegExp('[*"]', 'g'), '');
		return searchText;
	},

	/**
	 * Returns a unique value. If the value already exists within the list then a counter is added
	 * to make it unique
	 *
	 * @param {string[]} values - The list of unique values
	 * @param {string}   value  - The value to make unique
	 *
	 * @return {string} A unique value that is not contained within the list
	 */
	unique: function(values, value) {
		var counter = 1;
		var uniqueValue = value;
		while (values.indexOf(uniqueValue) !== -1) {
			counter++;
			uniqueValue = value + ' (' + counter + ')';
		}
		return uniqueValue;
	},

	/**
	 * Creates column information from the fields returned by the server-side search result
	 *
	 * @param {Object[]} fields - The fields returned by the search
	 *
	 * @return {Object[]} An array that has the same number of elements as the fields argument. Each
	 *                    object in this array represents a column in the results table
	 */
	makeColumns: function(fields) {
		var columns = [];
		var labels = [ this.relevanceLabel ];
		var i, n, field, label, column;
		for (i = 1, n = fields.length; i < n; i++) {
			field = fields[i];
			label = this.unique(labels, field.label);

			column = this.utils.clone(field);
			column.label = label;

			columns.push(column);
			labels.push(label);
		}
		return columns;
	},

	/**
	 * Creates the list of options used to populate the dropdown menu that allows the user to change
	 * the sort field
	 *
	 * @param {Object[]} columns   - The array of column objects
	 * @param {string}   sortField - The sort field
	 *
	 * @return {Object[]} The sort field menu options
	 */
	makeSortFieldOptions: function(columns, sortField) {
		var sortFieldOptions = [];
		var i, n, column;

		sortFieldOptions.push({
			name: this.relevanceValue,
			label: this.relevanceLabel,
			selected: this.utils.isBlank(sortField)
		});

		for (i = 0, n = columns.length; i < n; i++) {
			column = columns[i];
			if (column.sortable) {
				sortFieldOptions.push({
					name: column.name,
					label: column.label,
					selected: (column.name === sortField)
				});
			}
		}

		return sortFieldOptions;
	},

	/**
	 * Returns the item with the specified ID
	 *
	 * @param {Object[]} items - The array of items to search
	 * @param {string}   id    - The ID of the item to find
	 *
	 * @return {Object} The item with the specified ID or undefined if no match
	 */
	findItemById: function(items, id) {
		id = this.utils.trim(id).toLowerCase();

		return this.utils.find(items, function(item) {
			return item.id.toLowerCase() === id;
		});
	},

	/**
	 * Returns the sort field option with the specified name
	 *
	 * @param {Object[]} sortFieldOptions - The array of options to search
	 * @param {string}   name             - The name of the option to find
	 *
	 * @return {Object} The option with the specified name or undefined if no match
	 */
	findSortFieldOptionByName: function(sortFieldOptions, name) {
		return this.utils.find(sortFieldOptions, function(sortFieldOption) {
			return sortFieldOption.name === name;
		});
	},

	/**
	 * Returns the sort field option with the specified label
	 *
	 * @param {Object[]} sortFieldOptions - The array of options to search
	 * @param {string}   label            - The label of the option to find
	 *
	 * @return {Object} The option with the specified label or undefined if no match
	 */
	findSortFieldOptionByLabel: function(sortFieldOptions, label) {
		return this.utils.find(sortFieldOptions, function(sortFieldOption) {
			return sortFieldOption.label === label;
		});
	},

	/**
	 * Sets the selected sort field option
	 *
	 * @param {Object[]} sortFieldOptions - The array of options
	 * @param {string}   name             - The name of the option to select
	 *
	 * @return {void}
	 */
	selectSortFieldOptionByName: function(sortFieldOptions, name) {
		var i, n, sortFieldOption;
		for (i = 0, n = sortFieldOptions.length; i < n; i++) {
			sortFieldOption = sortFieldOptions[i];
			sortFieldOption.selected = (sortFieldOption.name === name);
		}
	},

	/**
	 * Perform a new search. Page number and sort field/direction will be reset to defaults
	 *
	 * @param {Aura.Component} component  - The inputLookupDialog component
	 * @param {string}         searchText - The text to search for
	 *
	 * @return {void}
	 */
	search: function(component, searchText) {
		this.loadItems(component, searchText, 1, this.relevanceValue, this.sortAscending);
	},

	/**
	 * Sorts the results by the specified field. If the results are already sorted by the specified
	 * field then the sort direction will be reversed
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
	 * @param {string}         sortField - The API name of the field to sort by
	 *
	 * @return {void}
	 */
	sort: function(component, sortField) {
		var searchText = this.getSearchText(component);
		var sortDirection = this.sortAscending;
		if (this.getSortField(component) === sortField) {
			if (this.getSortDirection(component) === this.sortAscending) {
				sortDirection = this.sortDescending;
			}
		}

		this.loadItems(component, searchText, 1, sortField, sortDirection);
	},

	/**
	 * Navigates to the specified page number
	 *
	 * @param {Aura.Component} component  - The inputLookupDialog component
	 * @param {number}         pageNumber - The page number to navigate to
	 *
	 * @return {void}
	 */
	goToPage: function(component, pageNumber) {
		var searchText = this.getSearchText(component);
		var sortField = this.getSortField(component);
		var sortDirection = this.getSortDirection(component);

		this.loadItems(component, searchText, pageNumber, sortField, sortDirection);
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputLookupDialog component
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
}) // eslint-disable-line semi