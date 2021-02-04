<template>
<Dialog :header="headline" :visible.sync="showEventSessionDialog" :modal="true">
	<div class="p-grid p-align-baseline">
		<div class="p-col-6">
			<div class="p-col-12">
				<span class="p-float-label">
					<InputText id="name" v-model="eventsession.name" type="text" class="full-width" />
					<label for="name">Name of the Session</label>
				</span>
			</div>

			<div class="p-col-12 p-grid p-align-baseline">
				<div class="p-col-7">
					<Calendar
						v-model="chosenDate"
						:locale="locale_en"
						date-format="dd M yy"
						:show-icon="true"
						:hide-on-date-time-select="true"
						:min-date="getMinDate()"
						:max-date="getMaxDate()"
					/>
				</div>

				<div class="p-col-4">
					<vue-timepicker
						v-model="chosenTime"
						format="HH:mm"
						:minute-interval="5"
						close-on-complete
					/>
				</div>
			</div>

			<div class="p-col-12 p-grid p-align-center">
				<div class="p-col-4">
					Duration:
				</div>

				<div class="p-col-8">
					<InputNumber
						id="duration_hours"
						v-model="duration.hours"
						suffix=" hours"
						:min="0"
						:max="49"
					/>
				</div>
			</div>

			<div class="p-col-12 p-grid p-align-center">
				<div class="p-col-4" />

				<div class="p-col-8">
					<InputNumber
						id="duration_minutes"
						v-model="duration.minutes"
						suffix=" minutes"
						:min="0"
						:max="61"
					/>
				</div>
			</div>

			<div class="p-col-12">
				<AutoComplete v-model="chosenSeries" :suggestions="availableSeries" :dropdown="true" placeholder="Series" class="full-width" field="name" @complete="searchSeries($event)">
					<template #item="slotProps" class="full-width">
						<div class="p-clearfix">
							{{ slotProps.item.name }}
						</div>
					</template>
				</AutoComplete>
			</div>
		</div>
		<div class="p-col-6">
			<div>
				<span class="sessions-headline">Sessions</span>
				<ul v-if="event && event.EventSessions && event.EventSessions.length">
					<li v-for="key in event.EventSessions" :key="key.id">
						{{ key.name }} ({{ key.Series.shortname }}) - {{ getSessionTime(key) }}
					</li>
				</ul>
			</div>
		</div>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import moment from 'moment-timezone';
import { strings, locale } from '~/plugins/constants';

export default {
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		event: {
			type: Object, default: null
		},
		headline: {
			type: String, default: ''
		},
		action: {
			type: String, default: ''
		},
		updateMode: {
			type: Boolean, default: false
		}
	},
	data: function() {
		return {
			showEventSessionDialog: false,
			eventsession: {
				name: ''
			},
			chosenSeries: '',
			availableSeries: [],
			allSeries: [],
			chosenDate: '',
			chosenTime: {
				HH: '',
				mm: ''
			},
			duration: {
				hours: 0,
				minutes: 0
			},
			locale_en: locale.en
		};
	},
	watch: {
		showDialog(newValue) {
			this.showEventSessionDialog = newValue;
		},
		showEventSessionDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_EVENTSESSION);

			this.chosenSeries = '';
			this.chosenTime = {
				HH: '',
				mm: ''
			};
			this.duration = {
				hours: 0,
				minutes: 0
			};

			// set the available series
			if (newValue === true) {
				this.allSeries = [];
				this.allSeries.push(this.event.Series);
				if (this.event.SupportSeries !== undefined)
					this.event.SupportSeries.forEach(s => {
						this.allSeries.push(s.Series);
					});
			}

			// set the initial month for the calendar
			this.chosenDate = new Date(this.event.startdate);
		}
	},
	methods: {
		close() {
			this.showEventSessionDialog = false;
		},
		sendRequest() {
			this.eventsession.series = this.chosenSeries.id;
			this.eventsession.starttime = moment(this.chosenDate)
				.set({
					'hour': Number(this.chosenTime.HH),
					'minute': Number(this.chosenTime.mm)
				})
				.format('YYYY-MM-DD HH:mm');
			this.eventsession.duration = this.duration.hours * 60 + this.duration.minutes;
			console.log('CREATING SESSION', this.eventsession);

			this.$parent.$emit(strings.SEND_REQUEST_CRUD_EVENTSESSION, this.eventsession, this.event);
		},
		validInput() {
			return this.validName() &&
				this.validDate() &&
				this.validTime() &&
				this.validDuration() &&
				this.validSeries();
		},
		validName() {
			return this.eventsession.name !== undefined &&
				this.eventsession.name.length > 0;
		},
		validDate() {
			return this.chosenDate !== undefined &&
				moment(this.chosenDate).isValid();
		},
		validTime() {
			return !isNaN(Number(this.chosenTime.HH)) &&
				!isNaN(Number(this.chosenTime.mm));
		},
		validDuration() {
			return this.duration.hours !== undefined &&
				this.duration.minutes !== undefined &&
				(this.duration.hours > 0 || this.duration.minutes > 0);
		},
		validSeries() {
			return this.chosenSeries !== '' &&
				this.chosenSeries.name;
		},
		searchSeries(event) {
			if (event.query.trim() === '')
				this.availableSeries = [...this.allSeries];
			else
				this.availableSeries = this.allSeries.filter(s => {
					return s.name.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		getMinDate() {
			// return new Date(this.event.startdate);
			if (this.event === null || this.event.startdate === null)
				return '';
			else
				return new Date(this.event.startdate);
		},
		getMaxDate() {
			// return new Date(this.event.enddate);
			if (this.event === null || this.event.enddate === null)
				return '';
			else
				return new Date(this.event.enddate);
		},
		getSessionTime(session) {
			let local_tz = this.event.Track.timezone;
			return moment(session.starttime).tz(local_tz).format('Do MMM, HH:mm');
		}
	}
};
</script>

<style lang="scss" scoped>
.p-calendar {
	width: 100%;
}
.sessions-headline {
	font-size: 1.2em;
	font-weight: bold;
	padding-left: 0.5em;
}
</style>
