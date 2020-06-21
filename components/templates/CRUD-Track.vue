<template>
<Dialog :header="headline" :visible.sync="showTrackDialog" :modal="true">
	<div>
		<span class="p-float-label">
			<InputText id="name" v-model="track.name" type="text" class="full-width" />
			<label for="name">Track Name</label>
		</span>
	</div>

	<br />

	<div>
		<AutoComplete v-model="track.country" :suggestions="countryNames" :dropdown="true" placeholder="Country" @complete="searchCountry($event)">
			<template #item="slotProps" class="">
				<div class="p-clearfix">
					{{ getCountryFlag(slotProps.item) }} {{ slotProps.item }}
				</div>
			</template>
		</AutoComplete>
	</div>

	<br />

	<div>
		<AutoComplete v-model="track.timezone" :suggestions="timeZones" :dropdown="true" placeholder="Timezone" class="full-width" field="display" @complete="searchTimezone($event)">
			<template #item="slotProps" class="full-width">
				<div class="p-clearfix">
					{{ tzDisplay(slotProps.item) }}
				</div>
			</template>
		</AutoComplete>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="length" v-model="track.length" type="text" class="full-width" />
			<label for="name">Length (km)</label>
		</span>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="map" v-model="track.map" type="text" class="full-width" />
			<label for="name">Map</label>
		</span>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import moment from 'moment-timezone';
import cl from 'country-list';
import flag from 'country-code-emoji';
import { strings } from '~/plugins/constants';

export default {
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		activeTrack: {
			type: Object, default: null
		},
		headline: {
			type: String, default: ''
		},
		action: {
			type: String, default: ''
		},
		updateMode: {
			type: Boolean, default: false
		},
		tz: {
			type: Object, default: null
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
			timeZones: null
		};
	},
	watch: {
		showDialog(newValue) {
			this.showTrackDialog = newValue;
		},
		showTrackDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_TRACK);

			if (newValue === true && this.updateMode === true)
				this.resetActiveTrack();
		},
		activeTrack(newValue) {
			if (newValue === undefined) return;

			this.track = newValue;

			if (typeof newValue === 'object' && this.updateMode === true)
				this.resetActiveTrack();
		}
	},
	created() {
		this.countryNames = this.getCountryNames();
		this.timeZones = this.tz.tz_array;
	},
	methods: {
		close() {
			this.showTrackDialog = false;
		},
		sendRequest() {
			//console.log(JSON.stringify(this.track));
			this.$parent.$emit(strings.SEND_REQUEST_CRUD_TRACK, this.track);
		},
		validInput() {
			return this.validTrackName() &&
				this.validCountry() &&
				this.validTimeZone() &&
				this.validLength() &&
				this.validMap();
		},
		validTrackName() {
			return this.track !== undefined && this.track.name.length > 0;
		},
		validCountry() {
			return cl.getCode(this.track.country) !== undefined;
		},
		validTimeZone() {
			return this.track.timezone !== undefined && this.track.timezone.name;
		},
		validLength() {
			return !isNaN(Number(this.track.length)) && Number(this.track.length) > 0;
		},
		validMap() {
			return this.track.map.trim() === '' || this.track.map.startsWith('https://') || this.track.map.startsWith('http://');
		},
		tzDisplay(item) {
			return '(UTC' + moment.tz(item.name).format('Z') + ') ' + item.desc;
		},
		getCountryNames() {
			return cl.getNames();
		},
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		searchCountry(event) {
			if (event.query.trim() === '')
				this.countryNames = [...this.getCountryNames()];
			else
				this.countryNames = this.getCountryNames().filter(country => {
					return country.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		searchTimezone(event) {
			if (event.query.trim() === '')
				this.timeZones = [...this.tz.tz_array];
			else
				this.timeZones = this.tz.tz_array.filter(tz => {
					return tz.desc.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		resetActiveTrack() {
			this.track = JSON.parse(JSON.stringify(this.activeTrack));
			let tz = this.tz.tz_array.find(e => e.name === this.track.timezone);
			this.track.timezone = {
				'name':tz.name,
				'desc':tz.desc,
				'toString':()=>'(UTC' + moment.tz(tz.name).format('Z') + ') ' + tz.desc
			};
		}
	}
};
</script>

<style lang="scss">

</style>
