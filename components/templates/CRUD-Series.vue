<template>
<Dialog :header="headline" :visible.sync="showSeriesDialog" :modal="true">
	<div>
		<span class="p-float-label">
			<InputText id="name" v-model="series.name" type="text" class="full-width" />
			<label for="name">Full Name of the Series</label>
		</span>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="shortname" v-model="series.shortname" type="text" class="full-width" />
			<label for="name">Short Name of the Series</label>
		</span>
	</div>

	<br />
	<div class="p-grid p-align-center">
		<div class="p-col-4">
			Vehicle classes:
		</div>
		<div class="p-col-8">
			<MultiSelect
				v-model="chosenVC"
				:options="vc"
				option-label="name"
				placeholder="Select vehicle classes"
				:filter="true"
			>
				<template #value="slotProps">
					<div v-for="option of slotProps.value" :key="option.id" class="p-multiselect-vc-token">
						<span>{{ option.name }}</span>
					</div>
					<div v-if="!slotProps.value || slotProps.value.length === 0">
						Select Vehicle Classes
					</div>
				</template>
				<template #option="slotProps">
					<div class="p-multiselect-vc-option">
						<span>
							{{ slotProps.option.name }} ({{ slotProps.option.VehicleClassCategory.name }})
						</span>
					</div>
				</template>
			</MultiSelect>
		</div>
	</div>

	<br />
	<div class="p-grid p-align-center">
		<div class="p-col-4">
			Priority:
		</div>
		<div class="p-col-8">
			<Dropdown
				v-model="series.priority"
				:options="availablePriorities"
				option-label="name"
				option-value="value"
				placeholder="Select a priority"
			/>
		</div>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="logo" v-model="series.logo" type="text" class="full-width" />
			<label for="name">Logo of the Series</label>
		</span>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="homepage" v-model="series.homepage" type="text" class="full-width" />
			<label for="name">Homepage of the Series</label>
		</span>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import { constants, strings } from '~/plugins/constants';

export default {
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		activeSeries: {
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
		},
		vc: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showSeriesDialog: false,
			series: {
				name: '',
				shortname: '',
				logo: '',
				homepage: '',
				priority: ''
			},
			chosenVC: [],
			availablePriorities: [],
			PRIORITY_MAX: constants.PRIORITY_MAX
		};
	},
	watch: {
		showDialog(newValue) {
			this.showSeriesDialog = newValue;
		},
		showSeriesDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_SERIES);

			this.chosenVC = [];

			if (newValue === true && this.updateMode === true && this.activeSeries !== undefined) {
				// Might need to reset the object
				this.resetActiveSeries();
			}
		},
		activeSeries(newValue) {
			if (newValue === undefined) return;

			this.series = newValue;

			if (newValue === true && this.updateMode === true)
				this.resetActiveSeries();
		}
	},
	created() {
		for (let i = 1; i <= this.PRIORITY_MAX; i++)
			this.availablePriorities.push(
				{
					'value': i,
					'name': 'Priority ' + i
				});
	},
	methods: {
		close() {
			this.showSeriesDialog = false;
		},
		sendRequest() {
			this.$root.$emit(strings.SEND_REQUEST_CRUD_SERIES, this.series, this.chosenVC);
		},
		validInput() {
			return this.validFullName() &&
				this.validShortName() &&
				this.validLogo() &&
				this.validHomepage() &&
				this.validPriority() &&
				this.validVehicleClasses();
		},
		validFullName() {
			return this.series !== undefined && this.series.name.length > 0;
		},
		validShortName() {
			return this.series.shortname.length > 0;
		},
		validLogo() {
			return this.series.logo.startsWith('https://') || this.series.logo.startsWith('http://');
		},
		validHomepage() {
			return this.series.homepage.trim() === '' || this.series.homepage.startsWith('https://') || this.series.homepage.startsWith('http://');
		},
		validPriority() {
			return !isNaN(Number(this.series.priority)) && Number(this.series.priority) >= 1 && Number(this.series.priority) <= this.PRIORITY_MAX;
		},
		validVehicleClasses() {
			return this.chosenVC && this.chosenVC.length && this.chosenVC.length > 0;
		},
		resetActiveSeries() {
			this.series = JSON.parse(JSON.stringify(this.activeSeries));

            // set the vehicle classes
			this.chosenVC = [];
			this.activeSeries.SeriesTypes.forEach(t => this.chosenVC.push(t.VehicleClass));
		}
	}
};
</script>

<style lang="scss">
.p-dropdown, .p-multiselect {
	min-width: 100%;
}
.p-dropdown-item, .p-multiselect-item {
	min-width: 100%;
}
.p-multiselect-vc-option {
	display: inline-block;
	vertical-align: middle;
}
.p-multiselect-vc-token {
	background: #FFB300;
	color: #000;
	padding: 2px 5px;
	margin: 0 0.5em 0.4em 0;
	display: inline-block;
	vertical-align: middle;
	height: 1.8em;
	border-radius: 5px;
}
</style>
