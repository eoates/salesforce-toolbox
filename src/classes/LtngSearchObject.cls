/**
 * Information about an S-Object type for use in search-related Lightning components
 */
public class LtngSearchObject {
	private static final String OBJECT_SPEC_PATTERN = ''
		+ '(\\w+)'
		+ '(?:\\s+AS\\s*\'((?:[^\'\\\\]|\\\\.)*)\'(?:\\s*\\|\\s*\'((?:[^\'\\\\]|\\\\.)*)\')?)?'
		+ '(?:\\s+USE\\s+ICON\\s*\'((?:[^\'\\\\]|\\\\.)*)\')?'
		+ '(?:\\s+(WITH|WITHOUT)\\s+SHARING)?'
		+ '(?:\\s+SELECT\\s*\\((.*)\\))?'
		+ '(?:\\s+WHERE\\s+(.*))?';

	private static final String DEFAULT_ICON_NAME = 'standard:default';

	private static final Map<String, String> STANDARD_ICON_NAMES = new Map<String, String> {
		'Account' => 'standard:account',
		'Attachment' => 'standard:file',
		'Campaign' => 'standard:campaign',
		'Case' => 'standard:case',
		'Contact' => 'standard:contact',
		'Contract' => 'standard:contract',
		'Dashboard' => 'standard:dashboard',
		'Document' => 'standard:document',
		'Event' => 'standard:event',
		'Group' => 'standard:groups',
		'Lead' => 'standard:lead',
		'Note' => 'standard:note',
		'Opportunity' => 'standard:opportunity',
		'Report' => 'standard:report',
		'Task' => 'standard:task',
		'User' => 'standard:user'
	};

	/**
	 * Creates a LtngSearchObject object
	 */
	public LtngSearchObject() {
		this.withSharing = true;
		this.createable = false;
		this.fields = new List<LtngSearchField>();
	}

	/**
	 * Gets or sets the S-Object type name
	 */
	@AuraEnabled
	public String name { get; set; }

	/**
	 * Gets or sets the label
	 */
	@AuraEnabled
	public String label { get; set; }

	/**
	 * Gets or sets the label to use when the plural form is needed
	 */
	@AuraEnabled
	public String labelPlural { get; set; }

	/**
	 * Gets or sets the key prefix for the object. The key prefix is the first 3 characters used in
	 * IDs for records of this type
	 */
	@AuraEnabled
	public String keyPrefix { get; set; }

	/**
	 * Gets or sets the name of the icon to use. Uses the same convention as the lightning:icon
	 * component (e.g. 'standard:account', 'standard:contact', 'custom:custom34')
	 */
	@AuraEnabled
	public String iconName { get; set; }

	/**
	 * Gets or sets a value that indicates whether sharing rules should be respected when searching
	 * for records of this type
	 */
	@AuraEnabled
	public Boolean withSharing { get; set; }

	/**
	 * Gets or sets the name field. As the name implies, the name field is the field which contains
	 * the record's name
	 */
	@AuraEnabled
	public LtngSearchField nameField { get; set; }

	/**
	 * Gets or sets a value that indicates whether the current user can create records of this type
	 */
	@AuraEnabled
	public Boolean createable { get; set; }

	/**
	 * Gets or sets an optional filter that should be applied to queries/searches. This filter value
	 * is not checked or validated so make sure that it contains valid SOQL
	 */
	@AuraEnabled
	public String filter { get; set; }

	/**
	 * Gets or sets the fields
	 */
	@AuraEnabled
	public List<LtngSearchField> fields { get; set; }

	/**
	 * Parses a string and returns a LtngSearchObject object
	 *
	 * The accepted syntax is:
	 * ObjectName
	 *   [AS 'Label' [ | 'Plural']]
	 *   [USE ICON 'icon:name']
	 *   [SELECT (field1 [AS 'Label1'] [(IMPORTANT|HIDDEN)][, field2 [AS 'Label2'] [(IMPORTANT|HIDDEN)]])]
	 *   [WHERE filter]
	 *
	 * Examples:
	 * Account USE ICON 'standard:account' WHERE IsPersonAccount = TRUE
	 *
	 * Contact AS 'Person'|'People' SELECT (Id HIDDEN, Email AS 'E-mail') WHERE CreateDate = TODAY
	 *
	 * Lead SELECT (Id, Name) WHERE IsConverted = FALSE
	 *
	 * @param spec The string to parse
	 *
	 * @return A LtngSearchObject object
	 */
	public static LtngSearchObject parse(String spec) {
		spec = CommonUtils.trim(spec);
		if (String.isBlank(spec)) {
			return null;
		}

		Pattern p = Pattern.compile('(?i)^' + OBJECT_SPEC_PATTERN + '$');
		Matcher m = p.matcher(spec);
		if (!m.matches()) {
			throw new LtngSearchException('Unable to parse object: "' + spec + '".');
		}

		LtngSearchObject o = new LtngSearchObject();
		o.name = m.group(1);
		o.label = CommonUtils.unescapeSingleQuotes(m.group(2));
		o.labelPlural = CommonUtils.unescapeSingleQuotes(m.group(3));
		o.iconName = CommonUtils.unescapeSingleQuotes(m.group(4));
		o.withSharing = !('WITHOUT'.equalsIgnoreCase(m.group(5)));
		o.fields = parseFields(o, m.group(6));
		o.filter = m.group(7);

		Schema.SObjectType typeToken = SObjectUtils.getTypeByName(o.name);
		if (typeToken == null) {
			throw new LtngSearchException('Invalid S-Object ' + o.name + '.');
		}

		Schema.DescribeSObjectResult typeInfo = typeToken.getDescribe();
		checkTypeIsQueryable(typeInfo);
		checkTypeIsSearchable(typeInfo);

		addIdField(o);
		addNameField(o);

		setObjectProperties(o, typeInfo);
		setAllFieldProperties(o);

		checkForDuplicateFields(o);
		ensureAtLeastOneFieldIsVisible(o);

		return o;
	}

	/**
	 * Throws an exception if the type is not queryable
	 *
	 * @param typeInfo S-Object describe result
	 */
	private static void checkTypeIsQueryable(Schema.DescribeSObjectResult typeInfo) {
		if (!typeInfo.isQueryable()) {
			throw new LtngSearchException('S-Object ' + typeInfo.getName() + ' is not queryable.');
		}
	}

	/**
	 * Throws an exception if the type is not searchable
	 *
	 * @param typeInfo S-Object describe result
	 */
	private static void checkTypeIsSearchable(Schema.DescribeSObjectResult typeInfo) {
		if (!typeInfo.isSearchable()) {
			throw new LtngSearchException('S-Object ' + typeInfo.getName() + ' is not searchable.');
		}
	}

	/**
	 * Parses object fields
	 *
	 * @param o The object
	 * @param specs The string to parse
	 *
	 * @return A list of LtngSearchField objects
	 */
	private static List<LtngSearchField> parseFields(LtngSearchObject o, String specs) {
		try {
			return LtngSearchField.parse(specs);
		} catch (LtngSearchException e) {
			String message = 'Unable to parse fields for S-Object ' + o.name + ': "' + specs + '".';
			throw new LtngSearchException(message);
		}
	}

	/**
	 * Throws an exception if object contains duplicate fields
	 *
	 * @param o The object
	 */
	private static void checkForDuplicateFields(LtngSearchObject o) {
		Set<String> fieldNames = new Set<String>();
		for (LtngSearchField f : o.fields) {
			String fieldName = f.name.toLowerCase();
			if (fieldNames.contains(fieldName)) {
				String message = 'Duplicate field ' + fieldName
					+ ' specified for S-Object ' + o.name + '.';

				throw new LtngSearchException(message);
			}

			fieldNames.add(fieldName);
		}
	}

	/**
	 * If there are no visible fields then the name field is forced visible
	 *
	 * @param o The object
	 */
	private static void ensureAtLeastOneFieldIsVisible(LtngSearchObject o) {
		for (LtngSearchField f : o.fields) {
			if (!f.hidden) {
				return;
			}
		}
		o.nameField.important = true;
		o.nameField.hidden = false;
	}

	/**
	 * Adds the standard ID field if not already included
	 *
	 * @param o The object
	 */
	private static void addIdField(LtngSearchObject o) {
		if (!o.hasField('Id')) {
			addField(o, 'Id');
		}
	}

	/**
	 * Adds the S-Object's name field if not already included
	 *
	 * @param o The object
	 */
	private static void addNameField(LtngSearchObject o) {
		Schema.SObjectField nameFieldToken = SObjectUtils.getNameField(o.name);
		Schema.DescribeFieldResult nameFieldInfo = nameFieldToken.getDescribe();

		LtngSearchField nameField = o.getField(nameFieldInfo.getName());
		if (nameField == null) {
			nameField = addField(o, nameFieldInfo.getName());
		}

		o.nameField = nameField;
	}

	/**
	 * Adds a field
	 *
	 * @param o The object
	 * @param fieldName The name of the field to add
	 *
	 * @return The added field
	 */
	private static LtngSearchField addField(LtngSearchObject o, String fieldName) {
		Schema.SObjectField fieldToken = SObjectUtils.getFieldByName(o.name, fieldName);
		Schema.DescribeFieldResult fieldInfo = fieldToken.getDescribe();

		LtngSearchField f = new LtngSearchField();
		f.name = fieldInfo.getName();
		f.hidden = true;

		o.fields.add(f);

		setSingleFieldProperties(o, f, fieldInfo);

		return f;
	}

	/**
	 * Sets object properties
	 *
	 * @param o The object
	 * @param typeInfo S-Object describe result
	 */
	private static void setObjectProperties(
		LtngSearchObject o,
		Schema.DescribeSObjectResult typeInfo
	) {
		o.name = typeInfo.getName();
		if (String.isBlank(o.label)) {
			o.label = typeInfo.getLabel();
		}
		if (String.isBlank(o.labelPlural)) {
			o.labelPlural = typeInfo.getLabelPlural();
		}
		o.keyPrefix = typeInfo.getKeyPrefix();
		if (String.isBlank(o.iconName)) {
			o.iconName = getDefaultIconName(typeInfo.getName());
		}
		o.createable = typeInfo.isCreateable();
	}

	/**
	 * Sets properties for all fields
	 *
	 * @param o The object
	 */
	private static void setAllFieldProperties(LtngSearchObject o) {
		for (LtngSearchField f : o.fields) {
			Schema.SObjectField fieldToken = SObjectUtils.getFieldByName(o.name, f.name);
			if (fieldToken == null) {
				String message = 'Invalid field ' + f.name
					+ ' specified for S-Object ' + o.name + '.';

				throw new LtngSearchException(message);
			}

			setSingleFieldProperties(o, f, fieldToken.getDescribe());
		}
	}

	/**
	 * Sets an individual field properties
	 *
	 * @param o The object
	 * @param f The field
	 * @param fieldInfo Field describe result
	 */
	private static void setSingleFieldProperties(
		LtngSearchObject o,
		LtngSearchField f,
		Schema.DescribeFieldResult fieldInfo
	) {
		f.name = SObjectUtils.getFieldNamePathAsString(o.name, f.name);
		if (String.isBlank(f.label)) {
			f.label = SObjectUtils.getFieldLabelPathAsString(o.name, f.name);
		}
		f.dataType = fieldInfo.getType().name();
		f.precision = fieldInfo.getPrecision();
		f.scale = fieldInfo.getScale();
		f.length = fieldInfo.getLength();
		f.sortable = fieldInfo.isSortable();
		if (!f.important && !f.hidden) {
			f.hidden = !fieldInfo.isAccessible();
		}
	}

	/**
	 * Returns the name of a default icon for the specified type. Use this when a icon was not
	 * explicitly set
	 *
	 * @param typeName The name of the S-Object type
	 *
	 * @return The name of the icon to use
	 */
	private static String getDefaultIconName(String typeName) {
		String iconName = DEFAULT_ICON_NAME;
		if (STANDARD_ICON_NAMES.containsKey(typeName)) {
			iconName = STANDARD_ICON_NAMES.get(typeName);
		}
		return iconName;
	}

	/**
	 * Returns true if the object contains a field with the specified name
	 *
	 * @param fieldName The name of the field
	 *
	 * @return true if the object contains a field with the specified name; otherwise, false
	 */
	public Boolean hasField(String fieldName) {
		return getField(fieldName) != null;
	}

	/**
	 * Returns a field by its name
	 *
	 * @param fieldName The name of the field
	 *
	 * @return A LtngSearchField object or null if the field could not be found
	 */
	public LtngSearchField getField(String fieldName) {
		if ((fields != null) && String.isNotBlank(fieldName)) {
			for (LtngSearchField f : fields) {
				if (fieldName.equalsIgnoreCase(f.name)) {
					return f;
				}
			}
		}
		return null;
	}

	/**
	 * Returns the list of field names
	 *
	 * @return A list of field names
	 */
	public List<String> getFieldNames() {
		List<String> fieldNames = new List<String>();
		if (fields != null) {
			for (LtngSearchField f : fields) {
				String fieldName = f.name;
				if (String.isNotBlank(fieldName)) {
					fieldNames.add(fieldName);
				}
			}
		}
		return fieldNames;
	}
}