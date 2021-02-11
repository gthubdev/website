<template>
<div>
	<Card class="card">
		<template #content>
			<div class="p-grid p-align-center">
				<div class="p-col-3">
					<img :src="eventLogo" alt="Logo" class="eventlogo">
				</div>
				<div class="p-col-9">
					<span class="event-headline">{{ event.name }}</span>
					<div class="headline-sep-line" />
					<div class="text-overflow series">
						{{ event.Series.name }}
					</div>
					<div class="text-overflow">
						{{ getCountryFlag }} {{ event.Track.name }}
					</div>
				</div>
			</div>
			<div class="dates">
				<i class="pi pi-calendar-plus" style="font-size: 1.2rem" />
				&nbsp;
				{{ startdate }} - {{ enddate }}
			</div>
			<div class="p-grid">
				<div class="p-col sessions">
					Show sessions
				</div>
				<div class="p-col sessions">
					Show series
				</div>
			</div>
		</template>
	</Card>
</div>
</template>

<script>
import Card from 'primevue/card';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	name: 'Event',
	components: {
		Card
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
		startdate() {
			return this.$dayjs(this.event.startdate).format('ddd Do MMM');
		},
		enddate() {
			return this.$dayjs(this.event.enddate).format('ddd Do MMM');
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
	}
};
</script>

<style scoped>
.card {
	background: rgba(32, 32, 32, .8);
	margin: 1em;
	padding: 0 1em;
	/*border: 3px solid rgba(255, 255, 255, .2);*/
	/*border: 3px solid;*/
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
.series {
	font-weight: bold;
	margin-bottom: 0.25em;
}
.dates {
	border-top: white 1px solid;
	border-bottom: white 1px solid;
	margin: .75em 0;
	padding: .75em 0;
	text-align: center;
	font-size: 1.2em;
	font-weight: bold;
}
.sessions {
	/*border-bottom: white 1px solid;*/
	/*margin: 0 0 0.75em 0;*/
	/*padding: 0 0 0.75em 0;*/
	text-align: center;
	font-size: 1.2em;
	font-weight: bold;
	color: #ed6400;
}
</style>
