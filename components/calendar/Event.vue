<template>
<div class="md-layout-item md-size-50">
	<md-card>
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">{{ event.name }}</div>
				<div class="md-subhead">{{ event.Track.name }}</div>
				<div class="md-subhead">{{ startdate }} - {{ enddate }}<br />
					({{ event.timezone }}, UTC{{ offset }})</div>
				<div class="md-subhead">Priority: {{ event.priority }}</div>
			</md-card-header-text>

			<md-card-media>
				<img :src="eventLogo" alt="Logo">
			</md-card-media>
		</md-card-header>
		<!-- <md-card-content>

		</md-card-content> -->
		<md-card-actions>
			<md-button @click.native='toggleSessions()'>Show sessions</md-button>
		</md-card-actions>
	</md-card>
</div>
</template>

<script>
import moment from 'moment-timezone';

export default {
	props: {
		event: {
			type: Object,
			default: null
		},
		tz: {
			type: Object,
			default: null
		},
		activeEvent: {
			type: Object,
			default: null
		}
	},
	computed: {
		startdate: function() {
			return moment(this.event.startdate).format('ddd Do MMM YYYY');
		},
		enddate: function() {
			return moment(this.event.enddate).format('ddd Do MMM YYYY');
		},
		eventLogo: function() {
			if (this.event.logo.length > 1)
				return this.event.logo;
			else if (this.event.Series.logo.length > 1)
				return this.event.Series.logo;
			else
				return '';
		},
		offset: function() {
			return moment.tz(this.event.timezone).format('Z');
		}
	},
	methods: {
		toggleSessions: function() {
			this.$root.$emit('toggleSessions', this.event);
		}
	}
};
</script>

<style lang="scss" scoped>
.md-card {
	width: 95%;
	margin: 16px;
	display: inline-block;
	vertical-align: top;
}
</style>
