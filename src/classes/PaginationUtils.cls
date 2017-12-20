/**
 * Utility methods for paginated data sets
 */
public class PaginationUtils {
	// The minimum page size is 1
	public static final Integer MIN_PAGE_SIZE = 1;

	// The default page size. This value is only used if a page size is not specified
	public static final Integer DEFAULT_PAGE_SIZE = 20;

	/**
	 * Returns information for a single page of data
	 *
	 * @param itemCount The total number of items in the data set
	 * @param pageSize The number of items per page
	 * @param pageNumber The desired page number
	 *
	 * @return A PaginationResult containing information for the requested page of data
	 */
	public static PaginationResult getPage(
		Integer itemCount,
		Integer pageSize,
		Integer pageNumber
	) {
		List<PaginationResult> results = getPages(itemCount, pageSize, pageNumber, pageNumber);
		return (PaginationResult)CollectionUtils.getFirst(results);
	}

	/**
	 * Returns information for a range of pages
	 *
	 * @param itemCount The total number of items in the data set
	 * @param pageSize The number of items per page
	 * @param firstPageNumber The number of the first page to include. If not specified this
	 *                        defaults to 1
	 * @param lastPageNumber The number of the last page to include. If not specified this defaults
	 *                       to the total number of pages
	 *
	 * @return A list of PaginationResult objects containing a PaginationResult for each page in the
	 *         requested range
	 */
	public static List<PaginationResult> getPages(
		Integer itemCount,
		Integer pageSize,
		Integer firstPageNumber,
		Integer lastPageNumber
	) {
		List<PaginationResult> results = new List<PaginationResult>();

		if ((itemCount != null) && (itemCount > 0)) {
			// Make sure pageSize is valid
			if (pageSize == null) {
				// No page size specified; use default
				pageSize = DEFAULT_PAGE_SIZE;
			} else if (pageSize < MIN_PAGE_SIZE) {
				// Page size too small; use min page size
				pageSize = MIN_PAGE_SIZE;
			}

			// Calculate the total number of pages
			Integer pageCount = Math.ceil((Double)itemCount / (Double)pageSize).intValue();

			// Make sure first page number is valid
			if ((firstPageNumber == null) || (firstPageNumber < 1)) {
				// Start at first page
				firstPageNumber = 1;
			} else if (firstPageNumber > pageCount) {
				// Start at the last page
				firstPageNumber = pageCount;
			}

			// Make sure last page number is valid
			if (lastPageNumber == null) {
				// Start at the last page
				lastPageNumber = pageCount;
			} else if (lastPageNumber < firstPageNumber) {
				// Last page cannot be lower than first page
				lastPageNumber = firstPageNumber;
			} else if (lastPageNumber > pageCount) {
				// Page number too high; use last page
				lastPageNumber = pageCount;
			}

			// Get each page in the requested range
			for (Integer pageNumber = firstPageNumber; pageNumber <= lastPageNumber; pageNumber++) {
				// Get the index of the first and last item for this page
				Integer firstItemIndex = (pageNumber - 1) * pageSize;
				Integer lastItemIndex = Math.min((firstItemIndex + pageSize), itemCount) - 1;

				// Add the information to the list
				PaginationResult result = new PaginationResult();
				result.pageSize = pageSize;
				result.pageNumber = pageNumber;
				result.pageCount = pageCount;
				result.itemCount = itemCount;
				result.firstItemIndex = firstItemIndex;
				result.lastItemIndex = lastItemIndex;

				results.add(result);
			}
		}

		// Return the results
		return results;
	}
}