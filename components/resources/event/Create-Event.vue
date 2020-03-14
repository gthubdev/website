<template>
<CRUDEvent
	:show-dialog="showCRUD"
	:active-event="event"
	:headline="'Create an event'"
	:action="'Create'"
	:update-mode="false"
	:series="series"
	:tracks="tracks"
/>
</template>

<script>
import CRUDEvent from '~/components/templates/CRUD-Event.vue';

export default {
	components: {
		CRUDEvent
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		series: {
			type: Array, default() { return []; }
		},
		tracks: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showCRUD: false,
			event: {
				name: '',
				track: '',
				mainseries: '',
				startdate: '',
				enddate: '',
				logo: '',
				priority: ''
			},
		};
	},
	watch: {
		showDialog(newValue) {
			this.showCRUD = newValue;
			if (newValue === true) {
				this.event = {
					name: '',
					track: '',
					mainseries: '',
					startdate: '',
					enddate: '',
					logo: '',
					priority: ''
				};
			}
		}
	}
};
</script>

<style>
</style>