/**************************************************************************************************
 * toasterRenderer.js
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
	 * After the toaster is rendered add a reference to the toasters array in the helper
	 */
	afterRender: function(component, helper) {
		helper.toasters.push(component);

		this.superAfterRender();
	},

	/**
	 * After the toaster is unrendered (i.e. destroyed) remove it from the toasters array in the
	 * helper
	 */
	unrender: function(component, helper) {
		var toasters = helper.toasters;
		for (var i = 0, n = toasters.length; i < n; i++) {
			if (component === toasters[i]) {
				toasters.splice(i, 1);
				break;
			}
		}

		this.superUnrender();
	}
}) // eslint-disable-line semi