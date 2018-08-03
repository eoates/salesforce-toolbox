/**
 * Contains test methods for the LtngInputLookupController class
 *
 * @author  Eugene Oates
 * @since   2018-08-03
 * @version 1.0.0
 */
@IsTest
private class LtngInputLookupControllerTest {
	/**
	 * Creates a test user with the Standard User profile
	 */
	static User createStandardUser() {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Standard User'];

		User u = new User(
			Alias = 'standt',
			Email = 'standarduser@testorg.com',
			EmailEncodingKey = 'UTF-8',
			LastName = 'Testing',
			LanguageLocaleKey = 'en_US',
			LocaleSidKey = 'en_US',
			ProfileId = p.Id,
			TimeZoneSidKey = 'America/Los_Angeles',
			Username = 'standarduser' + DateTime.now().getTime() + '@testorg.com'
		);

		return u;
	}

	/**
	 * Creates a test account
	 */
	static Account createTestAccount() {
		Account a = new Account();
		a.Name = 'Test';
		insert a;

		return a;
	}

	/**
	 * Tests that the getSObjects() method behaves as expected when given a valid S-Object name
	 */
	@IsTest
	static void getSObjects_ValidObject_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetSObjectResult> results
				= LtngInputLookupController.getSObjects(new List<String> { 'Account'  });

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(1, results.size());
			System.assertEquals('Account', results[0].name);
		//}
	}

	/**
	 * Tests that the getSObjects() method throws an exception when given an invalid S-Object name
	 */
	@IsTest
	static void getSObjects_InvalidObjectName_ExceptionThrown() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			try {
				LtngInputLookupController.getSObjects(new List<String> { '_InvalidObjectName_'  });
				System.assert(false);
			} catch (AuraHandledException e) {
			}

			Test.stopTest();
		//}
	}

	/**
	 * Tests that the getSObjects() method throws an exception when given the name of a S-Object
	 * that is not queryable
	 */
	@IsTest
	static void getSObjects_NonQueryableObject_ExceptionThrown() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			try {
				LtngInputLookupController.getSObjects(new List<String> { 'Name'  });
				System.assert(false);
			} catch (AuraHandledException e) {
			}

			Test.stopTest();
		//}
	}

	/**
	 * Tests that the getSObjects() method throws an exception when given the name of a S-Object
	 * that has no name field
	 */
	@IsTest
	static void getSObjects_ObjectWithNoNameField_ExceptionThrown() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			try {
				LtngInputLookupController.getSObjects(new List<String> { 'AccountShare'  });
				System.assert(false);
			} catch (AuraHandledException e) {
			}

			Test.stopTest();
		//}
	}

	/**
	 * Tests that the getItems() method behaves as expected when given a valid record ID
	 */
	@IsTest
	static void getItems_ValidRecordId_Success() {
		User u = createStandardUser();

		System.runAs(u) {
			Account a = createTestAccount();

			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(new List<String> { a.Id });

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(1, results.size());
			System.assertEquals(a.Id, results[0].id);
		}
	}

	/**
	 * Tests that the getItems() method behaves as expected when given null
	 */
	@IsTest
	static void getItems_NullList_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(null);

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(0, results.size());
		//}
	}

	/**
	 * Tests that the getItems() method behaves as expected when given an empty list
	 */
	@IsTest
	static void getItems_EmptyList_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(new List<String>());

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(0, results.size());
		//}
	}

	/**
	 * Tests that the getItems() method behaves as expected when given a null record ID. Invalid
	 * record IDs (including null/blank) should be ignored
	 */
	@IsTest
	static void getItems_NullRecordId_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(new List<String> { null });

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(0, results.size());
		//}
	}

	/**
	 * Tests that the getItems() method beahves as expected when given a blank record ID. Invalid
	 * record IDs (including null/blank) should be ignored
	 */
	@IsTest
	static void getItems_BlankRecordId_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(new List<String> { '' });

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(0, results.size());
		//}
	}

	/**
	 * Tests that the getItems() method beahves as expected when given an invalid record ID. Invalid
	 * record IDs (including null/blank) should be ignored
	 */
	@IsTest
	static void getItems_InvalidRecordId_Success() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getItems(new List<String> { '_InvalidRecordId_' });

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(0, results.size());
		//}
	}

	/**
	 * Tests that the getRecentItems() method behaves as expected when given valid arguments
	 */
	@IsTest
	static void getRecentItems_ValidArgs_Success() {
		User u = createStandardUser();

		System.runAs(u) {
			Account a = createTestAccount();

			Test.startTest();

			List<LtngInputLookupController.GetItemResult> results
				= LtngInputLookupController.getRecentItems('Account', null, null, null, null);

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(1, results.size());
			System.assertEquals(a.Id, results[0].id);
		}
	}

	/**
	 * Tests tha the getLookupItems() method behaves as expected when given valid arguments
	 */
	@IsTest
	static void getLookupItems_ValidArgs_Success() {
		User u = createStandardUser();

		System.runAs(u) {
			Account a = createTestAccount();

			Test.startTest();
			Test.setFixedSearchResults(new List<Id> { a.Id });

			List<LtngInputLookupController.GetItemResult> results;
			results = LtngInputLookupController.getLookupItems(
				'Account',
				null,
				'Test',
				null,
				false,
				null,
				'LtngInputLookupDefaultProvider'
			);

			Test.stopTest();

			System.assertNotEquals(null, results);
			System.assertEquals(1, results.size());
			System.assertEquals(a.Id, results[0].id);
		}
	}

	/**
	 * Tests that the getLookupItems() method throws an exception when given an invalid provider
	 * name
	 */
	@IsTest
	static void getLookupItems_InvalidProviderName_ExceptionThrown() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			try {
				LtngInputLookupController.getLookupItems(
					'Account', null, 'Test', null, false, null, '_InvalidClassName_');
				System.assert(false);
			} catch (AuraHandledException e) {
			}

			Test.stopTest();
		//}
	}

	/**
	 * Tests that the getLookupItems() method throws an exception when given a provider name which
	 * does not implement the LtngInputLookupProvider interface
	 */
	@IsTest
	static void getLookupItems_ProviderDoesNotImplementInterface_ExceptionThrown() {
		//User u = createStandardUser();

		//System.runAs(u) {
			Test.startTest();

			try {
				LtngInputLookupController.getLookupItems(
					'Account', null, 'Test', null, false, null, 'LtngInputLookupController');
				System.assert(false);
			} catch (AuraHandledException e) {
			}

			Test.stopTest();
		//}
	}

	/**
	 * Tests that the search() method behaves as expected when given valid arguments
	 */
	@IsTest
	static void search_ValidArgs_Success() {
		User u = createStandardUser();

		System.runAs(u) {
			Account a = createTestAccount();

			Test.startTest();
			Test.setFixedSearchResults(new List<Id> { a.Id });

			LtngInputLookupController.search(
				'Account', // sObjectName
				'Name,Site,Owner.Alias|Owner,_InvalidFieldName_,ID,ID', // fieldNames
				'Test', // searchText
				null, // sortField
				null, // sortAscending
				null, // pageSize
				null, // pageNumber
				null, // filter
				true, // withoutSharing
				null, // howMany
				null // providerName
			);

			Test.stopTest();
		}
	}
}