<template>
<div>
	<CRUDTrack
		:show-dialog="showCRUD"
		:active-track="track"
		:headline="headline"
		:action="'Update'"
		:tz="tz"
	/>
</div>
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
			track: null
		};
	},
	computed: {
		headline() {
			return 'Update';
		}
	},
	watch: {
		showDialog(newValue) {
			this.showCRUD = newValue;
			if (newValue === true)
				this.track = this.activeTrack;
		}
	}
};
</script>

<style>
</style>
