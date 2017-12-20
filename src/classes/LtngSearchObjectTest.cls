/**
 * Contains test methods for the LtngSearchObject class
 */
@IsTest
private class LtngSearchObjectTest {
	@IsTest
	static void parse_Null() {
		System.assertEquals(null, LtngSearchObject.parse(null));
	}

	@IsTest
	static void parse_Blank() {
		System.assertEquals(null, LtngSearchObject.parse(''));
	}

	@IsTest
	static void parse_InvalidObjectSyntax() {
		String spec = 'This is not valid object syntax';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_InvalidFieldSyntax() {
		String spec = 'Account SELECT (This is not valid field syntax)';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_InvalidObjectName() {
		String spec = 'Invalid_Object_Name';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_InvalidFieldName() {
		String spec = 'Account SELECT (Invalid_Field_Name)';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_DuplicateField() {
		String spec = 'Account SELECT (Name, name)';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_TypeNotQueryable() {
		String spec = 'AggregateResult';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_TypeNotSearchable() {
		String spec = 'Organization';

		Boolean exceptionThrown = false;
		try {
			LtngSearchObject.parse(spec);
		} catch (LtngSearchException e) {
			exceptionThrown = true;
		}
		System.assertEquals(true, exceptionThrown);
	}

	@IsTest
	static void parse_Simple() {
		String spec = 'Account';

		LtngSearchObject o = LtngSearchObject.parse(spec);
		System.assertEquals('Account', o.name);
		System.assertEquals(2, o.fields.size());
		System.assertEquals(true, o.hasField('Id'));
		System.assertEquals(true, o.hasField('Name'));
		System.assertEquals(o.nameField, o.getField('Name'));

		List<String> fieldNames = o.getFieldNames();
		System.assertEquals(2, fieldNames.size());
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(fieldNames, 'Id'));
		System.assertEquals(true, CollectionUtils.containsIgnoreCase(fieldNames, 'Name'));
	}

	@IsTest
	static void parse_Complex() {
		String spec = 'Account'
			+ ' AS \'My Account\'|\'My Accounts\''
			+ ' USE ICON \'standard:account\''
			+ ' SELECT('
			+ '   Id HIDDEN,'
			+ '   Name AS \'My Account Name\' IMPORTANT,'
			+ '   Owner.Name AS \'Owner\','
			+ '   CreatedDate'
			+ ' )'
			+ ' WHERE CreatedDate = TODAY';

		LtngSearchObject o = LtngSearchObject.parse(spec);
		System.assertEquals('Account', o.name);
		System.assertEquals('My Account', o.label);
		System.assertEquals('My Accounts', o.labelPlural);
		System.assertEquals('standard:account', o.iconName);
		System.assertEquals(4, o.fields.size());
		System.assertEquals('Id', o.fields[0].name);
		System.assertEquals(true, o.fields[0].hidden);
		System.assertEquals('Name', o.fields[1].name);
		System.assertEquals('My Account Name', o.fields[1].label);
		System.assertEquals(true, o.fields[1].important);
		System.assertEquals('Owner.Name', o.fields[2].name);
		System.assertEquals('Owner', o.fields[2].label);
		System.assertEquals('CreatedDate', o.fields[3].name);
		System.assertEquals('CreatedDate = TODAY', o.filter);
	}
}