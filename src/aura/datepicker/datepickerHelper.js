/**************************************************************************************************
 * datepickerHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	VALUE_FORMAT: 'yyyy-MM-dd',
	MONTH_NAMES: [
		'January', 'February', 'March', 'April', 'May', 'June', 'July',
		'August', 'September', 'October', 'November', 'December'
	],

	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The datepicker component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Gets the calendar for the specified month. The calendar has an array containing all of the
	 * days in the month. Each day has information about that day such as whether it is the selected
	 * date, whether it is disabled, etc.
	 *
	 * @param {number} year       - The year
	 * @param {number} month      - The month
	 * @param {Date}   [selected] - The selected date
	 *
	 * @return {Object} The calendar for the specified month
	 */
	getCalendar: function(year, month, selected) {
		var today = new Date();
		var firstDayOfMonth = this.utils.firstDayOfMonth(year, month);
		var lastDayOfMonth = this.utils.lastDayOfMonth(year, month);
		var beginDate = this.utils.addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
		var endDate = this.utils.addDays(lastDayOfMonth, 6 - lastDayOfMonth.getDay());
		var days = this.utils.daysBetween(endDate, beginDate);
		var weeks = Math.ceil(days / 7);
		if (weeks === 4) {
			// Show last week of previous month and first week of next month
			beginDate = this.utils.addDays(beginDate, -7);
			endDate = this.utils.addDays(endDate, 7);
		} else if (weeks === 5) {
			// Show the first full week of the next month
			endDate = this.utils.addDays(endDate, 7);
		}

		var currentDate = beginDate;
		var calendarDays = [];
		for (var y = 0; y < 6; y++) {
			for (var x = 0; x < 7; x++) {
				var day = {
					index: (y * 7) + x,
					value: currentDate,
					year: currentDate.getFullYear(),
					month: currentDate.getMonth(),
					date: currentDate.getDate(),
					selected: this.utils.sameDay(currentDate, selected),
					today: this.utils.sameDay(currentDate, today),
					disabled: (currentDate.getMonth() !== month)
				};
				calendarDays.push(day);

				currentDate = this.utils.addDays(currentDate, 1);
			}
		}

		return {
			year: year,
			month: month,
			monthName: this.MONTH_NAMES[month],
			selected: selected,
			days: calendarDays
		};
	},

	/**
	 * Returns the first day in the calendar that matches the predicate
	 *
	 * @param {Object}   calendar  - The calendar
	 * @param {Function} predicate - A function that will be called for each day in the calendar
	 *
	 * @return {Object} The first day that matched the specified predicate. If there was no match
	 *                  then null is returned
	 */
	getDay: function(calendar, predicate) {
		var days = calendar.days;
		for (var i = 0, n = days.length; i < n; i++) {
			var day = days[i];
			var match = predicate.call(this, day);
			if (match) {
				return day;
			}
		}
		return null;
	},

	/**
	 * Returns the day at the specified index
	 *
	 * @param {Object} calendar - The calendar
	 * @param {number} index    - The index of the desired day
	 *
	 * @return {Object} The day at the specified index
	 */
	getDayByIndex: function(calendar, index) {
		return calendar.days[index];
	},

	/**
	 * Returns the day for the specified date
	 *
	 * @param {Object} calendar - The calendar
	 * @param {Date}   date     - The value of the day to return
	 *
	 * @return {Object} The day for the specified date
	 */
	getDayByValue: function(calendar, date) {
		return this.getDay(calendar, function(day) {
			return this.utils.sameDay(day.value, date);
		});
	},

	/**
	 * Adds the rows to the calendar body. This is only called once in the afterRender() method of
	 * the component's renderer
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {Object}         calendar  - The calendar
	 *
	 * @return {void}
	 */
	addRows: function(component, calendar) {
		var self = this;

		var globalId = component.getGlobalId();

		var rows = document.createDocumentFragment();

		var days = calendar.days;
		var dayIndex = 0;
		for (var y = 0; y < 6; y++) {
			var row = document.createElement('tr');
			row.id = globalId + '_row_' + y;
			rows.appendChild(row);

			for (var x = 0; x < 7; x++) {
				var day = days[dayIndex++];

				var cell = document.createElement('td');
				cell.id = globalId + '_cell_' + day.index;
				cell.setAttribute('role', 'gridcell');
				row.appendChild(cell);

				var span = document.createElement('span');
				span.className = 'slds-day';
				span.addEventListener('mousedown', $A.getCallback(function(event) {
					self.handleDayMouseDown(component, event);
				}), false);
				cell.appendChild(span);

				this.updateCell(cell, calendar, day);
			}
		}

		var body = document.getElementById(globalId + '_body');
		body.appendChild(rows);
	},

	/**
	 * Updates all of the cells in the calendar when the month or selected date is changed
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {Object}         calendar  - The calendar
	 *
	 * @return {void}
	 */
	updateRows: function(component, calendar) {
		var globalId = component.getGlobalId();

		var body = document.getElementById(globalId + '_body');
		var rows = body.childNodes;

		var days = calendar.days;
		var dayIndex = 0;
		for (var y = 0; y < 6; y++) {
			var row = rows[y];
			var cells = row.childNodes;

			for (var x = 0; x < 7; x++) {
				var day = days[dayIndex++];
				var cell = cells[x];
				this.updateCell(cell, calendar, day);
			}
		}
	},

	/**
	 * Updates an individual cell in the calendar
	 *
	 * @param {HTMLElement} cell     - The cell to update
	 * @param {Object}      calendar - The calendar
	 * @param {Object}      day      - The day that the cell represents
	 *
	 * @return {void}
	 */
	updateCell: function(cell, calendar, day) {
		this.utils.toggleClass(cell, 'slds-disabled-text', day.disabled);
		this.utils.toggleClass(cell, 'slds-is-selected', !day.disabled && day.selected);
		this.utils.toggleClass(cell, 'slds-is-today', !day.disabled && !day.selected && day.today);

		this.setElementAttribute(cell, 'aria-disabled', day.disabled ? true : null);
		this.setElementAttribute(cell, 'aria-selected', !day.disabled && day.selected);
		this.setElementAttribute(
			cell,
			'aria-current',
			(!day.disabled && day.today) ? 'date' : null
		);

		this.setElementAttribute(cell, 'data-index', day.index);
		this.setElementAttribute(cell, 'data-year', day.year);
		this.setElementAttribute(cell, 'data-month', day.month);
		this.setElementAttribute(cell, 'data-date', day.date);

		var span = cell.querySelector('span.slds-day');
		span.innerText = day.date;
	},

	/**
	 * Updates the displayed month name whenever the month changes
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {Object}         calendar  - The calendar
	 *
	 * @return {void}
	 */
	updateMonthName: function(component, calendar) {
		var globalId = component.getGlobalId();

		var container = document.getElementById(globalId + '_container');
		container.setAttribute('aria-label', 'Date picker: ' + calendar.monthName);

		var month = document.getElementById(globalId + '_month');
		month.innerText = calendar.monthName;
	},

	/**
	 * Updates the year select options when the year changes
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {Object}         calendar  - The calendar
	 *
	 * @return {void}
	 */
	updateYearOptions: function(component, calendar) {
		var globalId = component.getGlobalId();

		var yearSelect = document.getElementById(globalId + '_year');

		var beginYear = calendar.year - 5;
		var endYear = calendar.year + 10;
		var selectedIndex = -1;
		var index = 0;
		for (var i = beginYear; i < endYear; i++) {
			var option;
			if (index < yearSelect.childNodes.length) {
				option = yearSelect.childNodes[index];
			} else {
				option = document.createElement('option');
				yearSelect.appendChild(option);
			}

			option.value = this.utils.asString(i);
			option.innerText = option.value;

			if (i === calendar.year) {
				selectedIndex = index;
			}
			index++;
		}

		// Make sure the correct year is selected
		yearSelect.selectedIndex = selectedIndex;

		// Truncate any extra options
		var years = endYear - beginYear;
		while (yearSelect.childNodes.length > years) {
			yearSelect.removeChild(yearSelect.lastChild);
		}
	},

	/**
	 * Updates the active cell's tabindex. Also removes the tabindex attribute from any previously
	 * active cell(s)
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {boolean}        [focus]   - true if the active cell should receive focus; otherwise,
	 *                                     false
	 *
	 * @return {void}
	 */
	updateActiveCellTabIndex: function(component, focus) {
		var globalId = component.getGlobalId();

		var activeIndex = component.activeIndex;
		var activeCell = document.getElementById(globalId + '_cell_' + activeIndex);
		if (activeCell) {
			this.utils.toggleClass(activeCell, 'is-active', true);
			this.setElementAttribute(activeCell, 'tabindex', 0);
			if (focus) {
				this.focusActiveCell(component);
			}
		}

		var body = document.getElementById(globalId + '_body');
		var cells = body.querySelectorAll('td.is-active');
		for (var i = 0, n = cells.length; i < n; i++) {
			var cell = cells[i];
			var index = parseInt(cell.getAttribute('data-index'), 10);
			if (index !== activeIndex) {
				this.utils.toggleClass(cell, 'is-active', false);
				this.setElementAttribute(cell, 'tabindex', null);
			}
		}
	},

	/**
	 * Sets focus to the cell which represents the active day
	 *
	 * @param {Aura.Component} component - The datepicker component
	 *
	 * @return {void}
	 */
	focusActiveCell: function(component) {
		var globalId = component.getGlobalId();
		var activeIndex = component.activeIndex;
		var cell = document.getElementById(globalId + '_cell_' + activeIndex);
		if (cell && cell.focus) {
			cell.focus();
		}
	},

	/**
	 * Handles the mousedown event on an individual day cell. Since the cells are being created
	 * dynamically in the helper and not using an aura:iteration component in the markup, we have to
	 * have the event handler here instead of in the controller
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {MouseEvent}     event     - The event information
	 *
	 * @return {void}
	 */
	handleDayMouseDown: function(component, event) {
		var span = event.target;
		var cell = span.parentNode;
		var index = parseInt(cell.getAttribute('data-index'), 10);
		if (!this.utils.isNumber(index)) {
			return;
		}

		var year = component.year;
		var month = component.month;
		var value = this.utils.asDate(component.get('v.value'));
		var calendar = this.getCalendar(year, month, value);

		var day = this.getDayByIndex(calendar, index);
		if (day.disabled) {
			return;
		}

		this.setValue(component, day.value, true);
	},

	/**
	 * Increments or decrements the active day by a specified number of units. The units can be
	 * years ("y"), months ("m"), or days ("d")
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {number}         count     - The number of years/months/days to increment or decrement
	 * @param {string}         unit      - The unit by which to increment or decrement ("y" = years,
	 *                                     "m" = months, "d" = days)
	 * @param {boolean}        focus     - true if the active day should receive focus; otherwise,
	 *                                     false
	 *
	 * @return {void}
	 */
	navigate: function(component, count, unit, focus) {
		var year = component.year;
		var month = component.month;
		var value = this.utils.asDate(component.get('v.value'));
		var calendar = this.getCalendar(year, month, value);

		var activeIndex = component.activeIndex;
		var activeDay = this.getDayByIndex(calendar, activeIndex);
		var activeDate = activeDay.value;

		if (unit === 'y') {
			// Years
			activeDate = this.utils.addYears(activeDate, count);
		} else if (unit === 'm') {
			// Months
			activeDate = this.utils.addMonths(activeDate, count);
		} else if (unit === 'd') {
			// Days
			activeDate = this.utils.addDays(activeDate, count);
		}

		// Display the active day
		this.setActiveDate(component, activeDate, focus, calendar);
	},

	/**
	 * Sets the selected value
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {Date}           value     - The value
	 * @param {boolean}        [focus]   - true if the active day should receive the focus
	 *
	 * @return {void}
	 */
	setValue: function(component, value, focus) {
		var oldValue = component.get('v.value');
		if (this.utils.sameDay(value, this.utils.asDate(oldValue))) {
			this.setActiveDate(component, value, focus);
			this.fireEvent(component, 'onselect', {
				value: value
			});
			return false;
		}

		var today = new Date();
		var year = value ? value.getFullYear() : today.getFullYear();
		var month = value ? value.getMonth() : today.getMonth();
		var calendar = this.getCalendar(year, month, value);
		var activeDay = this.getDayByValue(calendar, value || today);

		// If the component has been rendered then update the DOM elements
		if (component.isRendered()) {
			this.updateRows(component, calendar);
			this.updateMonthName(component, calendar);
			this.updateYearOptions(component, calendar);
		}

		// Update the active day
		var activeIndex = component.activeIndex;
		if (activeDay.index !== activeIndex) {
			activeIndex = activeDay.index;
			component.activeIndex = activeIndex;

			if (component.isRendered()) {
				this.updateActiveCellTabIndex(component, focus);
			}
		} else if (focus && component.isRendered()) {
			this.focusActiveCell(component);
		}

		// Set the value
		if (value) {
			value = this.utils.formatDate(value, this.VALUE_FORMAT);
		} else {
			value = null;
		}

		component.ignoreValueChange = true;
		try {
			component.set('v.value', value);
		} finally {
			component.ignoreValueChange = false;
		}

		// Fire the select event
		this.fireEvent(component, 'onselect', {
			value: value
		});

		// Fire the change event
		this.fireEvent(component, 'onchange', {
			value: value,
			oldValue: oldValue
		});
	},

	/**
	 * Returns the active date
	 *
	 * @param {Aura.Component} component - The datepicker component
	 *
	 * @return {Date} The active date
	 */
	getActiveDate: function(component) {
		var year = component.year;
		var month = component.month;
		var value = this.utils.asDate(component.get('v.value'));
		var calendar = this.getCalendar(year, month, value);

		var activeIndex = component.activeIndex;
		var activeDay = this.getDayByIndex(calendar, activeIndex);

		return activeDay.value;
	},

	/**
	 * Sets the actively displayed day
	 *
	 * @param {Aura.Component} component  - The datepicker component
	 * @param {Date}           date       - The date of the active day
	 * @param {boolean}        [focus]    - true if the active day should receive focus
	 * @param {Object}         [calendar] - The calendar
	 *
	 * @return {void}
	 */
	setActiveDate: function(component, date, focus, calendar) {
		var year = component.year;
		var month = component.month;
		var value = this.utils.asDate(component.get('v.value'));
		var activeIndex = component.activeIndex;

		// If the calendar was not specified then get it using the currently selected year and month
		if (!calendar) {
			calendar = this.getCalendar(year, month, value);
		}

		// Get the year and month from the new active date
		year = date.getFullYear();
		month = date.getMonth();

		// If the year or month has changed then we need to update the UI
		var yearChanged = (year !== calendar.year);
		var monthChanged = (month !== calendar.month);
		if (yearChanged || monthChanged) {
			component.year = year;
			component.month = month;

			calendar = this.getCalendar(year, month, value);

			if (component.isRendered()) {
				this.updateRows(component, calendar);
				if (monthChanged) {
					this.updateMonthName(component, calendar);
				}
				if (yearChanged) {
					this.updateYearOptions(component, calendar);
				}
			}
		}

		// If the active cell index has changed then we need to update the tabindex attribute for
		// the new active cell and any previously active cell(s)
		var activeDay = this.getDayByValue(calendar, date);
		if (activeDay.index !== activeIndex) {
			activeIndex = activeDay.index;
			component.activeIndex = activeIndex;

			if (component.isRendered()) {
				this.updateActiveCellTabIndex(component, focus);
			}
		} else if (focus && component.isRendered()) {
			// Otherwise, if the active cell did not change then simply set focus to it
			this.focusActiveCell(component);
		}
	},

	/**
	 * Cancels selection of a new date and resets the calendar to display the selected date or today
	 * if no date is selected
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {boolean}        [focus]   - true if the active day should receive focus
	 *
	 * @return {void}
	 */
	cancel: function(component, focus) {
		var today = new Date();
		var value = this.utils.asDate(component.get('v.value'));
		this.setActiveDate(component, value || today, focus);
		this.fireEvent(component, 'oncancel');
	},

	/**
	 * Sets an element attribute. If the value is undefined/null then the attribute is removed
	 *
	 * @param {HTMLElement} element - The element
	 * @param {string}      name    - The attribute name
	 * @param {*}           value   - The attribute value
	 *
	 * @return {void}
	 */
	setElementAttribute: function(element, name, value) {
		if (this.utils.isUndefinedOrNull(value)) {
			element.removeAttribute(name);
		} else {
			element.setAttribute(name, value);
		}
	},

	/**
	 * Fire the named event
	 *
	 * @param {Aura.Component} component - The datepicker component
	 * @param {string}         name      - The event name
	 * @param {Object}         args      - Optional event arguments
	 *
	 * @return {void}
	 */
	fireEvent: function(component, name, args) {
		var event = component.getEvent(name);
		event.setParam('arguments', args || {});
		event.fire();
	}
}) // eslint-disable-line semi