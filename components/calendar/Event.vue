<template>
<div class="p-col-4">
	<Card class="card">
		<template slot="content">
			<div class="p-grid p-align-center">
				<div class="p-col-3">
					<img :src="eventLogo" alt="Logo" />
				</div>
				<div class="p-col-9" style="word-wrap: break-spaces">
					<span style="font-size: 1.5em; font-weight: bold; word-wrap: break-word">{{ event.Series.name }}</span>
					<br />
					<div class="headline-sep-line" />
					{{ event.name }}
					<br />
					{{ event.Track.name }}, {{ event.Track.country }}
				</div>
			</div>
			<div class="dates">
				{{ startdate }} - {{ enddate }}
			</div>
			<div v-if="!event.SupportSeries.length" class="no-supportseries">
				No Support Series.
			</div>
			<div v-if="event.SupportSeries.length" class="supportseries">
				Support Series:
				<ul>
					<li v-for="item in event.SupportSeries" :key="item.id">
						{{ item.Series.name }}
					</li>
				</ul>
			</div>
		</template>
	</Card>
</div>
</template>

<script>
import moment from 'moment-timezone';
import { strings } from '~/plugins/constants';

export default {
    props: {
        event: {
            type: Object, default: null
        },
        tz: {
            type: Object, default: null
        },
        activeEvent: {
            type: Object, default: null
        }
    },
    computed: {
        startdate() {
            return moment(this.event.startdate).format('ddd Do MMM YYYY');
        },
        enddate() {
            return moment(this.event.enddate).format('ddd Do MMM YYYY');
        },
        eventLogo() {
            if (this.event.logo.length)
                return this.event.logo;
            else if (this.event.Series.logo.length)
                return this.event.Series.logo;
            else
                return '';
        },
        offset() {
            return moment.tz(this.event.Track.timezone).format('Z');
        }
    },
    methods: {
        toggleSessions() {
            this.$root.$emit(strings.TOGGLE_SESSIONS, this.event);
        }
    }
};
</script>

<style lang="scss" scoped>
.card {
	background: rgba(32, 32, 32, 0.3);
	margin: 1em;
	padding: 1em;
	border: white 1px solid;
	border-radius: 25px;
}
.dates {
	border-top: white 1px solid;
	border-bottom: white 1px solid;
	margin: .75em 0;
	padding: .75em 0;
	text-align: center;
	font-size: 1.3em;
	font-weight: bold;
}
.no-supportseries {
	font-size: 1.1em;
	font-weight: bold;
}
.supportseries {
	font-size: 1.1em;
	font-weight: bold;
}
</style>
