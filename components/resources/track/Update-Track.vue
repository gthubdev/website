<template>
<CRUDTrack
	:show-dialog="showCRUD"
	:active-track="track"
	:headline="headline()"
	:action="'Update'"
	:update-mode="true"
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
			type: Boolean,
			default: false
		},
		activeTrack: {
			type: Object,
			default: null
		},
		tz: {
			type: Object,
			default: null
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
			if (newValue === true)
				this.track = this.activeTrack;

			this.showCRUD = newValue;
		}
	},
	methods: {
		headline() {
			return 'Update track ' + this.track.name;
		}
	}
};
</script>

<style>
</style>
