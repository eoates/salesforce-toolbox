public class LtngSearchRecord {
	public LtngSearchRecord(LtngSearchObject o, SObject record) {
		this.typeName = String.valueOf(record.getSObjectType());
		this.recordId = record.Id;
		this.name = String.valueOf(record.get(o.nameField.name));
		this.fields = new Map<String, Object>();

		for (LtngSearchField f : o.fields) {
			String fieldName = f.name;
			Object fieldValue = SObjectUtils.getFieldValue(record, fieldName);

			this.fields.put(fieldName, fieldValue);
		}
	}

	@AuraEnabled
	public String typeName { get; set; }

	@AuraEnabled
	public String recordId { get; set; }

	@AuraEnabled
	public String name { get; set; }

	@AuraEnabled
	public Map<String, Object> fields { get; set; }
}