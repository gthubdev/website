<template>
<div class="md-layout-item flex-start main-panel">
	<div class="md-layout headline">
		<div class="md-layout-item md-display-1">
			Tracks
		</div>
		<div class="md-layout-item align-right">
			<md-button class="md-raised md-primary btn-primary" @click.native="createTrack()">
				Create Track
			</md-button>
		</div>
	</div>

	<md-list>
		<md-list-item v-for="t in tracks" :key="t.id">
			<span class="md-list-item-text">{{ t.name }}</span>
			<md-icon @click.native="updateTrack(t)">
				edit
			</md-icon>
			<md-icon @click.native="deleteTrack(t.id)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDTrack
		:show-dialog="showDialog"
		:active-track="activeTrack"
		:mode="mode"
		:tz="tz"
	/>
</div>
</template>

<script>
import CRUDTrack from '~/components/resources/CRUD-Track.vue';

export default {
	components: {
		CRUDTrack
	},
	props: {
		tracks: {
			type: Array,
			default() { return []; }
		},
		tz: {
			type: Object,
			default: null
		}
	},
	data: function() {
		return {
			showDialog: false,
			activeTrack: null,
			mode: ''
		};
	},
	mounted() {
		this.$root.$on('toggleCrudTrack', () => {
			this.showDialog = !this.showDialog;
		});
	},
	methods: {
		async deleteTrack(id) {
			try {
				const res = await this.$axios.$post('/api/calendar/track/delete/' + id);
				if (res.deleted >= 1)
					this.$root.$emit('trackDeleted', id);
			} catch(err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
			}
		},
		createTrack() {
			this.mode = 'create';
			this.showDialog = !this.showDialog;
		},
		updateTrack(track) {
			this.activeTrack = track;
			this.mode = 'update';
			this.showDialog = !this.showDialog;
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
