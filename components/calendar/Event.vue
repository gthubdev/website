<template>
<div>
	<Card class="event-card">
		<template #content>
			<Chip :label="event.Series.shortname" />
			<div class="p-grid p-align-center">
				<div class="p-col-3">
					<img :src="eventLogo" alt="Logo" class="eventlogo">
				</div>
				<div class="p-col-1" />
				<div class="p-col-8">
					<span class="event-headline">{{ event.name }}</span>
					<div class="headline-sep-line" />
					<div class="text-overflow">
						{{ getCountryFlag }} {{ event.Track.name }}
					</div>
					<div class="dates">
						{{ eventDate }}
					</div>
					<div class="moreinfo">
						More info &rarr;
					</div>
				</div>
			</div>
		</template>
	</Card>
</div>
</template>

<script>
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	name: 'Event',
	components: {
		Card, Chip
	},
	props: {
		event: {
			type: Object, default: null
		},
		tz: {
			type: Object, default: null
		}
	},
	computed: {
		eventDate() {
			if (this.event.startdate === this.event.enddate)
				return this.startdate();
			else
				return this.startdate() + ' - ' + this.enddate();
		},
		eventLogo() {
			if (this.event.logo.length)
				return this.event.logo;
			else if (this.event.Series.logo.length)
				return this.event.Series.logo;
			else
				return '';
		},
		getCountryFlag() {
			return flag(cl.getCode(this.event.Track.country));
		}
	},
	methods: {
		startdate() {
			return this.$dayjs(this.event.startdate).format('ddd Do MMM');
		},
		enddate() {
			return this.$dayjs(this.event.enddate).format('ddd Do MMM');
		}
	}
};
</script>

<style scoped>
.p-card > .p-card-body {
	padding: 0 1rem !important;
}
.p-chip {
	border-radius: 10px !important;
	background-color: goldenrod !important;
	padding: 0 0.5rem !important;
	color: #000 !important;
	font-weight: bold !important;
}
.p-chip-text {
	line-height: 1em !important;
}
.event-card {
	background: rgba(32, 32, 32, .6);
	margin: 1em;
	padding: 0;
	border-radius: 16px;
	max-width: 550px;
}
.eventlogo {
	width:100%;
	height:100%;
	object-fit:cover;
}
.event-headline {
	font-size: 1.5em;
	font-weight: bold;
	display: flex;
	word-wrap: break-word;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.2em;
	height: 2.4em;
	align-items: center;
}
.text-overflow {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.dates {
	margin-top: 1em;
	font-weight: bold;
}
.moreinfo {
	margin-top: 1em;
	color: goldenrod;
}
</style>
