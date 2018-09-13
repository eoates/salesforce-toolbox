/**************************************************************************************************
 * inputLookupHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	/** Amount of time (in milliseconds) to wait after user input before performing a search */
	searchDelay: 300,

	/** Minimum number of characters that must be entered in order to search */
	minSearchTextLength: 3,

	/** Number of items displayed in the recent items list */
	numRecentItems: 5,

	/** Number of items displayed in the recent items list on mobile devices */
	numRecentItemsMobile: 25,

	/** Number of items returned by a search */
	numLookupItems: 5,

	/** Number of items returned by a search on mobile devices */
	numLookupItemsMobile: 25,

	/** Icon name to use when one is not specified and cannot be discovered */
	defaultIconName: 'standard:custom',

	/** Defaults for key standard objects */
	standardObjects: [
		{ name: 'Account', keyPrefix: '001', iconName: 'standard:account' },
		{ name: 'Approval', keyPrefix: '806', iconName: 'standard:approval' },
		{ name: 'CampaignMember', keyPrefix: '00v', iconName: 'standard:campaign_members' },
		{ name: 'Campaign', keyPrefix: '701', iconName: 'standard:campaign' },
		{ name: 'Case', keyPrefix: '500', iconName: 'standard:case' },
		{ name: 'Contact', keyPrefix: '003', iconName: 'standard:contact' },
		{ name: 'Document', keyPrefix: '015', iconName: 'standard:document' },
		{ name: 'Event', keyPrefix: '00U', iconName: 'standard:event' },
		{ name: 'Attachment', keyPrefix: '00P', iconName: 'standard:file' },
		{ name: 'Folder', keyPrefix: '00l', iconName: 'standard:folder' },
		{ name: 'Group', keyPrefix: '00G', iconName: 'standard:groups' },
		{ name: 'Lead', keyPrefix: '00Q', iconName: 'standard:lead' },
		{ name: 'Note', keyPrefix: '002', iconName: 'standard:note' },
		{ name: 'Opportunity', keyPrefix: '006', iconName: 'standard:opportunity' },
		{ name: 'Pricebook2', keyPrefix: '01s', iconName: 'standard:pricebook' },
		{ name: 'Product2', keyPrefix: '01t', iconName: 'standard:product' },
		{ name: 'Report', keyPrefix: '00O', iconName: 'standard:report' },
		{ name: 'Task', keyPrefix: '00T', iconName: 'standard:task' },
		{ name: 'User', keyPrefix: '005', iconName: 'standard:user', filter: 'IsActive = TRUE' }
	],

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
	 * Returns the value of the value attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object} The value of the value attribute
	 */
	getValue: function(component) {
		return component.get('v.value');
	},

	/**
	 * Returns the value of the values attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the values attribute
	 */
	getValues: function(component) {
		return component.get('v.values');
	},

	/**
	 * Returns the value of the types attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the types attribute
	 */
	getTypes: function(component) {
		return component.get('v.types');
	},

	/**
	 * Returns the value of the typeName attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The value of the typeName attribute
	 */
	getTypeName: function(component) {
		return this.utils.trim(component.get('v.typeName'));
	},

	/**
	 * Returns the value of the multiple attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} The value of the multiple attribute
	 */
	getMultiple: function(component) {
		return component.get('v.multiple');
	},

	/**
	 * Returns the value of the searchText attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The value of the searchText attribute
	 */
	getSearchText: function(component) {
		return this.utils.trim(component.get('v.searchText'));
	},

	/**
	 * Returns the value of the searchObjects attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the searchObjects attribute
	 */
	getSearchObjects: function(component) {
		return component.get('v.searchObjects');
	},

	/**
	 * Returns the value of the selectedSearchObject attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object} The value of the selectedSearchObject attribute
	 */
	getSelectedSearchObject: function(component) {
		return component.get('v.selectedSearchObject');
	},

	/**
	 * Returns the value of the recentItems attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the recentItems attribute
	 */
	getRecentItems: function(component) {
		return component.get('v.recentItems');
	},

	/**
	 * Returns the value of the lookupItems attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the lookupItems attribute
	 */
	getLookupItems: function(component) {
		return component.get('v.lookupItems');
	},

	/**
	 * Returns the value of the selectedItems attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object[]} The value of the selectedItems attribute
	 */
	getSelectedItems: function(component) {
		return component.get('v.selectedItems');
	},

	/**
	 * Returns the value of the workCounter attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {number} The value of the workCounter attribute
	 */
	getWorkCounter: function(component) {
		return component.get('v.workCounter');
	},

	/**
	 * Sets the value of the value attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object}         value     - The attribute value
	 *
	 * @return {void}
	 */
	setValue: function(component, value) {
		this.setComponentAttribute(component, 'value', value);
	},

	/**
	 * Sets the value of the values attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object[]}       values    - The attribute value
	 *
	 * @return {void}
	 */
	setValues: function(component, values) {
		this.setComponentAttribute(component, 'values', values);
	},

	/**
	 * Sets the value of the types attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object[]}       types     - The attribute value
	 *
	 * @return {void}
	 */
	setTypes: function(component, types) {
		this.setComponentAttribute(component, 'types', types);
	},

	/**
	 * Sets the value of the typeName attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         typeName  - The attribute value
	 *
	 * @return {void}
	 */
	setTypeName: function(component, typeName) {
		typeName = this.utils.trim(typeName);
		this.setComponentAttribute(component, 'typeName', typeName);
	},

	/**
	 * Sets the value of the multiple attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {boolean}        multiple  - The attribute value
	 *
	 * @return {void}
	 */
	setMultiple: function(component, multiple) {
		this.setComponentAttribute(component, 'multiple', multiple);
	},

	/**
	 * Sets the value of the searchText attribute
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The attribute value
	 *
	 * @return {void}
	 */
	setSearchText: function(component, searchText) {
		searchText = this.utils.trim(searchText);
		this.setComponentAttribute(component, 'searchText', searchText);
	},

	/**
	 * Sets the value of the searchObjects attribute
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {Object[]}       searchObjects - The attribute value
	 *
	 * @return {void}
	 */
	setSearchObjects: function(component, searchObjects) {
		var selectedSearchObjectName = this.getSelectedSearchObjectName(component);

		this.setComponentAttribute(component, 'searchObjects', searchObjects);
		this.setSelectedSearchObjectByName(component, selectedSearchObjectName);
	},

	/**
	 * Sets the value of the selectedSearchObject attribute
	 *
	 * @param {Aura.Component} component            - The inputLookup component
	 * @param {Object}         selectedSearchObject - The attribute value
	 *
	 * @return {void}
	 */
	setSelectedSearchObject: function(component, selectedSearchObject) {
		this.setComponentAttribute(component, 'selectedSearchObject', selectedSearchObject);
	},

	/**
	 * Sets the value of the recentItems attribute
	 *
	 * @param {Aura.Component} component   - The inputLookup component
	 * @param {Object[]}       recentItems - The attribute value
	 *
	 * @return {void}
	 */
	setRecentItems: function(component, recentItems) {
		this.setComponentAttribute(component, 'recentItems', recentItems);
	},

	/**
	 * Sets the value of the lookupItems attribute
	 *
	 * @param {Aura.Component} component   - The inputLookup component
	 * @param {Object[]}       lookupItems - The attribute value
	 *
	 * @return {void}
	 */
	setLookupItems: function(component, lookupItems) {
		this.setComponentAttribute(component, 'lookupItems', lookupItems);
	},

	/**
	 * Sets the value of the selectedItems attribute
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {Object[]}       selectedItems - The attribute value
	 *
	 * @return {void}
	 */
	setSelectedItems: function(component, selectedItems) {
		this.setComponentAttribute(component, 'selectedItems', selectedItems);
	},

	/**
	 * Sets the value of the workCounter attribute
	 *
	 * @param {Aura.Component} component   - The inputLookup component
	 * @param {number}         workCounter - The attribute value
	 *
	 * @return {void}
	 */
	setWorkCounter: function(component, workCounter) {
		this.setComponentAttribute(component, 'workCounter', workCounter);
	},

	/**
	 * Returns true if the specified attribute was set internally via setComponentAttribute() and
	 * its change handler should be ignored
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {string}         attributeName - The name of the attribute to check
	 *
	 * @return {boolean} If the specified attribute was set via setComponentAttribute() then true is
	 *                   returned; otherwise, false
	 */
	ignoreComponentAttributeChange: function(component, attributeName) {
		var ignoreFlagName = 'ignoreChange_' + attributeName;
		var ignoreFlagValue = !!component[ignoreFlagName];
		return ignoreFlagValue;
	},

	/**
	 * The handleComponentAttributeChange() method should be called from within a change handler for
	 * the specified attribute. If the attribute's change handler was fired as a result of calling
	 * setComponentAttribute() then this method does nothing. If the change was not because of
	 * setComponentAttribute(), however, then the provided handler function will be called
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {string}         attributeName - The name of the attribute that changed
	 * @param {Function}       handler       - A function that will be called in the event that the
	 *                                         attribute was not changed by setComponentAttribute()
	 *
	 * @return {void}
	 */
	handleComponentAttributeChange: function(component, attributeName, handler) {
		if (handler && !this.ignoreComponentAttributeChange(component, attributeName)) {
			var value = component.get('v.' + attributeName);
			handler(value);
		}
	},

	/**
	 * Sets the value of the specified attribute. The setComponentAttribute() also sets a temporary
	 * flag to indicate that any change handlers should ignore this change. This flag is then used
	 * by ignoreComponentAttributeChange() and handleComponentAttributeChange() to determine whether
	 * to handle the event
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {string}         attributeName - The name of the attribute to set
	 * @param {*}              value         - The attribute value
	 *
	 * @return {void}
	 */
	setComponentAttribute: function(component, attributeName, value) {
		var ignoreFlagName = 'ignoreChange_' + attributeName;
		var ignoreFlagValue = !!component[ignoreFlagName];

		component[ignoreFlagName] = true;
		try {
			component.set('v.' + attributeName, value);
		} finally {
			component[ignoreFlagName] = ignoreFlagValue;
		}
	},

	/**
	 * Returns true if the component is either disabled or read-only; otherwise, false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the component is disabled or read-only
	 */
	isDisabledOrReadOnly: function(component) {
		var disabled = component.get('v.disabled');
		var readOnly = component.get('v.readonly');
		return disabled || readOnly;
	},

	/**
	 * Initializes the value and values attribute. A user of this component should only specify a
	 * value for one attribute or the other. If a value is provided for the values attribute then
	 * the is used to set the value attribute. If no value is provided for the values attribute,
	 * however, then the value attribute is used to set the values attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	initValueAndValues: function(component) {
		var value = this.getValue(component);
		var values = this.getValues(component);
		if (!this.utils.isEmpty(values)) {
			this.setValueFromValues(component);
		} else if (!this.utils.isEmpty(value)) {
			this.setValuesFromValue(component);
		}
	},

	/**
	 * Uses the value of the values attribute to set the value attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	setValueFromValues: function(component) {
		var values = this.getValues(component);
		if (this.utils.isEmpty(values)) {
			this.setValue(component, undefined);
		} else if (this.utils.isArray(values)) {
			this.setValue(component, values[0]);
		} else {
			this.setValue(component, values);
		}
	},

	/**
	 * Uses the value of the value attribute to set the values attribute
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	setValuesFromValue: function(component) {
		var value = this.getValue(component);
		if (this.utils.isEmpty(value)) {
			this.setValues(component, []);
		} else if (this.utils.isArray(value)) {
			this.setValues(component, value);
		} else {
			this.setValues(component, [ value ]);
		}
	},

	/**
	 * Gets the name of the selected object type
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The name of the selected object type
	 */
	getSelectedSearchObjectName: function(component) {
		var selectedSearchObject = this.getSelectedSearchObject(component);
		return selectedSearchObject ? selectedSearchObject.name : undefined;
	},

	/**
	 * Sets the selected object type to the type with the specified name
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         name      - The name of the object type to use as the selected type
	 *
	 * @return {void}
	 */
	setSelectedSearchObjectByName: function(component, name) {
		var searchObjects, selectedSearchObject;

		searchObjects = this.getSearchObjects(component);
		if (this.utils.isEmpty(searchObjects)) {
			this.setSelectedSearchObject(component, undefined);
			return;
		}

		selectedSearchObject = this.findSearchObjectByName(searchObjects, name);
		if (!selectedSearchObject) {
			selectedSearchObject = searchObjects[0];
		}

		this.setSelectedSearchObject(component, selectedSearchObject);
	},

	/**
	 * Uses the value of the values attribute to create the array of selected items. The values
	 * attribute will be an array and each element in the array may be either a string or an object.
	 * String values are assumed to be a record ID and object values are assumed to have an "id"
	 * and "name" property
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	setSelectedItemsFromValues: function(component) {
		var multiple = this.getMultiple(component);
		var searchObjects = this.getSearchObjects(component);
		var values = this.getValues(component);
		var selectedItems = [];
		var i, n, value;
		var id, name;

		if (this.utils.isUndefinedOrNull(values)) {
			values = [];
		} else if (!this.utils.isArray(values)) {
			values = [ values ];
		}

		if (!multiple && (values.length > 1)) {
			values = values.slice(0, 1);
		}

		for (i = 0, n = values.length; i < n; i++) {
			value = values[i];

			if (this.utils.isString(value)) {
				id = this.utils.asID18(value);
				name = id;
			} else if (this.utils.isObject(value)) {
				id = this.utils.asID18(value.id);
				name = this.utils.trim(value.name) || id;
			} else {
				continue;
			}

			if (!id || this.findItemById(selectedItems, id)) {
				continue;
			}

			selectedItems.push({
				id: id,
				name: name
			});
		}

		this.sortItems(selectedItems);
		this.updateItemIconNames(selectedItems, searchObjects);
		this.setSelectedItems(component, selectedItems);

		this.setValues(component, selectedItems.map(function(item) {
			return item.id;
		}));
		this.setValueFromValues(component);
	},

	/**
	 * Uses the value of the types attribute to create the array of search objects. The types
	 * attribute contains an array with each element being either a string or an object. String
	 * values are assumed to be the API name of an S-Object. Object values should have, at a
	 * minimum, a name property which is the API name of an S-Object. Object values can have many
	 * other properties which allow users of the component to control behavior of the component
	 * when searching for records of that type. For the complete list of supported properties refer
	 * to the component's .auradoc file
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	setSearchObjectsFromTypes: function(component) {
		var types = this.getTypes(component);
		var typeName = this.getTypeName(component);
		var searchObjects = [];
		var i, n, type;
		var name, labelOverride, labelPluralOverride, keyPrefix;
		var iconNameOverride, iconUrl, iconClass;
		var fieldNames, filter;
		var withoutSharing, allowSearch, allowAdd, providerName;
		var standardObject;
		var defaults = this.getSearchObjectDefaults(component);

		if (this.utils.isUndefinedOrNull(types)) {
			types = [];
		} else if (!this.utils.isArray(types)) {
			types = [ types ];
		}

		if ((types.length === 0) && typeName) {
			types.push(typeName);
		}

		for (i = 0, n = types.length; i < n; i++) {
			type = types[i];

			if (!this.utils.isObject(type) && !this.utils.isString(type)) {
				continue;
			}

			if (this.utils.isString(type)) {
				type = {
					name: type
				};
			}

			name = this.utils.trim(type.name);
			if (!name || this.findSearchObjectByName(searchObjects, name)) {
				continue;
			}

			standardObject = this.findStandardObjectByName(name);
			if (standardObject) {
				type = this.utils.extend({}, defaults, standardObject, type);
			} else {
				type = this.utils.extend({}, defaults, type);
			}

			labelOverride = this.utils.trim(type.label);
			labelPluralOverride = this.utils.trim(type.labelPlural);
			keyPrefix = this.utils.trim(type.keyPrefix);
			iconNameOverride = this.utils.trim(type.iconName);
			iconUrl = this.utils.trim(type.iconUrl);
			iconClass = this.utils.trim(type.iconClass);
			fieldNames = this.utils.trim(type.fieldNames);
			filter = this.utils.trim(type.filter);
			withoutSharing = this.utils.asBoolean(type.withoutSharing);
			allowSearch = this.utils.asBoolean(type.allowSearch);
			allowAdd = this.utils.asBoolean(type.allowAdd);
			providerName = this.utils.trim(type.providerName);

			searchObjects.push({
				name: name,
				label: labelOverride || name,
				labelOverride: labelOverride,
				labelPlural: labelPluralOverride || labelOverride || name,
				labelPluralOverride: labelPluralOverride,
				keyPrefix: keyPrefix,
				iconName: iconNameOverride || this.defaultIconName,
				iconNameOverride: iconNameOverride,
				iconUrl: iconUrl,
				iconClass: iconClass,
				fieldNames: fieldNames,
				filter: filter,
				withoutSharing: withoutSharing,
				allowSearch: allowSearch,
				allowAdd: allowAdd,
				providerName: providerName
			});
		}

		this.sortSearchObjects(searchObjects, 'labelPlural');
		this.setSearchObjects(component, searchObjects);
	},

	/**
	 * Returns an object which contains the default property values for a search object. These
	 * values can be overridden at the type-level via the type and types attribute on the component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {Object} An object containing the default search object property values
	 */
	getSearchObjectDefaults: function(component) {
		var utils = this.utils,
			label = utils.trim(component.get('v.typeLabel')),
			labelPlural = utils.trim(component.get('v.typeLabelPlural')),
			iconName = utils.trim(component.get('v.iconName')),
			iconUrl = utils.trim(component.get('v.iconUrl')),
			iconClass = utils.trim(component.get('v.iconClass')),
			fieldNames = utils.trim(component.get('v.fieldNames')),
			filter = utils.trim(component.get('v.filter')),
			withoutSharing = utils.asBoolean(component.get('v.withoutSharing')),
			allowAdd = utils.asBoolean(component.get('v.allowAdd')),
			allowSearch = utils.asBoolean(component.get('v.allowSearch')),
			providerName = utils.trim(component.get('v.providerName')),
			defaults = {};

		var setDefault = function(key, value) {
			if (value) {
				defaults[key] = value;
			}
		};

		// If an iconUrl was specified check to see if it is a SLDS icon. If so use the icon
		// type and name to set the iconName
		if (iconUrl) {
			var icon = this.getIconInfo(iconUrl);
			if (icon) {
				iconName = icon.type + ':' + icon.name;
				iconUrl = '';
				iconClass = '';
			}
		}

		setDefault('label', label);
		setDefault('labelPlural', labelPlural);
		setDefault('iconName', iconName);
		setDefault('iconUrl', iconUrl);
		setDefault('iconClass', iconClass);
		setDefault('fieldNames', fieldNames);
		setDefault('filter', filter);
		setDefault('withoutSharing', withoutSharing);
		setDefault('allowAdd', allowAdd);
		setDefault('allowSearch', allowSearch);
		setDefault('providerName', providerName);

		return defaults;
	},

	/**
	 * Returns information about the icon. If the icon is a SLDS icon then an object is returned
	 * which contains the type and name of the icon. If the icon is not a SLDS icon, however, then
	 * undefined is returned
	 *
	 * @param {string} iconUrl - The URL of the icon
	 *
	 * @return {Object} An object with the type and name of the icon
	 */
	getIconInfo: function(iconUrl) {
		// First, check whether the icon URL references a SVG sprite
		// e.g., /_slds/icons/custom-sprite/svg/symbols.svg#custom32
		var pattern = /\/icons\/(.+)-sprite\/svg\/symbols\.svg#(.+)$/i;
		var match = iconUrl.match(pattern);
		if (!match) {
			// Next, check whether the icon URL references a PNG or SVG file directly
			// e.g., /_slds/icons/custom/custom32_60.png
			pattern = /\/icons\/([^/]+)\/(.+)(?:_\d+\.png|\.svg)$/i;
			match = iconUrl.match(pattern);

			// If still no match then exit
			if (!match) {
				return undefined;
			}
		}

		// Return the icon type and name
		var type = this.utils.trim(match[1]).toLowerCase();
		var name = this.utils.trim(match[2]).toLowerCase();
		name = name.replace(/_/g, '-');

		return {
			type: type,
			name: name
		};
	},

	/**
	 * Retrieves search objects from the server
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	loadSearchObjects: function(component) {
		var searchObjects = this.getSearchObjects(component);
		var names = searchObjects.map(function(searchObject) {
			return searchObject.name;
		});

		this.incrementWorkCounter(component);

		this.apex(component, 'getSObjects', {
			context: this,
			abortable: true,
			storable: true,
			params: {
				names: names
			},
			success: function(sobjects) {
				var i, n, sobject;
				var searchObject;

				for (i = 0, n = sobjects.length; i < n; i++) {
					sobject = sobjects[i];
					searchObject = this.findSearchObjectByName(searchObjects, sobject.name);
					searchObject.name = sobject.name;
					searchObject.iconName = searchObject.iconNameOverride || sobject.iconName
						|| this.defaultIconName;
					searchObject.keyPrefix = sobject.keyPrefix;
					searchObject.label = searchObject.labelOverride || sobject.label;
					searchObject.labelPlural = searchObject.labelPluralOverride
						|| sobject.labelPlural;
					searchObject.nameField = sobject.nameField;
					searchObject.createable = sobject.createable;
				}

				this.sortSearchObjects(searchObjects, 'labelPlural');
				this.setSearchObjects(component, searchObjects);
				this.setSelectedSearchObject(component, searchObjects[0]);
				this.updateAllItemIconNames(component);

				var searchText = this.getSearchText(component);
				if (searchText) {
					this.loadLookupItems(component, searchText);
				}
			},
			failure: function(error) {
				console.error('Unable to load S-Object type information: ' + error.message);
				this.setSearchObjects(component, []);
				this.setSelectedSearchObject(component, undefined);
				this.setRecentItems(component, []);
				this.setLookupItems(component, []);
			},
			complete: function() {
				this.decrementWorkCounter(component);
			}
		});
	},

	/**
	 * Retrieves recent items for the currently selected search object from the server
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {Function}       [callback] - An optional callback function to be called once the
	 *                                      items have been loaded
	 *
	 * @return {void}
	 */
	loadRecentItems: function(component, callback) {
		var selectedSearchObject = this.getSelectedSearchObject(component);
		if (!selectedSearchObject) {
			this.setRecentItems(component, []);
			if (callback) {
				callback.call(this);
			}
			return;
		}

		var howMany = this.numRecentItems;
		if (this.mobileEnabled(component)) {
			howMany = this.numRecentItemsMobile;
		}

		this.incrementWorkCounter(component);

		this.apex(component, 'getRecentItems', {
			context: this,
			abortable: true,
			storable: true,
			params: {
				sObjectName: selectedSearchObject.name,
				fieldNames: selectedSearchObject.fieldNames,
				filter: selectedSearchObject.filter,
				howMany: howMany,
				providerName: selectedSearchObject.providerName
			},
			success: function(items) {
				var searchObjects = this.getSearchObjects(component);

				this.removeItemsWithInvalidSObjectType(items, searchObjects);
				this.updateItemHighlightFields(items);
				this.updateItemIconNames(items, searchObjects);
				this.setRecentItems(component, items);
			},
			failure: function(error) {
				console.error('Unable to load recent items: ' + error.message);
				this.setRecentItems(component, []);
			},
			complete: function() {
				this.decrementWorkCounter(component);
				this.waitForRender(callback);
			}
		});
	},

	/**
	 * Retrieves items for the currently selected search object that match the given search text
	 * from the server
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The search text entered by the user
	 * @param {Function}       [callback] - An optional callback function to be called once the
	 *                                      items have been loaded
	 *
	 * @return {void}
	 */
	loadLookupItems: function(component, searchText, callback) {
		var selectedSearchObject = this.getSelectedSearchObject(component);
		if (!selectedSearchObject) {
			this.setLookupItems(component, []);
			return;
		}

		var simplifiedSearchText = this.stripSpecialChars(searchText);
		if (simplifiedSearchText.length < this.minSearchTextLength) {
			this.setLookupItems(component, []);
			if (callback) {
				callback.call(this);
			}
			return;
		}

		var howMany = this.numLookupItems;
		if (this.mobileEnabled(component)) {
			howMany = this.numLookupItemsMobile;
		}

		this.incrementWorkCounter(component);

		this.apex(component, 'getLookupItems', {
			context: this,
			abortable: true,
			params: {
				sObjectName: selectedSearchObject.name,
				fieldNames: selectedSearchObject.fieldNames,
				searchText: searchText,
				filter: selectedSearchObject.filter,
				withoutSharing: selectedSearchObject.withoutSharing,
				howMany: howMany,
				providerName: selectedSearchObject.providerName
			},
			success: function(items) {
				var searchObjects = this.getSearchObjects(component);

				this.updateItemHighlightFields(items);
				this.updateItemIconNames(items, searchObjects);
				this.setLookupItems(component, items);
			},
			failure: function(error) {
				console.error('Unable to load lookup items: ' + error.message);
				this.setLookupItems(component, []);
			},
			complete: function() {
				this.decrementWorkCounter(component);
				this.waitForRender(callback);
			}
		});
	},

	/**
	 * Retrieves the selected items from the server. Note that this method is called during
	 * during initialization before search objects may have been loaded. As a result, items may not
	 * have a name or icon property set until after the search objects are loaded
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	loadSelectedItems: function(component) {
		var selectedItems = this.getSelectedItems(component);
		var recordIds = selectedItems.map(function(item) {
			return item.id;
		});

		this.incrementWorkCounter(component);

		this.apex(component, 'getItems', {
			context: this,
			abortable: true,
			params: {
				recordIds: recordIds
			},
			success: function(items) {
				var searchObjects = this.getSearchObjects(component);

				this.sortItems(items);
				this.removeItemsWithInvalidSObjectType(items, searchObjects);
				this.updateItemIconNames(items, searchObjects);
				this.setSelectedItems(component, items);
			},
			complete: function() {
				this.decrementWorkCounter(component);
			}
		});
	},

	/**
	 * Cancels a pending search
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
	 * Waits a short period of time and then executes a search. The reason for the delay is because
	 * this method is called whenever a user changes the text in the input text box. We don't want
	 * to search every time they press a key so instead we wait a few milliseconds. If the method is
	 * called again before the search happens then the timer is reset
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The text entered by the user
	 * @param {boolean}        [force]    - If true the search will be performed even if searchText
	 *                                      has not changed
	 * @param {Function}       [callback] - An optional callback function that will be called once
	 *                                      the search is complete
	 *
	 * @return {void}
	 */
	startSearchAfterDelay: function(component, searchText, force, callback) {
		this.cancelSearch(component);

		searchText = this.utils.trim(searchText);

		var self = this;
		component.searchTimeout = setTimeout($A.getCallback(function() {
			if (!force) {
				var newSearchText = searchText.toLowerCase();
				var currentSearchText = self.getSearchText(component).toLowerCase();
				if (newSearchText === currentSearchText) {
					return;
				}
			}

			self.loadLookupItems(component, searchText, callback);
		}), this.searchDelay);
	},

	/**
	 * Returns the HTML input element. Note that if an item is selected and the multiple attribute
	 * is false this returns undefined because the input element is not rendered
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The HTML input element
	 */
	getSearchTextInputElement: function(component) {
		var searchTextInput = component.find('searchTextInput');
		return searchTextInput && searchTextInput.getElement();
	},

	/**
	 * Returns the text from the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The value of the input element
	 */
	getSearchTextInputValue: function(component) {
		var inputElement = this.getSearchTextInputElement(component);
		return inputElement ? inputElement.value : '';
	},

	/**
	 * Sets the text in the search text input element
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         value     - The value to set
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
	 * Disables autocomplete on the search text input element. We have to do this programmatically.
	 * Simply specifying autocomplete="off" in the markup does not work because the Aura framework
	 * renders this as autocomplete="true". Essentially, any non-empty value specified for the
	 * autocomplete attribute gets changed to "true" when the component is rendered
	 *
	 * @param {Aura.Component} component - The inputLookup component
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
	 * Gets the selected item input element. The selected item input element displays the name of
	 * the currently selected item when the multiple attribute is false. This input element is
	 * read-only
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The selected item input element
	 */
	getSelectedItemInputElement: function(component) {
		var selectedItemInput = component.find('selectedItemInput');
		return selectedItemInput && selectedItemInput.getElement();
	},

	/**
	 * Gets the rendered input element. If the multiple attribute is true or if no item is selected
	 * the search text input element will be returned; otherwise, the selected item input element
	 * will be returned
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The rendered input element
	 */
	getInputElement: function(component) {
		return this.getSearchTextInputElement(component)
			|| this.getSelectedItemInputElement(component);
	},

	/**
	 * Returns the element that represents the combobox. The combobox element has the slds-listbox
	 * CSS class
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The combobox element
	 */
	getComboboxElement: function(component) {
		var combobox = component.find('combobox');
		return combobox && combobox.getElement();
	},

	/**
	 * Returns the element that represents the dropdown menu. The menu element has the slds-listbox
	 * CSS class
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The menu element
	 */
	getMenuElement: function(component) {
		var menu = component.find('menu');
		return menu && menu.getElement();
	},

	/**
	 * Returns the menu item elements
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement[]} An array of menu item elements
	 */
	getMenuItems: function(component) {
		var menu = this.getMenuElement(component);
		if (!menu) {
			return [];
		}

		var items = menu.querySelectorAll('.lookup-menu-item');
		return Array.prototype.slice.call(items);
	},

	/**
	 * Returns the selectable menu item elements. Not all menu items are selectable such as the
	 * header that appears above the list of recent items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement[]} An array of selectable menu item elements
	 */
	getSelectableMenuItems: function(component) {
		var menu = this.getMenuElement(component);
		if (!menu) {
			return [];
		}

		var selector = '.lookup-menu-item:not(.slds-hide):not([data-selectable="false"])';
		var items = menu.querySelectorAll(selector);
		return Array.prototype.slice.call(items);
	},

	/**
	 * Returns the currently selected menu item element. If no menu item is selected then undefined
	 * is returned
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {HTMLElement} The selected menu item element or undefined if no item is selected
	 */
	getSelectedMenuItem: function(component) {
		var menu = this.getMenuElement(component);
		if (!menu) {
			return undefined;
		}

		var item = menu.querySelector('.lookup-menu-item.slds-has-focus');
		return item;
	},

	/**
	 * Selects the specified menu item
	 *
	 * @param {Aura.Component} component    - The inputLookup component
	 * @param {HTMLElement}    selectedItem - The menu item to select
	 *
	 * @return {void}
	 */
	setSelectedMenuItem: function(component, selectedItem) {
		var items = this.getMenuItems(component);
		var i, n, item, selected;
		for (i = 0, n = items.length; i < n; i++) {
			item = items[i];
			selected = (item === selectedItem);
			this.utils.toggleClass(item, 'is-selected slds-has-focus', selected);
		}

		var selectedItemId = selectedItem && selectedItem.id;
		var inputElement = this.getSearchTextInputElement(component);
		if (inputElement) {
			if (selectedItemId) {
				inputElement.setAttribute('aria-activedescendant', selectedItemId);
			} else {
				inputElement.removeAttribute('aria-activedescendant');
			}
		}
	},

	/**
	 * Returns a value that indicates whether the menu is open
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu is open; otherwise, false
	 */
	isMenuOpen: function(component) {
		var combobox = this.getComboboxElement(component);
		return this.utils.hasClass(combobox, 'slds-is-open');
	},

	/**
	 * Opens the menu
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was opened; otherwise, false
	 */
	openMenu: function(component) {
		var combobox = this.getComboboxElement(component);
		if (!combobox) {
			return false;
		}

		this.setSelectedMenuItem(component, undefined);

		this.utils.addClass(combobox, 'slds-is-open');
		combobox.setAttribute('aria-expanded', 'true');

		return true;
	},

	/**
	 * Closes the menu
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the menu was closed; otherwise, false
	 */
	closeMenu: function(component) {
		var combobox = this.getComboboxElement(component);
		if (!combobox) {
			return false;
		}

		this.setSelectedMenuItem(component, undefined);

		this.utils.removeClass(combobox, 'slds-is-open');
		combobox.setAttribute('aria-expanded', 'false');

		return true;
	},

	/**
	 * Toggles the open state of the menu. If the menu is opened then it will be closed and if it is
	 * closed then it will be opened
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	toggleMenu: function(component) {
		if (this.isMenuOpen(component)) {
			this.closeMenu(component);
		} else {
			this.openMenuIfNotEmpty(component);
			this.closeMenuIfEmpty(component);
		}
	},

	/**
	 * Opens the menu as long as there is at least one visible menu item
	 *
	 * @param {Aura.Component} component     - The inputLookup component
	 * @param {boolean}        [selectFirst] - If true then the first item will automatically be
	 *                                         selected
	 *
	 * @return {void}
	 */
	openMenuIfNotEmpty: function(component, selectFirst) {
		this.showMenuItemsBasedOnSearchText(component);

		var items = this.getSelectableMenuItems(component);
		if (items.length > 0) {
			this.openMenu(component, selectFirst);
			if (selectFirst) {
				this.setSelectedMenuItem(component, items[0]);
			}
		}
	},

	/**
	 * Closes the menu if there are no visible menu items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	closeMenuIfEmpty: function(component) {
		this.showMenuItemsBasedOnSearchText(component);

		var items = this.getSelectableMenuItems(component);
		if (items.length === 0) {
			this.closeMenu(component);
		}
	},

	/**
	 * Returns a value that indicates whether a menu item is visible
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {boolean} true if the menu item is visible; otherwise, false
	 */
	isMenuItemVisible: function(item) {
		return !this.utils.hasClass(item, 'slds-hide');
	},

	/**
	 * Shows a menu item
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {void}
	 */
	showMenuItem: function(item) {
		this.utils.removeClass(item, 'slds-hide');
	},

	/**
	 * Hides a menu item
	 *
	 * @param {HTMLElement} item - The menu item element
	 *
	 * @return {void}
	 */
	hideMenuItem: function(item) {
		this.utils.addClass(item, 'slds-hide');
	},

	/**
	 * Toggles the visibility of a menu item
	 *
	 * @param {HTMLElement} item     - The menu item element
	 * @param {boolean}     [toggle] - If true the menu item will be shown. If false the menu item
	 *                                 will be hidden. If not specified the menu item's visibility
	 *                                 will be toggled
	 */
	toggleMenuItem: function(item, toggle) {
		if (this.utils.isUndefinedOrNull(toggle)) {
			toggle = !this.isMenuItemVisible(item);
		}

		if (toggle) {
			this.showMenuItem(item);
		} else {
			this.hideMenuItem(item);
		}
	},

	/**
	 * Shows 1 or more menu items
	 *
	 * @param {HTMLElement[]} items - The menu item elements
	 *
	 * @return {void}
	 */
	showMenuItems: function(items) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.showMenuItem(items[i]);
		}
	},

	/**
	 * Hides 1 or more menu items
	 *
	 * @param {HTMLElement[]} items - The menu item elements
	 *
	 * @return {void}
	 */
	hideMenuItems: function(items) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.hideMenuItem(items[i]);
		}
	},

	/**
	 * Toggles the visibility of 1 or more menu items
	 *
	 * @param {HTMLElement[]} items    - The menu item elements
	 * @param {boolean}       [toggle] - If true the menu items will be shown. If false the menu
	 *                                   items will be hidden. If not specified then each menu
	 *                                   item's visibility will be toggled
	 *
	 * @return {void}
	 */
	toggleMenuItems: function(items, toggle) {
		for (var i = 0, n = items.length; i < n; i++) {
			this.toggleMenuItem(items[i], toggle);
		}
	},

	/**
	 * Shows or hides the menu item that allows the user to search based on the currently entered
	 * search text. For the search menu item to be visible the user must have entered at least 2
	 * characters and the selected object type must be allow searching
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showSearchMenuItem: function(component) {
		var selectedSearchObject = this.getSelectedSearchObject(component);
		var searchText = this.getSearchText(component);
		var simplifiedSearchText = this.stripSpecialChars(searchText);
		var menu = this.getMenuElement(component);
		if (!menu) {
			return;
		}

		var visible = false;
		if (selectedSearchObject) {
			visible = selectedSearchObject.allowSearch && (simplifiedSearchText.length > 1);
		}

		var item = menu.querySelector('.lookup-menu-item[data-category="search"]');
		this.toggleMenuItem(item, visible);
	},

	/**
	 * Shows or hides the recent item menu items. The recent item menu items are visible if the user
	 * has entered 3 or fewer characters
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showRecentMenuItems: function(component) {
		var searchText = this.getSearchText(component);
		var simplifiedSearchText = this.stripSpecialChars(searchText);
		var menu = this.getMenuElement(component);
		if (!menu) {
			return;
		}

		var items = menu.querySelectorAll('.lookup-menu-item[data-category="recent-items"]');
		this.toggleMenuItems(items, simplifiedSearchText.length < this.minSearchTextLength);
	},

	/**
	 * Shows or hides the lookup items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showLookupMenuItems: function(component) {
		var searchText = this.getSearchText(component);
		var menu = this.getMenuElement(component);
		if (!menu) {
			return;
		}

		var items = menu.querySelectorAll('.lookup-menu-item[data-category="lookup-items"]');
		this.toggleMenuItems(items, searchText.length > 0);
	},

	/**
	 * Shows or hides menu items based on the currently entered search text
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	showMenuItemsBasedOnSearchText: function(component) {
		this.showSearchMenuItem(component);
		this.showRecentMenuItems(component);
		this.showLookupMenuItems(component);
	},

	/**
	 * Selects the next menu item. If there is no selected item then the first item is selected
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectPreviousMenuItem: function(component) {
		var items = this.getSelectableMenuItems(component);
		var selectedItem = this.getSelectedMenuItem(component);
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
			this.setSelectedMenuItem(component, items[index]);
		} else {
			this.setSelectedMenuItem(component, items[0]);
		}
	},

	/**
	 * Selects the previous menu item. If there is no selected item then the first item is selected
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	selectNextMenuItem: function(component) {
		var items = this.getSelectableMenuItems(component);
		var selectedItem = this.getSelectedMenuItem(component);
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
			this.setSelectedMenuItem(component, items[index]);
		} else {
			this.setSelectedMenuItem(component, items[0]);
		}
	},

	/**
	 * Adds an item to the list of selected items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object}         item      - The item to add
	 *
	 * @return {boolean} true if the item was not already selected and was added to the list;
	 *                   otherwise, false
	 */
	addSelectedItem: function(component, item) {
		if (!item) {
			return false;
		}

		var multiple = this.getMultiple(component);
		var selectedItems = this.getSelectedItems(component);
		var selectedItem = this.findItemById(selectedItems, item.id);
		if (selectedItem) {
			return false;
		}

		if (!multiple) {
			selectedItems.splice(0, selectedItems.length);
		}
		selectedItems.push(this.utils.clone(item));

		this.sortItems(selectedItems);
		this.setSelectedItems(component, selectedItems);
		return true;
	},

	/**
	 * Adds an item to the list of selected items, updates the value and values attributes, and
	 * fires the onchange event
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {Object}         item      - The item to select
	 *
	 * @return {boolean} true if the item was not already selected and was added to the list;
	 *                   otherwise, false
	 */
	addSelectedItemAndUpdate: function(component, item) {
		this.cancelSearch(component);
		this.closeMenu(component);

		this.setSearchText(component, '');
		this.setSearchTextInputValue(component, '');

		if (!this.addSelectedItem(component, item)) {
			return false;
		}

		var multiple = this.getMultiple(component);
		var selectedItems = this.getSelectedItems(component);
		var values = selectedItems.map(function(selectedItem) {
			return selectedItem.id;
		});

		if (multiple) {
			this.setValue(component, values.length > 0 ? values[0] : undefined);
			this.setValues(component, values);
			this.fireEvent(component, 'onchange');
		} else {
			this.waitForRender(function() {
				component.focus();

				this.setValue(component, values.length > 0 ? values[0] : undefined);
				this.setValues(component, values);
				this.fireEvent(component, 'onchange');
			});
		}

		return true;
	},

	/**
	 * Removes an item from the list of selected items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         itemId    - The ID of the item to remove
	 *
	 * @return {boolean} true if the item was removed; otherwise, false. If false is returned it
	 *                   means the item was not previously selected
	 */
	removeSelectedItem: function(component, itemId) {
		var selectedItems = this.getSelectedItems(component);
		var selectedItem = this.findItemById(selectedItems, itemId);
		if (!selectedItem) {
			return false;
		}

		var index = selectedItems.indexOf(selectedItem);
		if (index === -1) {
			return false;
		}

		selectedItems.splice(index, 1);

		this.setSelectedItems(component, selectedItems);
		return true;
	},

	/**
	 * Increments the work counter by 1. Because multiple asynchronous operations may be occurring
	 * in parallel we use a counter instead of a simple boolean flag. When the counter is greater
	 * than 0 then a spinner is displayed and when the counter returns to 0 the spinner is hidden
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	incrementWorkCounter: function(component) {
		var workCounter = this.getWorkCounter(component);
		this.setWorkCounter(component, workCounter + 1);
	},

	/**
	 * Decrements the work counter by 1
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	decrementWorkCounter: function(component) {
		var workCounter = this.getWorkCounter(component);
		this.setWorkCounter(component, Math.max(workCounter - 1, 0));
	},

	/**
	 * Calls the provided callback function once the component has been rendered. This function
	 * uses setTimeout() internally as a way to wait for rending to complete
	 *
	 * @param {Function} callback - The callback function
	 *
	 * @return {void}
	 */
	waitForRender: function(callback) {
		var self = this;
		var args = Array.prototype.slice.call(arguments, 1);
		if (callback) {
			setTimeout($A.getCallback(function() {
				callback.apply(self, args);
			}), 0);
		}
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
	 * Sets the highlight field for the given items
	 *
	 * @param {Object[]} items - The items to update
	 *
	 * @return {void}
	 */
	updateItemHighlightFields: function(items) {
		var i, n, item;
		for (i = 0, n = items.length; i < n; i++) {
			item = items[i];
			this.updateItemHighlightField(item);
		}
	},

	/**
	 * Sets an item's highlight field. The highlight field is the field that is displayed below the
	 * the item's name in the dropdown menu
	 *
	 * @param {Object} item - The item to update
	 *
	 * @return {void}
	 */
	updateItemHighlightField: function(item) {
		var fields = item.fields;
		var i, n, field;
		var highlightField;
		var acceptedDataTypes = [
			'COMBOBOX', 'CURRENCY', 'DATE', 'DATETIME', 'DOUBLE', 'INTEGER', 'PERCENT', 'PHONE',
			'STRING', 'TIME'
		];

		// Skip the first 2 fields which will always be ID and the name field
		for (i = 2, n = fields.length; i < n; i++) {
			field = fields[i];
			if (acceptedDataTypes.indexOf(field.dataType) !== -1) {
				highlightField = field;
				break;
			}
		}

		item.highlightField = highlightField;
	},

	/**
	 * Updates the icon for all items. This includes recent items, lookup items, and selected items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	updateAllItemIconNames: function(component) {
		var searchObjects = this.getSearchObjects(component);

		var recentItems = this.getRecentItems(component);
		this.updateItemIconNames(recentItems, searchObjects);
		this.setRecentItems(component, recentItems);

		var lookupItems = this.getLookupItems(component);
		this.updateItemIconNames(lookupItems, searchObjects);
		this.setLookupItems(component, lookupItems);

		var selectedItems = this.getSelectedItems(component);
		this.updateItemIconNames(selectedItems, searchObjects);
		this.setSelectedItems(component, selectedItems);
	},

	/**
	 * Sets the icon property for the specified items
	 *
	 * @param {Object[]} items         - The items to update
	 * @param {Object[]} searchObjects - The search objects
	 *
	 * @return {void}
	 */
	updateItemIconNames: function(items, searchObjects) {
		var i, n, item;
		var keyPrefix, searchObject;
		var iconName, iconUrl, iconClass;

		for (i = 0, n = items.length; i < n; i++) {
			item = items[i];
			keyPrefix = item.id.substring(0, 3);
			searchObject = this.findSearchObjectByKeyPrefix(searchObjects, keyPrefix);
			iconName = searchObject && searchObject.iconName;
			iconUrl = searchObject && searchObject.iconUrl;
			iconClass = searchObject && searchObject.iconClass;

			item.iconName = iconName || 'standard:generic_loading';
			item.iconUrl = iconUrl;
			item.iconClass = iconClass;
		}
	},

	/**
	 * Removes all items from the given array which do not match one of the search object types
	 *
	 * @param {Object[]} items         - The array of items
	 * @param {Object[]} searchObjects - The search objects
	 *
	 * @return {number} The number of items removed from the array
	 */
	removeItemsWithInvalidSObjectType: function(items, searchObjects) {
		var i, item;
		var searchObject;
		var numRemoved = 0;

		for (i = (items.length - 1); i >= 0; i--) {
			item = items[i];
			searchObject = this.findSearchObjectByName(searchObjects, item.sObjectName);
			if (!searchObject) {
				items.splice(i, 1);
				numRemoved++;
			}
		}

		return numRemoved;
	},

	/**
	 * Sorts an array of items by name (case-insensitive)
	 *
	 * @param {Object[]} items - The items to sort
	 *
	 * @return {void}
	 */
	sortItems: function(items) {
		var utils = this.utils;

		items.sort(function(a, b) {
			var nameA = utils.trim(a.name).toLowerCase();
			var nameB = utils.trim(b.name).toLowerCase();
			if (nameA < nameB) {
				return -1;
			} else if (nameA > nameB) {
				return 1;
			} else {
				return 0;
			}
		});
	},

	/**
	 * Finds an item in array by ID. The search is case-insensitive
	 *
	 * @param {Object[]} items - The array of items to search
	 * @param {string}   id    - The ID of the item to find
	 *
	 * @return {Object} The item with the given ID or undefined if no match
	 */
	findItemById: function(items, id) {
		id = this.utils.trim(id).toLowerCase();

		return this.utils.find(items, function(item) {
			return item.id.toLowerCase() === id;
		});
	},

	/**
	 * Sorts an array of search objects
	 *
	 * @param {Object[]} searchObjects - The array of objects to sort
	 * @param {string}   [sortKey]     - The name of the property to use for sorting. If no value is
	 *                                   provided then the objects will be sorted by label
	 *
	 * @return {void}
	 */
	sortSearchObjects: function(searchObjects, sortKey) {
		var utils = this.utils;

		if (!sortKey) {
			sortKey = 'label';
		}

		searchObjects.sort(function(a, b) {
			var valueA = utils.trim(a[sortKey]).toLowerCase();
			var valueB = utils.trim(b[sortKey]).toLowerCase();
			if (valueA < valueB) {
				return -1;
			} else if (valueA > valueB) {
				return 1;
			} else {
				return 0;
			}
		});
	},

	/**
	 * Finds a search object in array with the given key prefix. The search is case-sensitive
	 *
	 * @param {Object[]} searchObjects - The array of objects to search
	 * @param {string}   keyPrefix     - The key prefix of the object to find
	 *
	 * @return {Object} The object with the given key prefix or undefined if no match
	 */
	findSearchObjectByKeyPrefix: function(searchObjects, keyPrefix) {
		return this.utils.find(searchObjects, function(searchObject) {
			return searchObject.keyPrefix === keyPrefix;
		});
	},

	/**
	 * Finds a search object in array with the given name. The search is case-insensitive
	 *
	 * @param {Object[]} searchObjects - The array of objects to search
	 * @param {string}   name          - The name of the object to find
	 *
	 * @return {Object} The object with the given name or undefined if no match
	 */
	findSearchObjectByName: function(searchObjects, name) {
		name = this.utils.trim(name).toLowerCase();

		return this.utils.find(searchObjects, function(searchObject) {
			return searchObject.name.toLowerCase() === name;
		});
	},

	/**
	 * Finds the standard object defaults by name. The search is case-insensitive
	 *
	 * @param {string} name - The name of the standard object
	 *
	 * @return {Object} The defaults for the named object or undefined if no match
	 */
	findStandardObjectByName: function(name) {
		name = this.utils.trim(name).toLowerCase();

		return this.utils.find(this.standardObjects, function(standardObject) {
			return standardObject.name.toLowerCase() === name;
		});
	},

	/**
	 * Handles menu item clicks. The action performed depends on which item was clicked
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {HTMLElement}    item      - The clicked menu item element
	 *
	 * @return {boolean} true if the event was handled; otherwise, false
	 */
	handleMenuItemClick: function(component, item) {
		if (this.utils.matchesSelector(item, '[data-selectable="false"]')) {
			return false;
		}

		var value = item.getAttribute('data-value');
		var category = item.getAttribute('data-category');
		var recentItems, lookupItems, selectedItem;
		var selectedSearchObject, searchText;

		switch (category) {
		case 'search':
			searchText = this.getSearchText(component);

			this.cancelSearch(component);
			this.closeMenu(component);

			this.setSearchText(component, '');
			this.setSearchTextInputValue(component, '');

			component.find('searchDialog').open(searchText);
			break;

		case 'recent-items':
			recentItems = this.getRecentItems(component);
			selectedItem = this.findItemById(recentItems, value);
			this.addSelectedItemAndUpdate(component, selectedItem);
			break;

		case 'lookup-items':
			lookupItems = this.getLookupItems(component);
			selectedItem = this.findItemById(lookupItems, value);
			this.addSelectedItemAndUpdate(component, selectedItem);
			break;

		case 'new-item':
			selectedSearchObject = this.getSelectedSearchObject(component);
			searchText = this.getSearchText(component);

			if (!selectedSearchObject || !selectedSearchObject.allowAdd) {
				return false;
			}

			this.cancelSearch(component);
			this.closeMenu(component);

			this.setSearchText(component, '');
			this.setSearchTextInputValue(component, '');

			this.fireEvent(component, 'onadd', {
				type: selectedSearchObject.name,
				text: searchText
			});
			break;
		}

		return true;
	},

	/**
	 * Handles click event for the remove button or when the user presses the DELETE or BACKSPACE
	 * key when the selected item input element has focus. This is only called when the multiple
	 * attribute is false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} Always returns true
	 */
	handleSelectedItemRemoveButtonClick: function(component) {
		this.setSearchText(component, '');
		this.setSearchTextInputValue(component, '');

		this.setSelectedItems(component, []);

		this.waitForRender(function() {
			component.focus();

			this.showMenuItemsBasedOnSearchText(component);
			this.openMenuIfNotEmpty(component);
			this.closeMenuIfEmpty(component);

			this.setValue(component, undefined);
			this.setValues(component, []);
			this.fireEvent(component, 'onchange');
		});

		return true;
	},

	/**
	 * Handles the click event for the remove button in selected item pills. This is only called
	 * when the multiple attribute is true
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 * @param {string}         itemId    - The ID of the item to remove
	 *
	 * @return {boolean} true if the event was handled; otherwise, false
	 */
	handleSelectedItemPillRemove: function(component, itemId) {
		if (!this.removeSelectedItem(component, itemId)) {
			return false;
		}

		var selectedItems = this.getSelectedItems(component);
		var values = selectedItems.map(function(selectedItem) {
			return selectedItem.id;
		});

		this.setValue(component, values.length > 0 ? values[0] : undefined);
		this.setValues(component, values);
		this.fireEvent(component, 'onchange');

		return true;
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
	},

	/**
	 * Returns true if the component should display a mobile-specific UI; otherwise, false. If
	 * the multiple attribute is true then mobileEnabled() will return false even when the current
	 * device is a mobile device as mobile multi-select lookups are not presently supported by this
	 * component
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the component should display a mobile-specific UI
	 */
	mobileEnabled: function(component) {
		var multiple = this.getMultiple(component);
		return this.utils.isMobile() && !multiple;
	},

	/**
	 * Sets the selected search object to the S-Object type of the selected item. If there is no
	 * selected item then the selected search object is not updated
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileResetSelectedSearchObject: function(component) {
		var selectedItems = this.getSelectedItems(component);
		if (selectedItems.length === 0) {
			return;
		}

		var sObjectName = selectedItems[0].sObjectName;
		if (sObjectName === this.getSelectedSearchObjectName(component)) {
			return;
		}

		this.setSelectedSearchObjectByName(component, sObjectName);
		this.setRecentItems(component, []);
		this.setLookupItems(component, []);
		this.loadRecentItems(component);
	},

	/**
	 * Returns true if the mobile search overlay is visible; otherwise, false
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {boolean} true if the mobile search overlay is visible; otherwise, false
	 */
	mobileIsSearchOverlayVisible: function(component) {
		var overlay = component.find('mobileSearchOverlay');
		if (!overlay) {
			return false;
		}
		return !this.utils.hasClass(overlay.getElement(), 'slds-hide');
	},

	/**
	 * Shows the mobile search overlay
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileShowSearchOverlay: function(component) {
		var overlay = component.find('mobileSearchOverlay');
		if (!overlay || this.mobileIsSearchOverlayVisible(component)) {
			return;
		}

		var containerId = 'cInputLookup_mobile_search_overlay_container';
		var container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement('div');
			container.id = containerId;
			container.className = 'slds-scope ' + component.getName();
			document.body.appendChild(container);
		}

		container.appendChild(overlay.getElement());
		this.utils.removeClass(overlay.getElement(), 'slds-hide');
	},

	/**
	 * Hides the mobile search overlay
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileHideSearchOverlay: function(component) {
		if (!this.mobileIsSearchOverlayVisible(component)) {
			return;
		}

		var overlay = component.find('mobileSearchOverlay');
		if (!overlay) {
			return;
		}
		this.utils.addClass(overlay.getElement(), 'slds-hide');

		var container = component.find('mobileSearchOverlayContainer');
		if (!container) {
			return;
		}
		container.getElement().appendChild(overlay.getElement());
	},

	/**
	 * Filters the list of recent items and adds all items that match the search text to the list of
	 * lookup items to be selected
	 *
	 * @param {Aura.Component} component         - The inputLookup component
	 * @param {string}         searchText        - The entered search text
	 * @param {boolean}        [includeSelected] - If true then the currently selected items will be
	 *                                             added to the list of matching items
	 *
	 * @return {void}
	 */
	mobileFilterRecentItems: function(component, searchText, includeSelected) {
		searchText = this.utils.asString(searchText).replace(/^\s+/g, '');

		var recentItems = this.getRecentItems(component);
		var lookupItems = recentItems.slice(0);
		if (includeSelected) {
			var selectedItems = this.getSelectedItems(component);
			selectedItems.forEach(function(item) {
				if (!this.findItemById(lookupItems, item.id)) {
					lookupItems.splice(0, 0, item);
				}
			}, this);
		}

		if (searchText) {
			var searchTextLower = searchText.toLowerCase();

			var matches = [];
			lookupItems.forEach(function(item) {
				var itemName = item.name;
				var itemNameLower = itemName.toLowerCase();
				if (itemNameLower.indexOf(searchTextLower) > -1) {
					matches.push(item);
				}
			});

			lookupItems = matches;
		}

		this.setLookupItems(component, lookupItems);
	},

	/**
	 * Returns the value of the search text input field
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {string} The value of the search text input field
	 */
	mobileGetSearchTextInputValue: function(component) {
		return component.find('mobileSearchTextInput').getElement().value;
	},

	/**
	 * Sets the value of the search text input field
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The value
	 *
	 * @return {void}
	 */
	mobileSetSearchTextInputValue: function(component, searchText) {
		component.find('mobileSearchTextInput').getElement().value = searchText;
	},

	/**
	 * Shows the "X" button within the search text input field when search text has been entered and
	 * hides the button when the text is empty
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The entered search text
	 *
	 * @return {void}
	 */
	mobileToggleClearSearchTextButton: function(component, searchText) {
		if (searchText) {
			$A.util.addClass(component.find('mobileSearchTextSearchIcon'), 'slds-hide');
			$A.util.removeClass(component.find('mobileSearchTextClearIcon'), 'slds-hide');
		} else {
			$A.util.removeClass(component.find('mobileSearchTextSearchIcon'), 'slds-hide');
			$A.util.addClass(component.find('mobileSearchTextClearIcon'), 'slds-hide');
		}
	},

	/**
	 * Shows the search button in the item list
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileShowSearchButton: function(component) {
		$A.util.removeClass(component.find('mobileSearchButton'), 'slds-hide');
	},

	/**
	 * Hides the search button in the item list
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileHideSearchButton: function(component) {
		$A.util.addClass(component.find('mobileSearchButton'), 'slds-hide');
	},

	/**
	 * Shows the search button in the item list when search text has been entered and its length is
	 * greater than or equal to the minimum text length required to perform a search. If the search
	 * text is empty or is too short then the search button is hidden
	 *
	 * @param {Aura.Component} component  - The inputLookup component
	 * @param {string}         searchText - The entered search text
	 *
	 * @return {void}
	 */
	mobileToggleSearchButton: function(component, searchText) {
		searchText = this.utils.trim(searchText);

		var simplifiedSearchText = this.stripSpecialChars(searchText);
		if (simplifiedSearchText.length < this.minSearchTextLength) {
			this.mobileHideSearchButton(component);
		} else {
			component.find('mobileSearchMessage').getElement().innerText = '"' + searchText + '"';
			this.mobileShowSearchButton(component);
		}
	},

	/**
	 * Shows the empty item list message
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileShowEmptyListItem: function(component) {
		$A.util.removeClass(component.find('mobileEmptyListItem'), 'slds-hide');
	},

	/**
	 * Hides the empty item list message
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileHideEmptyListItem: function(component) {
		$A.util.addClass(component.find('mobileEmptyListItem'), 'slds-hide');
	},

	/**
	 * Shows the empty item list message when the list of lookup items is empty and hides the
	 * message when the list contains 1 or more items
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileToggleEmptyListItem: function(component) {
		var lookupItems = this.getLookupItems(component);
		if (lookupItems.length > 0) {
			this.mobileHideEmptyListItem(component);
		} else {
			var searchText = this.getSearchText(component);
			var selectedSearchObject = this.getSelectedSearchObject(component);

			var emptyListMessage = 'No results for "' + searchText + '"';
			if (selectedSearchObject) {
				emptyListMessage += ' in ' + selectedSearchObject.label;
			}

			component.find('mobileEmptyListMessage').getElement().innerText = emptyListMessage;

			this.mobileShowEmptyListItem(component);
		}
	},

	/**
	 * Sets focus to the component. If the search overlay is open then focus is set to the overlay's
	 * "Cancel" button; otherwise, focus is set to the search/clear button within the selected item
	 * input field
	 *
	 * @param {Aura.Component} component - The inputLookup component
	 *
	 * @return {void}
	 */
	mobileFocus: function(component) {
		if (this.mobileIsSearchOverlayVisible(component)) {
			component.find('mobileCancelSearchButton').focus();
		} else {
			component.find('mobileSelectedItemSearchOrClearButton').getElement().focus();
		}
	},

	/**
	 * Executes server-side Apex method
	 *
	 * @param {Aura.Component} component        - The component
	 * @param {string}         name             - Name of the Apex method to execute
	 * @param {Object}         opts             - Execution options
	 * @param {Object}         [opts.context]   - The value of the this keyword in callback methods
	 * @param {boolean}        [opts.abortable] - Specifies whether the action is abortable
	 * @param {boolean}        [opts.storable]  - Specifies whether the action is storable
	 * @param {Function}       [opts.success]   - Function that is called upon success
	 * @param {Function}       [opts.failure]   - Function that is called when an error occurs
	 * @param {Function}       [opts.complete]  - Function that is called when the action is
	 *                                            complete regardless of whether the action was
	 *                                            successful or an error occurred
	 *
	 * @return {void}
	 */
	apex: function(component, name, opts) {
		var beginTime, endTime, duration;
		var action = component.get('c.' + name);
		var nop = function() {};
		var success = opts.success || nop;
		var failure = opts.failure || nop;
		var complete = opts.complete || nop;
		var context = opts.context || this;

		if (opts.params) {
			action.setParams(opts.params);
		}
		if (opts.abortable) {
			action.setAbortable();
		}
		if (opts.storable) {
			action.setStorable();
		}

		action.setCallback(context, function(response) {
			var state, result, error, message;

			if (!component.isValid()) {
				return;
			}

			endTime = Date.now();
			duration = endTime - beginTime;
			console.debug('Callout ' + name + ' completed in ' + duration + 'ms');

			state = response.getState();
			switch (state) {
			case 'SUCCESS':
			case 'REFRESH':
				result = response.getReturnValue();
				success.call(context, result, state);
				complete.call(context);
				break;
			case 'ERROR':
				message = 'An error occurred.';
				error = response.getError();
				if (error && (error.length > 0) && error[0] && error[0].message) {
					message = error[0].message;
				}
				failure.call(context, new Error(message), state);
				complete.call(context);
				break;
			case 'INCOMPLETE':
				message = 'Lost connection to server.';
				failure.call(context, new Error(message), state);
				complete.call(context);
				break;
			case 'ABORTED':
				message = 'Operation was aborted.';
				failure.call(context, new Error(message), state);
				complete.call(context);
				break;
			default:
				message = 'Unknown error.';
				failure.call(context, new Error(message), state);
				complete.call(context);
				break;
			}
		}, 'ALL');

		beginTime = Date.now();
		$A.enqueueAction(action);
	}
}) // eslint-disable-line semi