/**
 * Contains test methods for the CommonUtils class
 */
@IsTest
private class CommonUtilsTest {
	@IsTest
	static void decimalToInteger_Null() {
		System.assertEquals(null, CommonUtils.decimalToInteger(null));
	}

	@IsTest
	static void decimalToInteger_NotNull() {
		System.assertEquals(100, CommonUtils.decimalToInteger(100.05));
	}

	@IsTest
	static void decimalToLong_Null() {
		System.assertEquals(null, CommonUtils.decimalToLong(null));
	}

	@IsTest
	static void decimalToLong_NotNull() {
		System.assertEquals(100, CommonUtils.decimalToLong(100.05));
	}

	@IsTest
	static void doubleToInteger_Null() {
		System.assertEquals(null, CommonUtils.doubleToInteger(null));
	}

	@IsTest
	static void doubleToInteger_NotNull() {
		System.assertEquals(100, CommonUtils.doubleToInteger(Double.valueOf(100.05)));
	}

	@IsTest
	static void doubleToLong_Null() {
		System.assertEquals(null, CommonUtils.doubleToLong(null));
	}

	@IsTest
	static void doubleToLong_NotNull() {
		System.assertEquals(100, CommonUtils.doubleToLong(Double.valueOf(100.05)));
	}

	@IsTest
	static void replaceNull_Null() {
		Object value = CommonUtils.replaceNull(null, 'Replacement');
		System.assertEquals('Replacement', value);
	}

	@IsTest
	static void replaceNull_NotNull() {
		Object value = CommonUtils.replaceNull('Test', 'Replacement');
		System.assertEquals('Test', value);
	}

	@IsTest
	static void getBoolean_Null() {
		System.assertEquals(false, CommonUtils.getBoolean(null));
	}

	@IsTest
	static void getBoolean_NotNull() {
		System.assertEquals(true, CommonUtils.getBoolean(true));
	}

	@IsTest
	static void getDecimal_Null() {
		System.assertEquals(0, CommonUtils.getDecimal(null));
	}

	@IsTest
	static void getDecimal_NotNull() {
		System.assertEquals(100, CommonUtils.getDecimal(100));
	}

	@IsTest
	static void getDouble_Null() {
		System.assertEquals(0, CommonUtils.getDouble(null));
	}

	@IsTest
	static void getDouble_NotNull() {
		System.assertEquals(100, CommonUtils.getDouble(100));
	}

	@IsTest
	static void getInteger_Null() {
		System.assertEquals(0, CommonUtils.getInteger(null));
	}

	@IsTest
	static void getInteger_NotNull() {
		System.assertEquals(100, CommonUtils.getInteger(100));
	}

	@IsTest
	static void getLong_Null() {
		System.assertEquals(0, CommonUtils.getLong(null));
	}

	@IsTest
	static void getLong_NotNull() {
		System.assertEquals(100, CommonUtils.getLong(100));
	}

	@IsTest
	static void getString_Null() {
		System.assertEquals('', CommonUtils.getString(null));
	}

	@IsTest
	static void getString_NotNull() {
		System.assertEquals('Test', CommonUtils.getString('Test'));
	}

	@IsTest
	static void escapeSoql_Null() {
		System.assertEquals(null, CommonUtils.escapeSoql(null));
	}

	@IsTest
	static void escapeSoql_NotNull() {
		System.assertEquals('\\"test\\"', CommonUtils.escapeSoql('"test"'));
		System.assertEquals('\\\'test\\\'', CommonUtils.escapeSoql('\'test\''));
		System.assertEquals('%_%_', CommonUtils.escapeSoql('%_%_', true));
		System.assertEquals('\\%\\_\\%\\_', CommonUtils.escapeSoql('%_%_', false));
	}

	@IsTest
	static void escapeSosl_Null() {
		System.assertEquals(null, CommonUtils.escapeSosl(null));
	}

	@IsTest
	static void escapeSosl_NotNull() {
		System.assertEquals('\\\\test\\\\', CommonUtils.escapeSosl('\\test\\'));
		System.assertEquals('\\&test\\&', CommonUtils.escapeSosl('&test&'));
		System.assertEquals('\\|test\\|', CommonUtils.escapeSosl('|test|'));
		System.assertEquals('\\!test\\!', CommonUtils.escapeSosl('!test!'));
		System.assertEquals('\\{test\\}', CommonUtils.escapeSosl('{test}'));
		System.assertEquals('\\[test\\]', CommonUtils.escapeSosl('[test]'));
		System.assertEquals('\\(test\\)', CommonUtils.escapeSosl('(test)'));
		System.assertEquals('\\^test\\^', CommonUtils.escapeSosl('^test^'));
		System.assertEquals('\\~test\\~', CommonUtils.escapeSosl('~test~'));
		System.assertEquals('\\:test\\:', CommonUtils.escapeSosl(':test:'));
		System.assertEquals('\\"test\\"', CommonUtils.escapeSosl('"test"'));
		System.assertEquals('\\\'test\\\'', CommonUtils.escapeSosl('\'test\''));
		System.assertEquals('\\+test\\+', CommonUtils.escapeSosl('+test+'));
		System.assertEquals('\\-test\\-', CommonUtils.escapeSosl('-test-'));
		System.assertEquals('?*?*', CommonUtils.escapeSosl('?*?*', true));
		System.assertEquals('\\?\\*\\?\\*', CommonUtils.escapeSosl('?*?*', false));
	}

	@IsTest
	static void escapeSingleQuotes_Null() {
		System.assertEquals(null, CommonUtils.escapeSingleQuotes(null));
	}

	@IsTest
	static void escapeSingleQuotes_NotNull() {
		System.assertEquals(
			'My \\\'Test\\\' Value',
			CommonUtils.escapeSingleQuotes('My \'Test\' Value')
		);
	}

	@IsTest
	static void unescapeSingleQuotes_Null() {
		System.assertEquals(null, CommonUtils.unescapeSingleQuotes(null));
	}

	@IsTest
	static void unescapeSingleQuotes_NotNull() {
		System.assertEquals(
			'My \'Test\' Value',
			CommonUtils.unescapeSingleQuotes('My \\\'Test\\\' Value')
		);
	}

	@IsTest
	static void trim_Null() {
		System.assertEquals('', CommonUtils.trim(null));
	}

	@IsTest
	static void trim_NotNull() {
		System.assertEquals('', CommonUtils.trim(''));
		System.assertEquals('', CommonUtils.trim(' '));
		System.assertEquals('Test', CommonUtils.trim(' Test'));
		System.assertEquals('Test', CommonUtils.trim('Test '));
		System.assertEquals('Test', CommonUtils.trim(' Test '));
		System.assertEquals('Test', CommonUtils.trim('Test'));
	}

	@IsTest
	static void trimAll_Null() {
		List<String> output = CommonUtils.trimAll(null);
		System.assertNotEquals(null, output);
		System.assertEquals(true, output.isEmpty());
	}

	@IsTest
	static void trimAll_NotNull() {
		List<String> input = new List<String>();
		input.add(null);
		input.add(' Test');
		input.add('Test ');
		input.add(' Test ');
		input.add('Test');

		List<String> output = CommonUtils.trimAll(input);
		System.assertEquals(input.size(), output.size());
		System.assertEquals('', output[0]);
		System.assertEquals('Test', output[1]);
		System.assertEquals('Test', output[2]);
		System.assertEquals('Test', output[3]);
		System.assertEquals('Test', output[4]);
	}
}