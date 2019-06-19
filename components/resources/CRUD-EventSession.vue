<template>
<div>
	<md-dialog :md-active.sync="showEventSessionDialog">
		<md-dialog-title>Create an EventSession for {{ eventname }}</md-dialog-title>

		<md-list v-if="event !== null" class="md-dense">
			<md-list-item v-for="es in event.EventSessions" :key="es.id">
				<!-- <md-avatar>
					<img :src="es.Series.logo" alt="Logo" />
				</md-avatar> -->
				<div class="md-list-item-text">
					<div class="md-layout">
						<div class="md-layout-item">
							<strong>{{ es.name }}</strong> {{ es.starttime }}
						</div>
						<div class="md-layout-item">
							<md-icon class="" @click.native="deleteSession(es.id)">
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
				<md-highlight-text :md-term="term">
					{{ item.name }}
				</md-highlight-text>
			</template>

			<template slot="md-autocomplete-empty" slot-scope="{ term }">
				"{{ term }}" not found!
			</template>

			<span class="md-error">Please choose a series</span>
		</md-autocomplete>

		<div class="md-layout">
			<div class="block md-layout-item md-size-33">
				<label>Date</label>
				<md-datepicker v-model="eventtime.date" md-immediately :class="requiredDate">
					<span class="md-error">Please choose a date</span>
				</md-datepicker>
			</div>
			<div class="block md-layout-item md-size-15">
				<md-field :class="requiredHour">
					<label>Hour</label>
					<md-input v-model="eventtime.hour" required />
					<span class="md-error">Please enter an hour</span>
				</md-field>
			</div>
			<div class="block md-layout-item md-size-15">
				<md-field :class="requiredMinute">
					<label>Minute</label>
					<md-input v-model="eventtime.minute" required />
					<span class="md-error">Please enter a minute</span>
				</md-field>
			</div>
		</div>

		<p style="padding-left: 1em">
			<strong>Info:</strong> When creating the 2nd session etc., you need to clear the date first. Will be fixed later.
		</p>

		<md-dialog-actions>
			<md-button class="md-primary md-accent" @click="showEventSessionDialog = false">
				Cancel
			</md-button>
			<md-button class="md-raised md-primary" :disabled="!validInput()" @click="createSession()">
				Create
			</md-button>
		</md-dialog-actions>
	</md-dialog>
</div>
</template>

<script>
import moment from 'moment-timezone';

export default {
	props: {
		showDialog: {
			type: Boolean,
			defaukt: false
		},
		event: {
			type: Object,
			default() {
				return '';
			}
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
				hour: '',
				minute: ''
			},
			eventname: ''
		};
	},
	computed: {
		requiredDate() {
			return {
				'md-invalid': this.eventtime.date === null || this.eventtime.date === ''
			};
		},
		requiredHour() {
			return {
				'md-invalid': this.eventtime.hour === '' || !Number.isInteger(Number(this.eventtime.hour)) || Number(this.eventtime.hour) < 0 || Number(this.eventtime.hour) > 23
			};
		},
		requiredMinute() {
			return {
				'md-invalid': this.eventtime.minute === '' || !Number.isInteger(Number(this.eventtime.minute)) || Number(this.eventtime.minute) < 0 || Number(this.eventtime.minute) > 59
			};
		},
		requiredName() {
			return {
				'md-invalid': !(this.eventsession.name.length > 0)
			};
		},
		requiredSeries() {
			return {
				'md-invalid': this.eventsession.series === undefined || this.eventsession.series === ''
			};
		}
	},
	watch: {
		showDialog: function(newValue) {
			this.showEventSessionDialog = newValue;
		},
		showEventSessionDialog: function(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudEventSession');
			if (newValue === true) {
				Object.keys(this.eventsession).forEach(key => (this.eventsession[key] = ''));
				Object.keys(this.eventtime).forEach(key => (this.eventtime[key] = ''));
				if (event !== null)
					this.eventname = this.event.name;
			}
		},
	},
	methods: {
		async createSession() {
			const session = JSON.parse(JSON.stringify(this.eventsession));
			session.event = this.event.id;
			session.series = session.series.id;
			let date = moment(this.eventtime.date).format('YYYY-MM-DD');
			let hour = (Number(this.eventtime.hour) < 10 ? '0' : '') + parseInt(this.eventtime.hour, 10);
			let minute = parseInt(this.eventtime.minute, 10);
			minute = (minute < 10 ? '0' : '') + minute;
			session.starttime = date + ' ' + hour + ':' + minute;
			session.timezone = this.event.Track.timezone;

			const res = await this.$axios.$post('/api/calendar/eventsession/create', {
				session
			});
			this.$root.$emit('eventSessionCreated', res);
			Object.keys(this.eventsession).forEach(key => (this.eventsession[key] = ''));
			Object.keys(this.eventtime).forEach(key => (this.eventtime[key] = ''));
			if (event !== null)
				this.eventname = this.event.name;
		},
		async deleteSession(sessionid) {
			const res = await this.$axios.$post('/api/calendar/eventsession/delete/' + sessionid);
			if (res.deleted >= 1)
				this.$root.$emit('eventSessionDeleted', this.event.id, sessionid);
		},
		getAllSeries: function() {
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
		validInput: function() {
			return this.eventsession.name.length > 0 &&
			this.eventsession.series !== undefined && this.eventsession.series !== '' &&
			this.eventtime.date !== null && this.eventtime.date !== '' &&
			this.eventtime.hour !== '' && Number.isInteger(Number(this.eventtime.hour)) && Number(this.eventtime.hour) >= 0 && Number(this.eventtime.hour) <= 23 &&
			this.eventtime.minute !== '' && Number.isInteger(Number(this.eventtime.minute)) && Number(this.eventtime.minute) >= 0 && Number(this.eventtime.minute) <= 59;
		}
	}
};
</script>

<style lang="scss" scoped>
.md-dialog {
	min-width: 33%;
}

.md-field {
	width: auto;
	margin-left: 1em;
	margin-right: 1em;
}

.md-menu-content {
	z-index: 100;
}
</style>
