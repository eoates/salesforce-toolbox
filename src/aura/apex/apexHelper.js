/**************************************************************************************************
 * apexHelper.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author   Eugene Oates
 * @date     2018-03-20
 * @version  2.0.0
 *
 **************************************************************************************************/
 ({
 	/**
	 * Returns a function which is intended to be passed to the setCallback() method of a
	 * component action
	 *
	 * @param {Object}   [opts]          - An object containing options
	 * @param {Function} [opts.success]  - A function to be executed if the Apex method is
	 *                                     successful
	 * @param {Function} [opts.failure]  - A function to be executed if an error occurs
	 * @param {Function} [opts.complete] - A function to be executed after the Apex method has been
	 *                                     executed regardless of success or failure. This callback
	 *                                     is executed after the success and failure callbacks
	 * @param {Object}   [opts.context]  - An object to be used for the this object when executing
	 *                                     the success or failure callback
	 *
	 * @return {Function} A function that will handle the response from the framework when executing
	 *                    a server-side Apex method
	 */
	getHandler: function(opts) {
		var self = this;
		var beginTime = Date.now();
		var endTime, duration;

		return function(response, component) {
			var success, failure, complete, context;
			var state, result, error, message;
			var action = component.getName() + '.' + response.getName();

			// Do nothing if the component is not valid
			if (!component.isValid()) {
				return;
			}

			// Record the duration
			endTime = Date.now();
			duration = endTime - beginTime;
			console.debug('Callout ' + action + ' completed in ' + duration + 'ms');

			// Get options
			success = opts && opts.success;
			failure = opts && opts.failure;
			complete = opts && opts.complete;
			context = (opts && opts.context) || this;

			// Handle the response
			state = response.getState();
			switch (state) {
				// Action completed successfully
				case 'SUCCESS':
				case 'REFRESH':
					result = response.getReturnValue();
					self.handleSuccess(action, state, result, context, success, failure, complete);
					break;

				case 'ERROR':
					// An error occurred
					message = 'An error occurred.';
					error = response.getError();
					if (error && (error.length > 0) && error[0] && error[0].message) {
						message = error[0].message;
					}

					self.handleFailure(action, state, message, context, failure, complete);
					break;

				case 'INCOMPLETE':
					// Lost connection to server
					message = 'Lost connection to server.'
					self.handleFailure(action, state, message, context, failure, complete);
					break;

				case 'ABORTED':
					// Operation was aborted
					message = 'Operation was aborted.';
					self.handleFailure(action, state, message, context, failure, complete);
					break;

				default:
					// Unknown error
					message = 'Unknown error.';
					self.handleFailure(action, state, message, context, failure, complete);
					break;
			}
		};
	},

	/**
	 * Handles successful execution of an Apex method and executes the appropriate callbacks. If an
	 * exception occurs while executing the success callback and a failure callback is provided then
	 * the failure callback will be executed. The complete callback, if provided, is always executed
	 *
	 * @param {string}   action   - The name of the action. This consists of the component name and
	 *                              Apex method name
	 * @param {string}   state    - The state returned by the platform. Possible values are
	 *                              "SUCCESS" and "REFRESH"
	 * @param {*}        result   - The value returned by the Apex method
	 * @param {Object}   context  - The context in which to execute the callbacks
	 * @param {Function} success  - A function to be executed on success
	 * @param {Function} failure  - A function to be executed on failure
	 * @param {Function} complete - A function to be executed on completion regardless success or
	 *                              failure
	 *
	 * @return {void}
	 */
	handleSuccess: function(action, state, result, context, success, failure, complete) {
		var message;

		// If a success callback is provided then execute it. If an exception occurs while executing
		// the success callback and a failure callback is provided then the failure callback will
		// be executed
		if (success) {
			try {
				success.call(context, result, state);
			} catch (se) {
				// An exception occurred in the success callback. If a failure callback was provided
				// then execute it; otherwise, just log the error to the console
				if (failure) {
					try {
						message = 'Unhandled exception in success callback: ' + se.message;
						failure.call(context, new Error(message), 'ERROR');
					} catch (fe) {
						console.error('Unhandled exception in failure callback for ' + action, fe);
					}
				} else {
					console.error('Unhandled exception in success callback for ' + action, se);
				}
			}
		}

		this.handleComplete(action, context, complete);
	},

	/**
	 * Handles failed execution of an Apex method and executes the appropriate callbacks.
	 *
	 * @param {string}   action   - The name of the action. This consists of the component name and
	 *                              Apex method name
	 * @param {string}   state    - The state returned by the platform. Possible values are
	 *                              "SUCCESS" and "REFRESH"
	 * @param {string}   message  - An error message that describes what went wrong
	 * @param {Object}   context  - The context in which to execute the callbacks
	 * @param {Function} failure  - A function to be executed on failure
	 * @param {Function} complete - A function to be executed on completion regardless success or
	 *                              failure
	 *
	 * @return {void}
	 */
	handleFailure: function(action, state, message, context, failure, complete) {
		// If a failure callback is provided then execute it; otherwise, just log the error to the
		// console
		if (failure) {
			try {
				failure.call(context, new Error(message), state);
			} catch (fe) {
				console.error('Unhandled exception in failure callback for ' + action, fe);
			}
		} else {
			console.error('Callout ' + action + ' failed', new Error(message), state);
		}

		this.handleComplete(action, context, complete);
	},

	/**
	 * Executes the complete callback if provided. The complete callback is always executed
	 * regardless of whether the Apex method was successful. Think of the complete callback like
	 * the finally statement in a try/catch/finally structure
	 *
	 * @param {string} action     - The name of the action. This consists of the component name and
	 *                              Apex method name
	 * @param {Object} context    - The context in which to execute the callbacks
	 * @param {Function} complete - A function to be executed on completion regardless success or
	 *                              failure
	 *
	 * @return {void}
	 */
	handleComplete: function(action, context, complete) {
		if (complete) {
			try {
				complete.call(context);
			} catch (ce) {
				console.error('Unhandled exception in complete callback for ' + action, ce);
			}
		}
	}
})