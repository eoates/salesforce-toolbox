({
	toastCounter: 0,
	toasters: [],

	/**
	 * Returns the number of toasts that can be displayed simultaneously on the current device. On
	 * phones we only want to display a single toast at a time. On other devices we display 3
	 *
	 * @returns {number} the number of toasts to display simultaneously
	 */
	getMaxToasts: function() {
		var formFactor = $A.get('$Browser.formFactor');
		return (formFactor === 'PHONE') ? 1 : 3;
	},

	/**
	 * Creates a toast. If there are less than 3 toasts currently being displayed then the new toast
	 * is displayed immediately; otherwise, the toast is added to a queue and will be displayed once
	 * any other toasts in the queue have been displayed
	 *
	 * @param {aura.Component} component the component
	 * @param {string} type the toast type, which can be error, warning, success, or info
	 * @param {string} key specifies an icon when the toast type is other
	 * @param {string} title specifies the toast title in bold
	 * @param {string} message specifies the message to display
	 * @param {string} mode the toast mode, which can be dismissible, pester, or sticky
	 * @param {number} duration toast duration in milliseconds
	 * @returns {void}
	 */
	createToast: function(component, type, key, title, message, mode, duration) {
		duration = parseFloat(duration);
		if (isNaN(duration) || !isFinite(duration)) {
			duration = 5000;
		} else if (duration < 0) {
			duration = 0;
		}

		var toast = {
			name: 'toast' + this.toastCounter++,
			dismissible: (mode !== 'pester'),
			type: type,
			key: key,
			title: title,
			message: message
		};

		var toasts = component.get('v.toasts');
		if (toasts.length < this.getMaxToasts()) {
			if (toasts.length > 0) {
				toasts.splice(0, 0, toast);
			} else {
				toasts.push(toast);
			}
			component.set('v.toasts', toasts);

			if (mode !== 'sticky') {
				var self = this;
				setTimeout($A.getCallback(function() {
					self.removeToast(component, toast.name);
					self.showNextToastInQueue(component);
				}), duration);
			}
		} else {
			var args = Array.prototype.slice.call(arguments, 1);

			var queue = component.get('v.queue');
			queue.push(args);
			component.set('v.queue', queue);
		}
	},

	/**
	 * Removes the toast with the specified name
	 *
	 * @param {aura.Component} component the component
	 * @param {string} name the name of the toast to remove
	 * @returns {void}
	 */
	removeToast: function(component, name) {
		if (!component.isValid()) {
			return;
		}

		var toasts = component.get('v.toasts');
		for (var i = 0, n = toasts.length; i < n; i++) {
			var toast = toasts[i];
			if (toast.name === name) {
				toasts.splice(i, 1);
				component.set('v.toasts', toasts);
				break;
			}
		}
	},

	/**
	 * Displays the next toast in the queue. If there are no toasts in the queue then this function
	 * does nothing
	 *
	 * @param {aura.Component} component the component
	 * @returns {void}
	 */
	showNextToastInQueue: function(component) {
		if (!component.isValid()) {
			return;
		}

		var queue = component.get('v.queue');
		if (queue.length > 0) {
			var args = queue[0];
			args.splice(0, 0, component);

			queue.splice(0, 1);
			component.set('v.queue', queue);

			this.createToast.apply(this, args);
		}
	}
})