<template>
<div>
	<h1 class="page-headline">
		Calendar
	</h1>
	<div>
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
		<!--<span style="margin-left: 2rem">{{ usertz }}</span>-->
	</div>
	<div class="p-grid">
		<Event
			v-for="event in data.events"
			:key="event.id"
			:event="event"
		/>
	</div>
</div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import { mapGetters, mapMutations } from 'vuex';
import Event from '~/components/calendar/Event';

export default {
	components: {
		Dropdown, Event
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
			selectedTimezone: null
		};
	},
	computed: mapGetters({
		usertz: 'usertz/get',
		defaultTimezone: 'usertz/getDefaultTimezone',
		timezones: 'usertz/getTimezones'
	}),
	created() {
		this.setTimezones(this.data.tz.timezones);
		this.selectedTimezone = this.defaultTimezone;
	},
	methods: {
		...mapMutations({
			setUsertz: 'usertz/set',
			setDefault: 'usertz/setDefault',
			setTimezones: 'usertz/setTimezones'
		}),
		changeTimezone(value) {
			if (value !== null)
				this.setUsertz(value.name);
			else
				this.setDefault();
		}
	}
};
</script>

<style scoped>

</style>
