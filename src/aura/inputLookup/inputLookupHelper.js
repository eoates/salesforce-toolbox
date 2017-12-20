({
	// Minimium length of search text
	MIN_SEARCH_TEXT_LENGTH: 2,

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Initialize the component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	init: function(component) {
		var type = this.utils.trim(component.get('v.type'));
		var types = component.get('v.types') || [];
		if (this.utils.isEmpty(types) && !this.utils.isEmpty(type)) {
			this.setTypes(component, [ type ]);
		} else if (!this.utils.isEmpty(types)) {
			this.setType(component, types[0]);
		} else if (this.utils.isEmpty(types)) {
			this.setType(component, undefined);
		}

		var multiple = component.get('v.multiple');
		var value = this.utils.trim(component.get('v.value'));
		var values = component.get('v.values') || [];
		if (this.utils.isEmpty(values) && !this.utils.isEmpty(value)) {
			this.setValues(component, [ value ]);
		} else if (!this.utils.isEmpty(values)) {
			this.setValue(component, values[0]);
			this.setValues(component, values);
			if ((values.length > 1) && !multiple) {
				component.set('v.multiple', true);
			}
		} else if (this.utils.isEmpty(values)) {
			this.setValue(component, undefined);
		}
	},

	/**
	 * Resets the component. Clears the search text, closes object switcher (if open), closes
	 * lookup menu (if open), clears search results, toggles menu item visibility, etc.
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	reset: function(component) {
		this.setInputElementValue(component, '');
		this.closeObjectSwitcher(component);
		this.closeMenu(component);

		component.set('v.searchText', '');
		component.set('v.lookupItems', []);

		this.handleSearchTextChange(component);
	},

	/**
	 * Clears the selection and resets the component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	clear: function(component) {
		var removedRecords = this.simplifyRecords(component.get('v.records'));

		component.set('v.records', []);

		this.setValues(component, []);
		this.setValue(component, undefined);

		this.reset(component);

		if (removedRecords.length > 0) {
			this.fireEvent(component, 'onremove', {
				records: removedRecords
			});
			this.fireEvent(component, 'onchange');
		}
	},

	/**
	 * Selects the specified record. If multiple = true then this record will be added to the list
	 * of selected records; otherwise, if multiple = false then the record will become the 1 and
	 * only selected record
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object}         record    - The record to select
	 *
	 * @return {void}
	 */
	select: function(component, record) {
		var multiple = component.get('v.multiple');
		if (!multiple) {
			// Single select
			if (record) {
				component.set('v.records', [ record ]);

				this.setValues(component, [ record.recordId ]);
				this.setValue(component, record.recordId);

				// Fire events
				this.fireEvent(component, 'onselect', {
					records: this.simplifyRecords([ record ])
				});
				this.fireEvent(component, 'onchange');
			} else {
				var removedRecords = this.simplifyRecords(component.get('v.records'));

				component.set('v.records', []);

				this.setValues(component, []);
				this.setValue(component, undefined);

				// Fire events
				if (removedRecords.length > 0) {
					this.fireEvent(component, 'onremove', {
						records: removedRecords
					});
					this.fireEvent(component, 'onchange');
				}
			}
		} else {
			// Multi select
			if (record) {
				var index;
				var added = false;

				// Add the record
				var records = component.get('v.records') || [];
				index = this.utils.findIndex(records, function(r) {
					return r.recordId === record.recordId;
				});
				if (index === -1) {
					added = true;

					records.push(record);
					component.set('v.records', records);
				}

				// Add the value
				var values = component.get('v.values') || [];
				index = this.utils.findIndex(values, function(v) {
					return v === record.recordId;
				});
				if (index === -1) {
					values.push(record.recordId);
					this.setValues(component, values);
					this.setValue(component, values[0]);
				}

				// If added then fire events
				if (added) {
					this.fireEvent(component, 'onselect', {
						records: this.simplifyRecords([ record ])
					});
					this.fireEvent(component, 'onchange');
				}
			}
		}
	},

	/**
	 * Unselects the specified record. The record is removed from the list of selected records
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object}         record    - The record to remove
	 *
	 * @return {void}
	 */
	remove: function(component, record) {
		if (!record) {
			return;
		}

		var index;
		var removed = false;

		// Remove record
		var records = component.get('v.records') || [];
		index = this.utils.findIndex(records, function(r) {
			return r.recordId === record.recordId;
		});
		if (index !== -1) {
			removed = true;

			records.splice(index, 1);
			component.set('v.records', records);
		}

		// Remove value
		var values = component.get('v.values') || [];
		index = this.utils.findIndex(values, function(v) {
			return v === record.recordId;
		});
		if (index !== -1) {
			values.splice(index, 1);
			this.setValues(component, values);
			this.setValue(component, (values.length > 0) ? values[0] : undefined);
		}

		// Fire events
		if (removed) {
			this.fireEvent(component, 'onremove', {
				records: this.simplifyRecords([ record ])
			});
			this.fireEvent(component, 'onchange');
		}
	},

	/**
	 * Set a component attribute. This method sets a temporary flag to true before updating the
	 * attribute and then sets the flag to false after the attribute has been set. This temporary
	 * flag is then used in handleAttributeChange() so the handler is only executed when the flag
	 * is false. This allows us to respond to determine if an attribute is being set explicitly via
	 * the setAttribute() method or if it is being set externally
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - Name of the attribute to set
	 * @param {*}              value     - Attribute value
	 *
	 * @return {void}
	 */
	setAttribute: function(component, name, value) {
		component['ignoreChange_' + name] = true;
		try {
			component.set('v.' + name, value);
		} finally {
			component['ignoreChange_' + name] = false;
		}
	},

	/**
	 * Executes a specified handler function only if the attribute is not being changed via the
	 * setAttribute() method. This method is intended to be used when you want to respond to an
	 * attribute's value change ONLY if the attribute was changed by some external process (such as
	 * data binding or a parent component)
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - Name of the attribute
	 * @param {Function}       handler   - A handler function
	 *
	 * @return {void}
	 */
	handleAttributeChange: function(component, name, handler) {
		if (component['ignoreChange_' + name]) {
			return;
		}

		var value = component.get('v.' + name);
		handler(value);
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
	 * Set the type attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         type      - Attribute value
	 *
	 * @return {void}
	 */
	setType: function(component, type) {
		this.setAttribute(component, 'type', type);
	},

	/**
	 * Set the types attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string[]}       types     - Attribute value
	 *
	 * @return {void}
	 */
	setTypes: function(component, types) {
		this.setAttribute(component, 'types', types);
	},

	/**
	 * Set the value attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         value     - Attribute value
	 *
	 * @return {void}
	 */
	setValue: function(component, value) {
		this.setAttribute(component, 'value', value);
	},

	/**
	 * Set the values attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string[]}       values    - Attribute value
	 *
	 * @return {void}
	 */
	setValues: function(component, values) {
		this.setAttribute(component, 'values', values);
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
			if (this.utils.isArray(input)) {
				if (input.length > 0) {
					return input[0].getElement();
				}
			} else {
				return input.getElement();
			}
		}
		return undefined;
	},

	/**
	 * Gets the value of the input element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The input element value
	 */
	getInputElementValue: function(component) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			return inputElement.value;
		}
		return '';
	},

	/**
	 * Sets the value of the input element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         value     - The value
	 *
	 * @return {void}
	 */
	setInputElementValue: function(component, value) {
		var inputElement = this.getInputElement(component);
		if (inputElement) {
			var mode = inputElement.getAttribute('data-mode');
			if (mode !== 'static') {
				inputElement.value = value;
			}
		}
	},

	/**
	 * Set focus to the input element after rendering is complete. Uses setTimeout() to wait for the
	 * component to re-render then sets focus to the input element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	focusInputElementAfterRender: function(component) {
		setTimeout($A.getCallback(function() {
			component.focus();
		}), 0);
	},

	/**
	 * Returns the HTML element that represents the object switcher menu. If the component does not
	 * have an object switcher then undefined is returned
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The object switcher menu element
	 */
	getObjectSwitcher: function(component) {
		var objectSwitcher = component.find('objectSwitcher');
		if (objectSwitcher) {
			return objectSwitcher.getElement();
		}
		return undefined;
	},

	/**
	 * Returns true if the object switcher menu is open; otherwise, false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the object switcher menu is open; otherwise, false
	 */
	isObjectSwitcherOpen: function(component) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return false;
		}
		return $A.util.hasClass(objectSwitcher, 'slds-is-open');
	},

	/**
	 * Opens the object switcher menu. Calling this method when the component does not have an
	 * object switcher returns false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was opened; otherwise, false
	 */
	openObjectSwitcher: function(component) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return false;
		}

		var selectedSearchObject = component.get('v.selectedSearchObject');
		if (!selectedSearchObject) {
			return false;
		}

		var item = this.getObjectSwitcherItemByName(component, selectedSearchObject.name);
		this.setObjectSwitcherSelectedItem(component, item);

		$A.util.addClass(objectSwitcher, 'slds-is-open');

		return true;
	},

	/**
	 * Closes the object switcher menu. Calling this method when the component does not have an
	 * object switcher returns false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was closed; otherwise, false
	 */
	closeObjectSwitcher: function(component) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return false;
		}

		$A.util.removeClass(objectSwitcher, 'slds-is-open');
		return true;
	},

	/**
	 * Toggles the visibility of the object switcher menu (i.e. opens the menu when it is closed or
	 * closes it when it is open)
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was toggled; otherwise, false
	 */
	toggleObjectSwitcher: function(component) {
		if (this.isObjectSwitcherOpen(component)) {
			return this.closeObjectSwitcher(component);
		} else {
			return this.openObjectSwitcher(component);
		}
	},

	/**
	 * Returns the list of object switcher menu items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {NodeList} The object switcher menu items
	 */
	getObjectSwitcherItems: function(component) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return [];
		}

		var items = objectSwitcher.querySelectorAll('.slds-dropdown__item');
		return items;
	},

	/**
	 * Returns a specific object switcher menu item by name
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - The name of the item to find
	 *
	 * @return {HTMLElement} The object switcher menu item or undefined if not found
	 */
	getObjectSwitcherItemByName: function(component, name) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return undefined;
		}

		var a = objectSwitcher.querySelector('.slds-dropdown__item a[data-name="' + name + '"]');
		return a && a.parentElement;
	},

	/**
	 * Returns the currently selected (i.e. highlighted) object switcher menu item or undefined if
	 * no item is currently selected
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The selected item or undefined if no item is selected
	 */
	getObjectSwitcherSelectedItem: function(component) {
		var objectSwitcher = this.getObjectSwitcher(component);
		if (!objectSwitcher) {
			return undefined;
		}

		var item = objectSwitcher.querySelector('.slds-dropdown__item.slds-is-selected');
		return item;
	},

	/**
	 * Set the selected object switcher menu item
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {HTMLElement}    item      - The selected item
	 *
	 * @return {void}
	 */
	setObjectSwitcherSelectedItem: function(component, item) {
		var items = this.getObjectSwitcherItems(component);
		for (var i = 0, n = items.length; i < n; i++) {
			if (items[i] === item) {
				$A.util.addClass(items[i], 'slds-is-selected');
			} else {
				$A.util.removeClass(items[i], 'slds-is-selected');
			}
		}
	},

	/**
	 * Returns the specified object switcher menu item's name. The name contains the S-Object type
	 * that the item represents
	 *
	 * @param {HTMLElement} item - The menu item
	 *
	 * @return {string} The item's name
	 */
	getObjectSwitcherItemName: function(item) {
		if (item) {
			var a = item.querySelector('a[data-name]');
			if (a) {
				return a.getAttribute('data-name');
			}
		}
		return undefined;
	},

	/**
	 * Selects the next item in the object switcher menu wrapping around to the top of the menu if
	 * necessary
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectNextObjectSwitcherItem: function(component) {
		var items = this.getObjectSwitcherItems(component);

		var selected = this.getObjectSwitcherSelectedItem(component);
		if (selected) {
			var index = this.utils.findIndex(items, function(item) {
				return item === selected;
			});

			if (index === -1) {
				index = 0;
			} else {
				index++;
				if (index >= items.length) {
					index = 0;
				}
			}

			this.setObjectSwitcherSelectedItem(component, items[index]);
		} else {
			this.setObjectSwitcherSelectedItem(component, items[0]);
		}
	},

	/**
	 * Selects the previous item in the object switcher menu wrapping around to the bottom of the
	 * menu if necessary
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectPreviousObjectSwitcherItem: function(component) {
		var items = this.getObjectSwitcherItems(component);

		var selected = this.getObjectSwitcherSelectedItem(component);
		if (selected) {
			var index = this.utils.findIndex(items, function(item) {
				return item === selected;
			});

			if (index === -1) {
				index = items.length - 1;
			} else {
				index--;
				if (index < 0) {
					index = items.length - 1;
				}
			}

			this.setObjectSwitcherSelectedItem(component, items[index]);
		} else {
			this.setObjectSwitcherSelectedItem(component, items[0]);
		}
	},

	/**
	 * Set the selected search object. If the component supports multiple types this will be the
	 * type chosen from the object switcher. If the component supports only a single type then this
	 * will be that supported type
	 *
	 * @param {Aura.Component} component    - The inputLookup component
	 * @param {Object}         searchObject - The selected search object
	 *
	 * @return {Promise} A Promise object. This method causes recent items to be reloaded and the
	 *                   Promise returned can be used to determine when the records have loaded
	 */
	setSelectedSearchObject: function(component, searchObject) {
		if (searchObject === component.get('v.selectedSearchObject')) {
			return Promise.resolve();
		}

		component.set('v.selectedSearchObject', searchObject);

		return this.loadRecentItems(component);
	},

	/**
	 * Returns a search object by name
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - Name of the search object to return
	 *
	 * @return {Object} The search object with the specified name or undefined if no match was found
	 */
	getSearchObjectByName: function(component, name) {
		var searchObjects = component.get('v.searchObjects');
		return this.utils.find(searchObjects, function(searchObject) {
			return searchObject.name === name;
		});
	},

	/**
	 * Returns an object specification string for the specified search object. See the
	 * LtngSearchObject Apex class for more information on this syntax
	 *
	 * @param {Object} searchObject - The search object
	 *
	 * @return {string} An object specification string
	 */
	getSearchObjectSpec: function(searchObject) {
		if (!searchObject) {
			return '';
		}

		var spec = searchObject.name;
		spec += ' AS \'' + searchObject.label + '\'|\'' + searchObject.labelPlural + '\'';
		if (searchObject.iconName) {
			spec += ' USE ICON \'' + searchObject.iconName + '\'';
		}
		if (!searchObject.withSharing) {
			spec += ' WITHOUT SHARING';
		}
		spec += ' SELECT (';
		for (var i = 0, n = searchObject.fields.length; i < n; i++) {
			var field = searchObject.fields[i];
			if (i > 0) {
				spec += ', ';
			}
			spec += field.name;
			spec += ' AS \'' + field.label + '\'';
			if (field.important) {
				spec += ' IMPORTANT';
			} else if (field.hidden) {
				spec += ' HIDDEN';
			}
		}
		spec += ')';
		if (searchObject.filter) {
			spec += ' WHERE ' + searchObject.filter;
		}
		return spec;
	},

	/**
	 * Returns a record from the list of recent items by ID
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         recordId  - The ID of the record to return
	 *
	 * @return {Object} The record with the specified ID or undefined if not found
	 */
	getRecentItemById: function(component, recordId) {
		var records = component.get('v.recentItems');
		return this.utils.find(records, function(record) {
			return record.recordId === recordId;
		});
	},

	/**
	 * Returns a record from the list of lookup items by ID
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         recordId  - The ID of the record to return
	 *
	 * @return {Object} The record with the specified ID or undefined if not found
	 */
	getLookupItemById: function(component, recordId) {
		var records = component.get('v.lookupItems');
		return this.utils.find(records, function(record) {
			return record.recordId === recordId;
		});
	},

	/**
	 * Returns a record from the list of selected records by ID
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         recordId  - The ID of the record to return
	 *
	 * @return {Object} The record with the specified ID or undefined if not found
	 */
	getRecordById: function(component, recordId) {
		var records = component.get('v.records') || [];
		return this.utils.find(records, function(record) {
			return record.recordId === recordId;
		});
	},

	/**
	 * Performs the search after a short delay. This method is called each time the user enters some
	 * text into the input element. In this method we use setTimeout() to wait a short time and then
	 * execute the search. If startSearchAfterDelay() is called before the search is executed then
	 * the delay is reset. This allows us to wait until the user has finished entering text instead
	 * of executing the query for every key press
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The search text
	 *
	 * @return {void}
	 */
	startSearchAfterDelay: function(component, searchText) {
		var self = this;
		self.cancelSearch(component);

		searchText = self.utils.trim(searchText);

		component.searchTimeout = setTimeout($A.getCallback(function() {
			component.searchTimeout = undefined;

			if (searchText === component.get('v.searchText')) {
				return;
			}
			//component.set('v.searchText', searchText);

			self.loadLookupItems(component, searchText).then($A.getCallback(function() {
				self.openMenuIfNotEmpty(component);
				self.closeMenuIfEmpty(component);
			}));
		}), 300);
	},

	/**
	 * Cancel pending search
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	cancelSearch: function(component) {
		if (component.searchTimeout) {
			clearTimeout(component.searchTimeout);
			component.searchTimeout = undefined;
		}
	},

	/**
	 * Gets the HTML element with the .slds-combobox style
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The combobox element
	 */
	getCombobox: function(component) {
		var combobox = component.find('combobox');
		if (combobox) {
			return combobox.getElement();
		}
		return undefined;
	},

	/**
	 * Gets the HTML element that represents the lookup menu
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The lookup menu element
	 */
	getMenu: function(component) {
		var menu = component.find('menu');
		if (menu) {
			return menu.getElement();
		}
		return undefined;
	},

	/**
	 * Return the list of lookup menu items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {NodeList} The lookup menu items
	 */
	getMenuItems: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return [];
		}

		var items = menu.querySelectorAll('.slds-listbox__item:not(.slds-hide)');
		return items;
	},

	/**
	 * Returns the selected lookup menu item or undefined if no item is selected
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The selected lookup menu item or undefined if no item is selected
	 */
	getMenuSelectedItem: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return undefined;
		}

		var item = menu.querySelector('.slds-listbox__item.slds-is-selected');
		return item;
	},

	/**
	 * Sets the selected lookup menu item
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {HTMLElement}    item      - The selected item
	 *
	 * @return {void}
	 */
	setMenuSelectedItem: function(component, item) {
		var items = this.getMenuItems(component);
		for (var i = 0, n = items.length; i < n; i++) {
			if (items[i] === item) {
				$A.util.addClass(items[i], 'slds-is-selected');
			} else {
				$A.util.removeClass(items[i], 'slds-is-selected');
			}
		}
	},

	/**
	 * Returns the lookup menu items which represent recent items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {NodeList} The recent item menu items
	 */
	getMenuRecentItems: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return [];
		}

		var items = menu.querySelectorAll('.slds-listbox__item.item-type-recent');
		return items;
	},

	/**
	 * Returns the lookup menu items which represent search results
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {NodeList} The search result menu items
	 */
	getMenuLookupItems: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return [];
		}

		var items = menu.querySelectorAll('slds-listbox__item.is-item-type-lookup');
		return items;
	},

	/**
	 * Returns the lookup menu item which is used to execute an advanced search
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The search menu item
	 */
	getMenuSearchItem: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return undefined;
		}

		var item = menu.querySelector('.slds-listbox__item.item-type-search');
		return item;
	},

	/**
	 * Returns the lookup menu item which is used to add a new record
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The add menu item
	 */
	getMenuAddItem: function(component) {
		var menu = this.getMenu(component);
		if (!menu) {
			return undefined;
		}

		var item = menu.querySelector('.slds-listbox__item.item-type-add');
		return item;
	},

	/**
	 * Returns true if the lookup menu is open; otherwise, false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the lookup menu is open; otherwise, false
	 */
	isMenuOpen: function(component) {
		var combobox = this.getCombobox(component);
		if (combobox) {
			return $A.util.hasClass(combobox, 'slds-is-open');
		} else {
			return false;
		}
	},

	/**
	 * Opens the lookup menu
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was opened; otherwise, false
	 */
	openMenu: function(component) {
		var combobox = this.getCombobox(component);
		if (!combobox) {
			return false;
		}

		this.setMenuSelectedItem(component, undefined);

		$A.util.addClass(combobox, 'slds-is-open');
		combobox.setAttribute('aria-expanded', 'true');

		return true;
	},

	/**
	 * Closes the lookup menu
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was closed; otherwise, false
	 */
	closeMenu: function(component) {
		var combobox = this.getCombobox(component);
		if (!combobox) {
			return false;
		}

		$A.util.removeClass(combobox, 'slds-is-open');
		combobox.setAttribute('aria-expanded', 'false');

		return true;
	},

	/**
	 * Opens the lookup menu if there is at least one visible menu item
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was opened; otherwise, falsee
	 */
	openMenuIfNotEmpty: function(component) {
		var items = this.getMenuItems(component);
		if (items.length > 0) {
			return this.openMenu(component);
		} else {
			return false;
		}
	},

	/**
	 * Closes the lookup menu if there are no visible menu items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was closed; otherwise, false
	 */
	closeMenuIfEmpty: function(component) {
		var items = this.getMenuItems(component);
		if (items.length === 0) {
			return this.closeMenu(component);
		} else {
			return false;
		}
	},

	/**
	 * Returns true if the specified item is visible; otherwise, false. This method does not check
	 * whether the item is physically visible - it only checks for the existence of the .slds-hide
	 * CSS class
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {boolean} true if the item is visible; otherwise, false
	 */
	isMenuItemVisible: function(item) {
		if (!item) {
			return false;
		}
		return $A.util.hasClass(item, 'slds-hide') ? false : true;
	},

	/**
	 * Shows the item
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {boolean} true if the item was shown; otherwise, false
	 */
	showMenuItem: function(item) {
		if (!item) {
			return false;
		}
		$A.util.removeClass(item, 'slds-hide');
		return true;
	},

	/**
	 * Hids the item
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {boolean} true if the item was hidden; otherwise, false
	 */
	hideMenuItem: function(item) {
		if (!item) {
			return false;
		}
		$A.util.addClass(item, 'slds-hide');
		$A.util.removeClass(item, 'slds-is-selected');
		return true;
	},

	/**
	 * Toggles an item's visibility. If the item is visible then it will be hidden. If the item is
	 * hidden it will be shown
	 *
	 * @param {HTMLElement} item     - The menu item element
	 * @param {boolean}     [toggle] - If true item will be shown, if false the item will be hidden
	 *                                 and if no value specified then the item's visibility will be
	 *                                 toggled
	 *
	 * @return {boolean} true if the item's visibility was toggled; otherwise, false
	 */
	toggleMenuItem: function(item, toggle) {
		if (this.utils.isUndefined(toggle)) {
			toggle = !this.isMenuItemVisible(item);
		}

		if (toggle) {
			return this.showMenuItem(item);
		} else {
			return this.hideMenuItem(item);
		}
	},

	/**
	 * Shows the lookup menu items
	 *
	 * @param {NodeList|HTMLElement[]} items - The items to show
	 *
	 * @return {void}
	 */
	showMenuItems: function(items) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.showMenuItem(items[i]);
		}
	},

	/**
	 * Hides the lookup menu items
	 *
	 * @param {NoeList|HTMLElement[]} items - The items to hide
	 *
	 * @return {void}
	 */
	hideMenuItems: function(items) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.hideMenuItem(items[i]);
		}
	},

	/**
	 * Shows or hides lookup menu items
	 *
	 * @param {NodeList|HTMLElement[]} items    - The lookup menu items
	 * @param {boolean}                [toggle] - If true the items will be shown. If false the
	 *                                            items will be hidden. If not specified the items'
	 *                                            visibility will be toggled
	 *
	 * @return {void}
	 */
	toggleMenuItems: function(items, toggle) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.toggleMenuItem(items[i], toggle);
		}
	},

	/**
	 * Sets the visibility of the search lookup menu item based on the current search text. If the
	 * user has entered 2 or more characters then the item is displayed; otherwise it is hidden.
	 * Also, the item will only be made visible if the component's allowsearch attribute is true
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showMenuSearchItemIfSearchTextLongerThanOneChar: function(component) {
		var allowSearch = component.get('v.allowsearch');
		var searchText = this.utils.trim(component.get('v.searchText'));
		var searchTextLength = this.getSearchTextLength(searchText);

		var item = this.getMenuSearchItem(component);
		this.toggleMenuItem(item, allowSearch && (searchTextLength >= this.MIN_SEARCH_TEXT_LENGTH));
	},

	/**
	 * Sets the visibility of the menu items that show recent items. Recent items are only displayed
	 * when the search text length is 0
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showMenuRecentItemsIfSearchTextIsEmpty: function(component) {
		var searchText = this.utils.trim(component.get('v.searchText'));
		var searchTextLength = this.getSearchTextLength(searchText);

		var items = this.getMenuRecentItems(component);
		this.toggleMenuItems(items, searchTextLength == 0);
	},

	/**
	 * Sets the visibility of the menu items that show search results. Search result items are only
	 * displayed when the search text length is greater than 0
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showMenuLookupItemsIfSearchTextIsNotEmpty: function(component) {
		var searchText = this.utils.trim(component.get('v.searchText'));
		var searchTextLength = this.getSearchTextLength(searchText);

		var items = this.getMenuLookupItems(component);
		this.toggleMenuItems(items, searchTextLength > 0);
	},

	/**
	 * Highlights the next available item in the lookup menu wrapping back around to the top of the
	 * menu if necessary. If no item is currently highlighted then the first item is used
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectNextMenuItem: function(component) {
		var items = this.getMenuItems(component);

		var selected = this.getMenuSelectedItem(component);
		if (selected) {
			var index = this.utils.findIndex(items, function(item) {
				return item === selected;
			});

			if (index === -1) {
				index = 0;
			} else {
				index++;
				if (index >= items.length) {
					index = 0;
				}
			}

			this.setMenuSelectedItem(component, items[index]);
		} else {
			this.setMenuSelectedItem(component, items[0]);
		}
	},

	/**
	 * Highlights the previous item in the lookup menu wrapping around to the bottom of the menu if
	 * necessary. If no item is currently highlighted then the first item is used
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectPreviousMenuItem: function(component) {
		var items = this.getMenuItems(component);

		var selected = this.getMenuSelectedItem(component);
		if (selected) {
			var index = this.utils.findIndex(items, function(item) {
				return item === selected;
			});

			if (index === -1) {
				index = items.length - 1;
			} else {
				index--;
				if (index < 0) {
					index = items.length - 1;
				}
			}

			this.setMenuSelectedItem(component, items[index]);
		} else {
			this.setMenuSelectedItem(component, items[0]);
		}
	},

	/**
	 * Opens the search modal
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	openSearchModal: function(component) {
		var label = component.get('v.label');
		var selectedSearchObject = component.get('v.selectedSearchObject');
		var searchText = this.utils.trim(component.get('v.searchText'));
		var searchTextLength = this.getSearchTextLength(searchText);
		var recordIds = component.get('v.values') || [];
		if (!selectedSearchObject || (searchTextLength < this.MIN_SEARCH_TEXT_LENGTH)) {
			return;
		}

		component.find('searchModal').open(
			label,
			this.getSearchObjectSpec(selectedSearchObject),
			searchText,
			recordIds
		);
	},

	/**
	 * Loads search objects asynchronously
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Promise} A Promise that returns the search objects if resolved
	 */
	loadSearchObjects: function(component) {
		var self = this;
		var specs = component.get('v.types') || [];
		var recordIds = component.get('v.values') || [];

		component.set('v.loadingSearchObjects', true);

		return new Promise(function(resolve, reject) {
			self.apex(component, 'getSearchObjects', {
				params: {
					specs: specs,
					recordIds: recordIds
				},
				success: resolve,
				failure: reject
			});
		}).then($A.getCallback(function(result) {
			var searchObjects = result.slice(0);
			searchObjects.sort(function(a, b) {
				if (a.labelPlural < b.labelPlural) {
					return -1;
				} else if (a.labelPlural > b.labelPlural) {
					return 1;
				} else {
					return 0;
				}
			});

			var selectedSearchObject;
			if (searchObjects.length > 0) {
				selectedSearchObject = searchObjects[0];
			}

			component.set('v.searchObjects', searchObjects);
			component.set('v.selectedSearchObject', selectedSearchObject);
			component.set('v.loadingSearchObjects', false);
		})).catch($A.getCallback(function(error) {
			component.set('v.loadingSearchObjects', false);
			self.onError(component, 'Error in loadSearchObjects', error);
		}));
	},

	/**
	 * Loads recent items asynchronously
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Promise} A Promise that returns the recent items if resolved
	 */
	loadRecentItems: function(component) {
		var self = this;
		var selectedSearchObject = component.get('v.selectedSearchObject');

		var p;
		if (selectedSearchObject) {
			component.set('v.loadingRecentItems', true);

			p = new Promise(function(resolve, reject) {
				self.apex(component, 'getRecentItems', {
					params: {
						spec: self.getSearchObjectSpec(selectedSearchObject),
						howMany: 5
					},
					success: resolve,
					failure: reject
				});
			});
		} else {
			p = Promise.resolve([]);
		}

		return p.then($A.getCallback(function(result) {
			var recentItems = self.transformRecords(component, result);
			component.set('v.recentItems', recentItems);
			component.set('v.loadingRecentItems', false);
		})).catch($A.getCallback(function(error) {
			component.set('v.loadingRecentItems', false);
			self.onError(component, 'Error in loadRecentItems', error);
		}));
	},

	/**
	 * Loads lookup items asynchronously
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The search text
	 *
	 * @return {Promise} A Promise that returns the lookup items if resolved
	 */
	loadLookupItems: function(component, searchText) {
		var self = this;
		var selectedSearchObject = component.get('v.selectedSearchObject');
		var recordIds = component.get('v.values') || [];
		var searchTextLength = self.getSearchTextLength(searchText);

		var p;
		if (selectedSearchObject && (searchTextLength >= self.MIN_SEARCH_TEXT_LENGTH)) {
			component.set('v.loadingLookupItems', true);

			p = new Promise(function(resolve, reject) {
				self.apex(component, 'getLookupItems', {
					params: {
						spec: self.getSearchObjectSpec(selectedSearchObject),
						searchText: searchText,
						recordIds: recordIds,
						howMany: 5
					},
					success: resolve,
					failure: reject
				});
			});
		} else {
			p = Promise.resolve([]);
		}

		return p.then($A.getCallback(function(result) {
			var lookupItems = self.transformRecords(component, result);

			component.set('v.searchText', searchText);
			component.set('v.lookupItems', lookupItems);
			component.set('v.loadingLookupItems', false);

			self.handleSearchTextChange(component);
		})).catch($A.getCallback(function(error) {
			component.set('v.loadingLookupItems', false);
			self.onError(component, 'Error in loadLookupItems', error);
		}));
	},

	/**
	 * Loads selected records asynchronously
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Promise} A Promise that returns the selected records if resolved
	 */
	loadRecords: function(component) {
		var self = this;
		var specs = component.get('v.types') || [];
		var recordIds = component.get('v.values') || [];

		var p;
		if (!self.utils.isEmpty(specs) && !self.utils.isEmpty(recordIds)) {
			component.set('v.loadingRecords', true);

			p = new Promise(function(resolve, reject) {
				self.apex(component, 'getRecords', {
					params: {
						specs: specs,
						recordIds: recordIds
					},
					success: resolve,
					failure: reject
				});
			});
		} else {
			p = Promise.resolve([]);
		}

		return p.then($A.getCallback(function(result) {
			var records = self.transformRecords(component, result);
			records.sort(function(a, b) {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			});

			component.set('v.records', records);
			component.set('v.loadingRecords', false);
		})).catch($A.getCallback(function(error) {
			component.set('v.loadingRecords', false);
			self.onError(component, 'Error in loadRecords', error);
		}));
	},

	/**
	 * The handleTypesChange() method should be called whenever the type or types attribute is
	 * changed
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Promise} A Promise that is resolved when search objects, recent items and selected
	 *                   records are reloaded
	 */
	handleTypesChange: function(component) {
		var self = this;
		return self
			.loadSearchObjects(component)
			.then($A.getCallback(function() {
				return Promise.all([
					self.loadRecentItems(component),
					self.loadRecords(component)
				]);
			}));
	},

	/**
	 * The handleValuesChange() method should be called whenever the value or values attribute is
	 * changed
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Promise} A Promise that is resolved when search objects, recent items and selected
	 *                   records are reloaded
	 */
	handleValuesChange: function(component) {
		var values = component.get('v.values') || [];
		var multiple = component.get('v.multiple');
		if ((values.length > 1) && !multiple) {
			component.set('v.multiple', true);
		}

		var self = this;
		return self
			.loadSearchObjects(component)
			.then($A.getCallback(function() {
				return Promise.all([
					self.loadRecentItems(component),
					self.loadRecords(component)
				]);
			}));
	},

	/**
	 * The handleSearchTextChange() method should be called whenever the searchText attribute is
	 * changed
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	handleSearchTextChange: function(component) {
		this.showMenuSearchItemIfSearchTextLongerThanOneChar(component);
		this.showMenuRecentItemsIfSearchTextIsEmpty(component);
		this.showMenuLookupItemsIfSearchTextIsNotEmpty(component);
	},

	/**
	 * Handle object switcher menu item click
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {HTMLElement}    item      - The clicked item
	 *
	 * @return {void}
	 */
	handleObjectSwitcherItemClick: function(component, item) {
		var name = this.getObjectSwitcherItemName(item);
		var searchObject = this.getSearchObjectByName(component, name);

		this.reset(component);
		this.setSelectedSearchObject(component, searchObject);
	},

	/**
	 * Handle lookup menu item click
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {HTMLElement}    item      - The clicked item
	 *
	 * @return {void}
	 */
	handleMenuItemClick: function(component, item) {
		var type = item.getAttribute('data-type');
		var recordId = item.getAttribute('data-recordid');
		var record;

		switch (type) {
			case 'search':
				this.openSearchModal(component);
				this.reset(component);
				break;

			case 'item-recent':
				record = this.getRecentItemById(component, recordId);

				this.select(component, record);
				this.reset(component);
				this.focusInputElementAfterRender(component);
				break;

			case 'item-lookup':
				record = this.getLookupItemById(component, recordId);

				this.select(component, record);
				this.reset(component);
				this.focusInputElementAfterRender(component);
				break;

			case 'add':
				this.reset(component);
				this.fireEvent(component, 'onadd');
				break;
		}
	},

	/**
	 * Transform records returned from the server (LtngSearchRecord) into a structure used within
	 * this component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object[]}       records   - The records to transform
	 *
	 * @return {Object[]} The transformed records
	 */
	transformRecords: function(component, records) {
		var transformedRecords = [];
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var searchObject = this.getSearchObjectByName(component, record.typeName);

			var transformedRecord = this.utils.extend(true, {}, record);
			transformedRecord.type = searchObject;
			transformedRecord.fields = [];

			for (var j = 0; j < searchObject.fields.length; j++) {
				var field = searchObject.fields[j];
				var value = record.fields[field.name];

				transformedRecord.fields.push(this.utils.extend(true, {
					value: record.fields[field.name]
				}, field));
			}

			transformedRecords.push(transformedRecord);
		}
		return transformedRecords;
	},

	/**
	 * Converts records which have previously beeen transformed via the transformRecords() method
	 * back into their original form (LtngSearchRecord)
	 *
	 * @param {Object[]} records - The records to simplify
	 *
	 * @return {Object[]} The simplified records
	 */
	simplifyRecords: function(records) {
		var simplifiedRecords = [];
		if (records) {
			for (var i = 0; i < records.length; i++) {
				var record = records[i];

				var simplifiedRecord = this.utils.extend(true, {}, record);
				simplifiedRecord.fields = {};
				delete simplifiedRecord.type;

				for (var j = 0; j < record.fields.length; j++) {
					var field = record.fields[j];
					simplifiedRecord.fields[field.name] = field.value;
				}

				simplifiedRecords.push(simplifiedRecord);
			}
		}
		return simplifiedRecords;
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
		opts = this.utils.extend(opts, { context: this });
		component.find('apex').execute(component, name, opts);
	},

	/**
	 * Logs an error to the console
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         message   - A brief message or description of the error
	 * @param {Error}          error     - An Error object
	 *
	 * @return {void}
	 */
	onError: function(component, message, error) {
		var globalId = component.getGlobalId();
		var localId = component.getLocalId();
		var componentId = globalId + (localId ? ' (' + localId + ')' : '');
		console.error('inputLookup:' + componentId, message, error && error.message);
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputLookup component
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