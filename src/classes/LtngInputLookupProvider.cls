/**
 * Data provider for the inputLookup Lightning component
 *
 * @author  Eugene Oates
 * @since   2018-08-03
 * @version 1.0.0
 */
global interface LtngInputLookupProvider {
	/**
	 * Returns a list of recent items for the specified S-Object
	 *
	 * @param sObjectName The API name of the S-Object
	 * @param fieldNames The list of fields to be included
	 * @param filter An optional filter passed via the input component
	 * @param howMany The number of items to return
	 *
	 * @return A list of recent items
	 */
	List<SObject> getRecentItems(
		String sObjectName,
		List<String> fieldNames,
		String filter,
		Integer howMany
	);

	/**
	 * Returns a list of items that match the specified search text
	 *
	 * @param sObjectName The API name of the S-Object
	 * @param fieldNames The list of fields to be included
	 * @param searchText The text entered into the component to be used for the search
	 * @param filter An optional filter passed via the input component
	 * @param sortField The name of the field to sort by
	 * @param sortAscending The direction to sort the results
	 * @param howMany The number of items to return
	 * @param withoutSharing An optional flag set via the input component
	 *
	 * @return A list of items that match the search text
	 */
	List<SObject> search(
		String sObjectName,
		List<String> fieldNames,
		String searchText,
		String filter,
		String sortField,
		Boolean sortAscending,
		Integer howMany,
		Boolean withoutSharing
	);
}