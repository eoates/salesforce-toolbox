/**
 * Contains test methods for the SObjectUtils class
 */
@IsTest
private class SObjectUtilsTest {
	@IsTest
	static void stringToId_Null() {
		System.assertEquals(null, SObjectUtils.stringToId(null));
	}

	@IsTest
	static void stringToId_Empty() {
		System.assertEquals(null, SObjectUtils.stringToId(''));
	}

	@IsTest
	static void stringToId_Invalid() {
		Boolean exceptionThrown = false;
		try {
			SObjectUtils.stringToId('Foo');
		} catch (StringException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void stringToId_Valid() {
		Id idValue = UserInfo.getUserId();
		String idString = String.valueOf(idValue);

		System.assertEquals(idValue, SObjectUtils.stringToId(idString));
	}

	@IsTest
	static void stringsToIds_Null() {
		List<Id> idValues = SObjectUtils.stringsToIds(null);
		System.assertNotEquals(null, idValues);
		System.assertEquals(true, idValues.isEmpty());
	}

	@IsTest
	static void stringsToIds_Valid() {
		Id userId = UserInfo.getUserId();
		Id profileId = UserInfo.getProfileId();

		List<String> idStrings = new List<String>();
		idStrings.add(String.valueOf(userId));
		idStrings.add(String.valueOf(profileId));

		List<Id> idValues = SObjectUtils.stringsToIds(idStrings);
		System.assertEquals(2, idValues.size());
		System.assertEquals(userId, idValues[0]);
		System.assertEquals(profileId, idValues[1]);
	}

	@IsTest
	static void idToString_Null() {
		System.assertEquals(null, SObjectUtils.idToString(null));
	}

	@IsTest
	static void idToString_Valid() {
		Id idValue = UserInfo.getUserId();
		String idString = String.valueOf(idValue);

		System.assertEquals(idString, SObjectUtils.idToString(idValue));
	}

	@IsTest
	static void idsToStrings_Null() {
		List<Id> idValues = SObjectUtils.idsToStrings(null);
		System.assertNotEquals(null, idValues);
		System.assertEquals(true, idValues.isEmpty());
	}

	@IsTest
	static void idsToStrings_Valid() {
		Id userId = UserInfo.getUserId();
		Id profileId = UserInfo.getProfileId();

		List<Id> idValues = new List<Id>();
		idValues.add(userId);
		idValues.add(profileId);

		List<String> idStrings = SObjectUtils.idsToStrings(idValues);
		System.assertEquals(2, idStrings.size());
		System.assertEquals(String.valueOf(userId), idStrings[0]);
		System.assertEquals(String.valueOf(profileId), idStrings[1]);
	}

	@IsTest
	static void getTypeByName_Null() {
		System.assertEquals(null, SObjectUtils.getTypeByName(null));
	}

	@IsTest
	static void getTypeByName_Empty() {
		System.assertEquals(null, SObjectUtils.getTypeByName(''));
	}

	@IsTest
	static void getTypeByName_Invalid() {
		System.assertEquals(null, SObjectUtils.getTypeByName('_INVALID_'));
	}

	@IsTest
	static void getTypeByName_Valid() {
		System.assertEquals(Account.SObjectType, SObjectUtils.getTypeByName('Account'));
	}

	@IsTest
	static void getTypesByName_Null() {
		List<Schema.SObjectType> typeTokens = SObjectUtils.getTypesByName(null);
		System.assertNotEquals(null, typeTokens);
		System.assertEquals(true, typeTokens.isEmpty());
	}

	@IsTest
	static void getTypesByName_Valid() {
		List<String> typeNames = new List<String>();
		typeNames.add('Account');
		typeNames.add('Contact');

		List<Schema.SObjectType> typeTokens = SObjectUtils.getTypesByName(typeNames);
		System.assertEquals(2, typeTokens.size());
		System.assertEquals(Account.SObjectType, typeTokens[0]);
		System.assertEquals(Contact.SObjectType, typeTokens[1]);
	}

	@IsTest
	static void getTypeByRecordId_Null() {
		System.assertEquals(null, SObjectUtils.getTypeByRecordId(null));
	}

	@IsTest
	static void getTypeByRecordId_Valid() {
		Id userId = UserInfo.getUserId();
		System.assertEquals(User.SObjectType, SObjectUtils.getTypeByRecordId(userId));
	}

	@IsTest
	static void getTypesByRecordId_Null() {
		List<Schema.SObjectType> typeTokens = SObjectUtils.getTypesByRecordId(null);
		System.assertNotEquals(null, typeTokens);
		System.assertEquals(true, typeTokens.isEmpty());
	}

	@IsTest
	static void getTypesByRecordId_Valid() {
		List<Id> recordIds = new List<Id>();
		recordIds.add(UserInfo.getUserId());
		recordIds.add(UserInfo.getProfileId());

		List<Schema.SObjectType> typeTokens = SObjectUtils.getTypesByRecordId(recordIds);
		System.assertEquals(2, typeTokens.size());
		System.assertEquals(User.SObjectType, typeTokens[0]);
		System.assertEquals(Profile.SObjectType, typeTokens[1]);
	}

	@IsTest
	static void getNameField_Null() {
		System.assertEquals(null, SObjectUtils.getNameField((String)null));
	}

	@IsTest
	static void getNameField_Empty() {
		System.assertEquals(null, SObjectUtils.getNameField(''));
	}

	@IsTest
	static void getNameField_Invalid() {
		System.assertEquals(null, SObjectUtils.getNameField('_INVALID_'));
	}

	@IsTest
	static void getNameField_Valid() {
		System.assertEquals(Account.Name, SObjectUtils.getNameField('Account'));
	}

	@IsTest
	static void getFieldByRelationshipName_NullTypeName() {
		System.assertEquals(null, SObjectUtils.getFieldByRelationshipName((String)null, 'Owner'));
	}

	@IsTest
	static void getFieldByRelationshipName_InvalidTypeName() {
		System.assertEquals(null, SObjectUtils.getFieldByRelationshipName('_INVALID_', 'Owner'));
	}

	@IsTest
	static void getFieldByRelationshipName_NullFieldName() {
		System.assertEquals(null, SObjectUtils.getFieldByRelationshipName('Account', null));
	}

	@IsTest
	static void getFieldByRelationshipName_InvalidFieldName() {
		System.assertEquals(null, SObjectUtils.getFieldByRelationshipName('Account', '_INVALID_'));
	}

	@IsTest
	static void getFieldByRelationshipName_Valid() {
		Schema.SObjectField fieldToken = SObjectUtils.getFieldByRelationshipName(
			'Account',
			'CreatedBy'
		);
		System.assertEquals(Account.CreatedById, fieldToken);
	}

	@IsTest
	static void getFieldByName_NullTypeName() {
		System.assertEquals(null, SObjectUtils.getFieldByName((String)null, 'Id'));
	}

	@IsTest
	static void getFieldByName_NullFieldName() {
		System.assertEquals(null, SObjectUtils.getFieldByName('Account', null));
	}

	@IsTest
	static void getFieldByName_InvalidTypeName() {
		System.assertEquals(null, SObjectUtils.getFieldByName('_INVALID_', 'Id'));
	}

	@IsTest
	static void getFieldByName_InvalidFieldName() {
		System.assertEquals(null, SObjectUtils.getFieldByName('Account', '_INVALID_'));
	}

	@IsTest
	static void getFieldByName_InvalidRelationshipName() {
		System.assertEquals(null, SObjectUtils.getFieldByName('Account', '_INVALID_.Id'));
	}

	@IsTest
	static void getFieldByName_ValidRelationshipName() {
		System.assertEquals(User.Name, SObjectUtils.getFieldByName('Account', 'CreatedBy.Name'));
	}

	@IsTest
	static void getFieldByName_Valid() {
		System.assertEquals(Account.Name, SObjectUtils.getFieldByName('Account', 'Name'));
	}

	@IsTest
	static void getFieldNamePath_Valid() {
		SObjectUtils.getFieldNamePath('Account', 'CreatedBy.Name');
		SObjectUtils.getFieldNamePathAsString('Account', 'CreatedBy.Name');
	}

	@IsTest
	static void getFieldLabelPath_Valid() {
		SObjectUtils.getFieldLabelPath('Account', 'CreatedBy.Name');
		SObjectUtils.getFieldLabelPathAsString('Account', 'CreatedBy.Name');
	}

	@IsTest
	static void getIds_List() {
		List<SObject> records = [SELECT Id FROM User WHERE IsActive = TRUE LIMIT 5];

		List<Id> recordIds = SObjectUtils.getIds(records);
		System.assertEquals(records.size(), recordIds.size());

		for (Integer i = 0; i < records.size(); i++) {
			System.assertEquals(records[i].Id, recordIds[i]);
		}
	}

	@IsTest
	static void getIds_Map() {
		Map<Id, SObject> records = new Map<Id, SObject>([
			SELECT Id FROM User WHERE IsActive = TRUE LIMIT 5
		]);

		List<Id> recordIds = SObjectUtils.getIds(records);
		System.assertEquals(records.size(), recordIds.size());

		Set<Id> idSet = new Set<Id>(recordIds);
		for (Id recordId : records.keySet()) {
			System.assertEquals(true, idSet.contains(recordId));
		}
	}

	@IsTest
	static void getUniqueIds_Null() {
		List<Id> recordIds = SObjectUtils.getUniqueIds((List<Id>)null);
		System.assertNotEquals(null, recordIds);
		System.assertEquals(true, recordIds.isEmpty());
	}

	@IsTest
	static void getUniqueIds_ListOfIds() {
		List<Id> recordIds = new List<Id>();
		recordIds.add(UserInfo.getUserId());
		recordIds.add(null);
		recordIds.add(UserInfo.getProfileId());
		recordIds.add(UserInfo.getProfileId());
		recordIds.add(null);
		recordIds.add(UserInfo.getUserId());

		List<Id> uniqueIds = SObjectUtils.getUniqueIds(recordIds);
		System.assertEquals(3, uniqueIds.size());
		System.assertEquals(UserInfo.getUserId(), uniqueIds[0]);
		System.assertEquals(null, uniqueIds[1]);
		System.assertEquals(UserInfo.getProfileId(), uniqueIds[2]);
	}

	@IsTest
	static void getUniqueIds_ListOfRecords() {
		List<SObject> records = new List<SObject>();
		records.add([SELECT Id FROM User WHERE Id = :UserInfo.getUserId()]);
		records.add(null);
		records.add([SELECT Id FROM Profile WHERE Id = :UserInfo.getProfileId()]);

		List<Id> recordIds = SObjectUtils.getUniqueIds(records);
		System.assertEquals(records.size(), recordIds.size());
		System.assertEquals(records[0].Id, recordIds[0]);
		System.assertEquals(null, recordIds[1]);
		System.assertEquals(records[2].Id, recordIds[2]);
	}

	@IsTest
	static void getUniqueIds_Map() {
		List<SObject> records = new List<SObject>();
		records.add([SELECT Id FROM User WHERE Id = :UserInfo.getUserId()]);
		records.add([SELECT Id FROM Profile WHERE Id = :UserInfo.getProfileId()]);

		List<Id> recordIds = SObjectUtils.getUniqueIds(new Map<Id, SObject>(records));
		System.assertEquals(records.size(), recordIds.size());
		System.assertEquals(records[0].Id, recordIds[0]);
		System.assertEquals(records[1].Id, recordIds[1]);
	}

	@IsTest
	static void getIdsGroupedByType_Null() {
		Map<Schema.SObjectType, List<Id>> groupedIds = SObjectUtils.getIdsGroupedByType(null);
		System.assertNotEquals(null, groupedIds);
		System.assertEquals(true, groupedIds.isEmpty());
	}

	@IsTest
	static void getIdsGroupedByType_Valid() {
		List<Id> recordIds = new List<Id>();
		recordIds.add(UserInfo.getUserId());
		recordIds.add(UserInfo.getProfileId());

		Map<Schema.SObjectType, List<Id>> groupedIds = SObjectUtils.getIdsGroupedByType(recordIds);

		List<Id> userIds = groupedIds.get(User.SObjectType);
		System.assertNotEquals(null, userIds);
		System.assertEquals(1, userIds.size());
		System.assertEquals(UserInfo.getUserId(), userIds[0]);

		List<Id> profileIds = groupedIds.get(Profile.SObjectType);
		System.assertNotEquals(null, profileIds);
		System.assertEquals(1, profileIds.size());
		System.assertEquals(UserInfo.getProfileId(), profileIds[0]);
	}

	@IsTest
	static void getFieldValue_Valid() {
		User u = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];
		Profile p = u.Profile;

		String profileName = (String)SObjectUtils.getFieldValue(u, 'Profile.Name');
		System.assertEquals(p.Name, profileName);
	}

	@IsTest
	static void setFieldValue_Valid() {
		User u = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];
		Profile p = u.Profile;

		SObjectUtils.setFieldValue(u, 'Profile.Name', 'Test');
		System.assertEquals('Test', p.Name);
	}

	@IsTest
	static void getRecentlyViewedIds_NoArgs() {
		SObjectUtils.getRecentlyViewedIds();
	}

	@IsTest
	static void getRecentlyViewedIds_Limit10() {
		SObjectUtils.getRecentlyViewedIds(10);
	}

	@IsTest
	static void getRecentlyViewedIds_SingleTypeNoLimit() {
		SObjectUtils.getRecentlyViewedIds('Account');
	}

	@IsTest
	static void getRecentlyViewedIds_SingleTypeLimit10() {
		SObjectUtils.getRecentlyViewedIds('Account', 10);
	}

	@IsTest
	static void getRecentlyViewedIds_MultipleTypesNoLimit() {
		List<String> typeNames = new List<String>();
		typeNames.add('Account');
		typeNames.add('Contact');

		SObjectUtils.getRecentlyViewedIds(typeNames);
	}

	@IsTest
	static void getRecentlyViewedIds_MultipleTypesLimit10() {
		List<String> typeNames = new List<String>();
		typeNames.add('Account');
		typeNames.add('Contact');

		SObjectUtils.getRecentlyViewedIds(typeNames, 10);
	}

	@IsTest
	static void getRecords_NoIds() {
		List<SObject> records = SObjectUtils.getRecords(null, null);
		System.assertEquals(true, records.isEmpty());
	}

	@IsTest
	static void getRecords_NoFields() {
		List<Id> recordIds = new List<Id>();
		recordIds.add(UserInfo.getUserId());

		List<SObject> records = SObjectUtils.getRecords(recordIds, null);
		System.assertEquals(1, records.size());
		System.assertEquals(recordIds[0], records[0].Id);
	}

	@IsTest
	static void getRecords_Filtered() {
		User u = [
			SELECT Profile.Name, FirstName, LastName, Email
			FROM User
			WHERE Id = :UserInfo.getUserId()
		];

		List<Id> recordIds = new List<Id>();
		recordIds.add(u.Id);

		List<String> fieldNames = new List<String>();
		fieldNames.add('Profile.Name');
		fieldNames.add('FirstName');
		fieldNames.add('LastName');
		fieldNames.add('Email');

		List<SObject> records = SObjectUtils.getRecords(recordIds, fieldNames, 'IsActive = TRUE');
		System.assertEquals(1, records.size());
		System.assertEquals(u.Id, records[0].Id);
		System.assertEquals(u.FirstName, (String)records[0].get('FirstName'));
		System.assertEquals(u.LastName, (String)records[0].get('LastName'));
		System.assertEquals(u.Email, (String)records[0].get('Email'));
	}

	@IsTest
	static void getRecords_MixedTypes() {
		List<Id> recordIds = new List<Id>();
		recordIds.add(UserInfo.getUserId());
		recordIds.add(UserInfo.getProfileId());

		Boolean exceptionThrown = false;
		try {
			SObjectUtils.getRecords(recordIds, null);
		} catch (SObjectException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void sequenceById_Valid() {
		Organization o = [SELECT Id FROM Organization WHERE Id = :UserInfo.getOrganizationId()];
		Profile p = [SELECT Id FROM Profile WHERE Id = :UserInfo.getProfileId()];
		User u = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];

		List<SObject> records = new List<SObject>();
		records.add(null);
		records.add(u);
		records.add(p);
		records.add(o);

		List<Id> sequence = new List<Id>();
		sequence.add(u.Id);
		sequence.add(null);
		sequence.add(o.Id);

		SObjectUtils.sequenceById(records, sequence);
		System.assertEquals(u, records[0]);
		System.assertEquals(null, records[1]);
		System.assertEquals(o, records[2]);
		System.assertEquals(p, records[3]);
	}
}