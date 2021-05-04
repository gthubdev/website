<template>
<div class="resources">
	<div class="flex justify-between my-4">
		<div>
			<InputText id="trackSearchTerm" v-model="searchTerm" type="text" />
		</div>
		<div>
			<Button label="CREATE TRACK" class="p-button-raised" @click="openTrackCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="tracks"
			paginator-position="bottom"
			:paginator="true"
			:rows="5"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="w-screen flex justify-between py-2 items-center">
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
	data: function() {
		return {
			searchTerm: '',
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
				if (res.data.deleted >= 1)
					this.deleteTrack(track.id);
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
				if (this.isEditing === false)
					this.addTrack(res);
				else if (res.updated >= 1)
					this.updateTrack(track);
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
