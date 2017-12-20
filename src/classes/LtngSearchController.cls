/**
 * Provides search functionality for Lightning components
 */
public with sharing class LtngSearchController {
	/**
	 * Gets the SharingContext based on whether sharing rules should be respected or ignored
	 *
	 * @param withSharing If true sharing will be respected. If false sharing will be ignored
	 *
	 * @return A SharingContext object
	 */
	private static SharingContext getSharingContext(Boolean withSharing) {
		SharingContext context;
		if (withSharing) {
			context = new WithSharingContext();
		} else {
			context = new WithoutSharingContext();
		}
		return context;
	}

	/**
	 * Attempt to parse a search object specification string. Throws an AuraHandledException if
	 * parsing fails
	 *
	 * @param spec The type string
	 *
	 * @return A LtngSearchObject object
	 */
	private static LtngSearchObject tryParseSearchObject(String spec) {
		try {
			return LtngSearchObject.parse(spec);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	/**
	 * Attempt to get a list of records by ID. Throws an AuraHandledException if an error occurs
	 *
	 * @param context A SharingContext object
	 * @param recordIds The list of IDs of the records to return
	 * @param fieldNames The list of fields to include in the returned records
	 * @param filter An optional filter added to the query
	 *
	 * @return A list of SObject objects
	 */
	private static List<SObject> tryGetRecords(
		SharingContext context,
		List<Id> recordIds,
		List<String> fieldNames,
		String filter
	) {
		try {
			return context.getRecords(recordIds, fieldNames, filter);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	/**
	 * Attempt to execute a SOSL query. Throws an AuraHandledException if an error occurs
	 *
	 * @param context A SharingContext object
	 * @param sosl The SOSL query to execute
	 * @param searchText The text to search for
	 *
	 * @return The results of the search
	 */
	private static List<List<SObject>> trySearch(
		SharingContext context,
		String sosl,
		String searchText
	) {
		try {
			return context.search(sosl, searchText);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	/**
	 * Returns the length of the search text. Determining the length of the search text is not as
	 * simple as simply returning the string's length. When executing a SOSL query the search text
	 * must be longer than 1 character. The difficulty here is that if the string is 2 characters or
	 * less and the first character is a wildcard character then an exception will be thrown even if
	 * the string length is technically longer than 1 character and even if that first wildcard
	 * character is escaped. So, we have to check for this condition and return 0 so we don't try
	 * and execute the query and get an error
	 *
	 * @param searchText The search text
	 *
	 * @return The logical length of the search text
	 */
	private static Integer getSearchTextLength(String searchText) {
		Integer length = searchText.length();
		if (length <= 2) {
			String first = searchText.left(1);
			if ((first == '?') || (first == '*')) {
				length = 0;
			}
		}
		return length;
	}

	/**
	 * Parse a search object specification string
	 *
	 * @param spec The string to parse
	 *
	 * @return A map where the key is the type name and the value is a LtngSearchObject object
	 */
	private static Map<String, LtngSearchObject> parseSearchObjects(String spec) {
		return parseSearchObjects(new List<String> { spec });
	}

	/**
	 * Parses multiple search object specification strings
	 *
	 * @param specs The strings to parse
	 *
	 * @return A map where the key is the type name and the value is a LtngSearchObject object
	 */
	private static Map<String, LtngSearchObject> parseSearchObjects(List<String> specs) {
		Map<String, LtngSearchObject> searchObjects = new Map<String, LtngSearchObject>();
		if (!CollectionUtils.isEmpty(specs)) {
			for (String spec : specs) {
				LtngSearchObject searchObject = tryParseSearchObject(spec);
				searchObjects.put(searchObject.name, searchObject);
			}
		}
		return searchObjects;
	}

	/**
	 * Adds types if they do not already exist
	 *
	 * @param searchObjects The list of search objects
	 * @param typeTokens The types to add
	 */
	private static void addMissingSearchObjects(
		Map<String, LtngSearchObject> searchObjects,
		Set<Schema.SObjectType> typeTokens
	) {
		for (Schema.SObjectType typeToken : typeTokens) {
			String typeName = String.valueOf(typeToken);

			LtngSearchObject searchObject = searchObjects.get(typeName);
			if (searchObject == null) {
				searchObject = tryParseSearchObject(typeName);
				searchObjects.put(typeName, searchObject);
			}
		}
	}

	/**
	 * Return the first search object from a map
	 *
	 * @param searchObjects The map
	 *
	 * @return The first search object in the map
	 */
	private static LtngSearchObject getFirstSearchObject(
		Map<String, LtngSearchObject> searchObjects
	) {
		return (LtngSearchObject)CollectionUtils.getFirst(searchObjects.values());
	}

	/**
	 * Removes records from a list
	 *
	 * @param records The records
	 * @param recordIds The list of IDs to be removed
	 */
	private static void removeRecords(List<SObject> records, List<String> recordIds) {
		recordIds = CommonUtils.trimAll(recordIds);

		Set<Id> idSet = new Set<Id>(SObjectUtils.stringsToIds(recordIds));
		if (records != null) {
			Integer length = records.size();
			for (Integer i = (length - 1); i >= 0; i--) {
				SObject record = records[i];
				if (idSet.contains(record.Id)) {
					records.remove(i);
				}
			}
		}
	}

	/**
	 * Converts a list of SObject objects to a list of LtngSearchRecord objects
	 *
	 * @param searchObjects The search objects
	 * @param records A list of SObject objects
	 *
	 * @return A list of LtngSearchRecord objects
	 */
	private static List<LtngSearchRecord> getSearchRecords(
		Map<String, LtngSearchObject> searchObjects,
		List<SObject> records
	) {
		List<LtngSearchRecord> searchRecords = new List<LtngSearchRecord>();
		for (SObject record : records) {
			String typeName = String.valueOf(record.getSObjectType());
			LtngSearchObject searchObject = searchObjects.get(typeName);

			searchRecords.add(new LtngSearchRecord(searchObject, record));
		}
		return searchRecords;
	}

	/**
	 * Returns search objects
	 *
	 * @param specs A list of object specification strings. See LtngSearchObject for the syntax
	 * @param recordIds A list containing selected records. If the list contains records of a type
	 *                  not specified in specs then it will be added automatically to ensure that
	 *                  the component always has a LtngSearchObject for every selected record
	 *
	 * @return A list of LtngSearchObject objects. This list is not sorted in any way. The list will
	 *         be sorted in the component code
	 */
	@AuraEnabled
	public static List<LtngSearchObject> getSearchObjects(
		List<String> specs,
		List<String> recordIds
	) {
		specs = CommonUtils.trimAll(specs);
		recordIds = CommonUtils.trimAll(recordIds);

		Map<String, LtngSearchObject> searchObjects = parseSearchObjects(specs);

		if (!CollectionUtils.isEmpty(recordIds)) {
			Map<Schema.SObjectType, List<Id>> recordIdsByType = SObjectUtils.getIdsGroupedByType(
				SObjectUtils.stringsToIds(recordIds)
			);
			addMissingSearchObjects(searchObjects, recordIdsByType.keySet());
		}

		return searchObjects.values();
	}

	/**
	 * Gets the specified records by ID. This method always ignores sharing, regardless of whether
	 * the search object specifies WITH SHARING
	 *
	 * @param specs A list of object specification strings. See LtngSearchObject for the syntax
	 * @param recordIds The IDs of the records to return
	 *
	 * @return A list of LtngSearchObject objects
	 */
	@AuraEnabled
	public static List<LtngSearchRecord> getRecords(List<String> specs, List<String> recordIds) {
		specs = CommonUtils.trimAll(specs);
		recordIds = CommonUtils.trimAll(recordIds);

		Map<Schema.SObjectType, List<Id>> recordIdsByType = SObjectUtils.getIdsGroupedByType(
			SObjectUtils.stringsToIds(recordIds)
		);

		Map<String, LtngSearchObject> searchObjects = parseSearchObjects(specs);
		addMissingSearchObjects(searchObjects, recordIdsByType.keySet());

		SharingContext context = getSharingContext(false);

		List<SObject> records = new List<SObject>();
		for (Schema.SObjectType typeToken : recordIdsByType.keySet()) {
			String typeName = String.valueOf(typeToken);
			LtngSearchObject searchObject = searchObjects.get(typeName);

			records.addAll(tryGetRecords(
				context,
				recordIdsByType.get(typeToken),
				searchObject.getFieldNames(),
				searchObject.filter
			));
		}

		SObjectUtils.sequenceById(records, recordIds);

		List<LtngSearchRecord> searchRecords = getSearchRecords(searchObjects, records);
		return searchRecords;
	}

	/**
	 * Returns recent items of the specified type
	 *
	 * @param spec An object specification string. See LtngSearchObject for the syntax
	 * @param howMany The number of records to return
	 *
	 * @return A list of LtngSearchRecord objects
	 */
	@AuraEnabled
	public static List<LtngSearchRecord> getRecentItems(String spec, Decimal howMany) {
		spec = CommonUtils.trim(spec);

		Map<String, LtngSearchObject> searchObjects = parseSearchObjects(spec);
		LtngSearchObject searchObject = getFirstSearchObject(searchObjects);

		SharingContext context = getSharingContext(searchObject.withSharing);

		List<Id> recordIds = context.getRecentlyViewedIds(
			searchObject.name,
			CommonUtils.decimalToInteger(howMany)
		);

		List<SObject> records = tryGetRecords(
			context,
			recordIds,
			searchObject.getFieldNames(),
			searchObject.filter
		);

		List<LtngSearchRecord> searchRecords = getSearchRecords(searchObjects, records);
		return searchRecords;
	}

	/**
	 * Returns items for use in a lookup component
	 *
	 * @param spec An object specification string. See LtngSearchObject for the syntax
	 * @param searchText The text to search for
	 * @param recordIds A list containing the selected record IDs. These records will be filtered
	 *                  out of the results
	 * @param howMany The number of records to return
	 *
	 * @return A list of LtngSearchRecord objects
	 */
	@AuraEnabled
	public static List<LtngSearchRecord> getLookupItems(
		String spec,
		String searchText,
		List<String> recordIds,
		Decimal howMany
	) {
		LtngSearchResult result = getSearchResult(
			spec,
			searchText,
			recordIds,
			null,
			true,
			howMany,
			null,
			null,
			false
		);
		return result.records;
	}

	/**
	 * Executes a search and returns a single page of results
	 *
	 * @param spec An object specification string. See LtngSearchObject for the syntax
	 * @param searchText The text to search for
	 * @param recordIds A list containing the selected record IDs. These records will be filtered
	 *                  out of the results
	 * @param sortField The field to sort by. If null then the name field will be used
	 * @param sortAsc True to sort the results in ascending order or false to sort descending
	 * @param howMany The maximium number of records to return
	 * @param pageSize Number of records per page
	 * @param pageNumber Current page number
	 *
	 * @return A LtngSearchResult object
	 */
	@AuraEnabled
	public static LtngSearchResult getSearchResult(
		String spec,
		String searchText,
		List<String> recordIds,
		String sortField,
		Boolean sortAsc,
		Decimal howMany,
		Decimal pageSize,
		Decimal pageNumber
	) {
		return getSearchResult(
			spec,
			searchText,
			recordIds,
			sortField,
			sortAsc,
			howMany,
			pageSize,
			pageNumber,
			true
		);
	}

	/**
	 * Executes a search and returns a single page of results
	 *
	 * @param spec An object specification string. See LtngSearchObject for the syntax
	 * @param searchText The text to search for
	 * @param recordIds A list containing the selected record IDs. These records will be filtered
	 *                  out of the results
	 * @param sortField The field to sort by. If null then the name field will be used
	 * @param sortAsc True to sort the results in ascending order or false to sort descending
	 * @param howMany The maximium number of records to return
	 * @param pageSize Number of records per page
	 * @param pageNumber Current page number
	 * @param ignoreWildcards True to allow wildcard characters or false to escape them
	 *
	 * @return A LtngSearchResult object
	 */
	private static LtngSearchResult getSearchResult(
		String spec,
		String searchText,
		List<String> recordIds,
		String sortField,
		Boolean sortAsc,
		Decimal howMany,
		Decimal pageSize,
		Decimal pageNumber,
		Boolean ignoreWildcards
	) {
		LtngSearchResult result = new LtngSearchResult();

		// Sanitize arguments
		spec = CommonUtils.trim(spec);
		searchText = CommonUtils.trim(searchText);
		sortField = CommonUtils.trim(sortField);
		sortAsc = CommonUtils.getBoolean(sortAsc);

		// Make sure the search text is long enough and escape it
		Integer searchTextLength = getSearchTextLength(searchText);
		if (searchTextLength < 2) {
			return result;
		}
		searchText = CommonUtils.escapeSosl(searchText, ignoreWildcards);

		// Get the search object
		Map<String, LtngSearchObject> searchObjects = parseSearchObjects(spec);
		LtngSearchObject searchObject = getFirstSearchObject(searchObjects);

		String typeName = searchObject.name;
		String fieldNames = String.join(searchObject.getFieldNames(), ',');

		// If a sort field was not specified then use the name field
		if (String.isBlank(sortField) || !searchObject.hasField(sortField)) {
			sortField = searchObject.nameField.name;
		}

		// Build the WHERE clause
		String filter = CommonUtils.trim(searchObject.filter);
		if (String.isNotBlank(filter)) {
			filter = ' WHERE (' + filter + ')';
		}

		// Build the ORDER BY clause
		String order = ' ORDER BY ' + sortField;
		order += sortAsc ? ' ASC NULLS FIRST' : ' DESC NULLS LAST';

		// Build the LIMIT clause
		String recordLimit = '';
		if ((howMany != null) && (howMany >= 0)) {
			recordLimit = ' LIMIT ' + String.valueOf(howMany);
		}

		// Build the SOSL query
		String sosl = 'FIND :searchText'
			+ ' IN NAME FIELDS'
			+ ' RETURNING ' + typeName + '(' + fieldNames + filter + order + ')'
			+ recordLimit;

		// Execute the query
		SharingContext context = getSharingContext(searchObject.withSharing);
		List<List<SObject>> all = trySearch(context, sosl, searchText);

		List<SObject> records = all[0];
		removeRecords(records, recordIds);

		// If records were returned then use PaginationUtils to paginate the data and get the
		// selected page of results
		if (!records.isEmpty()) {
			PaginationResult pr = PaginationUtils.getPage(
				records.size(),
				CommonUtils.decimalToInteger(pageSize),
				CommonUtils.decimalToInteger(pageNumber)
			);

			result.recordCount = pr.itemCount;
			result.pageSize = pr.pageSize;
			result.pageNumber = pr.pageNumber;
			result.pageCount = pr.pageCount;
			for (Integer i = pr.firstItemIndex; i <= pr.lastItemIndex; i++) {
				SObject record = records[i];
				result.records.add(new LtngSearchRecord(searchObject, record));
			}
		}

		return result;
	}

	/**
	 * Executes queries in a particular sharing context
	 */
	private interface SharingContext {
		/**
		 * @see SObjectUtils.getRecentlyViewedIds
		 */
		List<Id> getRecentlyViewedIds(String typeName, Integer howMany);

		/**
		 * @see SObjectUtils.getRecords
		 */
		List<SObject> getRecords(List<Id> recordIds, List<String> fieldNames, String filter);

		/**
		 * Executes a SOSL query
		 *
		 * @param sosl The search query
		 * @param searchText The text to search for
		 *
		 * @return The results of the search
		 */
		List<List<SObject>> search(String sosl, String searchText);
	}

	/**
	 * Respects sharing rules when executing queries
	 */
	private with sharing class WithSharingContext implements SharingContext {
		/**
		 * Implements SharingContext.getRecentlyViewedIds
		 */
		public List<Id> getRecentlyViewedIds(String typeName, Integer howMany) {
			return SObjectUtils.getRecentlyViewedIds(typeName, howMany);
		}

		/**
		 * Implements SharingContext.getRecords
		 */
		public List<SObject> getRecords(
			List<Id> recordIds,
			List<String> fieldNames,
			String filter
		) {
			return SObjectUtils.getRecords(recordIds, fieldNames, filter);
		}

		/**
		 * Implements SharingContext.search
		 */
		public List<List<SObject>> search(String sosl, String searchText) {
			return Search.query(sosl);
		}
	}

	/**
	 * Ignores sharing rules when executing queries
	 */
	private without sharing class WithoutSharingContext implements SharingContext {
		/**
		 * Implements SharingContext.getRecentlyViewedIds
		 */
		public List<Id> getRecentlyViewedIds(String typeName, Integer howMany) {
			return SObjectUtils.getRecentlyViewedIds(typeName, howMany);
		}

		/**
		 * Implements SharingContext.getRecords
		 */
		public List<SObject> getRecords(
			List<Id> recordIds,
			List<String> fieldNames,
			String filter
		) {
			return SObjectUtils.getRecords(recordIds, fieldNames, filter);
		}

		/**
		 * Implements SharingContext.search
		 */
		public List<List<SObject>> search(String sosl, String searchText) {
			return Search.query(sosl);
		}
	}
}