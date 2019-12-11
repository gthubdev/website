<template>
<CRUDSeries
	:show-dialog="showCRUD"
	:active-series="series"
	:headline="'Create a series'"
	:action="'Create'"
	:update-mode="false"
	:vc="vc"
/>
</template>

<script>
import CRUDSeries from '~/components/templates/CRUD-Series.vue';

export default {
	components: {
		CRUDSeries
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		vc: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showCRUD: false,
			series: {
				name: '',
				shortname: '',
				logo: '',
				homepage: '',
				priority: ''
			}
		};
	},
	watch: {
		showDialog(newValue) {
			this.showCRUD = newValue;
			if (newValue === true) {
				this.series = {
					name: '',
					shortname: '',
					logo: '',
					homepage: '',
					priority: ''
				};
			}
		}
	}
};
</script>

<style>
</style>
