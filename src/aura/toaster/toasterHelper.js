/**************************************************************************************************
 * toasterHelper.js
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
	toastCounter: 0,
	toasters: [],

	/**
	 * Returns the first valid toaster component. An application may contain multiple toaster
	 * components, but we only want one of them to actually handle showToast events. In order to
	 * enforce this behavior each toaster adds a reference to itself to the toasters array when it
	 * is rendered and removes it when it is destroyed. This method simply returns the first toaster
	 * in the toasters array that is available and can be used to handle showToast events
	 *
	 * @return {Aura.Component} A reference to the first available, valid toaster component that
	 *                          can process showToast events
	 */
	getFirstToaster: function() {
		for (var i = 0, n = this.toasters.length; i < n; i++) {
			var toaster = this.toasters[i];
			if (toaster && toaster.isValid()) {
				return toaster;
			}
		}
		return undefined;
	},

	/**
	 * Returns the number of toasts that can be displayed simultaneously on the current device. On
	 * phones we only want to display a single toast at a time. On other devices we display 3
	 *
	 * @return {number} The number of toasts to display simultaneously
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
	 * @param {Aura.Component} component - The component
	 * @param {string}         type      - The toast type, which can be error, warning, success, or
	 *                                     info
	 * @param {string}         key       - Specifies an icon when the toast type is other
	 * @param {string}         title     - Specifies the toast title in bold
	 * @param {string}         message   - Specifies the message to display
	 * @param {string}         mode      - The toast mode, which can be dismissible, pester, or
	 *                                     sticky
	 * @param {number}         duration  - Toast duration in milliseconds
	 *
	 * @return {void}
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
			toasts.unshift(toast);
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

			var queue = component.queue;
			if (!queue) {
				queue = component.queue = [];
			}
			queue.push(args);
		}
	},

	/**
	 * Removes the toast with the specified name
	 *
	 * @param {Aura.Component} component - The component
	 * @param {string}         name      - The name of the toast to remove
	 *
	 * @return {void}
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
	 * @param {Aura.Component} component - The component
	 *
	 * @return {void}
	 */
	showNextToastInQueue: function(component) {
		if (!component.isValid()) {
			return;
		}

		var queue = component.queue || [];
		if (queue.length > 0) {
			var args = queue.shift();
			args.splice(0, 0, component);

			this.createToast.apply(this, args);
		}
	}
}) // eslint-disable-line semi