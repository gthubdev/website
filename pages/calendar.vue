<template>
<div>
	<h1 class="page-headline">
		Calendar
	</h1>
	<div>
		<div>
			User-selected timezone:
			<Dropdown
				v-model="selectedTimezone"
				:options="timezones"
				option-label="desc"
				:filter="true"
				placeholder="Select your timezone"
				:show-clear="true"
				@input="changeTimezone($event)"
			>
				<template #value="slotProps">
					<div v-if="slotProps.value">
						{{ slotProps.value.display }}
					</div>
					<div v-else>
						{{ slotProps.placeholder }}
					</div>
				</template>
				<template #option="slotProps">
					<div>
						{{ slotProps.option.display }}
					</div>
				</template>
			</Dropdown>
		</div>
		<div>
			Filter tracks:
			<MultiSelect
				v-model="selectedTracks"
				:options="displayedTracks"
				option-label="name"
				placeholder="Select tracks"
				:filter="true"
				@input="filterEvents()"
			>
				<template #value="slotProps">
					<div v-for="option of slotProps.value" :key="option.id">
						{{ getCountryFlag(option.country) }} {{ option.name }}
					</div>
					<template v-if="!slotProps.value || slotProps.value.length === 0">
						Select tracks
					</template>
				</template>
				<template #option="slotProps">
					<div>
						{{ getCountryFlag(slotProps.option.country) }} {{ slotProps.option.name }}
					</div>
				</template>
			</MultiSelect>
		</div>
		<div>
			Filter series:
			<MultiSelect
				v-model="selectedSeries"
				:options="displayedSeries"
				option-label="name"
				placeholder="Select tracks"
				:filter="true"
				@input="filterEvents()"
			>
				<template #value="slotProps">
					<div v-for="option of slotProps.value" :key="option.id">
						{{ option.name }}
					</div>
					<template v-if="!slotProps.value || slotProps.value.length === 0">
						Select series
					</template>
				</template>
				<template #option="slotProps">
					<div>
						{{ slotProps.option.name }}
					</div>
				</template>
			</MultiSelect>
		</div>
		<!--<span style="margin-left: 2rem">{{ usertz }}</span>-->
	</div>
	<div class="p-grid">
		<Event
			v-for="event in displayedEvents"
			:key="event.id"
			:event="event"
		/>
	</div>
</div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import { mapGetters, mapMutations } from 'vuex';
import cl from 'country-list';
import flag from 'country-code-emoji';
import Event from '~/components/calendar/Event';

export default {
	components: {
		Dropdown, Event, MultiSelect
	},
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/calendar');
			return {
				data: res
			};
		} catch (err) {
			return {
				data: []
			};
		}
	},
	data: function() {
		return {
			data: [],
			displayedEvents: [],
			selectedTimezone: null,
			displayedTracks: [],
			selectedTracks: null,
			displayedSeries: [],
			selectedSeries: null
		};
	},
	computed: {
		...mapGetters({
			usertz: 'usertz/get',
			defaultTimezone: 'usertz/getDefaultTimezone',
			timezones: 'usertz/getTimezones'
		})
	},
	created() {
		this.setTimezones(this.data.tz.timezones);
		this.selectedTimezone = this.defaultTimezone;
		this.displayedEvents = [...this.data.events];

		const tracks = new Set();
		const series = new Set();
		for (const ev of this.data.events) {
			if (!tracks.has(ev.track)) {
				this.displayedTracks.push(ev.Track);
				tracks.add(ev.track);
			}
			if (!series.has(ev.mainseries)) {
				this.displayedSeries.push(ev.Series);
				series.add(ev.mainseries);
			}
		}
	},
	methods: {
		...mapMutations({
			setUsertz: 'usertz/set',
			setDefault: 'usertz/setDefault',
			setTimezones: 'usertz/setTimezones'
		}),
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		changeTimezone(value) {
			if (value !== null && value.name)
				this.setUsertz(value.name);
			else
				this.setDefault();
		},
		isAnyFilterSet() {
			if (this.selectedTracks != null && this.selectedTracks.length > 0)
				return true;
			if (this.selectedSeries != null && this.selectedSeries.length > 0)
				return true;

			return false;
		},
		filterEvents() {
			this.displayedEvents = [...this.data.events];

			if (!this.isAnyFilterSet()) return;

			const track_ids = new Set();
			if (this.selectedTracks != null && this.selectedTracks.length > 0)
				for (const track of this.selectedTracks)
					track_ids.add(track.id);
			else
				for (const ev of this.data.events)
					track_ids.add(ev.track);

			const series_ids = new Set();
			if (this.selectedSeries != null && this.selectedSeries.length > 0)
				for (const series of this.selectedSeries)
					series_ids.add(series.id);
			else
				for (const ev of this.data.events)
					series_ids.add(ev.mainseries);

			this.displayedEvents = this.data.events
				.filter(ev => track_ids.has(ev.track))
				.filter(ev => series_ids.has(ev.mainseries));
		}
	}
};
</script>

<style scoped>

</style>
