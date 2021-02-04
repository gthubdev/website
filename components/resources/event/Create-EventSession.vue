<template>
<CRUDEventSession
	:show-dialog="showCRUD"
	:event="activeEvent"
	:active-session="eventsession"
	:headline="'Create an event session'"
	:action="'Create'"
	:update-mode="false"
/>
</template>

<script>
import CRUDEventSession from '~/components/templates/CRUD-EventSession.vue';

export default {
	components: {
		CRUDEventSession
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		activeEvent: {
			type: Object, default: null
		},
	},
	data: function() {
		return {
			showCRUD: false,
			eventsession: {
				name: '',
				series: '',
				starttime: '',
				duration: ''
				// event, starttime, duration
			},
		};
	},
	watch: {
		showDialog(newValue) {
			this.showCRUD = newValue;
			if (newValue === true) {
				this.eventsession = {
					name: '',
					series: '',
					starttime: '',
					duration: ''
				};
			}
		}
	}
};
</script>

<style>
</style>