<template>
<CRUDEvent
	:show-dialog="showCRUD"
	:active-event="event"
	:headline="headline()"
	:action="'Update'"
	:update-mode="true"
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
		activeEvent: {
			type: Object, default: null
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
				supportseries: [],
				startdate: '',
				enddate: '',
				logo: '',
				priority: ''
			},
		};
	},
	watch: {
		showDialog(newValue) {
			if (newValue === true)
				this.event = this.activeEvent;

			this.showCRUD = newValue;
		}
	},
	methods: {
		headline() {
			return 'Update event ' + this.event.name;
		}
	}
};
</script>

<style>
</style>