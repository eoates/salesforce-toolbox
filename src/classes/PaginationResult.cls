/**
 * Represents an individual page in a paginated data set
 */
public class PaginationResult {
	/**
	 * Creates a new PaginationResult object
	 */
	public PaginationResult() {
		this.pageSize = 0;
		this.pageNumber = 1;
		this.pageCount = 1;
		this.itemCount = 0;
		this.firstItemIndex = -1;
		this.lastItemIndex = -1;
	}

	/**
	 * The number of items per page
	 */
	public Integer pageSize { get; set; }

	/**
	 * The page number
	 */
	public Integer pageNumber { get; set; }

	/**
	 * Total number of pages in the paginated data set
	 */
	public Integer pageCount { get; set; }

	/**
	 * Total number of items in the data set
	 */
	public Integer itemCount { get; set; }

	/**
	 * The index of the first item for this page
	 */
	public Integer firstItemIndex { get; set; }

	/**
	 * The index of the last item for this page
	 */
	public Integer lastItemIndex { get; set; }
}