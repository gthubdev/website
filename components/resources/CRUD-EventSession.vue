<template>
<div>
	<md-dialog :md-active.sync="showEventSessionDialog">
		<md-dialog-content>
			<md-dialog-title>{{ headline() }}</md-dialog-title>

			<md-list v-if="event !== null" class="md-dense">
				<md-list-item v-for="es in getSessions()" :key="es.id">
					<!-- <md-avatar>
						<img :src="es.Series.logo" alt="Logo" />
					</md-avatar> -->
					<div class="md-list-item-text">
						<div class="md-layout">
							<div class="md-layout-item">
								<strong>{{ es.name }} ({{ es.Series.shortname }})</strong> {{ getLocalTime(es) }}
							</div>
							<div class="md-layout-item">
								<md-icon class="" @click.native="deleteSession(es)">
									delete
								</md-icon>
							</div>
						</div>
					</div>
				</md-list-item>
			</md-list>

			<md-field :class="requiredName">
				<label>Name</label>
				<md-input v-model="eventsession.name" required />
				<span class="md-error">Please enter a name</span>
			</md-field>

			<md-autocomplete v-model="eventsession.series" :md-options="getAllSeries().map(x=>({
				'id':x.id,
				'name':x.name,
				'toLowerCase':()=>x.name.toLowerCase(),
				'toString':()=>x.name
			}))" :class="requiredSeries"
			>
				<label>Series</label>
				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<span class="color" :style="`background-color: ${item.color}`" />
					<md-highlight-text :md-term="term.name ? term.name : term">
						{{ item.name }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a series</span>
			</md-autocomplete>

			<div class="md-subheading">
				Date
			</div>
			<VueCtkDateTimePicker
				v-model="eventtime.date"
				:label="dateLabel()"
				format="YYYY-MM-DD HH:mm"
				formatted="ddd, Do MMMM YYYY, HH:mm"
				minute-interval="15"
				locale="en"
				:hint="dateHint()"
				:error="isInvalidStart()"
				color="#ed6400"
				button-color="#ed6400"
				:min-date="getMinDate()"
				:max-date="getMaxDate()"
				:first-day-of-week="1"
				:dark="true"
			/>

			<div class="md-subheading">
				Duration
			</div>
			<div class="md-layout">
				<div class="block md-layout-item md-size-25">
					<md-field :class="requiredDuration">
						<label>Hours</label>
						<md-input v-model="eventtime.duration_hours" required />
						<span class="md-error">Please enter hours</span>
					</md-field>
				</div>

				<div class="md-layout-item md-size-5">
					&nbsp;
				</div>

				<div class="block md-layout-item md-size-25">
					<md-field :class="requiredDuration">
						<label>Minutes</label>
						<md-input v-model="eventtime.duration_minutes" required />
						<span class="md-error">Please enter minutes</span>
					</md-field>
				</div>
			</div>

			<div class="md-layout-item">
				&nbsp;
			</div>

			<md-dialog-actions>
				<md-button class="md-primary md-accent" @click="showEventSessionDialog = false">
					Cancel
				</md-button>
				<md-button class="md-raised md-primary" :disabled="!validInput()" @click="sendRequest()">
					{{ action }}
				</md-button>
			</md-dialog-actions>
		</md-dialog-content>
	</md-dialog>
</div>
</template>

<script>
import moment from 'moment-timezone';

export default {
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		event: {
			type: Object,
			default() {
				return '';
			}
		},
		activeSession: {
			type: Object,
			default() {
				return '';
			}
		},
		mode: {
			type: String,
			default: ''
		}
	},
	data: function() {
		return {
			showEventSessionDialog: false,
			eventsession: {
				name: '',
				series: ''
			},
			eventtime: {
				date: '',
				duration_hours: '',
				duration_minutes: ''
			}
		};
	},
	computed: {
		action() {
			switch(this.mode) {
				case 'create':
					return 'Create';
				case 'update':
					return 'Update';
				default:
					return '';
			}
		},
		requiredDate() {
			return {
				'md-invalid': this.eventtime.date === null || this.eventtime.date === ''
			};
		},
		requiredDuration() {
			return {
				'md-invalid': !this.validDuration()
			};
		},
		requiredName() {
			return {
				'md-invalid': !(this.eventsession.name.length > 0)
			};
		},
		requiredSeries() {
			return {
				'md-invalid': this.eventsession.series === undefined || !this.eventsession.series.id
			};
		}
	},
	watch: {
		showDialog(newValue) {
			this.showEventSessionDialog = newValue;
		},
		showEventSessionDialog(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudEventSession');
			if (newValue === true && this.mode === 'create') {
				// Reset all values
				Object.keys(this.eventsession).forEach(key => (this.eventsession[key] = ''));
				Object.keys(this.eventtime).forEach(key => (this.eventtime[key] = ''));
			}
			if (newValue === true && this.mode === 'update' && this.activeSession !== undefined) {
				this.eventsession = JSON.parse(JSON.stringify(this.activeSession));
				let s = this.eventsession.Series;
				this.eventsession.series = {
					'id':s.id,
					'name':s.name,
					'toLowerCase':()=>s.name.toLowerCase(),
					'toString':()=>s.name
				};
				// Convert into local time
				let start = moment(this.eventsession.starttime).tz(this.event.Track.timezone);
				this.eventtime.date = start.format('YYYY-MM-DD HH:mm');
			}
		},
		activeSession(newValue) {
			if (this.mode === 'update' && newValue !== undefined) {
				this.eventsession = JSON.parse(JSON.stringify(this.activeSession));
				let s = this.eventsession.Series;
				this.eventsession.series = {
					'id':s.id,
					'name':s.name,
					'toLowerCase':()=>s.name.toLowerCase(),
					'toString':()=>s.name
				};
				// Convert into local time
				let start = moment(this.eventsession.starttime).tz(this.event.Track.timezone);
				this.eventtime.date = start.format('YYYY-MM-DD HH:mm');
				// Parse the duration
				this.eventtime.duration_hours = Math.floor(parseInt(this.eventsession.duration)/60);
				this.eventtime.duration_minutes = parseInt(this.eventsession.duration) % 60;
			}
		}
	},
	methods: {
		async sendRequest() {
			const session = JSON.parse(JSON.stringify(this.eventsession));
			session.event = this.event.id;
			session.series = session.series.id;
			session.starttime = this.eventtime.date;
			// hours/minutes might not be a number, set it to 0 otherwise
			let tmp_hours = isNaN(parseInt(this.eventtime.duration_hours)) ? 0 : parseInt(this.eventtime.duration_hours);
			let tmp_minutes = isNaN(parseInt(this.eventtime.duration_minutes)) ? 0 : parseInt(this.eventtime.duration_minutes);
			session.duration = tmp_hours * 60 + tmp_minutes;
			session.timezone = this.event.Track.timezone;

			if (this.mode === 'create') {
				try {
					const res = await this.$axios.$post('/api/calendar/eventsession/create', {
						session
					});
					this.$root.$emit('eventSessionCreated', res);
					Object.keys(this.eventsession).forEach(key => (this.eventsession[key] = ''));
					Object.keys(this.eventtime).forEach(key => (this.eventtime[key] = ''));
					if (event !== null)
					this.eventname = this.event.name;
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			} else if (this.mode === 'update') {
				delete session.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/eventsession/update/' + session.id, {
						session
					});
					if (res.id)
					this.$root.$emit('eventSessionUpdated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
				this.showEventSessionDialog = false;
			}
		},
		deleteSession(session) {
			this.$root.$emit('confirmDeleteEventSession', session);
		},
		headline() {
			switch(this.mode) {
				case 'create': {
					let name;
					if (this.event !== null)
						name = this.event.name;
					else
						name = '';
					// let name = this.event !== undefined ? this.event.name : '';
					return 'Create an EventSession for ' + name;
				}
				case 'update':
					return 'Update Session ' + this.eventsession.name + ' for ' + this.event.name;
				default:
					return '';
			}
		},
		getSessions() {
			// don't show the active session in the list
			return this.event.EventSessions.filter(es => {
				if (this.mode === 'create')
					return true;
				else if (this.activeSession && this.activeSession.id)
					return es.id !== this.activeSession.id;
			});
		},
		getAllSeries() {
			let arr = [];
			if (this.event === null) {
				return arr;
			}
			arr.push(this.event.Series);
			this.event.SupportSeries.forEach(series => {
				arr.push(series.Series);
			});
			return arr;
		},
		getLocalTime(session) {
			let local_tz = this.event.Track.timezone;
			return moment(session.starttime).tz(local_tz).format('Do MMM, HH:mm');
		},
		validInput() {
			return this.eventsession.name.length > 0 &&
			this.eventsession.series !== undefined && this.eventsession.series.id &&
			!this.isInvalidStart() &&
			this.validDuration();
		},
		validDuration() {
			// both are valid
			if (this.validHours() && this.validMinutes() &&
				(Number(this.eventtime.duration_hours) > 0 || Number(this.eventtime.duration_minutes) > 0))
				return true;
			// only hours are valid
			if (this.validHours() && Number(this.eventtime.duration_hours) > 0 && this.eventtime.duration_minutes.trim() === '')
				return true;
			// only minutes are valid
			if (this.validMinutes() && Number(this.eventtime.duration_minutes) > 0 && this.eventtime.duration_hours.trim() === '')
				return true;
			// neither is valid
			return false;
		},
		validHours() {
			if (this.eventtime.duration_hours !== '' && Number.isInteger(Number(this.eventtime.duration_hours)) && Number(this.eventtime.duration_hours) >= 0 && Number(this.eventtime.duration_hours) <= 96)
				return true;
			else
				return false;
		},
		validMinutes() {
			if (this.eventtime.duration_minutes !== '' && Number.isInteger(Number(this.eventtime.duration_minutes)) && Number(this.eventtime.duration_minutes) >= 0 && Number(this.eventtime.duration_minutes) <= 60)
				return true;
			else
				return false;
		},
		isInvalidStart() {
			if (this.eventtime.date === null ||
				this.eventtime.date === '')
				return true;

			return moment(this.event.startdate).isAfter(moment(this.eventtime.date).format('YYYY-MM-DD')) &&
				moment(this.event.enddate).isBefore(moment(this.eventtime.date).format('YYYY-MM-DD'));
		},
		dateLabel() {
			return this.isInvalidStart() ? 'Select date' : '';
		},
		dateHint() {
			return this.isInvalidStart() ? 'Please select a valid date' : '';
		},
		getMinDate() {
			if (this.event === null || this.event.startdate === null)
				return '';
			else
				return this.event.startdate;
		},
		getMaxDate() {
			if (this.event === null || this.event.enddate === null)
				return '';
			else
				return this.event.enddate;
		}
	}
};
</script>

<style lang="scss" scoped>
.md-dialog {
	min-width: 50%;
}
.md-menu-content {
	z-index: 100;
}
</style>
