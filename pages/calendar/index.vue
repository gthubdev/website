<template>
<div class="md-layout">
	<FilterPanel
		:show-current-events="showCurrentEvents"
	/>

	<div class="md-layout-item flex-start">
		<div class="headline">
			<span class="md-display-1">{{ headline }}</span><br />
		</div>
		<md-autocomplete v-model="userTimezone" md-dense :md-options="data.tz.tz_array.map(x=>({
			'name':x.name,
			'desc': x.desc,
			'toLowerCase':()=>x.desc.toLowerCase(),
			'toString':()=>x.desc
		}))"
		>
			<label>Local Timezone</label>

			<template slot="md-autocomplete-item" slot-scope="{ item }">
				<!-- <span class="color" :style="`background-color: ${item.color}`"></span> -->
				<!-- <md-highlight-text :md-term="tzDisplay(item)">{{ tzDisplay(item) }}</md-highlight-text> -->
				{{ tzDisplay(item) }}
			</template>

			<template slot="md-autocomplete-empty" slot-scope="{ term }">
				"{{ term }}" not found!
			</template>

			<span class="md-error">Please choose a timezone</span>
		</md-autocomplete>
		<div class="md-layout">
			<Event
				v-for="event in filterEvents()"
				:key="event.id"
				:event="event"
				:tz="data.tz"
				:active-event="activeEvent"
			/>
		</div>
	</div>

	<SidePanel
		:event="activeEvent"
		:show-event="showEvent"
		:user-timezone="userTimezone"
	/>
</div>
</template>

<script>
import Event from '~/components/calendar/Event.vue';
import FilterPanel from '~/components/calendar/FilterPanel.vue';
import SidePanel from '~/components/calendar/SidePanel.vue';

import moment from 'moment-timezone';

export default {
	components: {
		Event, FilterPanel,	SidePanel
	},
	data: function() {
		return {
			data: [],
			showCurrentEvents: true,
			activeEvent: null,
			showEvent: false,
			userTimezone: ''
		};
	},
	computed: {
		headline: function() {
			return this.showCurrentEvents ? 'This week\'s events' : 'All events';
		}
	},
	async asyncData({
		$axios
	}) {
		const resdata = await $axios.$get('/api/calendar');
		return {
			data: resdata
		};
	},
	mounted() {
		this.$root.$on('toggleCurrentEvents', () => {
			this.showCurrentEvents = !this.showCurrentEvents;
		});
		this.$root.$on('toggleSessions', event => {
			if (!this.showEvent) {
				this.showEvent = true;
				this.activeEvent = event;
			} else {
				this.showEvent = false;
				this.activeEvent = null;
			}
		});
		// Set the initial timezone
		let tz_name = 'Europe/Brussels';
		let tz_desc = this.data.tz.tz_strings[tz_name];
		this.userTimezone = {
			'name':tz_name,
			'desc': tz_desc,
			'toLowerCase':()=>tz_desc.toLowerCase(),
			// 'toString':()=>'(UTC' + moment.tz(tz_name).format('Z') + ') ' + tz_desc
			'toString':()=>tz_desc

		};

	},
	methods: {
		filterEvents: function() {
			if (this.showCurrentEvents)
				return this.data.events.filter(function(event) {
					return moment(event.startdate).isBefore('2019-07-01');
				});
			else
				return this.data.events;
		},
		tzDisplay: function(item) {
			return '(UTC' + moment.tz(item.name).format('Z') + ') ' + item.desc;
		},
	}
};
</script>

<style lang="scss" scoped>
.flex-start {
	align-content: flex-start;
}
.headline {
	padding: 1em;
}
</style>
