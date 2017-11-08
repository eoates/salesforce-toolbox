({
	afterRender: function(component, helper) {
		this.superAfterRender();
		helper.updateInputElementValue(component);
	}
})