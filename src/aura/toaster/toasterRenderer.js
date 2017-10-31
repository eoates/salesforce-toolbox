({
	afterRender: function(component, helper) {
		helper.toasters.push(component);

		this.superAfterRender();
	},

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