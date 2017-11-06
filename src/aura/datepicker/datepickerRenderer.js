({
	/**
	 * This method is called by the Aura framework when the component has been rendered for the
	 * first time. This is where we will initially create our DOM elements for the calendar
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		// Create calendar DOM elements
		var year = component.get('v.year');
		var month = component.get('v.month');
		var value = helper.toDate(component.get('v.value'));
		var calendar = helper.getCalendar(year, month, value);

		helper.addRows(component, calendar);
		helper.updateMonthName(component, calendar);
		helper.updateYearOptions(component, calendar);
		helper.updateActiveCellTabIndex(component, false);
	}
})