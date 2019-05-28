<template>
<p>
	<strong>{{ session.name }}</strong> ({{ session.Series.name }}) {{ starttime }}
</p>
</template>

<script>
import moment from 'moment';

export default {
	props: {
		session: {
			type: Object,
			default: null
		},
		tz: {
			type: Object,
			default: null
		}
	},
	computed: {
		starttime: function() {
			return moment(this.session.starttime).format('ddd Do MMM HH:mm')+'h';
		}
	}
};
</script>
