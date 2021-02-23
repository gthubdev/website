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
					<div class="color-goldenrod mt-4" @click="toggleOverlay">
						More info &rarr;
					</div>
				</div>
			</div>
		</template>
	</Card>
	<OverlayPanel ref="op" :show-close-icon="true">
		<div class="grid grid-cols-3 gap-4">
			<div v-for="es in event.EventSessions" :key="es.id" class="session" :class="borderColor(es)">
				<div class="space-y-2 my-0.5">
					<div class="block">
						<div class="flex items-center">
							<img :src="seriesLogo(es)" alt="Logo" class="series-logo">

							<span v-tooltip.top="es.Series.name" class="session-series" :class="seriesText(es)">
								{{ es.Series.shortname }}
							</span>
							{{ es.name }}
						</div>
					</div>
					<div class="block">
						<span class="session-start">
							{{ sessionStart(es) }}
						</span>
						<br>
						<span class="session-start-local">
							{{ sessionStartLocal(es) }} (local)
						</span>
					</div>
				</div>
			</div>
		</div>
	</OverlayPanel>
</div>
</template>

<script>
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import OverlayPanel from 'primevue/overlaypanel';
import Tooltip from 'primevue/tooltip';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	name: 'Event',
	components: {
		Card, Chip, OverlayPanel
	},
	directives: {
		tooltip: Tooltip
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
		},
		toggleOverlay(event) {
			this.$refs.op.toggle(event);
		},
		sessionStart(session) {
			return this.$dayjs(session.starttime).tz('UTC').format('ddd Do MMM HH:mm') + 'h';
		},
		sessionStartLocal(session) {
			return this.$dayjs(session.starttime).tz(this.event.Track.timezone).format('ddd Do MMM HH:mm') + 'h';
		},
		borderColor(es) {
			return {
				'main-series-border': this.event.mainseries === es.series,
				'support-series-border': this.event.mainseries !== es.series
			};
		},
		seriesText(es) {
			return {
				'main-series-text-color': this.event.mainseries === es.series,
				'main-series-tooltip': this.event.mainseries === es.series,
				'support-series-text-color': this.event.mainseries !== es.series,
				'support-series-tooltip': this.event.mainseries !== es.series
			};
		},
		seriesLogo(es) {
			if (es.Series.logo.length)
				return es.Series.logo;
			else
				return '';
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
.series-logo {
	height: 1.5rem;
}
.session {
	@apply w-full m-auto flex leading-4 px-2 my-2;
}
.session-series {
	@apply font-black mx-2;
	border-bottom: 2px dotted red;
}
.session-start {
	@apply px-2 text-sm;
}
.session-start-local {
	@apply px-2 text-xs text-gray-400;
}
.main-series-border {
	border-left: 4px solid rgba(96, 165, 250);
}
.main-series-text-color {
	@apply text-blue-400;
}
.main-series-tooltip {
	border-bottom: 2px dotted rgba(96, 165, 250);
}
.support-series-border {
	border-left: 4px solid $orange;
}
.support-series-text-color {
	@apply text-yellow-500;
}
.support-series-tooltip {
	border-bottom: 2px dotted $orange;
}
</style>
