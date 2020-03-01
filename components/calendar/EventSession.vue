<template>
<p>
	<strong>{{ session.name }}</strong> ({{ session.Series.name }}) Local time: {{ getLocalTime() }}, User time: {{ getUserTime() }}
</p>
</template>

<script>
import moment from 'moment-timezone';

export default {
	props: {
		session: {
			type: Object,
			default: null
		},
		localTimezone : {
			type: String,
			default: ''
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
		getLocalTime: function() {
			return moment(this.session.starttime).tz(this.localTimezone).format('ddd Do MMM HH:mm')+'h';
		},
		getUserTime: function() {
			let local_tz;
			if (this.userTimezone === undefined || moment.tz.zone(this.userTimezone.name) === null)
				local_tz = 'Europe/Stockholm';
			else
				local_tz = this.userTimezone.name;
			return moment(this.session.starttime).tz(local_tz).format('ddd Do MMM HH:mm')+'h';
		}
	}
};
</script>
