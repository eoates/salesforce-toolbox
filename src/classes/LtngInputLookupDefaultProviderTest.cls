/**
 * Contains test methods for the LtngInputLookupDefaultProvider class
 *
 * @author  Eugene Oates
 * @since   2018-08-03
 * @version 1.0.0
 */
@IsTest
private class LtngInputLookupDefaultProviderTest {
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
	 * Tests the getRecentItems() method with various scenarios
	 */
	@IsTest
	static void getRecentItems() {
		User u = createStandardUser();

		System.runAs(u) {
			Account a = createTestAccount();

			Test.startTest();

			LtngInputLookupDefaultProvider provider = new LtngInputLookupDefaultProvider();
			provider.getRecentItems('Account', new List<String> { 'Name' }, 'CreatedDate = TODAY', 100);
			provider.getRecentItems('Contact', new List<String> { 'Name' }, null, 100);

			Test.stopTest();
		}
	}

	/**
	 * Tests the search() method with various scenarios
	 */
	@IsTest
	static void search() {
		User u = createStandardUser();

		System.runAs(u) {
			Test.startTest();

			LtngInputLookupDefaultProvider provider = new LtngInputLookupDefaultProvider();
			provider.search('Account', new List<String> { 'Name' }, 'Test', 'CreatedDate = TODAY', 'Name', true, 100, false);
			provider.search('RecordType', new List<String> { 'Name' }, 'Test', 'IsActive = TRUE', 'Name', false, 100, false);
			provider.search('AuraDefinitionBundle', new List<String> { 'DeveloperName' }, 'Test', null, null, false, 100, false);

			Test.stopTest();
		}
	}
}