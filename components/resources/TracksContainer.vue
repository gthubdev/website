<template>
<div class="md-layout-item flex-start main-panel">
	<div class="headline">
		<span class="md-display-1">Tracks</span>
	</div>
	<md-button class="md-raised md-primary" @click.native="createTrack()">
		Create Track
	</md-button>
	<md-list>
		<md-list-item v-for="t in tracks" :key="t.id">
			<span class="md-list-item-text">{{ t.name }}</span>
			<md-icon>
				edit
			</md-icon>
			<md-icon>
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDTrack
		:show-dialog="showDialog"
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
			showDialog: false
		};
	},
	mounted() {
		this.$root.$on('toggleCrudTrack', () => {
			this.showDialog = !this.showDialog;
		});
	},
	methods: {
		createTrack() {
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
