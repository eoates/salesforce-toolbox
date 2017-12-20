/**
 * Contains test methods for the LtngSearchController class
 */
@IsTest
private class LtngSearchControllerTest {
	private static User createTestUser() {
		return createTestUsers(1)[0];
	}

	private static List<User> createTestUsers(Integer howMany) {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];

		List<User> testUsers = new List<User>();
		for (Integer i = 0; i < howMany; i++) {
			User testUser = new User(
				Alias = 'standt',
				Email = 'standarduser@testorg.com',
				EmailEncodingKey = 'UTF-8',
				LastName = 'Testing',
				LanguageLocaleKey = 'en_US',
				LocaleSidKey = 'en_US',
				ProfileId = p.Id,
				TimeZoneSidKey = 'America/Los_Angeles',
				Username = 'standarduser.' + i + '.' + Datetime.now().getTime() + '@testorg.com'
			);

			testUsers.add(testUser);
		}

		insert testUsers;
		return testUsers;
	}

	private static List<SObject> createTestRecords(Id ownerId, Integer howMany) {
		List<SObject> testRecords = new List<SObject>();
		for (Integer i = 0; i < howMany; i++) {
			Account record = new Account();
			record.OwnerId = ownerId;
			record.Name = 'Test ' + i;

			testRecords.add(record);
		}

		insert testRecords;
		return testRecords;
	}

	@IsTest
	static void getSearchObjects_Valid() {
		User testUser = createTestUser();
		List<SObject> testRecords = createTestRecords(testUser.Id, 1);

		List<LtngSearchObject> searchObjects;

		System.runAs(testUser) {
			Test.startTest();

			List<String> specs = new List<String>();
			specs.add('Account');

			List<String> recordIds = new List<String>();
			recordIds.add(UserInfo.getUserId());
			recordIds.add(testRecords[0].Id);

			searchObjects = LtngSearchController.getSearchObjects(specs, recordIds);

			Test.stopTest();
		}

		System.assertEquals(2, searchObjects.size());
		System.assertEquals('Account', searchObjects[0].name);
		System.assertEquals('User', searchObjects[1].name);
	}

	@IsTest
	static void getRecords_Valid() {
		List<User> testUsers = createTestUsers(2);

		List<SObject> testRecordsUser1 = createTestRecords(testUsers[0].Id, 1);
		List<SObject> testRecordsUser2 = createTestRecords(testUsers[1].Id, 1);

		List<LtngSearchRecord> records;

		System.runAs(testUsers[0]) {
			Test.startTest();

			List<String> specs = new List<String>();
			specs.add('Account');

			List<String> recordIds = new List<String>();
			recordIds.add(testRecordsUser1[0].Id);
			recordIds.add(testRecordsUser2[0].Id);

			records = LtngSearchController.getRecords(specs, recordIds);

			Test.stopTest();
		}

		System.assertEquals(2, records.size());
		System.assertEquals(testRecordsUser1[0].Id, records[0].recordId);
		System.assertEquals(testRecordsUser2[0].Id, records[1].recordId);
	}

	@IsTest
	static void getRecentItems_Valid() {
		User testUser = createTestUser();
		List<SObject> testRecords = createTestRecords(testUser.Id, 1);

		List<LtngSearchRecord> records;

		System.runAs(testUser) {
			Test.startTest();

			Database.query(
				'SELECT Id'
				+ ' FROM ' + testRecords[0].getSObjectType()
				+ ' WHERE Id = \'' + testRecords[0].Id + '\''
				+ ' FOR VIEW'
			);

			records = LtngSearchController.getRecentItems('Account', 10);

			Test.stopTest();
		}

		System.assertEquals(1, records.size());
		System.assertEquals(testRecords[0].Id, records[0].recordId);
	}

	@IsTest
	static void getLookupItems_Valid() {
		User testUser = createTestUser();

		List<SObject> testRecords = createTestRecords(testUser.Id, 4);
		testRecords[0].put('Name', 'John Doe');
		testRecords[1].put('Name', 'Jane Doe');
		testRecords[2].put('Name', 'John Smith');
		testRecords[3].put('Name', 'Guybrush Threepwood');
		update testRecords;

		List<LtngSearchRecord> records;

		System.runAs(testUser) {
			Test.setFixedSearchResults(new List<Id> {
				testRecords[0].Id,
				testRecords[2].Id
			});
			Test.startTest();

			List<String> recordIds = new List<String>();
			recordIds.add(testRecords[0].Id);

			records = LtngSearchController.getLookupItems('Account', 'John', recordIds, 5);

			Test.stopTest();
		}

		System.assertEquals(1, records.size());
		System.assertEquals(testRecords[2].Id, records[0].recordId);
	}

	@IsTest
	static void getSearchResult_SearchTextTooShort() {
		User testUser = createTestUser();
		List<SObject> testRecords = createTestRecords(testUser.Id, 1);

		LtngSearchResult result;

		System.runAs(testUser) {
			Test.setFixedSearchResults(new List<Id> { testRecords[0].Id });
			Test.startTest();

			result = LtngSearchController.getSearchResult(
				'Account',
				'*t',
				null,
				null,
				null,
				null,
				null,
				null
			);

			Test.stopTest();
		}

		System.assertEquals(0, result.recordCount);
	}

	@IsTest
	static void getSearchResult_Valid() {
		User testUser = createTestUser();
		List<SObject> testRecords = createTestRecords(testUser.Id, 10);
		List<Id> testRecordIds = SObjectUtils.getIds(testRecords);

		LtngSearchResult result;

		System.runAs(testUser) {
			Test.setFixedSearchResults(testRecordIds);
			Test.startTest();

			result = LtngSearchController.getSearchResult(
				'Account WITHOUT SHARING WHERE CreatedDate = TODAY',
				'Test',
				null,
				'Name',
				false,
				1000,
				5,
				1
			);

			Test.stopTest();
		}

		System.assertEquals(testRecords.size(), result.recordCount);
		System.assertEquals(5, result.pageSize);
		System.assertEquals(1, result.pageNumber);
		System.assertEquals(2, result.pageCount);
		System.assertEquals(5, result.records.size());
	}
}