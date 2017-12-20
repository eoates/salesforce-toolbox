({
	// Minimium length of search text
	MIN_SEARCH_TEXT_LENGTH: 2,

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The searchModal component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Selects the specified record and closes the modal
	 *
	 * @param {Aura.Component} component - The searchModal component
	 * @param {Object}         record    - The selected record
	 *
	 * @return {void}
	 */
	select: function(component, record) {
		if (!record) {
			return;
		}

		this.fireEvent(component, 'onselect', {
			record: this.simplifyRecord(record)
		});
		component.close();
	},

	/**
	 * Returns the input HTML element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The input element
	 */
	getInputElement: function(component) {
		var input = component.find('input');
		if (input) {
			return input.getElement();
		}
		return undefined;
	},

	/**
	 * Allow search if input is at least 2 characters long
	 *
	 * @param {Aura.Component} component - The searchModal component
	 *
	 * @return {void}
	 */
	setAllowSearchBasedOnInput: function(component) {
		var inputElement = this.getInputElement(component);
		var searchText = this.utils.trim(inputElement.value);
		var searchTextLength = this.getSearchTextLength(searchText);

		component.set('v.allowSearch', (searchTextLength >= this.MIN_SEARCH_TEXT_LENGTH));
	},

	/**
	 * Returns the length of the search text. Determining the length of the search text is not as
	 * simple as simply returning the string's length. When executing a SOSL query the search text
	 * must be longer than 1 character. The difficulty here is that if the string is 2 characters or
	 * less and the first character is a wildcard character then an exception will be thrown even if
	 * the string length is technically longer than 1 character and even if that first wildcard
	 * character is escaped. So, we have to check for this condition and return 0 so we don't try
	 * and execute the query and get an error
	 *
	 * @param {string} searchText - The search text
	 *
	 * @return The logical length of the search text
	 */
	getSearchTextLength: function(searchText) {
		var length = searchText.length;
		if (length <= 2) {
			var first = searchText.substring(0, 1);
			if ((first === '?') || (first === '*')) {
				length = 0;
			}
		}
		return length;
	},

	/**
	 * Set the sort field. If the specified field is the same as the current field then the sort
	 * order will be toggled
	 *
	 * @param {Aura.Component} component - The searchModal component
	 * @param {string}         sortField - The name of the field to sort by
	 *
	 * @return {void}
	 */
	setSortField: function(component, sortField, success, failure) {
		var sortAsc = component.get('v.sortAsc');
		if (sortField === component.get('v.sortField')) {
			sortAsc = !sortAsc;
		} else {
			sortAsc = true;
		}

		return this.search(component, undefined, 1, sortField, sortAsc);
	},

	/**
	 * Performs the search
	 *
	 * @param {Aura.Component} component    - The searchModal component
	 * @param {string}         [searchText] - The text to search for. If omitted the current search
	 *                                        text will be used
	 * @param {number}         [pageNumber] - The page number. If omitted the current page number
	 *                                        will be used
	 * @param {string}         [sortField]  - The field to sort by. If omitted the current sort
	 *                                        field will be used
	 * @param {boolean}        [sortAsc]    - The sort direction. If omitted the current sort order
	 *                                        will be used
	 *
	 * @return {void}
	 */
	search: function(component, searchText, pageNumber, sortField, sortAsc) {
		if (this.utils.isUndefinedOrNull(searchText)) {
			searchText = component.get('v.searchText');
		}
		searchText = this.utils.trim(searchText);

		if (this.utils.isUndefinedOrNull(pageNumber)) {
			pageNumber = component.get('v.pageNumber');
		}
		if (this.utils.isUndefinedOrNull(sortField)) {
			sortField = component.get('v.sortField');
		}
		if (this.utils.isUndefinedOrNull(sortAsc)) {
			sortAsc = component.get('v.sortAsc');
		}

		component.set('v.searching', true);

		return this
			.loadSearchResult(component, searchText, pageNumber, sortField, sortAsc)
			.then($A.getCallback(function() {
				component.set('v.searching', false);
			}))
			.catch($A.getCallback(function(error) {
				component.set('v.searching', false);

				var dialog = component.find('dialog');
				dialog.showToast('error', undefined, 'Search Error', error.message);
			}));
	},

	/**
	 * Loads search object asynchronously
	 *
	 * @param {Aura.Component} component - The searchModal component
	 *
	 * @return {Promise} A Promise that returns the search object if resolved
	 */
	loadSearchObject: function(component) {
		var self = this;
		var spec = component.get('v.type');
		var recordIds = component.get('v.selectedRecordIds') || [];

		return new Promise(function(resolve, reject) {
			self.apex(component, 'getSearchObjects', {
				params: {
					specs: [ spec ],
					recordIds: recordIds
				},
				success: resolve,
				failure: reject
			});
		}).then($A.getCallback(function(result) {
			var searchObjects = result.slice(0);
			if (searchObjects.length > 0) {
				var searchObject = searchObjects[0];

				var fields = searchObject.fields;
				var visibleFields = [];
				for (var i = 0, n = fields.length; i < n; i++) {
					var field = fields[i];
					if (!field.hidden) {
						visibleFields.push(field);
					}
				}
				searchObject.visibleFields = visibleFields;

				component.set('v.searchObject', searchObject);
			}
		}));
	},

	/**
	 * Executes search asynchronously
	 *
	 * @param {Aura.Component} component  - The searchModal component
	 * @param {string}         searchText - The search text
	 * @param {number}         pageNumber - The page number
	 * @param {string}         sortField  - The field to sort by
	 * @param {boolean}        sortAsc    - The sort order
	 *
	 * @return {Promise} A Promise that returns the search result if resolved
	 */
	loadSearchResult: function(component, searchText, pageNumber, sortField, sortAsc) {
		var self = this;
		var spec = component.get('v.type');
		var recordIds = component.get('v.selectedRecordIds') || [];
		var searchTextLength = self.getSearchTextLength(searchText);

		var p;
		if (searchTextLength >= self.MIN_SEARCH_TEXT_LENGTH) {
			p = new Promise(function(resolve, reject) {
				self.apex(component, 'getSearchResult', {
					params: {
						spec: spec,
						searchText: searchText,
						recordIds: recordIds,
						sortField: sortField,
						sortAsc: sortAsc,
						howMany: 1000,
						pageSize: 10,
						pageNumber: pageNumber
					},
					success: resolve,
					failure: reject
				});
			});
		} else {
			p = Promise.resolve([]);
		}

		return p.then($A.getCallback(function(result) {
			var records = self.transformRecords(component, result.records);

			component.set('v.searchText', searchText);
			component.set('v.recordCount', result.recordCount);
			component.set('v.pageSize', result.pageSize);
			component.set('v.pageNumber', result.pageNumber);
			component.set('v.pageCount', result.pageCount);
			component.set('v.records', records);
			component.set('v.sortField', sortField);
			component.set('v.sortAsc', sortAsc);
		}));
	},

	/**
	 * Transform records returned from the server (LtngSearchRecord) into a structure used within
	 * this component
	 *
	 * @param {Aura.Component} component - The searchModal component
	 * @param {Object[]}       records   - The records to transform
	 *
	 * @return {Object[]} The transformed records
	 */
	transformRecords: function(component, records) {
		var searchObject = component.get('v.searchObject');

		var transformedRecords = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];

			var transformedRecord = this.utils.extend(true, {}, record);
			transformedRecord.visibleFields = [];

			for (var j = 0; j < searchObject.visibleFields.length; j++) {
				var field = searchObject.visibleFields[j];
				var value = record.fields[field.name];
				var formattedValue = this.formatValue(value, field);

				transformedRecord.visibleFields.push(this.utils.extend(true, {
					value: value,
					formattedValue: formattedValue
				}, field));
			}

			transformedRecords.push(transformedRecord);
		}
		return transformedRecords;
	},

	/**
	 * Format a field value
	 *
	 * @param {*}      value - The value to format
	 * @param {Object} field - The field information
	 *
	 * @return {string} The formatted value
	 */
	formatValue: function(value, field) {
		if (this.utils.isUndefinedOrNull(value)) {
			return '';
		}

		var type = field.dataType;
		var scale = field.scale;
		if (type === 'CURRENCY') {
			value = this.utils.formatNumber(value, scale);
		} else if (type === 'DATE') {
			value = $A.localizationService.formatDate(value, 'M/d/yyyy');
		} else if (type === 'DATETIME') {
			value = $A.localizationService.formatDateTime(value, 'M/d/yyyy h:mm a');
		} else if ((type === 'DOUBLE') || (type === 'INTEGER')) {
			value = this.utils.formatNumber(value, scale);
		} else if (type === 'PERCENT') {
			value = this.utils.formatNumber(value, scale);
		} else if (type === 'TIME') {
			value = $A.localizationService.formatTime(value);
		} else {
			value = this.utils.trim(value);
		}

		return value;
	},

	/**
	 * Converts a records which was previously transformed via the transformRecords() method back to
	 * its original form (LtngSearchRecord)
	 *
	 * @param {Object} record - The record to simplify
	 *
	 * @return {Object} The simplified record
	 */
	simplifyRecord: function(record) {
		var simplifiedRecord = this.utils.extend(true, {}, record);
		delete simplifiedRecord.visibleFields;
		return simplifiedRecord;
	},

	/**
	 * Executes an Apex controller method
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - The name of the method to execute
	 * @param {Object}         opts      - An object containing execution options
	 *
	 * @return {void}
	 */
	apex: function(component, name, opts) {
		this.utils.extend(opts, { context: this });
		component.find('apex').execute(component, name, opts);
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The searchModal component
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
})