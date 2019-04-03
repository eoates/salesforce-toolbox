/**************************************************************************************************
 * sectionController.js
 **************************************************************************************************
 * This is a shared component. Do not make modifications to this component without carefully
 * considering the impact this may have on existing applications/components/pages/etc. that use this
 * component.
 *
 * @author Eugene Oates
 *
 **************************************************************************************************/
({
	/**
	 * Toggle visibility when the title is clicked
	 */
	titleClick: function(component, event, helper) {
		var collapsed = !!component.get('v.collapsed');
		component.set('v.collapsed', !collapsed);
	}
}) // eslint-disable-line semi