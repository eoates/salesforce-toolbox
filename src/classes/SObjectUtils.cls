/**
 * Contains utility/helper methods for working with S-Objects
 */
public class SObjectUtils {
	/**
	 * Converts a string to an ID
	 *
	 * @param idString The string to convert
	 *
	 * @return An ID value
	 */
	public static Id stringToId(String idString) {
		Id idValue = null;
		if (String.isNotEmpty(idString)) {
			idValue = Id.valueOf(idString);
		}
		return idValue;
	}

	/**
	 * Converts a list of strings to IDs
	 *
	 * @param idStrings The strings to convert
	 *
	 * @return A list of ID values
	 */
	public static List<Id> stringsToIds(List<String> idStrings) {
		List<Id> idValues = new List<Id>();
		if (idStrings != null) {
			for (String idString : idStrings) {
				Id idValue = stringToId(idString);
				idValues.add(idValue);
			}
		}
		return idValues;
	}

	/**
	 * Converts an ID to a string
	 *
	 * @param idValue The ID to convert
	 *
	 * @return A string value
	 */
	public static String idToString(Id idValue) {
		String idString = null;
		if (idValue != null) {
			idString = (String)idValue;
		}
		return idString;
	}

	/**
	 * Converts a list of IDs to strings
	 *
	 * @param idValues The IDs to convert
	 *
	 * @return A list of string values
	 */
	public static List<String> idsToStrings(List<Id> idValues) {
		List<String> idStrings = new List<String>();
		if (idValues != null) {
			for (Id idValue : idValues) {
				String idString = idToString(idValue);
				idStrings.add(idString);
			}
		}
		return idStrings;
	}

	/**
	 * Returns the S-Object type with the specified name. If no such S-Object type exists then null
	 * is returned
	 *
	 * @param typeName Name of the S-Object type
	 *
	 * @return A Schema.SObjectType object
	 */
	public static Schema.SObjectType getTypeByName(String typeName) {
		Schema.SObjectType typeToken = null;
		if (String.isNotEmpty(typeName)) {
			Map<String, Schema.SObjectType> typeMap = Schema.getGlobalDescribe();
			typeToken = typeMap.get(typeName);
		}
		return typeToken;
	}

	/**
	 * Returns the S-Object types with the specified names
	 *
	 * @param typeNames Names of the S-Object types
	 *
	 * @return A list of Schema.SObjectType objects
	 */
	public static List<Schema.SObjectType> getTypesByName(List<String> typeNames) {
		Set<Schema.SObjectType> typeTokenSet = new Set<Schema.SObjectType>();
		List<Schema.SObjectType> typeTokenList = new List<Schema.SObjectType>();
		if (typeNames != null) {
			Map<String, Schema.SObjectType> typeMap = Schema.getGlobalDescribe();
			for (String typeName : typeNames) {
				Schema.SObjectType typeToken = typeMap.get(typeName);
				if (!typeTokenSet.contains(typeToken)) {
					typeTokenSet.add(typeToken);
					typeTokenList.add(typeToken);
				}
			}
		}
		return typeTokenList;
	}

	/**
	 * Returns the S-Object type for the record with the specified ID
	 *
	 * @param recordId The record ID
	 *
	 * @return A Schema.SObjectType object
	 */
	public static Schema.SObjectType getTypeByRecordId(Id recordId) {
		try {
			return (recordId != null) ? recordId.getSObjectType() : null;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * Returns the S-Object types for the records with the specified IDs
	 *
	 * @param recordIds The record IDs
	 *
	 * @return A list of Schema.SObjectType objects
	 */
	public static List<Schema.SObjectType> getTypesByRecordId(List<Id> recordIds) {
		Set<Schema.SObjectType> typeTokenSet = new Set<Schema.SObjectType>();
		List<Schema.SObjectType> typeTokenList = new List<Schema.SObjectType>();
		if (recordIds != null) {
			for (Id recordId : recordIds) {
				Schema.SObjectType typeToken = getTypeByRecordId(recordId);
				if (!typeTokenSet.contains(typeToken)) {
					typeTokenSet.add(typeToken);
					typeTokenList.add(typeToken);
				}
			}
		}
		return typeTokenList;
	}

	/**
	 * Returns the name field for the specified S-Object type
	 *
	 * @param typeName The S-Object type name
	 *
	 * @return The type's name field
	 */
	public static Schema.SObjectField getNameField(String typeName) {
		return getNameField(getTypeByName(typeName));
	}

	/**
	 * Returns the name field for the specified S-Object type
	 *
	 * @param typeToken The S-Object type
	 *
	 * @return The type's name field
	 */
	public static Schema.SObjectField getNameField(Schema.SObjectType typeToken) {
		Schema.SObjectField nameField = null;
		if (typeToken != null) {
			Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
			Map<String, Schema.SObjectField> fieldMap = typeInfo.fields.getMap();

			nameField = fieldMap.get('Id');

			List<Schema.SObjectField> fieldTokens = fieldMap.values();
			for (Schema.SObjectField fieldToken : fieldTokens) {
				Schema.DescribeFieldResult fieldInfo = fieldToken.getDescribe();
				if (fieldInfo.isNameField()) {
					nameField = fieldToken;
					break;
				}
			}
		}
		return nameField;
	}

	/**
	 * Returns an S-Object field with the specified relationship name. If the type does not have a
	 * field with the specified relationship name then null is returned
	 *
	 * @param typeName The S-Object type name
	 * @param relationshipName Relationship name of the field to find
	 *
	 * @return A Schema.SObjectField object if a match was found; otherwise, null
	 */
	public static Schema.SObjectField getFieldByRelationshipName(
		String typeName,
		String relationshipName
	) {
		return getFieldByRelationshipName(getTypeByName(typeName), relationshipName);
	}

	/**
	 * Returns an S-Object field with the specified relationship name. If the type does not have a
	 * field with the specified relationship name then null is returned
	 *
	 * @param typeName The S-Object type
	 * @param relationshipName Relationship name of the field to find
	 *
	 * @return A Schema.SObjectField object if a match was found; otherwise, null
	 */
	public static Schema.SObjectField getFieldByRelationshipName(
		Schema.SObjectType typeToken,
		String relationshipName
	) {
		if ((typeToken != null) && String.isNotEmpty(relationshipName)) {
			Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
			Map<String, Schema.SObjectField> fieldMap = typeInfo.fields.getMap();
			List<Schema.SObjectField> fieldTokens = fieldMap.values();
			for (Schema.SObjectField fieldToken : fieldTokens) {
				Schema.DescribeFieldResult fieldInfo = fieldToken.getDescribe();
				if (relationshipName.equalsIgnoreCase(fieldInfo.getRelationshipName())) {
					return fieldToken;
				}
			}
		}
		return null;
	}

	/**
	 * Returns an S-Object field by name. Supports dot notation for field names (e.g. 'Owner.Name').
	 * If a matching field cannot be found then null is returned
	 *
	 * @param typeToken The S-Object type
	 * @param fieldName The name of the field to return
	 * @param namePath Optional. A list which will be populated with the names of all the fields
	 *                 traversed in order to reach the specified field
	 * @param labelPath Optional. A list which will be populated with the labels of all the fields
	 *                  traversed in order to reach the specified field
	 *
	 * @return A Schema.SObjectField object if a match was found; otherwise, null
	 */
	private static Schema.SObjectField getFieldByName(
		Schema.SObjectType typeToken,
		String fieldName,
		List<String> namePath,
		List<String> labelPath
	) {
		if (namePath == null) {
			namePath = new List<String>();
		}
		if (labelPath == null) {
			labelPath = new List<String>();
		}

		if ((typeToken == null) || String.isEmpty(fieldName)) {
			// Type or name not provided
			namePath.clear();
			labelPath.clear();
			return null;
		}

		Integer indexOfDot = fieldName.indexOf('.');
		if (indexOfDot != -1) {
			// Relationship field
			String relationshipName = fieldName.substring(0, indexOfDot);

			Schema.SObjectField relationshipField = getFieldByRelationshipName(
				typeToken,
				relationshipName
			);

			if (relationshipField == null) {
				// Relationship field not found
				namePath.clear();
				labelPath.clear();
				return null;
			}

			Schema.DescribeFieldResult fieldInfo = relationshipField.getDescribe();
			if (fieldInfo.isNamePointing()) {
				// Polymorphic key
				typeToken = Name.SObjectType;
			} else {
				// Get the type referenced by the relationship field
				List<Schema.SObjectType> referenceTo = fieldInfo.getReferenceTo();
				typeToken = referenceTo[0];
			}

			// Recursively search for field
			fieldName = fieldName.substring(indexOfDot + 1);

			namePath.add(fieldInfo.getRelationshipName());
			labelPath.add(fieldInfo.getLabel().removeEndIgnoreCase(' Id'));

			return getFieldByName(typeToken, fieldName, namePath, labelPath);
		} else {
			// Standard field
			Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();

			Schema.SObjectField fieldToken = typeInfo.fields.getMap().get(fieldName);
			if (fieldToken == null) {
				// Field not found
				namePath.clear();
				labelPath.clear();
				return null;
			}

			// Return the field
			Schema.DescribeFieldResult fieldInfo = fieldToken.getDescribe();
			namePath.add(fieldInfo.getName());
			labelPath.add(fieldInfo.getLabel());

			return fieldToken;
		}
	}

	/**
	 * Returns an S-Object field with the specified name. Returns null if no field exists with the
	 * specified name
	 *
	 * @param typeName The S-Object type name
	 * @param fieldName The name of the field to return
	 *
	 * @return A Schema.SObjectField object
	 */
	public static Schema.SObjectField getFieldByName(String typeName, String fieldName) {
		return getFieldByName(getTypeByName(typeName), fieldName);
	}

	/**
	 * Returns an S-Object field with the specified name. Returns null if no field exists with the
	 * specified name
	 *
	 * @param typeName The S-Object type
	 * @param fieldName The name of the field to return
	 *
	 * @return A Schema.SObjectField object
	 */
	public static Schema.SObjectField getFieldByName(
		Schema.SObjectType typeToken,
		String fieldName
	) {
		return getFieldByName(typeToken, fieldName, null, null);
	}

	/**
	 * Returns the names of all the fields in the path to the specified field
	 *
	 * @param typeName The S-Object type name
	 * @param fieldName The field name
	 *
	 * @return A list containing the names of all the fields in the path to the specified field
	 */
	public static List<String> getFieldNamePath(String typeName, String fieldName) {
		return getFieldNamePath(getTypeByName(typeName), fieldName);
	}

	/**
	 * Returns the names of all the fields in the path to the specified field
	 *
	 * @param typeName The S-Object type
	 * @param fieldName The field name
	 *
	 * @return A list containing the names of all the fields in the path to the specified field
	 */
	public static List<String> getFieldNamePath(Schema.SObjectType typeToken, String fieldName) {
		List<String> namePath = new List<String>();
		getFieldByName(typeToken, fieldName, namePath, null);
		return namePath;
	}

	/**
	 * Returns the names of all the fields in the path to the specified field as a string
	 *
	 * @param typeName The S-Object type name
	 * @param fieldName The field name
	 *
	 * @return A string containing the names of all the fields in the path to the specified field
	 *         separated by a period
	 */
	public static String getFieldNamePathAsString(String typeName, String fieldName) {
		return getFieldNamePathAsString(getTypeByName(typeName), fieldName);
	}

	/**
	 * Returns the names of all the fields in the path to the specified field as a string
	 *
	 * @param typeName The S-Object type
	 * @param fieldName The field name
	 *
	 * @return A string containing the names of all the fields in the path to the specified field
	 *         separated by a period
	 */
	public static String getFieldNamePathAsString(Schema.SObjectType typeToken, String fieldName) {
		List<String> namePath = getFieldNamePath(typeToken, fieldName);
		return String.join(namePath, '.');
	}

	/**
	 * Returns the labels of all the fields in the path to the specified field
	 *
	 * @param typeName The S-Object type name
	 * @param fieldName The field name
	 *
	 * @return A list containing the labels of all the fields in the path to the specified field
	 */
	public static List<String> getFieldLabelPath(String typeName, String fieldName) {
		return getFieldLabelPath(getTypeByName(typeName), fieldName);
	}

	/**
	 * Returns the labels of all the fields in the path to the specified field
	 *
	 * @param typeName The S-Object type
	 * @param fieldName The field name
	 *
	 * @return A list containing the labels of all the fields in the path to the specified field
	 */
	public static List<String> getFieldLabelPath(Schema.SObjectType typeToken, String fieldName) {
		List<String> labelPath = new List<String>();
		getFieldByName(typeToken, fieldName, null, labelPath);
		return labelPath;
	}

	/**
	 * Returns the labels of all the fields in the path to the specified field as a string
	 *
	 * @param typeName The S-Object type name
	 * @param fieldName The field name
	 *
	 * @return A string containing the labels of all the fields in the path to the specified field
	 *         separated by a colon and space (i.e. ': ')
	 */
	public static String getFieldLabelPathAsString(String typeName, String fieldName) {
		return getFieldLabelPathAsString(getTypeByName(typeName), fieldName);
	}

	/**
	 * Returns the labels of all the fields in the path to the specified field as a string
	 *
	 * @param typeName The S-Object type
	 * @param fieldName The field name
	 *
	 * @return A string containing the labels of all the fields in the path to the specified field
	 *         separated by a colon and space (i.e. ': ')
	 */
	public static String getFieldLabelPathAsString(Schema.SObjectType typeToken, String fieldName) {
		List<String> labelPath = getFieldLabelPath(typeToken, fieldName);
		return String.join(labelPath, ': ');
	}

	/**
	 * Returns a list of ID values from a list of records
	 *
	 * @param records A list of records
	 *
	 * @return A list of ID values
	 */
	public static List<Id> getIds(List<SObject> records) {
		List<Id> recordIds = new List<Id>();
		if (!CollectionUtils.isEmpty(records)) {
			for (SObject record : records) {
				Id recordId = null;
				if (record != null) {
					recordId = record.Id;
				}

				recordIds.add(recordId);
			}
		}
		return recordIds;
	}

	/**
	 * Returns a list of ID values from a map of objects keyed by ID
	 *
	 * @param records A map of records keyed by ID
	 *
	 * @return A list of ID values
	 */
	public static List<Id> getIds(Map<Id, SObject> records) {
		List<Id> recordIds = new List<Id>();
		if (records != null) {
			recordIds.addAll(records.keySet());
		}
		return recordIds;
	}

	/**
	 * Returns a list of unique ID values from a list of IDs. If a duplicate ID is found then the
	 * first occurrence is kept and all other occurrences are discarded
	 *
	 * @param recordIds A list of IDs, possibly containing duplicate values
	 *
	 * @return A list of unique ID values
	 */
	public static List<Id> getUniqueIds(List<Id> recordIds) {
		Set<Id> uniqueSet = new Set<Id>();
		List<Id> uniqueList = new List<Id>();
		if (recordIds != null) {
			for (Id recordId : recordIds) {
				if (!uniqueSet.contains(recordId)) {
					uniqueSet.add(recordId);
					uniqueList.add(recordId);
				}
			}
		}
		return uniqueList;
	}

	/**
	 * Returns a list of unique ID values from a list of records. If a duplicate ID is found then
	 * the first occurrence is kept and all other occurrences are discarded
	 *
	 * @param recordIds A list of records
	 *
	 * @return A list of unique ID values
	 */
	public static List<Id> getUniqueIds(List<SObject> records) {
		return getUniqueIds(getIds(records));
	}

	/**
	 * Returns a list of unique ID values from a map of records keyed by ID. If a duplicate ID is
	 * found then the first occurrence is kept and all other occurrences are discarded
	 *
	 * @param recordIds A map of records keyed by ID
	 *
	 * @return A list of unique ID values
	 */
	public static List<Id> getUniqueIds(Map<Id, SObject> records) {
		return getUniqueIds(getIds(records));
	}

	/**
	 * Groups a list of ID values by object type
	 *
	 * @param recordIds A list of IDs
	 *
	 * @return A map where the key is the object type and the value is the IDs for that type
	 */
	public static Map<Schema.SObjectType, List<Id>> getIdsGroupedByType(List<Id> recordIds) {
		Map<Schema.SObjectType, List<Id>> idsByType = new Map<Schema.SObjectType, List<Id>>();
		if (recordIds != null) {
			for (Id recordId : recordIds) {
				Schema.SObjectType typeToken = getTypeByRecordId(recordId);

				List<Id> typeRecordIds = idsByType.get(typeToken);
				if (typeRecordIds == null) {
					typeRecordIds = new List<Id>();
					idsByType.put(typeToken, typeRecordIds);
				}
				typeRecordIds.add(recordId);
			}
		}
		return idsByType;
	}

	/**
	 * Gets the value of the specified field. The field name supports dot notation for related
	 * object fields (e.g. 'Owner.Name')
	 *
	 * @param record A SObject object
	 * @param fieldName The field name
	 *
	 * @return The field value
	 */
	public static Object getFieldValue(SObject record, String fieldName) {
		Object fieldValue = null;
		if ((record != null) && String.isNotEmpty(fieldName)) {
			Integer indexOfDot = fieldName.indexOf('.');
			if (indexOfDot == -1) {
				fieldValue = record.get(fieldName);
			}
			else {
				String left = fieldName.substring(0, indexOfDot);
				String right = fieldName.substring(indexOfDot + 1);

				SObject related = record.getSObject(left);
				if (related != null) {
					fieldValue = getFieldValue(related, right);
				}
			}
		}
		return fieldValue;
	}

	/**
	 * Sets the value of the specified field. The field name supports dot notation for related
	 * object fields (e.g. 'Owner.Name')
	 *
	 * @param record A SObject object
	 * @param fieldName The field name
	 * @param fieldValue The field value
	 */
	public static void setFieldValue(SObject record, String fieldName, Object fieldValue) {
		if ((record != null) && String.isNotEmpty(fieldName)) {
			Integer indexOfDot = fieldName.indexOf('.');
			if (indexOfDot == -1) {
				record.put(fieldName, fieldValue);
			} else {
				String left = fieldName.substring(0, indexOfDot);
				String right = fieldName.substring(indexOfDot + 1);

				SObject related = record.getSObject(left);
				if (related != null) {
					setFieldValue(related, right, fieldValue);
				}
			}
		}
	}

	/**
	 * Returns the IDs of the most recently viewed records
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds() {
		return getRecentlyViewedIds((List<String>)null, null);
	}

	/**
	 * Returns the IDs of the most recently viewed records limited to a maximum number of rows
	 *
	 * @param howMany Maximum number of ID values to return
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds(Integer howMany) {
		return getRecentlyViewedIds((List<String>)null, howMany);
	}

	/**
	 * Returns the IDs of the most recently viewed records of a particular type
	 *
	 * @param typeName Name of the S-Object type
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds(String typeName) {
		return getRecentlyViewedIds(new List<String> { typeName }, null);
	}

	/**
	 * Returns the IDs of the most recently viewed records of a particular type and limited to a
	 * maximum number of rows
	 *
	 * @param typeName Name of the S-Object type
	 * @param howMany Maximum number of ID values to return
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds(String typeName, Integer howMany) {
		return getRecentlyViewedIds(new List<String> { typeName }, howMany);
	}

	/**
	 * Returns the IDs of the most recently viewed records of one or more types
	 *
	 * @param typeNames Names of the S-Object types
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds(List<String> typeNames) {
		return getRecentlyViewedIds(typeNames, null);
	}

	/**
	 * Returns the IDs of the most recently viewed records of one or more types and limited to a
	 * maximum number of rows
	 *
	 * @param typeNames Names of the S-Object types
	 * @param howMany Maximum number of ID values to return
	 *
	 * @return A list of ID values of the most recently viewed records
	 */
	public static List<Id> getRecentlyViewedIds(List<String> typeNames, Integer howMany) {
		String soql = 'SELECT Id FROM RecentlyViewed WHERE LastViewedDate != NULL';
		if (!CollectionUtils.isEmpty(typeNames)) {
			soql += ' AND Type IN :typeNames';
		}
		soql += ' ORDER BY LastViewedDate DESC';
		if ((howMany != null) && (howMany >= 0)) {
			soql += ' LIMIT :howMany';
		}

		List<RecentlyViewed> records = Database.query(soql);

		Set<Id> idSet = new Set<Id>();
		List<Id> idList = new List<Id>();
		for (RecentlyViewed record : records) {
			Id recordId = record.Id;

			if (!idSet.contains(recordId)) {
				idSet.add(recordId);

				Schema.SObjectType typeToken = getTypeByRecordId(recordId);
				if (typeToken != null) {
					idList.add(recordId);
				}
			}
		}
		return idList;
	}

	/**
	 * Returns records by ID. The specified list of IDs must all be of the same S-Object type. If
	 * you need to retrieve records of different types then you will have to make multiple calls
	 * to getRecords()
	 *
	 * The returned list of records will be in the same order as the record IDs passed to the method
	 *
	 * The returned list of records may not contain the same number of items as the list of IDs
	 *
	 * @param recordIds A list of IDs of the records to return
	 * @param fieldNames A list of field names to be included
	 *
	 * @return A list of records
	 */
	public static List<SObject> getRecords(List<Id> recordIds, List<String> fieldNames) {
		return getRecords(recordIds, fieldNames, null);
	}

	/**
	 * Returns records by ID. The specified list of IDs must all be of the same S-Object type. If
	 * you need to retrieve records of different types then you will have to make multiple calls
	 * to getRecords()
	 *
	 * The returned list of records will be in the same order as the record IDs passed to the method
	 *
	 * The returned list of records may not contain the same number of items as the list of IDs
	 *
	 * @param recordIds A list of IDs of the records to return
	 * @param fieldNames A list of field names to be included
	 * @param filter An optional filter to be added to the query used to retrieve the records. This
	 *               can be used to restrict the returned records based on some criteria. For
	 *               example, you could specify 'IsActive = TRUE' when retrieving User records to
	 *               only return active users
	 *
	 * @return A list of records
	 */
	public static List<SObject> getRecords(
		List<Id> recordIds,
		List<String> fieldNames,
		String filter
	) {
		// Get unique IDs
		Set<Id> uniqueIds = CollectionUtils.listToSet(recordIds);
		uniqueIds.remove(null);
		if (uniqueIds.isEmpty()) {
			return new List<SObject>();
		}

		// Get the S-Object type. All IDs must be of the same type or else we throw an exception
		List<Schema.SObjectType> typeTokens = getTypesByRecordId(
			CollectionUtils.setToList(uniqueIds)
		);
		if (typeTokens.size() != 1) {
			throw new SObjectException('All records must be the same S-Object type.');
		}

		Schema.SObjectType typeToken = typeTokens[0];

		// If no field specified then add the name field
		if (CollectionUtils.isEmpty(fieldNames)) {
			Schema.SObjectField nameFieldToken = getNameField(typeToken);

			fieldNames = new List<String>();
			fieldNames.add(String.valueOf(nameFieldToken));
		}

		// Build the SOQL query
		String soql = 'SELECT ' + String.join(fieldNames, ',')
			+ ' FROM ' + String.valueOf(typeToken)
			+ ' WHERE Id IN :uniqueIds';

		if (String.isNotBlank(filter)) {
			soql += ' AND (' + filter + ')';
		}

		// Execute the query and return the results
		List<SObject> records = Database.query(soql);
		sequenceById(records, recordIds);

		return records;
	}

	/**
	 * Changes the sequence of records within a list so they appear in a specified sequence. The
	 * sequence does not have to have the same number of IDs as records in the list nor do the IDs
	 * have to be unique. In the case of duplicate ID values only the first occurrence is used. For
	 * example, given the sequence ID2, ID4, ID2 the list would be reordered as ID2, ID4; the second
	 * occurrence of ID2 would be ignored. Also, if the list contains records with IDs that do not
	 * appear in the sequence they will appear at the end of the list
	 *
	 * @param records A list of records to resequence
	 * @param sequence The sequence of IDs used to order the list
	 */
	public static void sequenceById(List<SObject> records, List<Id> sequence) {
		List<SObjectIdSequencer> sequencers = new List<SObjectIdSequencer>();
		for (SObject record : records) {
			sequencers.add(new SObjectIdSequencer(record, sequence));
		}
		sequencers.sort();

		Integer size = records.size();
		for (Integer i = 0; i < size; i++) {
			records.set(i, sequencers[i].record);
		}
	}

	/**
	 * Internal helper class used to implement the sequenceById() method. Wraps an S-Object record
	 * and implements the Comparable interface which is used to sort a list into the desired
	 * sequence
	 */
	private class SObjectIdSequencer implements Comparable {
		private final List<Id> sequence;

		/**
		 * Creates a SObjectIdSequence object
		 *
		 * @param record The record being wrapped
		 * @param sequence The sequence of IDs used to order the list
		 */
		public SObjectIdSequencer(SObject record, List<Id> sequence) {
			this.record = record;
			this.sequence = sequence;
		}

		/**
		 * Gets the record being wrapped
		 */
		public SObject record { get; private set; }

		/**
		 * Return the ID of the record being wrapped
		 *
		 * @return The ID of the record
		 */
		private Id getRecordId() {
			Id recordId = null;
			if (record != null) {
				recordId = record.Id;
			}
			return recordId;
		}

		/**
		 * Compare the position of the record ID with that of another record to determine its
		 * position within the list based on the desired sequence
		 *
		 * @param other A SObjectIdSequencer object
		 *
		 * @return 0 if the IDs are the same, a negative number if this record should appear in the
		 *         list before the other, or a positive number if this record should appear after
		 *         the other
		 */
		public Integer compareTo(Object other) {
			Id valueA = getRecordId();
			Id valueB = ((SObjectIdSequencer)other).getRecordId();

			Integer indexA = CollectionUtils.indexOf(sequence, valueA);
			Integer indexB = CollectionUtils.indexOf(sequence, valueB);

			Integer result;
			if ((indexA == -1) && (indexB != -1)) {
				result = 1;
			} else if ((indexA != -1) && (indexB == -1)) {
				result = -1;
			} else {
				result = indexA - indexB;
			}
			return result;
		}
	}
}