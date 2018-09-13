/**
 * Apex controller for the inputLookup Lightning component
 *
 * @author Eugene Oates
 */
global with sharing class LtngInputLookupController {
	/**
	 * The SharingContext interface represents a collection of data access methods that can be
	 * executed either with or without sharing
	 */
	private interface SharingContext {
		/**
		 * Executes a provider implementation's search() method
		 *
		 * @see LtngInputLookupProvider.search
		 */
		List<SObject> search(
			LtngInputLookupProvider provider,
			String sObjectName,
			List<String> fieldNames,
			String searchText,
			String filter,
			String sortField,
			Boolean sortAscending,
			Integer howMany
		);
	}

	/**
	 * Implementation of SharingContext that enforces sharing rules
	 */
	private with sharing class WithSharingContext implements SharingContext {
		/** @see SharingContext.search */
		public List<SObject> search(
			LtngInputLookupProvider provider,
			String sObjectName,
			List<String> fieldNames,
			String searchText,
			String filter,
			String sortField,
			Boolean sortAscending,
			Integer howMany
		) {
			return provider.search(
				sObjectName,
				fieldNames,
				searchText,
				filter,
				sortField,
				sortAscending,
				howMany,
				false
			);
		}
	}

	/**
	 * Implementation of SharingContext that ignores sharing rules
	 */
	private without sharing class WithoutSharingContext implements SharingContext {
		/** @see SharingContext.search */
		public List<SObject> search(
			LtngInputLookupProvider provider,
			String sObjectName,
			List<String> fieldNames,
			String searchText,
			String filter,
			String sortField,
			Boolean sortAscending,
			Integer howMany
		) {
			return provider.search(
				sObjectName,
				fieldNames,
				searchText,
				filter,
				sortField,
				sortAscending,
				howMany,
				true
			);
		}
	}

	/**
	 * Used to retrieve one or more records by ID. The reason this functionality is in a separate
	 * class instead of just a method is so that we can use the "without sharing" keyword to ignore
	 * sharing rules
	 */
	private without sharing class RecordQuery {
		/**
		 * Returns a list of records with the specified IDs
		 *
		 * @param sObjectName The API name of the S-Object
		 * @param fieldNames The list of fields to include in the record set
		 * @param recordIds The IDs of the records to return
		 */
		public List<SObject> getRecordsById(
			String sObjectName,
			List<String> fieldNames,
			Set<Id> recordIds
		) {
			String soql = 'SELECT ' + String.join(fieldNames, ',')
				+ ' FROM ' + sObjectName
				+ ' WHERE Id IN :recordIds';

			return Database.query(soql);
		}
	}

	/**
	 * Represents a field
	 */
	global class ItemField {
		@AuraEnabled public String name { get; set; }
		@AuraEnabled public String label { get; set; }
		@AuraEnabled public Object value { get; set; }
		@AuraEnabled public String dataType { get; set; }
		@AuraEnabled public Decimal scale { get; set; }
		@AuraEnabled public Boolean sortable { get; set; }
	}

	/**
	 * Represents a lookup item
	 */
	global class GetItemResult {
		@AuraEnabled public String sObjectName { get; set; }
		@AuraEnabled public String id { get; set; }
		@AuraEnabled public String name { get; set; }
		@AuraEnabled public List<ItemField> fields { get; set; }
	}

	/**
	 * S-Object metadata
	 */
	global class GetSObjectResult {
		@AuraEnabled public String iconName { get; set; }
		@AuraEnabled public String keyPrefix { get; set; }
		@AuraEnabled public String name { get; set; }
		@AuraEnabled public String label { get; set; }
		@AuraEnabled public String labelPlural { get; set; }
		@AuraEnabled public String nameField { get; set; }
		@AuraEnabled public Boolean createable { get; set; }
	}

	/**
	 * Search result
	 */
	global class SearchResult {
		@AuraEnabled public Decimal pageSize { get; set; }
		@AuraEnabled public Decimal pageNumber { get; set; }
		@AuraEnabled public Decimal pageCount { get; set; }
		@AuraEnabled public Decimal itemCount { get; set; }
		@AuraEnabled public List<GetItemResult> items { get; set; }
	}

	// Constants
	private static final Integer MAX_FIELD_COUNT = 10;
	private static final Integer MIN_RECENT_ITEMS = 1;
	private static final Integer MAX_RECENT_ITEMS = 25;
	private static final Integer DEFAULT_RECENT_ITEMS = 5;
	private static final Integer MIN_LOOKUP_ITEMS = 1;
	private static final Integer MAX_LOOKUP_ITEMS = 25;
	private static final Integer DEFAULT_LOOKUP_ITEMS = 5;
	private static final Integer MIN_SEARCH_TEXT_LENGTH = 3;
	private static final Integer MIN_PAGE_SIZE = 1;
	private static final Integer MAX_PAGE_SIZE = 50;
	private static final Integer DEFAULT_PAGE_SIZE = 25;
	private static final Integer MIN_SEARCH_ITEMS = 1;
	private static final Integer MAX_SEARCH_ITEMS = 2000;
	private static final Integer DEFAULT_SEARCH_ITEMS = 500;

	private static final String ID_FIELD_NAME = 'Id';
	private static final String FIELD_PREFIX_IMPORTANT = '!';
	private static final List<String> FIELD_PREFIXES = new List<String> { FIELD_PREFIX_IMPORTANT };

	// Static fields
	private static Map<String, String> objectIconNames;
	private static Map<String, Schema.SObjectType> globalDescribe;

	/**
	 * Gets the default icon name for the specified S-Object. The default icon can be overridden
	 * by the component by specifying an iconName attribute for the type. The way the default icon
	 * is determined is by using the describe information for each defined tab to check for a tab
	 * that is associated with an S-Object. If there is no tab (standard or custom) for a particular
	 * S-Object then a default icon name cannot be determined and null will be returned
	 *
	 * @param name The S-Object API name
	 *
	 * @return The default icon name for the specified S-Object
	 */
	private static String getObjectIconName(String name) {
		final String LIGHTNING_ICON_EXT = '.svg';

		if (objectIconNames == null) {
			objectIconNames = new Map<String, String>();

			for (Schema.DescribeTabSetResult tabSet : Schema.describeTabs()) {
				//if (tabSet.isSelected()) {
					for (Schema.DescribeTabResult tab : tabSet.getTabs()) {
						String typeName = tab.getSobjectName();
						if (String.isBlank(typeName) || objectIconNames.containsKey(typeName)) {
							continue;
						}

						for (Schema.DescribeIconResult icon : tab.getIcons()) {
							String iconUrl = icon.getUrl();
							if (iconUrl.endsWithIgnoreCase(LIGHTNING_ICON_EXT)) {
								String iconName = iconUrl
									.substringAfterLast('/')
									.substringBefore(LIGHTNING_ICON_EXT);

								Boolean isCustom = typeName.endsWithIgnoreCase('__c');
								if (isCustom) {
									iconName = 'custom:' + iconName;
								} else {
									iconName = 'standard:' + iconName;
								}

								objectIconNames.put(typeName, iconName);
								break;
							}
						}
					}
					//break;
				//}
			}
		}

		return objectIconNames.get(name);
	}

	/**
	 * Returns a SharingContext object
	 *
	 * @param withoutSharing If true then the returned context will ignore sharing rules
	 *
	 * @return A SharingContext object
	 */
	private static SharingContext getSharingContext(Boolean withoutSharing) {
		SharingContext context;
		if (withoutSharing == true) {
			context = new WithoutSharingContext();
		} else {
			context = new WithSharingContext();
		}
		return context;
	}

	/**
	 * Returns a LtngInputLookupProvider by name. If name is blank then the default provider will be
	 * returned. The provider to use is specified by the components providerName attribute for the
	 * type
	 *
	 * @param providerName The name of an Apex class which implements the LtngInputLookupProvider
	 *                     interface. If the name is blank then the default provider will be used
	 *
	 * @return A LtngInputLookupProvider object
	 */
	private static LtngInputLookupProvider getLookupProvider(String providerName) {
		// Use default provider if a name is not specified
		if (String.isBlank(providerName)) {
			return new LtngInputLookupDefaultProvider();
		}

		// Get the named Apex class
		Type providerType = Type.forName(providerName);
		if (providerType == null) {
			throw new AuraHandledException('Provider ' + providerName + ' not found');
		}

		// Create an instance of the class
		Object providerInstance;
		try {
			providerInstance = providerType.newInstance();
		} catch (Exception e) {
			throw new AuraHandledException('Unable to create an instance of provider '
				+ providerName);
		}

		// Ensure that the class implements the LtngInputLookupProvider interface
		if (!(providerInstance instanceof LtngInputLookupProvider)) {
			throw new AuraHandledException('Provider ' + providerName
				+ ' does not implement LtngInputLookupProvider');
		}

		return (LtngInputLookupProvider)providerInstance;
	}

	/**
	 * Returns the named S-Object type. If the specified S-Object is invalid or if the S-Object is
	 * not queryable or if is has no name field then an exception is thrown
	 *
	 * @param name The API name of the S-Object
	 *
	 * @return A Schema.DescribeSObjectResult object
	 */
	private static Schema.DescribeSObjectResult getSObjectType(String name) {
		if (globalDescribe == null) {
			globalDescribe = Schema.getGlobalDescribe();
		}

		Schema.SObjectType typeToken = globalDescribe.get(name);
		if (typeToken == null) {
			throw new AuraHandledException('Invalid S-Object name: ' + name);
		}

		Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
		if (!typeInfo.isQueryable()) {
			throw new AuraHandledException('S-Object type ' + typeInfo.getName() + ' is not'
				+ ' queryable');
		}

		Schema.DescribeFieldResult nameField = getNameField(typeInfo);
		if (nameField == null) {
			throw new AuraHandledException('S-Object type ' + typeInfo.getName() + ' does not have'
				+ ' a name field');
		}

		return typeInfo;
	}

	/**
	 * Returns the name field for the specified S-Object type. If the type has no name field then
	 * the Id field is used
	 *
	 * @param typeInfo A Schema.DescribeSObjectResult object which represents the S-Object
	 *
	 * @return A Schema.DescribeFieldResult object that represents the name field
	 */
	private static Schema.DescribeFieldResult getNameField(Schema.DescribeSObjectResult typeInfo) {
		Schema.DescribeFieldResult nameField = null;

		Map<String, Schema.SObjectField> fieldTokens = typeInfo.fields.getMap();
		for (String fieldName : fieldTokens.keySet()) {
			Schema.SObjectField fieldToken = fieldTokens.get(fieldName);
			Schema.DescribeFieldResult fieldInfo = fieldToken.getDescribe();
			if (fieldInfo.isNameField()) {
				nameField = fieldInfo;
				break;
			}
		}

		return nameField;
	}

	/**
	 * Returns the specified field. This method supports reference fields using dot notation (e.g.,
	 * "Account.Owner.Name")
	 *
	 * @param typeInfo The S-Object type
	 * @param fieldName The name of the field to return
	 * @param names A list that will be populated with field names. This is most useful for
	 *              reference fields. For example, if fieldName is "Account.Owner.Name" then the
	 *              names list will contain 3 elements: "Account", "Owner", and "Name"
	 * @param labels Similar to the names list except it will contain each field's label instead of
	 *               its name
	 *
	 * @return A Schema.DescribeFieldResult object that represents the requested field
	 */
	private static Schema.DescribeFieldResult getField(
		Schema.DescribeSObjectResult typeInfo,
		String fieldName,
		List<String> names,
		List<String> labels
	) {
		Map<String, Schema.SObjectField> fieldTokens = typeInfo.fields.getMap();
		Schema.SObjectField fieldToken;
		Schema.DescribeFieldResult fieldInfo;

		// A dot indicates a foreign key field. For example, "Account.OwnerId"
		Integer indexOfDot = fieldName.indexOf('.');
		if (indexOfDot == -1) {
			// If the name does not contain a dot then the field is on the specified object
			fieldToken = fieldTokens.get(fieldName);
			if (fieldToken != null) {
				fieldInfo = fieldToken.getDescribe();
				names.add(fieldInfo.getName());
				labels.add(fieldInfo.getLabel());
			}
		} else {
			// If the name contains a dot then we need to find the field by its relationship name
			// (instead of name). That will let us determine the object that the field points to
			// then we call getField() recursively with the text to the right of the dot
			String l = fieldName.substring(0, indexOfDot);
			String r = fieldName.substring(indexOfDot + 1);

			for (String fname : fieldTokens.keySet()) {
				fieldToken = fieldTokens.get(fname);
				fieldInfo = fieldToken.getDescribe();

				// Instead of field name we need to find the field by relationship name
				String relationshipName = fieldInfo.getRelationshipName();
				if (!l.equalsIgnoreCase(relationshipName)) {
					continue;
				}

				// Add name and label
				names.add(relationshipName);
				labels.add(stripIdSuffix(fieldInfo.getLabel()));

				// Call getField() recursively
				if (fieldInfo.isNamePointing()) {
					typeInfo = Schema.SObjectType.Name;
				} else {
					List<Schema.SObjectType> referenceTo = fieldInfo.getReferenceTo();
					typeInfo = referenceTo[0].getDescribe();
				}
				fieldInfo = getField(typeInfo, r, names, labels);
				break;
			}
		}

		return fieldInfo;
	}

	/**
	 * Returns the value of the specified field
	 *
	 * @param record The record
	 * @param fieldName The name of the field
	 *
	 * @return The value of the named field
	 */
	private static Object getFieldValue(SObject record, String fieldName) {
		Object value = null;

		Integer indexOfDot = fieldName.indexOf('.');
		if (indexOfDot == -1) {
			value = record.get(fieldName);
		} else {
			String l = fieldName.substring(0, indexOfDot);
			String r = fieldName.substring(indexOfDot + 1);

			record = record.getSObject(l);
			if (record != null) {
				value = getFieldValue(record, r);
			}
		}

		return value;
	}

	/**
	 * Groups a list of record IDs by S-Object type
	 *
	 * @param recordIds A list containing the IDs to be grouped by S-Object type
	 *
	 * @return A map which is keyed by S-Object type and where each value is a list of record IDs
	 *         for that type
	 */
	private static Map<Schema.SObjectType, Set<Id>> groupRecordIdsByType(List<String> recordIds) {
		Map<Schema.SObjectType, Set<Id>> groupedRecordIds = new Map<Schema.SObjectType, Set<Id>>();

		if ((recordIds == null) || recordIds.isEmpty()) {
			return groupedRecordIds;
		}

		for (String recordId : recordIds) {
			Id idValue;
			try {
				idValue = Id.valueOf(recordId);
			} catch (Exception e) {
				continue;
			}

			Schema.SObjectType typeToken = idValue.getSObjectType();
			Set<Id> typeIds = groupedRecordIds.get(typeToken);
			if (typeIds == null) {
				typeIds = new Set<Id>();
				groupedRecordIds.put(typeToken, typeIds);
			}
			typeIds.add(idValue);
		}

		return groupedRecordIds;
	}

	/**
	 * Reads field names from the specified field set and returns the information as a string that
	 * can be parsed by parseFields()
	 *
	 * @param fieldSetName The name of the field set
	 * @param typeInfo The S-Object that contains the field set
	 *
	 * @return A comma-delimited string containing the field names in the field set
	 */
	private static String readFieldSetFields(
		String fieldSetName,
		Schema.DescribeSObjectResult typeInfo
	) {
		Map<String, Schema.FieldSet> fieldSets = typeInfo.fieldSets.getMap();
		Schema.FieldSet fieldSet = fieldSets.get(fieldSetName);
		if (fieldSet == null) {
			return '';
		}

		List<String> fieldNames = new List<String>();
		for (Schema.FieldSetMember member : fieldSet.getFields()) {
			fieldNames.add(member.getFieldPath());
		}
		return String.join(fieldNames, ',');
	}

	/**
	 * Parses a string containing a list of field names and optional label overrides and returns a
	 * list of ItemField objects
	 *
	 * @param fieldNames A comma-delimited list of field names
	 * @param typeInfo The S-Object type
	 * @param nameField The S-Object's name field
	 *
	 * @return A list of ItemField objects
	 */
	private static List<ItemField> parseFields(
		String fieldNames,
		Schema.DescribeSObjectResult typeInfo,
		Schema.DescribeFieldResult nameField
	) {
		String prefixes = String.join(FIELD_PREFIXES, '');
		List<String> fieldNameList = new List<String>();
		List<String> names = new List<String>();
		Map<String, String> labels = new Map<String, String>();
		Set<String> importantFields = new Set<String>();
		Set<String> distinctNames = new Set<String>();
		List<ItemField> fieldList = new List<ItemField>();

		// The ID and Name field should ALWAYS be included so add them to the list of important
		// fields so they bypass the accessibility check
		importantFields.add(ID_FIELD_NAME.toLowerCase());
		importantFields.add(nameField.getName().toLowerCase());

		// Get the individual field names. If fieldNames starts with the prefix "fieldset://" then
		// retrieve the fields from the specified field set
		if (String.isNotBlank(fieldNames)) {
			fieldNames = fieldNames.trim();

			String fieldSetNamePrefix = 'fieldset://';
			if (fieldNames.startsWithIgnoreCase(fieldSetNamePrefix)) {
				String fieldSetName = fieldNames.substring(fieldSetNamePrefix.length());
				fieldNames = readFieldSetFields(fieldSetName, typeInfo);
			}
			fieldNameList = fieldNames.split(',');
		}

		// Iterate over fieldNameList and do the following for each value:
		// 1. If a label is specified (e.g., "Name|Label") then parse it
		// 2. Convert the name to lowercase
		// 3. If the name is blank or exists in distinctNames then skip it
		// 4. Add label override to labels if one was specified
		// 5. Add name to names
		// 6. Add name to distinctNames so it doesn't get processed again
		for (Integer i = 0, n = fieldNameList.size(); i < n; i++) {
			String name = fieldNameList[i].trim();
			String label = '';
			Boolean important = false;

			// Check for special field prefixes. Currently we only have one prefix which is the
			// "!" character. Prefixing a field name with "!" which indicates that the field should
			// be considered important and should appear in the search results even if user does not
			// have access to the field normally
			while (name.indexOfAny(prefixes) == 0) {
				if (name.startsWith(FIELD_PREFIX_IMPORTANT)) {
					important = true;
					name = name.substring(1).trim();
				}
			}

			// Check for a label override. Label overrides use the syntax "Name|Label" where the
			// name appears to the left of the "|" and the label appears to the right
			Integer indexOfBar = name.indexOf('|');
			if (indexOfBar != -1) {
				label = name.substring(indexOfBar + 1).trim();
				name = name.substring(0, indexOfBar).trim();
			}

			// Make sure we only process each field once. If a field name appears in the fieldNames
			// string more than once only the first occurence is used
			name = name.toLowerCase();
			if (String.isBlank(name) || distinctNames.contains(name)) {
				continue;
			}

			// Store the field info
			if (String.isNotBlank(label)) {
				labels.put(name, label);
			}

			if (important) {
				importantFields.add(name);
			}

			names.add(name);
			distinctNames.add(name);
		}

		// Remove Id and Name fields and put them at the start of the list
		removeFieldName(names, nameField.getName());
		addFieldNameAtStart(names, nameField.getName());

		removeFieldName(names, ID_FIELD_NAME);
		addFieldNameAtStart(names, ID_FIELD_NAME);

		// Make sure the list does not exceed the maximum number of fields allowed
		truncateList(names, MAX_FIELD_COUNT);

		// Iterate over names and do the following for each value:
		// 1. Get the S-Object field. If no matching field then skip it
		// 2. Get the label override. If the label was not overridden then use the field's label
		// 3. Create an ItemField object, populate it, and add it to fieldList
		for (Integer i = 0, n = names.size(); i < n; i++) {
			String name = names[i];
			String label = labels.get(name);
			Boolean important = importantFields.contains(name);

			List<String> namePath = new List<String>();
			List<String> labelPath = new List<String>();
			Schema.DescribeFieldResult fieldInfo = getField(typeInfo, name, namePath, labelPath);
			if (fieldInfo == null) {
				// Invali field name
				continue;
			} else if (!important && !fieldInfo.isAccessible()) {
				// Field is not accessible and is not marked as important so skip it
				continue;
			}

			// If a label override was not specified then use the default label
			if (String.isBlank(label)) {
				label = String.join(labelPath, ': ');
			}

			// Add the field to the list
			ItemField f = new ItemField();
			f.name = String.join(namePath, '.');
			f.label = label;
			f.dataType = fieldInfo.getType().name();
			f.scale = fieldInfo.getScale();
			f.sortable = fieldInfo.isSortable();

			fieldList.add(f);
		}

		return fieldList;
	}

	/**
	 * Adds the name to the start of the list. The name will be converted to lowercase
	 *
	 * @param fieldNames The list of field names
	 * @param fieldName The name of the field to add
	 */
	private static void addFieldNameAtStart(List<String> fieldNames, String fieldName) {
		fieldName = fieldName.toLowerCase();
		if (fieldNames.size() > 0) {
			fieldNames.add(0, fieldName);
		} else {
			fieldNames.add(fieldName);
		}
	}

	/**
	 * Removes the specified name from the list if it exists. The list of names must contain only
	 * lowercase values or the field will not be removed
	 *
	 * @param fieldNames The list of field names
	 * @param fieldName The name of the field to remove
	 */
	private static void removeFieldName(List<String> fieldNames, String fieldName) {
		Integer index = fieldNames.indexOf(fieldName.toLowerCase());
		if (index != -1) {
			fieldNames.remove(index);
		}
	}

	/**
	 * Returns the names of the specified fields
	 *
	 * @param fields A list of ItemField objects
	 *
	 * @return A list of strings containing the name of each ItemField object
	 */
	private static List<String> getItemFieldNames(List<ItemField> fields) {
		List<String> fieldNames = new List<String>();
		for (ItemField field : fields) {
			fieldNames.add(field.name);
		}
		return fieldNames;
	}

	/**
	 * Constructs a new GetItemResult object from an S-Object
	 *
	 * @param record The record
	 * @param typeInfo The S-Object type
	 * @param nameField The S-Object type's name field
	 * @param fields A list of ItemField objects that specifies which fields to populate
	 *
	 * @return A GetItemResult object
	 */
	private static GetItemResult newItemFromSObject(
		SObject record,
		Schema.DescribeSObjectResult typeInfo,
		Schema.DescribeFieldResult nameField,
		List<ItemField> fields
	) {
		if (fields == null) {
			String fieldNames = 'Id,' + nameField.getName();
			fields = parseFields(fieldNames, typeInfo, nameField);
		}

		GetItemResult item = new GetItemResult();
		item.sObjectName = typeInfo.getName();
		item.id = String.valueOf(record.Id);
		item.name = String.valueOf(record.get(nameField.getName()));
		item.fields = new List<ItemField>();

		for (ItemField field : fields) {
			ItemField copy = (ItemField)field.clone();
			copy.value = getFieldValue(record, field.name);

			item.fields.add(copy);
		}

		return item;
	}

	/**
	 * Reduces a list of values to the specified size. Extra values exceeding the number specified
	 * by size are removed and discarded
	 *
	 * @param values The list to be truncated
	 * @param size The maximium size of the list
	 */
	private static void truncateList(List<Object> values, Integer size) {
		for (Integer i = (values.size() - 1); i >= size; i--) {
			values.remove(i);
		}
	}

	/**
	 * Removes special search characters. Used before searching to check whether the search text
	 * (sans special characters) contains enough characters to perform the search
	 *
	 * @param searchText The text to be sanitized
	 *
	 * @return The text with all special characters removed
	 */
	private static String stripSpecialChars(String searchText) {
		String modifiedSearchText = '';
		if (String.isNotBlank(searchText)) {
			modifiedSearchText = searchText.replaceAll('[*"]', '').trim();
		}
		return modifiedSearchText;
	}

	/**
	 * If the specified text ends with the suffix " ID" (case-insensitive) then it is removed
	 *
	 * @param text The text to be checked
	 *
	 * @return The text with the " ID" suffix removed if it was present
	 */
	private static String stripIdSuffix(String text) {
		String suffix = ' Id';
		if (String.isNotBlank(text) && text.endsWithIgnoreCase(suffix)) {
			text = text.substring(0, text.length() - suffix.length());
		}
		return text;
	}

	/**
	 * Returns information for one or more S-Object types
	 *
	 * @param names The API names of the S-Objects to return
	 *
	 * @return A list of GetSObjectResult objects
	 */
	@AuraEnabled
	global static List<GetSObjectResult> getSObjects(List<String> names) {
		List<GetSObjectResult> results = new List<GetSObjectResult>();

		if ((names == null) || names.isEmpty()) {
			return results;
		}

		for (String name : names) {
			Schema.DescribeSObjectResult typeInfo = getSObjectType(name);
			Schema.DescribeFieldResult nameField = getNameField(typeInfo);

			GetSObjectResult result = new GetSObjectResult();
			result.iconName = getObjectIconName(typeInfo.getName());
			result.keyPrefix = typeInfo.getKeyPrefix();
			result.name = typeInfo.getName();
			result.label = typeInfo.getLabel();
			result.labelPlural = typeInfo.getLabelPlural();
			result.nameField = nameField.getName();
			result.createable = typeInfo.isCreateable();

			results.add(result);
		}

		return results;
	}

	/**
	 * Returns a list of items by record ID
	 *
	 * @param recordIds The list of IDs of the records to return
	 *
	 * @return A list of GetItemResult objects
	 */
	@AuraEnabled
	global static List<GetItemResult> getItems(List<String> recordIds) {
		List<GetItemResult> items = new List<GetItemResult>();

		Map<Schema.SObjectType, Set<Id>> groupedRecordIds = groupRecordIdsByType(recordIds);
		if (groupedRecordIds.isEmpty()) {
			return items;
		}

		RecordQuery query = new RecordQuery();

		for (Schema.SObjectType typeToken : groupedRecordIds.keySet()) {
			Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
			Schema.DescribeFieldResult nameField = getNameField(typeInfo);

			List<String> fieldNames = new List<String>();
			fieldNames.add(ID_FIELD_NAME);
			fieldNames.add(nameField.getName());

			List<SObject> records = query.getRecordsById(
				typeInfo.getName(), fieldNames, groupedRecordIds.get(typeToken));

			for (SObject record : records) {
				GetItemResult item = newItemFromSObject(record, typeInfo, nameField, null);
				items.add(item);
			}
		}

		return items;
	}

	/**
	 * Returns a list of recently viewed items of the specified S-Object type
	 *
	 * @param sObjectName The API name of the S-Object type
	 * @param fieldNames A comma-delimited list of field names to be included
	 * @param filter An optional filter to be applied to the query
	 * @param howMany The number of items to return
	 * @param providerName The name of the provider to use. If blank the default provider is used
	 *
	 * @return A list of GetItemResult objects
	 */
	@AuraEnabled
	global static List<GetItemResult> getRecentItems(
		String sObjectName,
		String fieldNames,
		String filter,
		Decimal howMany,
		String providerName
	) {
		List<GetItemResult> items = new List<GetItemResult>();

		Schema.DescribeSObjectResult typeInfo = getSObjectType(sObjectName);
		Schema.DescribeFieldResult nameField = getNameField(typeInfo);

		howMany = (howMany != null) ? Math.floor(howMany) : DEFAULT_RECENT_ITEMS;
		howMany = Math.max(howMany, MIN_RECENT_ITEMS);
		howMany = Math.min(howMany, MAX_RECENT_ITEMS);

		List<ItemField> fields = parseFields(fieldNames, typeInfo, nameField);

		LtngInputLookupProvider provider = getLookupProvider(providerName);

		List<SObject> records = provider.getRecentItems(
			typeInfo.getName(), getItemFieldNames(fields), filter, howMany.intValue());

		truncateList(records, howMany.intValue());

		for (SObject record : records) {
			GetItemResult item = newItemFromSObject(record, typeInfo, nameField, fields);
			items.add(item);
		}

		return items;
	}

	/**
	 * Searches for items that match the specified search text. Items are sorted by the S-Object's
	 * name field and there is no pagination support. This method is used to populate the drop-down
	 * menu list in the input component so it should return a small number of items
	 *
	 * @param sObjectName The API name of the S-Object type
	 * @param fieldNames A comma-delimited list of field names to be included
	 * @param searchText The text to search for
	 * @param filter An optional filter to be applied to the query
	 * @param withoutSharing A flag that indicates whether sharing should be enforced
	 * @param howMany The number of items to return
	 * @param providerName The name of the provider to use. If blank the default provider is used
	 *
	 * @return A list of GetItemResult objects
	 */
	@AuraEnabled
	global static List<GetItemResult> getLookupItems(
		String sObjectName,
		String fieldNames,
		String searchText,
		String filter,
		Boolean withoutSharing,
		Decimal howMany,
		String providerName
	) {
		howMany = (howMany != null) ? Math.floor(howMany) : DEFAULT_LOOKUP_ITEMS;
		howMany = Math.max(howMany, MIN_LOOKUP_ITEMS);
		howMany = Math.min(howMany, MAX_LOOKUP_ITEMS);

		Schema.DescribeSObjectResult typeInfo = getSObjectType(sObjectName);
		Schema.DescribeFieldResult nameField = getNameField(typeInfo);

		SearchResult result = search(
			sObjectName,
			fieldNames,
			searchText,
			nameField.getName(),
			true,
			howMany,
			null,
			filter,
			withoutSharing,
			howMany,
			providerName
		);

		return result.items;
	}

	/**
	 * Searches for items that match the specified search text. Unlike the getLookupItems() method,
	 * the search() method is intended to be used by the advanced search dialog that can be sorted
	 * and supports pagination through large result sets
	 *
	 * @param sObjectName The API name of the S-Object type
	 * @param fieldNames A comma-delimited list of field names to be included
	 * @param searchText The text to search for
	 * @param sortField The name of the field to sort by
	 * @param sortAscending A flag that indicates whether to sort in ascending or descending order
	 * @param pageSize The number of items per page
	 * @param pageNumber The page of items to be returned
	 * @param filter An optional filter to be applied to the query
	 * @param withoutSharing A flag that indicates whether sharing should be enforced
	 * @param howMany The number of items to return
	 * @param providerName The name of the provider to use. If blank the default provider is used
	 *
	 * @return A SearchResult object
	 */
	@AuraEnabled
	global static SearchResult search(
		String sObjectName,
		String fieldNames,
		String searchText,
		String sortField,
		Boolean sortAscending,
		Decimal pageSize,
		Decimal pageNumber,
		String filter,
		Boolean withoutSharing,
		Decimal howMany,
		String providerName
	) {
		if (sortAscending == null) {
			sortAscending = true;
		}

		pageSize = (pageSize != null) ? Math.floor(pageSize) : DEFAULT_PAGE_SIZE;
		pageSize = Math.max(pageSize, MIN_PAGE_SIZE);
		pageSize = Math.min(pageSize, MAX_PAGE_SIZE);

		pageNumber = (pageNumber != null) ? Math.floor(pageNumber) : 1;
		pageNumber = Math.max(pageNumber, 1);

		howMany = (howMany != null) ? Math.floor(howMany) : DEFAULT_SEARCH_ITEMS;
		howMany = Math.max(howMany, MIN_SEARCH_ITEMS);
		howMany = Math.min(howMany, MAX_SEARCH_ITEMS);

		SearchResult result = new SearchResult();
		result.pageSize = pageSize;
		result.pageNumber = 1;
		result.pageCount = 1;
		result.itemCount = 0;
		result.items = new List<GetItemResult>();

		String simplifiedSearchText = stripSpecialChars(searchText);
		if (simplifiedSearchText.length() < MIN_SEARCH_TEXT_LENGTH) {
			return result;
		}

		Schema.DescribeSObjectResult typeInfo = getSObjectType(sObjectName);
		Schema.DescribeFieldResult nameField = getNameField(typeInfo);
		List<ItemField> fields = parseFields(fieldNames, typeInfo, nameField);

		SharingContext context = getSharingContext(withoutSharing);
		LtngInputLookupProvider provider = getLookupProvider(providerName);

		List<SObject> records = context.search(
			provider,
			typeInfo.getName(),
			getItemFieldNames(fields),
			searchText,
			filter,
			sortField,
			sortAscending,
			howMany.intValue()
		);

		truncateList(records, howMany.intValue());

		if (!records.isEmpty()) {
			result.itemCount = records.size();
			result.pageCount = Math.ceil(result.itemCount / pageSize);
			result.pageNumber = Math.min(pageNumber, result.pageCount);

			Integer firstIndex = (pageNumber.intValue() - 1) * pageSize.intValue();
			Integer lastIndex = Math.min(firstIndex + pageSize.intValue(), records.size());
			for (Integer i = firstIndex; i < lastIndex; i++) {
				SObject record = records[i];
				GetItemResult item = newItemFromSObject(record, typeInfo, nameField, fields);
				result.items.add(item);
			}
		}

		return result;
	}
}