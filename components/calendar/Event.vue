<template>
<div>
	<Card class="event-card">
		<template #content>
			<Chip :label="event.Series.shortname" />
			<div class="grid grid-cols-12">
				<div class="col-span-3 flex items-center">
					<img :src="eventLogo" alt="Logo" class="object-contain">
				</div>
				<div class="" />
				<div class="col-span-8">
					<span class="event-headline">{{ event.name }}</span>
					<div class="gradient-line" />
					<div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
						{{ getCountryFlag }} {{ event.Track.name }}
					</div>
					<div class="font-bold mt-4">
						{{ eventDate }}
					</div>
					<div class="color-goldenrod mt-4">
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

<style lang="scss" scoped>
@import "assets/scss/abstracts/variables";

.p-card > .p-card-body {
	padding: 0 1rem !important;
}
.p-card-content {
	padding: 0.25rem 0 !important;
}
.p-chip {
	margin: 0 0 !important;
	border-radius: 16px !important;
	background-color: $goldenrod !important;
	padding: 0 0.5rem !important;
	color: #000 !important;
	font-weight: bold !important;
}
.event-card {
	@apply m-4 p-0 rounded-xl max-w-lg;
	background: rgba(32, 32, 32, .6);
}
.event-headline {
	@apply font-bold flex overflow-hidden overflow-ellipsis items-center text-2xl h-16;
	word-wrap: break-word;
}
.color-goldenrod {
	color: $goldenrod;
}
</style>
