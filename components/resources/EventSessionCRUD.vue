<template>
<Dialog :header="headline" :visible.sync="showSessionDialog" :modal="true">
	<div class="flex flex-row">
		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="name" v-model="session.name" type="text" class="full-width" />
				<label for="name">Session Name</label>
			</span>
		</div>
		<div class="pt-2">
			<Dropdown
				v-model="chosenType"
				:options="sessionTypes"
				option-label="name"
				option-value="id"
				placeholder="Select a session type"
			/>
		</div>
	</div>

	<br>

	<div class="flex flex-row">
		<div class="pt-2">
			<Calendar
				v-model="chosenDate"
				date-format="dd M yy"
				:show-icon="true"
				:hide-on-date-time-select="true"
				:min-date="getMinDate()"
				:max-date="getMaxDate()"
			/>
		</div>
		<div class="pt-2">
			<vue-timepicker
				v-model="chosenTime"
				format="HH:mm"
				:minute-interval="5"
				close-on-complete
			/>
		</div>
	</div>

	<br>

	<label>Duration</label>
	<div class="flex flex-row">
		<div class="pt-2">
			<label for="duration_hours">Hours</label>
			<InputNumber
				id="duration_hours"
				v-model="duration.hours"
				:show-buttons="true"
				button-layout="horizontal"
				:step="1"
				decrement-button-class="p-button-danger"
				increment-button-class="p-button-success"
				increment-button-icon="pi pi-plus"
				decrement-button-icon="pi pi-minus"
			/>
		</div>

		<div class="pt-2">
			<label for="duration_minutes">Minutes</label>
			<InputNumber
				id="duration_minutes"
				v-model="duration.minutes"
				:show-buttons="true"
				button-layout="horizontal"
				:step="5"
				decrement-button-class="p-button-danger"
				increment-button-class="p-button-success"
				increment-button-icon="pi pi-plus"
				decrement-button-icon="pi pi-minus"
			/>
		</div>
	</div>

	<br>

	<AutoComplete
		v-model="chosenSeries"
		:suggestions="availableSeries"
		:dropdown="true"
		field="name"
		placeholder="Series"
		force-selection
		@complete="searchSeries($event)"
	>
		<template #item="slotProps">
			<div>
				{{ slotProps.item.name }}
			</div>
		</template>
	</AutoComplete>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-else :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import AutoComplete from 'primevue/autocomplete';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import VueTimepicker from 'vue2-timepicker';
import { mapGetters } from 'vuex';

export default {
	components: {
		AutoComplete, Calendar, Dialog, Dropdown, VueTimepicker
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		isEditing: {
			type: Boolean, default: false
		},
		editingEvent: {
			type: Object, default: null
		},
		editingSession: {
			type: Object, default: null
		}
	},
	data() {
		return {
			showSessionDialog: false,
			action: '',
			headline: '',
			session: {
				name: '',
				starttime: '',
				sessiontype: ''
			},
			chosenType: '',
			chosenDate: '',
			chosenTime: {
				HH: '',
				mm: ''
			},
			duration: {
				hours: 0,
				minutes: 0
			},
			chosenSeries: '',
			availableSeries: [],
			allSeries: []
		};
	},
	computed: {
		...mapGetters({
			sessionTypes: 'resources/sessiontypes/get'
		})
	},
	watch: {
		showDialog(newValue) {
			this.showSessionDialog = newValue;
		},
		showSessionDialog(newValue) {
			if (newValue === false)
				this.$emit('session-crud-closed');

			if (newValue === true) {
				this.action = 'Create';
				this.headline = 'Create a session';
				this.session = {
					name: '',
					starttime: '',
					sessiontype: ''
				};
				this.chosenType = '';
				this.chosenDate = '';
				this.chosenTime = {
					HH: '',
					mm: ''
				};
				this.duration = {
					hours: 0,
					minutes: 0
				};
				this.chosenSeries = '';
				this.allSeries = [];
				this.allSeries.push(this.editingEvent.Series);
				if (this.editingEvent.SupportSeries !== undefined)
					this.editingEvent.SupportSeries.forEach(s => {
						this.allSeries.push(s.Series);
					});
			}

			if (newValue === true && this.isEditing === true) {
				this.action = 'Update';
				this.headline = 'Update ' + this.editingSession.name +
					' [' + this.editingEvent.name + ']';
				this.session = {
					name: this.editingSession.name,
					starttime: '',
					sessiontype: this.editingSession.sessiontype
				};
				this.chosenType = this.editingSession.sessiontype;
				this.chosenDate = new Date(this.$dayjs(this.editingSession.starttime).tz(this.editingEvent.Track.timezone).format('YYYY-MM-DD'));

				const hour = this.$dayjs(this.editingSession.starttime).hour();
				if (hour < 10)
					this.chosenTime.HH = '0' + hour.toString();
				else
					this.chosenTime.HH = hour.toString();
				const min = this.$dayjs(this.editingSession.starttime).minute();
				if (min < 10)
					this.chosenTime.mm = '0' + min.toString();
				else
					this.chosenTime.mm = min.toString();

				this.duration = {
					hours: Math.floor(this.editingSession.duration / 60),
					minutes: this.editingSession.duration % 60
				};

				this.allSeries = [];
				this.allSeries.push(this.editingEvent.Series);
				if (this.editingEvent.SupportSeries !== undefined)
					this.editingEvent.SupportSeries.forEach(s => {
						this.allSeries.push(s.Series);
					});
				this.chosenSeries = this.allSeries.find(s => s.id === this.editingSession.series);
			}
		}
	},
	methods: {
		close() {
			this.showSessionDialog = false;
		},
		sendRequest() {
			this.session.sessiontype = this.chosenType;
			this.session.duration = this.duration.hours * 60 + this.duration.minutes;
			this.session.starttime = this.$dayjs(this.chosenDate)
				.hour(this.chosenTime.HH)
				.minute(this.chosenTime.mm)
				.format('YYYY-MM-DD HH:mm');
			this.session.series = this.chosenSeries.id;
			this.session.event = this.editingEvent.id;
			this.session.timezone = this.editingEvent.Track.timezone;
			this.$emit('send-request', this.session);
		},
		validInput() {
			return this.validName() &&
				this.validSessionType() &&
				this.validDate() &&
				this.validTime() &&
				this.validDuration() &&
				this.validSeries();
		},
		validName() {
			return this.session !== undefined && this.session.name.length > 0;
		},
		validSessionType() {
			return this.chosenType !== '';
		},
		validDate() {
			return this.chosenDate !== undefined && this.$dayjs(this.chosenDate).isValid();
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
			return this.chosenSeries !== '' && this.chosenSeries.name;
		},
		getMinDate() {
			if (this.editingEvent === null || this.editingEvent.startdate === null)
				return '';
			else
				return new Date(this.editingEvent.startdate);
		},
		getMaxDate() {
			if (this.editingEvent === null || this.editingEvent.enddate === null)
				return '';
			else
				return new Date(this.editingEvent.enddate);
		},
		searchSeries(event) {
			if (event.query.trim() === '')
				this.availableSeries = [...this.allSeries];
			else
				this.availableSeries = this.allSeries.filter(s => {
					return s.name.toLowerCase().includes(event.query.toLowerCase());
				});
		}
	}
};
</script>

<style scoped>

</style>
