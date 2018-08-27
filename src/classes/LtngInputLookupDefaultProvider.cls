/**
 * This class provides a default implementation of the LtngInputLookupProvider interface. Custom
 * providers can either extend this class or implement LtngInputLookupProvider directly
 *
 * @author Eugene Oates
 */
global virtual class LtngInputLookupDefaultProvider implements LtngInputLookupProvider {
	private static Map<String, Schema.SObjectType> globalDescribe;

	/**
	 * Describes a S-Object type
	 *
	 * @param name The API name of the S-Object type
	 *
	 * @return A Schema.DescribeSObjectResult object
	 */
	private static Schema.DescribeSObjectResult getSObjectType(String name) {
		if (globalDescribe == null) {
			globalDescribe = Schema.getGlobalDescribe();
		}
		Schema.SObjectType typeToken = globalDescribe.get(name);
		Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
		return typeInfo;
	}

	/**
	 * Describes the S-Object type's name field
	 *
	 * @param typeInfo The S-Object type
	 *
	 * @return A Schema.DescribeFieldResult object
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
	 * Sorts a list of records so they are in the order specified by the recordIds argument
	 *
	 * @param records The records to sort
	 * @param recordIds A list that specifies the desired order of the records
	 *
	 * @return The sorted records
	 */
	private static List<SObject> sequenceRecordsById(List<SObject> records, List<Id> recordIds) {
		Map<Id, SObject> recordMap = new Map<Id, SObject>(records);
		List<SObject> orderedList = new List<SObject>();

		for (Id recordId : recordIds) {
			SObject record = recordMap.get(recordId);
			if (record != null) {
				orderedList.add(record);
			}
		}

		return orderedList;
	}

	/**
	 * Returns a list containing the IDs of recently viewed records
	 *
	 * @param sObjectName The API name of the S-Object type
	 *
	 * @return The recently viewed record IDs
	 */
	protected virtual List<Id> getRecentlyViewedRecordIds(String sObjectName) {
		List<RecentlyViewed> records = [
			SELECT Id
			FROM RecentlyViewed
			WHERE Type = :sObjectName
			AND LastViewedDate != NULL
			ORDER BY LastViewedDate DESC
		];

		List<Id> recordIds = new List<Id>();
		for (RecentlyViewed record : records) {
			recordIds.add(record.Id);
		}
		return recordIds;
	}

	/**
	 * Returns a list of records with the specified IDs
	 *
	 * @param sObjectName The API name of the S-Object type
	 * @param fieldNames The list of field names to be included
	 * @param recordIds The IDs of the records to be returned
	 * @param filter An optional filter
	 * @param howMany The number of records to return
	 *
	 * @return A list containing the requested records
	 */
	protected virtual List<SObject> getRecordsById(
		String sObjectName,
		List<String> fieldNames,
		List<Id> recordIds,
		String filter,
		Integer howMany
	) {
		String soql = 'SELECT ' + String.join(fieldNames, ',')
			+ ' FROM ' + sObjectName
			+ ' WHERE Id IN :recordIds';

		if (String.isNotBlank(filter)) {
			soql += ' AND (' + filter + ')';
		}

		soql += ' LIMIT :howMany';

		return Database.query(soql);
	}

	/**
	 * @see LtngInputLookupProvider.getRecentItems
	 */
	global virtual List<SObject> getRecentItems(
		String sObjectName,
		List<String> fieldNames,
		String filter,
		Integer howMany
	) {
		List<SObject> records = new List<SObject>();

		List<Id> recordIds = getRecentlyViewedRecordIds(sObjectName);
		if ((recordIds == null) || recordIds.isEmpty()) {
			return records;
		}

		records = getRecordsById(sObjectName, fieldNames, recordIds, filter, howMany);
		return sequenceRecordsById(records, recordIds);
	}

	/**
	 * @see LtngInputLookupProvider.search
	 */
	global virtual List<SObject> search(
		String sObjectName,
		List<String> fieldNames,
		String searchText,
		String filter,
		String sortField,
		Boolean sortAscending,
		Integer howMany,
		Boolean withoutSharing
	) {
		List<SObject> records;

		if (String.isBlank(filter)) {
			filter = '';
		} else {
			filter = ' WHERE (' + filter + ')';
		}

		String order = '';
		if (String.isNotBlank(sortField)) {
			order = ' ORDER BY ' + sortField;
			order += (sortAscending == false) ? ' DESC NULLS LAST' : ' ASC NULLS FIRST';
		}

		Schema.DescribeSObjectResult typeInfo = getSObjectType(sObjectName);
		Schema.DescribeFieldResult nameField = getNameField(typeInfo);
		if (typeInfo.isSearchable()) {
			String sosl = 'FIND :searchText'
				+ ' IN NAME FIELDS'
				+ ' RETURNING'
				+ ' ' + sObjectName + '(' + String.join(fieldNames, ',') + filter + order + ')'
				+ ' LIMIT :howMany';

			records = Search.query(sosl)[0];
		} else {
			searchText = '%' + searchText + '%';

			if (String.isNotBlank(filter)) {
				filter += ' AND ';
			} else {
				filter = ' WHERE ';
			}
			filter += '(' + nameField.getName() + ' LIKE :searchText)';

			String soql = 'SELECT ' + String.join(fieldNames, ',')
				+ ' FROM ' + sObjectName
				+ filter
				+ order
				+ ' LIMIT :howMany';

			records = Database.query(soql);
		}

		return records;
	}
}