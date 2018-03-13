({
	/**
	 * Imports modules used by the component
	 *
	 * @param {Aura.Component} component - The apex component
	 *
	 * @return {void}
	 */
	importModules: function(component) {
		if (!this.utils) {
			this.utils = component.find('utils').getModule();
		}
	},

	/**
	 * Executes an Apex method
	 *
	 * @param {Aura.Component} component              - The component for which to execute the Apex
	 *                                                  method
	 * @param {string}         name                   - The name of the apex method to execute
	 * @param {Object}         opts                   - An object containing optional arguments
	 * @param {Object}         [opts.params]          - Parameter values to be passed to the Apex
	 *                                                  method
	 * @param {boolean}        [opts.abortable=false] - If true then the action is abortable
	 * @param {boolean}        [opts.storable=false]  - If true the action is storable
	 * @param {Function}       [opts.success]         - A function to execute if the action succeeds
	 * @param {Function}       [opts.failure]         - A function to execute if the action fails
	 * @param {Object}         [opts.context]         - Object to use as this when executing
	 *                                                  the success or failure callbacks
	 *
	 * @return {void}
	 */
	execute: function(component, name, opts) {
		var beginTime, endTime, duration;

		var action = component.get('c.' + name);
		if (opts && opts.params) {
			var params = this.utils.clone(opts.params);
			action.setParams(params);
		}
		if (opts && opts.abortable) {
			action.setAbortable();
		}
		if (opts && opts.storable) {
			action.setStorable();
		}

		var context = undefined;
		if (opts) {
			context = opts.context;
		}

		action.setCallback(this, function(response) {
			// Do nothing if the component is not valid
			if (!component.isValid()) {
				return;
			}

			// Record the duration
			endTime = Date.now();
			duration = endTime - beginTime;
			console.debug(
				'Callout ' + component.getName() + '.' + name + ' completed in ' + duration + 'ms'
			);

			var state = response.getState();
			switch (state) {
				// Action completed successfully
				case 'SUCCESS':
				case 'REFRESH':
					var result = response.getReturnValue();
					if (opts && opts.success) {
						opts.success.call(context, result, state);
					}
					break;

				case 'ERROR':
					// An error occurred
					var message = 'An error occurred.';
					var error = response.getError();
					if (error && error.length && error.length > 0 && error[0] && error[0].message) {
						message = error[0].message;
					}
					if (opts && opts.failure) {
						opts.failure.call(context, new Error(message), state);
					}
					break;

				case 'INCOMPLETE':
					// Lost connection to server
					if (opts && opts.failure) {
						opts.failure.call(context, new Error('Lost connection to server.'), state);
					}
					break;

				case 'ABORTED':
					// Operation was aborted
					if (opts && opts.failure) {
						opts.failure.call(context, new Error('Operation was aborted.'), state);
					}
					break;

				default:
					// Unknown error
					if (opts && opts.failure) {
						opts.failure.call(context, new Error('Unknown error.'), state);
					}
					break;
			}
		});

		// Execute the action
		beginTime = Date.now();
		$A.enqueueAction(action);
	}
})