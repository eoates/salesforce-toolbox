/**
 * Contains test methods for the LtngSearchField class
 */
@IsTest
private class LtngSearchFieldTest {
	@IsTest
	static void parse_Null() {
		List<LtngSearchField> fields = LtngSearchField.parse(null);
		System.assertNotEquals(null, fields);
		System.assertEquals(0, fields.size());
	}

	@IsTest
	static void parse_Blank() {
		List<LtngSearchField> fields = LtngSearchField.parse('');
		System.assertNotEquals(null, fields);
		System.assertEquals(0, fields.size());
	}

	@IsTest
	static void parse_InvalidSyntax() {
		String specs = 'This is not valid syntax';

		Boolean exceptionThrown = false;
		try {
			LtngSearchField.parse(specs);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_Multiple_NameOnly() {
		String specs = 'Name, OwnerId, LastModifiedDate';

		List<LtngSearchField> fields = LtngSearchField.parse(specs);
		System.assertEquals(3, fields.size());
		System.assertEquals('Name', fields[0].name);
		System.assertEquals('OwnerId', fields[1].name);
		System.assertEquals('LastModifiedDate', fields[2].name);
	}

	@IsTest
	static void parse_Single_NameAndLabel() {
		String specs = 'Id AS \'My Custom Label\'';

		List<LtngSearchField> fields = LtngSearchField.parse(specs);
		System.assertEquals(1, fields.size());
		System.assertEquals('Id', fields[0].name);
		System.assertEquals('My Custom Label', fields[0].label);
	}

	@IsTest
	static void parse_Single_NameAndLabelWithEmbeddedQuotes() {
		String specs = 'Foo AS \'My \\\'Test\\\' Label\'';

		List<LtngSearchField> fields = LtngSearchField.parse(specs);
		System.assertEquals(1, fields.size());
		System.assertEquals('Foo', fields[0].name);
		System.assertEquals('My \'Test\' Label', fields[0].label);
	}

	@IsTest
	static void parse_Multiple_RelatedObjectFields() {
		String specs = 'Owner.Id, CreatedBy.Name AS \'Created By\'';

		List<LtngSearchField> fields = LtngSearchField.parse(specs);
		System.assertEquals(2, fields.size());
		System.assertEquals('Owner.Id', fields[0].name);
		System.assertEquals('CreatedBy.Name', fields[1].name);
		System.assertEquals('Created By', fields[1].label);
	}

	@IsTest
	static void parse_Multiple_VisibilityModifiers() {
		String specs = 'Name IMPORTANT, SystemModstamp AS \'Modified\' HIDDEN, CreatedDate';

		List<LtngSearchField> fields = LtngSearchField.parse(specs);
		System.assertEquals(3, fields.size());
		System.assertEquals('Name', fields[0].name);
		System.assertEquals(true, fields[0].important);
		System.assertEquals(false, fields[0].hidden);
		System.assertEquals('SystemModstamp', fields[1].name);
		System.assertEquals('Modified', fields[1].label);
		System.assertEquals(false, fields[1].important);
		System.assertEquals(true, fields[1].hidden);
		System.assertEquals('CreatedDate', fields[2].name);
		System.assertEquals(false, fields[2].important);
		System.assertEquals(false, fields[2].hidden);
	}
}