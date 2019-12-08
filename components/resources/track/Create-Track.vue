<template>
<CRUDTrack
	:show-dialog="showCRUD"
	:active-track="track"
	:headline="'Create a track'"
	:action="'Create'"
	:update-mode="false"
	:tz="tz"
/>
</template>

<script>
import CRUDTrack from '~/components/templates/CRUD-Track.vue';

export default {
	components: {
		CRUDTrack
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		tz: {
			type: Object, default: null
		}
	},
	data: function() {
		return {
			showCRUD: false,
			track: {
				name: '',
				country: '',
				timezone: '',
				length: '',
				map: ''
			}
		};
	},
	watch: {
		showDialog(newValue) {
			this.showCRUD = newValue;
			if (newValue === true) {
				this.track = {
					name: '',
					country: '',
					timezone: '',
					length: '',
					map: ''
				};
			}
		}
	}
};
</script>

<style>
</style>
