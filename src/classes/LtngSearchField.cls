/**
 * Represents an individual field
 */
public class LtngSearchField {
	// Individual field pattern
	private static final String FIELD_SPEC_PATTERN = ''
		+ '(\\w+(?:\\.\\w+)*)'
		+ '(?:\\s+AS\\s*\'((?:[^\'\\\\]|\\\\.)*)\')?'
		+ '(?:\\s+(IMPORTANT|HIDDEN))?';

	// Field list pattern
	private static final String FIELD_LIST_PATTERN = ''
		+ FIELD_SPEC_PATTERN
		+ '(?:\\s*,\\s*' + FIELD_SPEC_PATTERN + ')*';

	/**
	 * Creates a LtngSearchField object
	 */
	public LtngSearchField() {
		this.dataType = 'STRING';
		this.precision = 0;
		this.scale = 0;
		this.length = 0;
		this.sortable = false;
		this.important = false;
		this.hidden = false;
	}

	/**
	 * Gets or sets the field name
	 */
	@AuraEnabled
	public String name { get; set; }

	/**
	 * Gets or sets the label
	 */
	@AuraEnabled
	public String label { get; set; }

	/**
	 * Gets or sets the data type
	 */
	@AuraEnabled
	public String dataType { get; set; }

	/**
	 * Gets or sets the number of digits in the number. For number fields only
	 */
	@AuraEnabled
	public Integer precision { get; set; }

	/**
	 * Gets or sets the number of digits to the right of the decimal. For number fields only
	 */
	@AuraEnabled
	public Integer scale { get; set; }

	/**
	 * Gets or sets the number of allowed characters. For string fields only
	 */
	@AuraEnabled
	public Integer length { get; set; }

	/**
	 * Gets or sets a value that indicates whether the field is sortable
	 */
	@AuraEnabled
	public Boolean sortable { get; set; }

	/**
	 * Gets or sets a value that indicates whether the field should be considered important.
	 * Important fields should be displayed in the UI even if the user does not have access to the
	 * field
	 */
	@AuraEnabled
	public Boolean important { get; set; }

	/**
	 * Gets or sets a value that indicates whether the field should be hidden. Hidden fields should
	 * not be displayed in the UI even if the user has access to the field
	 */
	@AuraEnabled
	public Boolean hidden { get; set; }

	/**
	 * Parses a string and returns a list of LtngSearchField objects
	 *
	 * The accepted syntax is:
	 * Name [AS 'Label'] [IMPORTANT|HIDDEN]
	 *
	 * Example:
	 * Id, Name IMPORTANT, OwnerId AS 'Owner', SystemModstamp HIDDEN, CreatedBy.Name AS 'Created By'
	 *
	 * @param specs The string to parse
	 *
	 * @return A list of LtngSearchField objects
	 */
	public static List<LtngSearchField> parse(String specs) {
		List<LtngSearchField> fields = new List<LtngSearchField>();

		specs = CommonUtils.trim(specs);
		if (String.isBlank(specs)) {
			return fields;
		}

		if (!Pattern.matches('(?i)^' + FIELD_LIST_PATTERN + '$', specs)) {
			throw new LtngSearchException('Unable to parse fields: "' + specs + '".');
		}

		Pattern p = Pattern.compile('(?i)' + FIELD_SPEC_PATTERN);
		Matcher m = p.matcher(specs);
		while (m.find()) {
			String name = m.group(1);
			String label = CommonUtils.unescapeSingleQuotes(m.group(2));
			String modifier = m.group(3);

			LtngSearchField f = new LtngSearchField();
			f.name = name;
			f.label = label;
			f.important = 'IMPORTANT'.equalsIgnoreCase(modifier);
			f.hidden = 'HIDDEN'.equalsIgnoreCase(modifier);

			fields.add(f);
		}

		return fields;
	}
}