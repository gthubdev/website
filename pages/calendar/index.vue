<template>
<div class="p-grid">
	<!--<div class="p-col-12">
		<FilterPanel
			:show-current-events="showCurrentEvents"
		/>
	</div>-->

	<div class="p-col-12">
		<div class="headline">
			{{ headline }}<br />
		</div>

		<!--<div style="margin-bottom: 1em;">
			<AutoComplete v-model="selectedTimezone" :suggestions="timeZones" :dropdown="true" placeholder="Timezone" class="full-width" field="display" @complete="searchTimezone($event)">
				<template #item="slotProps" class="full-width">
					<div class="p-clearfix width-50">
						{{ tzDisplay(slotProps.item) }}
					</div>
				</template>
			</AutoComplete>
		</div>-->

		<div class="p-grid">
			<Event
				v-for="event in filterEvents()"
				:key="event.id"
				:event="event"
				:tz="data.tz"
			/>
		</div>
	</div>

	<!--<SidePanel
		:event="activeEvent"
		:show-event="showEvent"
		:user-timezone="userTimezone"
	/>-->
</div>
</template>

<script>
import Event from '~/components/calendar/Event.vue';
//import FilterPanel from '~/components/calendar/FilterPanel.vue';
import { strings } from '~/plugins/constants';

import moment from 'moment-timezone';

export default {
	components: {
		Event//, FilterPanel
	},
	async asyncData({
		$axios
	}) {
		try {
			const resdata = await $axios.$get('/api/calendar');
			return {
				data: resdata
			};
		} catch (err) {
			if (err.response)
				alert(err.response);
			return {
				data: []
			};
		}
	},
	data: function() {
		return {
			data: [],
			showCurrentEvents: true,
			activeEvent: null,
			showEvent: false,
			userTimezone: {
				'name': '',
				'desc': ''
			},
			selectedTimezone: '',
			timeZones: null
		};
	},
	computed: {
		headline: function() {
			return this.showCurrentEvents ? 'Upcoming Events' : 'All Events';
		}
	},
	watch: {
		selectedTimezone: function(newValue) {
			if (newValue.name) {
				// save new local timezone in cookie
				if (moment.tz.zone(newValue.name) !== null) {
					let cookieDate = new Date(moment().add(12, 'months').toDate());
					document.cookie = 'localtz=' + newValue.name + '; expires ' + cookieDate;
				}
				// set userTimezone
				this.userTimezone = {
					'name': newValue.name,
					'desc': newValue.desc
				};
			}
		}
	},
	mounted() {
		this.$root.$on(strings.TOGGLE_CURRENT_EVENTS, () => {
			this.showCurrentEvents = !this.showCurrentEvents;
		});
		this.$root.$on(strings.TOGGLE_SESSIONS, event => {
			if (!this.showEvent) {
				this.showEvent = true;
				this.activeEvent = event;
			} else {
				this.showEvent = false;
				this.activeEvent = null;
			}
		});
		// Set the initial timezone, load from cookie if possible
		let tz_name = 'Europe/Stockholm';
		if (document.cookie.split(';').filter((item) => item.trim().startsWith('localtz=')).length) {
			tz_name = document.cookie.replace(/(?:(?:^|.*;\s*)localtz\s*=\s*([^;]*).*$)|^.*$/, '$1');
		}
		let tz_desc = this.data.tz.tz_strings[tz_name];
		this.selectedTimezone = {
			'name':tz_name,
			'desc':tz_desc,
			'toString':()=>'(UTC' + moment.tz(tz_name).format('Z') + ') ' + tz_desc
		};
	},
	created() {
		this.timeZones = this.data.tz.tz_array;
	},
	methods: {
		filterEvents: function() {
			if (this.showCurrentEvents) {
				const today = moment.utc().format('YYYY-MM-DD');
				return this.data.events.filter(event => {
					return moment(event.startdate).isSameOrAfter(today);
				});
			} else {
				return this.data.events;
			}
		},
		tzDisplay: function(item) {
			return '(UTC' + moment.tz(item.name).format('Z') + ') ' + item.desc;
		},
		searchTimezone(event) {
			if (event.query.trim() === '')
				this.timeZones = [...this.data.tz.tz_array];
			else
				this.timeZones = this.data.tz.tz_array.filter(tz => {
					return tz.desc.toLowerCase().includes(event.query.toLowerCase());
				});
		},
	}
};
</script>

<style lang="scss">
.headline {
	padding: 1em 0;
	font-size: 2em;
	font-variant: small-caps;
	font-weight: bold;
	color: #F7F7F7;
	text-align: center;
}
.p-autocomplete-input {
	min-width: 50% !important;
}
.p-autocomplete {
	width: 100% !important;
}
</style>
