<template>
<div class="md-layout-item md-size-20 sidepanel">
	<div v-if="showEvent" class="sessions">
		<md-icon class="md-size-2x" @click.native='toggleSessions()'>arrow_back</md-icon>
		<br />
		<br />
		<EventSession
			v-for="session in event.EventSessions"
			:key="session.id"
			:session="session"
			:tz="tz"
		/>
	</div>

</div>
</template>

<script>
import EventSession from '~/components/calendar/EventSession.vue';

export default {
	components: {
		EventSession
	},
	props: {
		event: {
			type: Object,
			default: null
		},
		showEvent: {
			type: Boolean,
			default: false
		},
		tz: {
			type: Object,
			default: null
		}
	},
	methods: {
		toggleSessions: function() {
			this.$emit('toggleSessions', null);
		}
	}
};
</script>

<style lang="scss" scoped>
.sidepanel {
	margin: 1em;
	// width: 80%;
	background-color: white;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

img {
	width: 100%;
}

.textcontainer {
	text-align: center;
	padding: 10px 20px;
}

.md-layout-item {
	padding: 0 !important;
}

.sessions {
	padding: 1em;
}
</style>
