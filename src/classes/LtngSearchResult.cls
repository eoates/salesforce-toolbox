/**
 * Represents a search result
 */
public class LtngSearchResult {
	/**
	 * Creates a LtngSearchResult object
	 */
	public LtngSearchResult() {
		recordCount = 0;
		pageSize = 0;
		pageNumber = 1;
		pageCount = 1;
		records = new List<LtngSearchRecord>();
	}

	/**
	 * Gets or sets the total number of records returned by the search
	 */
	@AuraEnabled
	public Integer recordCount { get; set; }

	/**
	 * Gets or sets the number of records displayed per page
	 */
	public Integer pageSize { get; set; }

	/**
	 * Gets or sets the page number
	 */
	@AuraEnabled
	public Integer pageNumber { get; set; }

	/**
	 * Gets or sets the number of pages
	 */
	@AuraEnabled
	public Integer pageCount { get; set; }

	/**
	 * Gets or sets the records for the current page. If pageCount is 1 then the number of records
	 * in this list should be equal to recordCount. If pageCount is greater than 1, however, the
	 * number of records in the list should be less than or equal to pageSize
	 */
	@AuraEnabled
	public List<LtngSearchRecord> records { get; set; }
}