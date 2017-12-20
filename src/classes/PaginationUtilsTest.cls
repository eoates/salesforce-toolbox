/**
 * Contains test methods for the PaginationUtils class
 */
@IsTest
private class PaginationUtilsTest {
	@IsTest
	static void getPage_AllArgsNull() {
		PaginationResult result = PaginationUtils.getPage(null, null, null);

		System.assertEquals(null, result);
	}

	@IsTest
	static void getPage_ItemCountNull() {
		PaginationResult result = PaginationUtils.getPage(null, 10, 1);

		System.assertEquals(null, result);
	}

	@IsTest
	static void getPage_ItemCountNegative() {
		PaginationResult result = PaginationUtils.getPage(-10, 10, 1);

		System.assertEquals(null, result);
	}

	@IsTest
	static void getPage_ItemCountZero() {
		PaginationResult result = PaginationUtils.getPage(0, 10, 1);

		System.assertEquals(null, result);
	}

	@IsTest
	static void getPage_PageSizeNull() {
		PaginationResult result = PaginationUtils.getPage(35, null, null);

		System.assertEquals(PaginationUtils.DEFAULT_PAGE_SIZE, result.pageSize);
	}

	@IsTest
	static void getPage_PageSizeNegative() {
		PaginationResult result = PaginationUtils.getPage(35, -1, null);

		System.assertEquals(PaginationUtils.MIN_PAGE_SIZE, result.pageSize);
	}

	@IsTest
	static void getPage_PageNumberNull() {
		PaginationResult result = PaginationUtils.getPage(35, 10, null);

		System.assertEquals(10, result.pageSize);
		System.assertEquals(1, result.pageNumber);
		System.assertEquals(4, result.pageCount);
		System.assertEquals(35, result.itemCount);
		System.assertEquals(0, result.firstItemIndex);
		System.assertEquals(9, result.lastItemIndex);
	}

	@IsTest
	static void getPage_PageNumberTooLow() {
		PaginationResult result = PaginationUtils.getPage(35, 10, -1);

		System.assertEquals(10, result.pageSize);
		System.assertEquals(1, result.pageNumber);
		System.assertEquals(4, result.pageCount);
		System.assertEquals(35, result.itemCount);
		System.assertEquals(0, result.firstItemIndex);
		System.assertEquals(9, result.lastItemIndex);
	}

	@IsTest
	static void getPage_PageNumberTooHigh() {
		PaginationResult result = PaginationUtils.getPage(35, 10, 50);

		System.assertEquals(10, result.pageSize);
		System.assertEquals(4, result.pageNumber);
		System.assertEquals(4, result.pageCount);
		System.assertEquals(35, result.itemCount);
		System.assertEquals(30, result.firstItemIndex);
		System.assertEquals(34, result.lastItemIndex);
	}
}