/**************************************************************************************************
 * datepickerRenderer.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  1.0.0
 *
 **************************************************************************************************/
({
	/**
	 * This method is called by the Aura framework when the component has been rendered for the
	 * first time. This is where we will initially create our DOM elements for the calendar
	 */
	afterRender: function(component, helper) {
		this.superAfterRender();

		// Create calendar DOM elements
		var year = component.year;
		var month = component.month;
		var value = helper.utils.asDate(component.get('v.value'));
		var calendar = helper.getCalendar(year, month, value);

		helper.addRows(component, calendar);
		helper.updateMonthName(component, calendar);
		helper.updateYearOptions(component, calendar);
		helper.updateActiveCellTabIndex(component, false);
	}
}) // eslint-disable-line semi