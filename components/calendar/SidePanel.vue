<template>
<div class="sidepanel">
	<div v-if="showEvent" class="sessions">
		<i class="pi pi-arrow-left" style="font-size: 3em" />
		<br />
		<br />
		<EventSession
			v-for="session in event.EventSessions"
			:key="session.id"
			:session="session"
			:local-timezone="event.Track.timezone"
			:user-timezone="userTimezone"
		/>
	</div>
</div>
</template>

<script>
import EventSession from '~/components/calendar/EventSession.vue';
import { strings } from '~/plugins/constants';

export default {
	components: {
		EventSession
	},
	props: {
		event: {
			type: Object, default: null
		},
		showEvent: {
			type: Boolean, default: false
		},
		userTimezone: {
			type: Object,
			default: function() {
				return	{
					'name':'',
					'desc':'',
				};
			}
		}
	},
	methods: {
		toggleSessions: function() {
			this.$root.$emit(strings.TOGGLE_SESSIONS, null);
		}
	}
};
</script>

<style lang="scss" scoped>
.sidepanel {
	margin: 1em;
	// width: 80%;
	//background-color: white;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

img {
	width: 100%;
}

.textcontainer {
	text-align: center;
	padding: 10px 20px;
}

.sessions {
	padding: 1em;
}
</style>
