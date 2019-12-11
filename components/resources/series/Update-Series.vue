<template>
<CRUDSeries
	:show-dialog="showCRUD"
	:active-series="series"
	:headline="headline()"
	:action="'Update'"
	:update-mode="true"
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
		activeSeries: {
			type: Object, default: null
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
			if (newValue === true)
				this.series = this.activeSeries;

			this.showCRUD = newValue;
		}
	},
	methods: {
		headline() {
			return 'Update series ' + this.series.name;
		}
	}
};
</script>

<style>
</style>
