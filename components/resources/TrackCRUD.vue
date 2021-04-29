<template>
<Dialog header="Create a track" :visible.sync="showTrackDialog" :modal="true">
	<div class="pt-2">
		<span class="p-float-label">
			<InputText id="name" v-model="track.name" type="text" class="full-width" />
			<label for="name">Track Name</label>
		</span>
	</div>

	<br>

	<div>
		<AutoComplete
			v-model="track.country"
			:suggestions="countryNames"
			:dropdown="true"
			field="name"
			placeholder="Country"
			force-selection
			@complete="searchCountry($event)"
		>
			<template #item="slotProps">
				{{ getCountryFlag(slotProps.item) }} {{ slotProps.item }}
			</template>
		</AutoComplete>
	</div>

	<br />

	<div>
		<AutoComplete
			v-model="track.timezone"
			:suggestions="timezones"
			:dropdown="true"
			field="display"
			placeholder="Timezone"
			force-selection
			@complete="searchTimezone($event)"
		>
			<template #item="slotProps">
				{{ slotProps.item.display }}
			</template>
		</AutoComplete>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="length" v-model="track.length" type="text" />
			<label for="name">Length (km)</label>
		</span>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="map" v-model="track.map" type="text" />
			<label for="name">Map</label>
		</span>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" label="Create" icon="pi pi-check" disabled />
		<Button v-else label="Create" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import AutoComplete from 'primevue/autocomplete';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import cl from 'country-list';
import flag from 'country-code-emoji';
import { mapGetters } from 'vuex';

export default {
	components: {
		AutoComplete, Dialog, InputText
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		}
	},
	data: function() {
		return {
			showTrackDialog: false,
			track: {
				name: '',
				country: '',
				timezone: '',
				length: '',
				map: ''
			},
			countryNames: null,
			timezones: null
		};
	},
	computed: {
		...mapGetters({
			allTimezones: 'usertz/getTimezones'
		})
	},
	watch: {
		showDialog(newValue) {
			this.showTrackDialog = newValue;
		},
		showTrackDialog(newValue) {
			if (newValue === false)
				this.$emit('track-crud-closed');

			if (newValue === true)
				this.track = {
					name: '',
					country: '',
					timezone: '',
					length: '',
					map: ''
				};
		}
	},
	created() {
		this.showTrackDialog = this.showDialog;
		this.countryNames = cl.getNames();
		this.timezones = this.allTimezones;
	},
	methods: {
		close() {
			this.showTrackDialog = false;
		},
		sendRequest() {
			this.$emit('send-request', this.track);
		},
		validInput() {
			return this.validName() &&
				this.validCountry() &&
				this.validTimezone() &&
				this.validLength() &&
				this.validMap();
		},
		validName() {
			return this.track !== undefined && this.track.name.length > 0;
		},
		validCountry() {
			if (this.track.country === undefined || this.track.country === null) return false;
			return cl.getCode(this.track.country) !== undefined;
		},
		validTimezone() {
			if (this.track.timezone === undefined || this.track.timezone === null) return false;
			return this.track.timezone.name;
		},
		validLength() {
			return !isNaN(Number(this.track.length)) && Number(this.track.length) > 0;
		},
		validMap() {
			return this.track.map.trim() === '' || this.track.map.startsWith('https://') || this.track.map.startsWith('http://');
		},
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		searchCountry(event) {
			if (event.query.trim() === '')
				this.countryNames = [...cl.getNames()];
			else
				this.countryNames = cl.getNames().filter(country => {
					return country.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		searchTimezone(event) {
			if (event.query.trim() === '')
				this.timezones = [...this.allTimezones];
			else
				this.timezones = this.allTimezones.filter(tz => {
					return tz.desc.toLowerCase().includes(event.query.toLowerCase());
				});
		}
	}
};
</script>

<style scoped>

</style>
