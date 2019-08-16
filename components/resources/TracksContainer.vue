<template>
<div class="md-layout-item flex-start main-panel">
	<div class="md-layout headline">
		<div class="md-layout-item md-display-1">
			Tracks
		</div>

		<div class="md-layout-item">
			<md-field md-clearable>
				<label>Search term</label>
				<md-input v-model="searchTerm" />
			</md-field>
		</div>

		<div class="md-layout-item align-right">
			<md-button class="md-raised md-primary btn-primary" @click.native="createTrack()">
				Create Track
			</md-button>
		</div>
	</div>

	<md-list>
		<md-list-item v-for="t in filterTracks()" :key="t.id">
			<span class="md-list-item-text">{{ t.name }}</span>
			<md-icon @click.native="updateTrack(t)">
				edit
			</md-icon>
			<md-icon @click.native="deleteTrack(t)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<div v-if="showPagination">
		<paginate
			:page-count="pageCount"
			:click-handler="pageClicked"
			:no-li-surround="true"
			:container-class="'pag-container'"
			:active-class="'pag-active'"
			:page-link-class="'pag-page-link'"
			:hide-prev-next="true"
		/>
	</div>

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
import Paginate from 'vuejs-paginate/src/components/Paginate.vue';

export default {
	components: {
		CRUDTrack, Paginate
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
			mode: '',
			searchTerm: '',
			showPagination: false,
			pageNumber: 1,
			pageCount: 1,
			itemsPerPage: 3
		};
	},
	mounted() {
		this.$root.$on('toggleCrudTrack', () => {
			this.showDialog = !this.showDialog;
		});
		this.pageCount = Math.ceil(this.tracks.length / this.itemsPerPage);
		this.showPagination = this.pageCount > 1;
	},
	methods: {
		createTrack() {
			this.mode = 'create';
			this.showDialog = !this.showDialog;
		},
		updateTrack(track) {
			this.activeTrack = track;
			this.mode = 'update';
			this.showDialog = !this.showDialog;
		},
		deleteTrack(track) {
			this.$root.$emit('confirmDeleteTrack', track);
		},
		filterTracks() {
			let arr = [], nrMatches = 0;

			// count number of elements matching
			for (let i = 0; i < this.tracks.length; i++) {
				if (this.searchTerm.trim() === '')
					nrMatches++;
				else if (this.tracks[i].name.toLowerCase().includes(this.searchTerm.trim()))
					nrMatches++;
			}

			// do the actual filtering
			for (let i = (this.pageNumber - 1) * this.itemsPerPage; i < this.tracks.length && arr.length < this.itemsPerPage; i++) {
				if (this.searchTerm.trim() === '')
					arr.push(this.tracks[i]);
				else if (this.tracks[i].name.toLowerCase().includes(this.searchTerm.trim()))
					arr.push(this.tracks[i]);
			}

			this.pageCount = Math.ceil(nrMatches / this.itemsPerPage);
			this.showPagination = this.pageCount > 1;
			return arr;
		},
		pageClicked(newPageNum) {
			console.log('Active Page: ' + newPageNum);
			this.pageNumber = newPageNum;
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
.md-list {
	background-color: rgba(0, 0, 0, 0.3);
	margin-top: 0.5em;
	border-radius: 20px;
}
</style>
