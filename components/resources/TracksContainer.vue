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

	<CreateTrack
		:show-dialog="showCreateDialog"
		:tz="tz"
	/>

	<UpdateTrack
		:show-dialog="showUpdateDialog"
		:active-track="activeTrack"
		:tz="tz"
	/>
</div>
</template>

<script>
import CreateTrack from '~/components/resources/track/Create-Track.vue';
import UpdateTrack from '~/components/resources/track/Update-Track.vue';
import Paginate from 'vuejs-paginate/src/components/Paginate.vue';
import { constants, strings } from '~/plugins/constants';

export default {
	components: {
		CreateTrack, UpdateTrack, Paginate
	},
	props: {
		tracks: {
			type: Array, default() { return []; }
		},
		tz: {
			type: Object, default: null
		}
	},
	data: function() {
		return {
			showCreateDialog: false,
			showUpdateDialog: false,
			activeTrack: null,
			searchTerm: '',
			showPagination: false,
			pageNumber: 1,
			pageCount: 1,
			itemsPerPage: constants.ITEMS_PER_PAGE_TRACKS
		};
	},
	mounted() {
		this.$root.$on(strings.TOGGLE_CRUD_TRACK, () => {
			this.showDialog = !this.showDialog;
		});
		this.pageCount = Math.ceil(this.tracks.length / this.itemsPerPage);
		this.showPagination = this.pageCount > 1;

		this.$root.$on(strings.CLOSED_CRUD_TRACK, () => {
			this.showCreateDialog = false;
			this.showUpdateDialog = false;
		});

		// handle requests to create/update a track
		this.$root.$on(strings.SEND_REQUEST_CRUD_TRACK, async obj => {
			// console.log('RECEIVED CREATE/UPDATE TRACK REQUEST');

			let track = JSON.parse(JSON.stringify(obj));
			track.timezone = obj.timezone.name;
			// create a track
			if (this.showCreateDialog) {
				try {
					const res = await this.$axios.$post('/api/calendar/track/create', {
						track
					});
					this.$root.$emit(strings.TRACK_CREATED, res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
				this.showCreateDialog = false;
			}
			// update a track
			if (this.showUpdateDialog) {
				// no need to update that
				delete track.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/track/update/' + track.id, {
						track
					});
					if (res.updated >= 1)
						this.$root.$emit(strings.TRACK_UPDATED, track);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
				this.showUpdateDialog = false;
			}
		});
	},
	methods: {
		createTrack() {
			this.showCreateDialog = true;
		},
		updateTrack(track) {
			this.activeTrack = track;
			this.showUpdateDialog = true;
		},
		deleteTrack(track) {
			this.$root.$emit(strings.CONFIRM_DELETE_TRACK, track);
		},
		filterTracks() {
			let arr = [], nrMatches = 0;

			// count number of elements matching
			if (this.searchTerm.trim() === '') {
				nrMatches = this.tracks.length;
			} else {
				this.tracks.forEach(e => {
					if (e.name.toLowerCase().includes(this.searchTerm.trim()))
						nrMatches++;
				});
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
			// console.log('Active Page: ' + newPageNum);
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
