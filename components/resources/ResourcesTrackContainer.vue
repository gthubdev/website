<template>
<div class="resources">
	<div class="resources-top-bar">
		<div>
			<span class="p-input-icon-left">
				<i class="pi pi-search" />
				<InputText id="trackSearchTerm" v-model="searchTerm" type="text" />
			</span>
		</div>
		<div>
			<Button label="CREATE TRACK" class="p-button-raised" @click="openTrackCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="displayedTracks"
			paginator-position="bottom"
			:paginator="true"
			:rows="5"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="resource-list-item-container">
					<div class="resource-list-item">
						{{ getCountryFlag(slotProps.data.country) }}
						{{ slotProps.data.name }}
					</div>
					<div>
						<Button icon="pi pi-pencil" @click="editTrack(slotProps.data)" />
						<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<TrackCRUD
		:show-dialog="showDialog"
		:is-editing="isEditing"
		:editing-track="editingTrack"
		@track-crud-closed="closeTrackCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import TrackCRUD from '@/components/resources/TrackCRUD';
import { mapGetters, mapMutations } from 'vuex';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	components: {
		DataView, InputText, TrackCRUD
	},
	data() {
		return {
			searchTerm: '',
			displayedTracks: [],
			showDialog: false,
			isEditing: false,
			editingTrack: null
		};
	},
	computed: {
		...mapGetters({
			tracks: 'resources/tracks/get'
		})
	},
	watch: {
		searchTerm(newvalue) {
			if (newvalue.trim() === '')
				this.displayedTracks = [...this.tracks];
			else
				this.displayedTracks = this.tracks.filter(t => {
					return t.name.toLowerCase().includes(newvalue.toLowerCase());
				});
		}
	},
	created() {
		this.displayedTracks = this.tracks;
	},
	methods: {
		...mapMutations({
			addTrack: 'resources/tracks/add',
			deleteTrack: 'resources/tracks/delete',
			updateTrack: 'resources/tracks/update'
		}),
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		openTrackCrud() {
			this.showDialog = true;
		},
		closeTrackCrud() {
			this.isEditing = false;
			this.showDialog = false;
			this.editingTrack = null;
		},
		editTrack(track) {
			this.isEditing = true;
			this.editingTrack = JSON.parse(JSON.stringify(track));
			this.showDialog = true;
		},
		async sendDeleteRequest(track) {
			try {
				const res = await this.$axios.post('/api/calendar/track/delete/' + track.id);
				if (res.data.deleted >= 1) {
					this.deleteTrack(track.id);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Track ' + track.name + ' deleted.', life: 5000 });
				}
			} catch (err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		async sendRequest(obj) {
			const track = JSON.parse(JSON.stringify(obj));
			track.timezone = obj.timezone.name;
			delete track.createdAt;
			let url;
			if (this.isEditing === false)
				url = '/api/calendar/track/create';
			else if (this.isEditing === true && this.editingTrack !== null)
				url = '/api/calendar/track/update/' + this.editingTrack.id;
			else
				console.error('Sending request for null-track.');

			try {
				const res = await this.$axios.$post(url, {
					track
				});
				if (this.isEditing === false) {
					this.addTrack(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Track ' + track.name + ' created.', life: 5000 });
				} else if (res.updated >= 1) {
					this.updateTrack(track);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Track ' + track.name + ' updated.', life: 5000 });
				}
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showDialog = false;
			this.isEditing = false;
			this.editingTrack = null;
		}
	}
};
</script>

<style scoped>

</style>
