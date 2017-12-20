/**
 * Contains common utility/helper methods
 */
public class CommonUtils {
	/**
	 * Converts a decimal to an integer
	 *
	 * @param value A decimal value
	 *
	 * @return An integer value
	 */
	public static Integer decimalToInteger(Decimal value) {
		return (value != null) ? value.intValue() : null;
	}

	/**
	 * Converts a decimal to a long
	 *
	 * @param value A decimal value
	 *
	 * @return A long value
	 */
	public static Long decimalToLong(Decimal value) {
		return (value != null) ? value.longValue() : null;
	}

	/**
	 * Converts a double to an integer
	 *
	 * @param value A double value
	 *
	 * @return An integer value
	 */
	public static Integer doubleToInteger(Double value) {
		return (value != null) ? value.intValue() : null;
	}

	/**
	 * Converts a double to a long
	 *
	 * @param value A decimal value
	 *
	 * @return A long value
	 */
	public static Long doubleToLong(Double value) {
		return (value != null) ? value.longValue() : null;
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise, replacementValue
	 */
	public static Object replaceNull(Object value, Object replacementValue) {
		System.assertNotEquals(null, replacementValue, 'Replacement value should not be null');
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns false
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise, false
	 */
	public static Boolean getBoolean(Boolean value) {
		return getBoolean(value, false);
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static Boolean getBoolean(Boolean value, Boolean replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns 0
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise 0
	 */
	public static Decimal getDecimal(Decimal value) {
		return getDecimal(value, 0);
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static Decimal getDecimal(Decimal value, Decimal replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns 0
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise 0
	 */
	public static Double getDouble(Double value) {
		return getDouble(value, 0);
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static Double getDouble(Double value, Double replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns 0
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise 0
	 */
	public static Integer getInteger(Integer value) {
		return getInteger(value, 0);
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static Integer getInteger(Integer value, Integer replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns 0
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise 0
	 */
	public static Long getLong(Long value) {
		return getLong(value, 0);
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static Long getLong(Long value, Long replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Checks value and, if it is null, returns an empty string
	 *
	 * @param value The value to check
	 *
	 * @return value if it is not null; otherwise an empty string
	 */
	public static String getString(String value) {
		return getString(value, '');
	}

	/**
	 * Checks value and, if it is null, returns replacementValue
	 *
	 * @param value The value to check
	 * @param replacementValue The value to return if value is null
	 *
	 * @return value if it is not null; otherwise replacementValue
	 */
	public static String getString(String value, String replacementValue) {
		return (value != null) ? value : replacementValue;
	}

	/**
	 * Escapes special characters in a string by prefixing them with a backslash
	 *
	 * @param input The input string
	 * @param charsToEscape The characters to escape. If this contains the right bracket (i.e. ']')
	 *                      character then make sure it is escaped or an exception will occur
	 *
	 * @return The escaped string
	 */
	private static String escapeChars(String input, String charsToEscape) {
		if (input == null) {
			return null;
		}
		Pattern p = Pattern.compile('[' + charsToEscape + ']');
		Matcher m = p.matcher(input);
		String escaped = m.replaceAll('\\\\$0');
		return escaped;
	}

	/**
	 * Escapes special SOQL characters, including wildcards
	 *
	 * @param input The input string
	 *
	 * @return The escaped string
	 */
	public static String escapeSoql(String input) {
		return escapeSoql(input, false);
	}

	/**
	 * Escapes special SOQL characters
	 *
	 * @param input The input string
	 * @param ignoreWildcards If true then wildcard characters are not escaped
	 *
	 * @return The escaped string
	 */
	public static String escapeSoql(String input, Boolean ignoreWildcards) {
		String charsToEscape = '"\'';
		if (ignoreWildcards != true) {
			charsToEscape += '_%';
		}
		return escapeChars(input, charsToEscape);
	}

	/**
	 * Escapes special SOSL characters, including wildcards
	 *
	 * @param input The input string
	 *
	 * @return The escaped string
	 */
	public static String escapeSosl(String input) {
		return escapeSosl(input, false);
	}

	/**
	 * Escapes special SOSL characters
	 *
	 * @param input The input string
	 * @param ignoreWildcards If true then wildcard characters are not escaped
	 *
	 * @return The escaped string
	 */
	public static String escapeSosl(String input, Boolean ignoreWildcards) {
		String charsToEscape = '\\\\&|!{}\\[\\]()^~:"\'+-';
		if (ignoreWildcards != true) {
			charsToEscape += '?*';
		}
		return escapeChars(input, charsToEscape);
	}

	/**
	 * Escapes single quote characters
	 *
	 * @param input The input string
	 *
	 * @return The escaped string
	 */
	public static String escapeSingleQuotes(String input) {
		return (input != null) ? String.escapeSingleQuotes(input) : null;
	}

	/**
	 * Unescapes single quote characters
	 *
	 * @param input The input string
	 *
	 * @return The unescaped string
	 */
	public static String unescapeSingleQuotes(String input) {
		return (input != null) ? input.replace('\\\'', '\'') : null;
	}

	/**
	 * Removes leading and trailing white space characters. If the string is null then an empty
	 * string is returned
	 *
	 * @param value The string to trim
	 *
	 * @return The trimmed string
	 */
	public static String trim(String value) {
		return (value != null) ? value.trim() : '';
	}

	/**
	 * Removes leading and trailing white spacer characters from zero or more strings. Null strings
	 * are converted to empty strings
	 *
	 * @param values The strings to trim
	 *
	 * @return A list containing the trimmed strings
	 */
	public static List<String> trimAll(List<String> values) {
		List<String> trimmed = new List<String>();
		if (values != null) {
			for (String value : values) {
				trimmed.add(trim(value));
			}
		}
		return trimmed;
	}
}