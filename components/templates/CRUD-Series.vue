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
		<div class="p-col-2">
			Vehicle classes:
		</div>
		<div class="p-col-10">
			<PickList
				v-model="pickListData"
				data-key="id"
				@move-to-source="sourceListChanged()"
				@move-all-to-source="sourceListChanged()"
				@move-to-target="targetListChanged()"
				@move-all-to-target="targetListChanged()"
			>
				<template #sourceHeader>
					Available
				</template>
				<template #targetHeader>
					Selected
				</template>
				<template #item="slotProps">
					<span>
						{{ slotProps.item.name }} ({{ slotProps.item.VehicleClassCategory.name }})
					</span>
				</template>
			</PickList>
		</div>
	</div>

	<br />
	<div class="p-grid p-align-center">
		<div class="p-col-2">
			Priority:
		</div>
		<div class="p-col-10">
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
				vehicleClasses: [],
				priority: ''
			},
			availablePriorities: [],
			// must be a 2-dimensional array
			pickListData:[[], []],
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

			if (newValue === true && this.updateMode === false)
				this.pickListData = [this.vc, []];

			if (newValue === true && this.updateMode === true && this.activeSeries !== undefined) {
				// Might need to reset the object
				this.resetActiveSeries();
			}
		},
		series(newValue) {
			console.log('NEW VALUE SERIES:', newValue);
		},
		activeSeries(newValue) {
			if (newValue === undefined) return;

			this.series = newValue;

			if (typeof newValue === 'object' && this.updateMode === true)
				this.resetActiveSeries();
		}
	},
	created() {
		for (let i = 1; i <= this.PRIORITY_MAX; i++)
			this.availablePriorities.push(
				{
					'value': i,
					'name': 'Priority ' + i
				}
			);
	},
	methods: {
		close() {
			this.showSeriesDialog = false;
		},
		sendRequest() {
			// set the vehicle classes
			this.series.vehicleClasses = [];
			this.pickListData[1].forEach(vc => this.series.vehicleClasses.push(vc.id));

			this.$parent.$emit(strings.SEND_REQUEST_CRUD_SERIES, this.series);
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
			return this.pickListData[1].length > 0;
		},
		findVehicleClass(id) {
			let obj = this.vc.find(cl => cl.id === id);
			return obj.name;
		},
		sourceListChanged() {
			this.pickListData[0].sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		},
		targetListChanged() {
			this.pickListData[1].sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		},
		resetActiveSeries() {
			this.series = JSON.parse(JSON.stringify(this.activeSeries));

            // set the vehicle classes
			this.series.vehicleClasses = [];

			// create tmp array, easier for comparison
			let series_vc = [];
			this.activeSeries.SeriesTypes.forEach(t => series_vc.push(t.VehicleClass.id));

			this.pickListData = [[], []];
			this.vc.forEach(vc => {
				if (series_vc.includes(vc.id))
					this.pickListData[1].push(vc);
				else
					this.pickListData[0].push(vc);
			});
		}
	}
};
</script>

<style lang="scss">
.p-dialog {
	min-width: 60% !important;
	max-width: 90% !important;
}
.p-dropdown, .p-multiselect {
	min-width: 100%;
}
.p-dropdown-item, .p-multiselect-item {
	min-width: 100%;
}
.p-multiselect-vc-option {
	//display: inline-block;
	//vertical-align: middle;
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
.p-picklist-source-controls , .p-picklist-target-controls {
	display: none;
}
</style>
