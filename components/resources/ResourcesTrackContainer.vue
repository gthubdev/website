<template>
<div class="resources">
	<div class="flex justify-between my-4">
		<div>
			<InputText id="trackSearchTerm" v-model="searchTerm" type="text" />
		</div>
		<div>
			<Button label="CREATE TRACK" class="p-button-raised" @click="createTrack()" />
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
				<div class="p-col-12">
					<div class="resource-list-item">
						{{ getCountryFlag(slotProps.data.country) }}
						{{ slotProps.data.name }}
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<TrackCRUD
		:show-dialog="showDialog"
		@track-crud-closed="trackCrudClosed"
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
			showDialog: false
		};
	},
	computed: {
		...mapGetters({
			tracks: 'resources/tracks/get'
		})
	},
	methods: {
		...mapMutations({
			addTrack: 'resources/tracks/add'
		}),
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		createTrack() {
			this.showDialog = true;
		},
		trackCrudClosed() {
			this.showDialog = false;
		},
		async sendRequest(obj) {
			const track = JSON.parse(JSON.stringify(obj));
			track.timezone = obj.timezone.name;
			const url = '/api/calendar/track/create';

			try {
				const res = await this.$axios.$post(url, {
					track
				});
				console.log('Track created', res);
				this.addTrack(res);
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showDialog = false;
		}
	}
};
</script>

<style scoped>

</style>
