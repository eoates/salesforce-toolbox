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
})