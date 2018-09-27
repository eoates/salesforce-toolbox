/**************************************************************************************************
 * inputLookupObjectSwitcherHelper.js
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
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Returns the value of the types component attribute
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {Object[]} The value of the types component attribute
	 */
	getTypes: function(component) {
		return component.get('v.types');
	},

	/**
	 * Returns the value of the selectedType component attribute
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {Object} The value of the selectedType component attribute
	 */
	getSelectedType: function(component) {
		return component.get('v.selectedType');
	},

	/**
	 * Returns the name of the selected type
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {string} The name of the selected type or null if no type is selected
	 */
	getSelectedTypeName: function(component) {
		var selectedType = this.getSelectedType(component);
		return selectedType ? selectedType.name : null;
	},

	/**
	 * Returns a type by name. Search is case sensitive
	 *
	 * @param {Object[]} types - The list of available types
	 * @param {string}   name  - The name of the type to find
	 *
	 * @return {Object} The type with the specified name or null if there is no match
	 */
	findTypeByName: function(types, name) {
		return this.utils.find(types, function(type) {
			return type.name === name;
		});
	},

	/**
	 * Returns the object switcher HTML element
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {HTMLElement} The object switcher HTML element
	 */
	getObjectSwitcherElement: function(component) {
		var objectSwitcher = component.find('objectSwitcher');
		return objectSwitcher && objectSwitcher.getElement();
	},

	/**
	 * Returns true if the object switcher menu is open; otherwise, false
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {boolean} true if the object switcher is open; otherwise, false
	 */
	isObjectSwitcherOpen: function(component) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		return this.utils.hasClass(objectSwitcher, 'slds-is-open');
	},

	/**
	 * Opens the object switcher menu
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {boolean} true if the menu was opened; otherwise, false
	 */
	openObjectSwitcher: function(component) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		if (!objectSwitcher) {
			return false;
		}

		var selectedType = this.getSelectedType(component);
		if (selectedType) {
			var item = this.getObjectSwitcherItemByName(component, selectedType.name);
			this.setSelectedObjectSwitcherItem(component, item);
		}

		this.utils.addClass(objectSwitcher, 'slds-is-open');
		return true;
	},

	/**
	 * Closes the object switcher menu
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {boolean} true if the menu was closed; otherwise, false
	 */
	closeObjectSwitcher: function(component) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		if (!objectSwitcher) {
			return false;
		}

		this.setSelectedObjectSwitcherItem(component, null);

		this.utils.removeClass(objectSwitcher, 'slds-is-open');
		return true;
	},

	/**
	 * Toggles the state of the object switcher menu (i.e., opens the menu if it is closed or closes
	 * the menu if it is open)
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {void}
	 */
	toggleObjectSwitcher: function(component) {
		if (this.isObjectSwitcherOpen(component)) {
			this.closeObjectSwitcher(component);
		} else {
			this.openObjectSwitcher(component);
		}
	},

	/**
	 * Returns the list of items in the object switcher menu
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {HTMLElement[]} An array containing the menu items
	 */
	getObjectSwitcherItems: function(component) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		if (!objectSwitcher) {
			return [];
		}

		var items = objectSwitcher.querySelectorAll('.object-switcher-item');
		return Array.prototype.slice.call(items);
	},

	/**
	 * Returns the name of the specified menu item
	 *
	 * @param {HTMLElement} item - The menu item
	 *
	 * @return {string} The name of the item
	 */
	getObjectSwitcherItemName: function(item) {
		var name;
		if (item) {
			var a = item.querySelector('a[data-name]');
			if (a) {
				name = a.getAttribute('data-name');
			}
		}
		return name;
	},

	/**
	 * Returns the object switcher menu item with the specified name
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 * @param {string}         name      - The name of the menu item to find
	 *
	 * @return {HTMLElement} The menu item with the specified name or null if no match
	 */
	getObjectSwitcherItemByName: function(component, name) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		if (!objectSwitcher) {
			return null;
		}

		var a = objectSwitcher.querySelector('.object-switcher-item a[data-name="' + name + '"]');
		return a ? a.parentElement : null;
	},

	/**
	 * Returns the currently selected object switcher menu item
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {HTMLElement} The selected item or null if no item is selected
	 */
	getSelectedObjectSwitcherItem: function(component) {
		var objectSwitcher = this.getObjectSwitcherElement(component);
		if (!objectSwitcher) {
			return null;
		}

		var item = objectSwitcher.querySelector('.object-switcher-item.slds-has-focus');
		return item;
	},

	/**
	 * Sets the selected object switcher menu item
	 *
	 * @param {Aura.Component} component    - The inputLookupObjectSwitcher component
	 * @param {HTMLElement}    selectedItem - The selected item
	 *
	 * @return {void}
	 */
	setSelectedObjectSwitcherItem: function(component, selectedItem) {
		var items = this.getObjectSwitcherItems(component);
		var i, n, item, selected;
		for (i = 0, n = items.length; i < n; i++) {
			item = items[i];
			selected = (item === selectedItem);
			this.utils.toggleClass(item, 'slds-has-focus', selected);
		}
	},

	/**
	 * Selects the next item in the object switcher menu
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {void}
	 */
	selectPreviousObjectSwitcherItem: function(component) {
		var items = this.getObjectSwitcherItems(component);
		var selectedItem = this.getSelectedObjectSwitcherItem(component);
		if (selectedItem) {
			var index = items.indexOf(selectedItem);
			if (index === -1) {
				index = items.length - 1;
			} else {
				index--;
				if (index < 0) {
					index = items.length - 1;
				}
			}
			this.setSelectedObjectSwitcherItem(component, items[index]);
		} else {
			this.setSelectedObjectSwitcherItem(component, items[0]);
		}
	},

	/**
	 * Selects the previous item in the object switcher menu
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 *
	 * @return {void}
	 */
	selectNextObjectSwitcherItem: function(component) {
		var items = this.getObjectSwitcherItems(component);
		var selectedItem = this.getSelectedObjectSwitcherItem(component);
		if (selectedItem) {
			var index = items.indexOf(selectedItem);
			if (index === -1) {
				index = 0;
			} else {
				index++;
				if (index >= items.length) {
					index = 0;
				}
			}
			this.setSelectedObjectSwitcherItem(component, items[index]);
		} else {
			this.setSelectedObjectSwitcherItem(component, items[0]);
		}
	},

	/**
	 * Handles the click event for a menu item
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
	 * @param {HTMLElement}    item      - The item that was clicked
	 *
	 * @return {boolean} false if the item is the same as the selected item; otherwise, true
	 */
	handleObjectSwitcherItemClick: function(component, item) {
		var name = this.getObjectSwitcherItemName(item);
		var types = this.getTypes(component);
		var type = this.findTypeByName(types, name);

		if (name === this.getSelectedTypeName(component)) {
			return true;
		}

		this.fireEvent(component, 'onselect', {
			selectedType: type
		});

		return true;
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The inputLookupObjectSwitcher component
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