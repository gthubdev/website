<template>
<div>
	<div class="p-grid p-align-center">
		<div class="p-col-4">
			<h2>
				Tracks
			</h2>
		</div>
		<div class="p-col-4">
			<span class="p-float-label">
				<InputText id="searchTerm" v-model="searchTerm" type="text" class="full-width" />
				<label for="searchTerm">Search term</label>
			</span>
		</div>
		<div class="p-col-4 align-right">
			<Button label="CREATE TRACK" class="p-button-raised" @click="createTrack()" />
		</div>
	</div>

	<DataView :value="shownTracks" paginator-position="bottom" :paginator="true" :rows="itemsPerPage" :always-show-paginator="false">
		<template #list="slotProps">
			<div class="p-grid p-align-center">
				<div class="p-col-9">
					<b>{{ slotProps.data.name }}</b>
				</div>
				<div class="p-col-3 align-right">
					<Button icon="pi pi-pencil" @click="updateTrack(slotProps.data)" />
					&nbsp; &nbsp;
					<Button icon="pi pi-trash" @click="deleteTrack(slotProps.data)" />
				</div>
			</div>
		</template>
	</DataView>

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
import { constants, strings } from '~/plugins/constants';

export default {
	components: {
		CreateTrack, UpdateTrack
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
			shownTracks: null,
			itemsPerPage: constants.ITEMS_PER_PAGE_TRACKS
		};
	},
	watch: {
		searchTerm(newValue) {
			if (newValue.trim() === '')
				this.shownTracks = this.tracks;
			else
				this.shownTracks = this.tracks.filter(t => {
					return t.name.toLowerCase().includes(newValue.toLowerCase());
				});
		}
	},
	created() {
		// set the tracks
		this.shownTracks = this.tracks;

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
			if (this.showCreateDialog === true) {
				try {
					const res = await this.$axios.$post('/api/calendar/track/create', {
						track
					});
					this.$root.$emit(strings.TRACK_CREATED, res);
				} catch(err) {
					if (err.response)
						alert(err.response.data);
				}
				this.showCreateDialog = false;
			}
			// update a track
			if (this.showUpdateDialog === true) {
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
						alert(err.response.data);
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
			this.activeTrack = JSON.parse(JSON.stringify(track));
			this.showUpdateDialog = true;
		},
		deleteTrack(track) {
			this.$root.$emit(strings.CONFIRM_DELETE_TRACK, track);
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
