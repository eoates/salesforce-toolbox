({
	/**
	 * Sets focus to the component
	 */
	focus: function(component, event, helper) {
		helper.focusActiveCell(component);
	},

	/**
	 * Initializes the component
	 */
	init: function(component, event, helper) {
		var today = new Date();
		var value = helper.toDate(component.get('v.value'));
		var year = value ? value.getFullYear() : today.getFullYear();
		var month = value ? value.getMonth() : today.getMonth();

		component.set('v.year', year);
		component.set('v.month', month);

		helper.setActiveDate(component, value || today);
	},

	/**
	 * Updates the component when the value attribute changes
	 */
	valueChange: function(component, event, helper) {
		if (component.ignoreValueChange) {
			return;
		}

		var today = new Date();
		var value = helper.toDate(component.get('v.value'));
		var year = value ? value.getFullYear() : today.getFullYear();
		var month = value ? value.getMonth() : today.getMonth();
		var calendar = helper.getCalendar(year, month, value);
		var activeDay = helper.getDayByValue(calendar, value || today);

		component.set('v.year', year);
		component.set('v.month', month);
		component.set('v.activeIndex', activeDay.index);

		if (component.isRendered()) {
			helper.updateRows(component, calendar);
			helper.updateMonthName(component, calendar);
			helper.updateYearOptions(component, calendar);
			helper.updateActiveCellTabIndex(component);
		}
	},

	/**
	 * Prevents an event from bubbling up
	 */
	nullEventHandler: function(component, event, helper) {
		event.stopPropagation();
	},

	/**
	 * Handles the focusin event of the container element
	 */
	containerFocusIn: function(component, event, helper) {
		// Check the blurTimeoutId property on the component. If it has a value then that means we
		// just lost focus because focus changed from one element to another within the container
		// so we just want to clear the timeout and do nothing. Otherwise, if blurTimeoutId has no
		// value then we are getting focus from some element outside of the datepicker
		if (component.blurTimeoutId) {
			clearTimeout(component.blurTimeoutId);
			component.blurTimeoutId = null;
			return;
		}

		helper.fireEvent(component, 'onfocus');
	},

	/**
	 * Handles the focusout event of the container element
	 */
	containerFocusOut: function(component, event, helper) {
		// When focus goes from one control to another within the container the onfocusout will be
		// fired when the current element loses focus and onfocusin will be fired when the new
		// element gains focus. When onfocusout is called we use a timeout to wait a fraction of a
		// second to see if another element within the container gains focus. If so then we will
		// clear the timeout and do nothing. If not, however, then we will fire our own onblur event
		if (component.blurTimeoutId) {
			clearTimeout(component.blurTimeoutId);
		}

		component.blurTimeoutId = setTimeout($A.getCallback(function() {
			component.blurTimeoutId = null;
			helper.fireEvent(component, 'onblur');
		}), 0);
	},

	/**
	 * Handles the mousedown event of the container element. We want to cancel the default behavior
	 * to keep the datepicker from losing focus
	 */
	containerMouseDown: function(component, event, helper) {
		event.preventDefault();
	},

	/**
	 * Handles the keydown event of the container element. This is where we implement the keyboard
	 * navigation
	 */
	containerKeyDown: function(component, event, helper) {
		var activeIndex = component.get('v.activeIndex');
		var days = 0;
		var value;

		var which = event.keyCode || event.which || 0;
		var handled = false;
		switch (which) {
			case 13: // Enter
			case 32: // Space
				// Select date
				value = helper.getActiveDate(component);
				helper.setValue(component, value, true);
				handled = true;
				break;

			case 27: // Escape
				// Set active date to the selected date (or today if no date selected)
				helper.cancel(component, true);
				handled = true;
				break;

			case 33: // Page Up
				if (event.altKey) {
					// Previous year
					helper.navigate(component, -1, 'y', true);
				} else {
					// Previous month
					helper.navigate(component, -1, 'm', true);
				}
				handled = true;
				break;

			case 34: // Page Down
				if (event.altKey) {
					// Next year
					helper.navigate(component, 1, 'y', true);
				} else {
					// Next month
					helper.navigate(component, 1, 'm', true);
				}
				handled = true;
				break;

			case 35: // End
				// End of week
				days = 6 - (activeIndex % 7);
				helper.navigate(component, days, 'd', true);
				handled = true;
				break;

			case 36: // Home
				// Beginning of week
				days = 0 - (activeIndex % 7);
				helper.navigate(component, days, 'd', true);
				handled = true;
				break;

			case 37: // Left Arrow
				// Previous day
				helper.navigate(component, -1, 'd', true);
				handled = true;
				break;

			case 39: // Right Arrow
				// Next day
				helper.navigate(component, 1, 'd', true);
				handled = true;
				break;

			case 38: // Up Arrow
				// Same day last week
				helper.navigate(component, -7, 'd', true);
				handled = true;
				break;

			case 40: // Down Arrow
				// Same day next week
				helper.navigate(component, 7, 'd', true);
				handled = true;
				break;
		}

		if (handled) {
			event.preventDefault();
		}
	},

	/**
	 * Handles the keydown event for the previous month button. Technically this event is attached
	 * to the parent element since the lightning:buttonIcon does not have its own keydown event
	 */
	previousMonthKeyDown: function(component, event, helper) {
		var trapFocus = component.get('v.trapFocus');

		var which = event.keyCode || event.which || 0;
		switch (which) {
			case 9: // Tab
				event.stopPropagation();

				// If we are trapping focus and SHIFT+TAB is pressed then move focus to the last
				// element
				if (trapFocus && event.shiftKey) {
					component.find('today').getElement().focus();
					event.preventDefault();
				}
				break;

			case 13: // Enter
			case 32: // Space
				event.stopPropagation();
				break;
		}
	},

	/**
	 * Handles the click event of the previous month button
	 */
	previousMonthClick: function(component, event, helper) {
		helper.navigate(component, -1, 'm', false);
	},

	/**
	 * Handles the keydown event for the next month button. Technically this event is attached
	 * to the parent element since the lightning:buttonIcon does not have its own keydown event
	 */
	nextMonthKeyDown: function(component, event, helper) {
		var which = event.keyCode || event.which || 0;
		switch (which) {
			case 9: // Tab
			case 13: // Enter
			case 32: // Space
				event.stopPropagation();
				break;
		}
	},

	/**
	 * Handles the click event of the next month button
	 */
	nextMonthClick: function(component, event, helper) {
		helper.navigate(component, 1, 'm', false);
	},

	/**
	 * Handles the change event of the year select
	 */
	yearChange: function(component, event, helper) {
		var newYear = parseInt(event.target.value, 10);
		var oldYear = component.get('v.year');
		helper.navigate(component, newYear - oldYear, 'y', false);
	},

	/**
	 * Handles the keydown event of the today button
	 */
	todayKeyDown: function(component, event, helper) {
		var trapFocus = component.get('v.trapFocus');

		var which = event.keyCode || event.which || 0;
		switch (which) {
			case 9: // Tab
				event.stopPropagation();

				// If we are trapping focus and TAB is pressed then move focus to the first element
				if (trapFocus && !event.shiftKey) {
					event.preventDefault();
					component.find('previousMonth').focus();
				}
				break;

			case 13: // Enter
			case 32: // Space
				event.stopPropagation();
				return;
		}
	},

	/**
	 * Handles the click event of the today button
	 */
	todayClick: function(component, event, helper) {
		var today = new Date();
		var value = helper.toDate(component.get('v.value'));
		if (!helper.isSameDate(value, today)) {
			helper.setValue(component, new Date(), false);
		} else {
			helper.setActiveDate(component, today);
			helper.fireEvent(component, 'oncancel');
		}
	}
})