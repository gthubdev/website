<template>
<div>
	<md-dialog :md-active.sync="showSeriesDialog">
		<md-dialog-content>
			<md-dialog-title>{{ headline }}</md-dialog-title>

			<md-field :class="requiredName">
				<label>Fullname of the Series</label>
				<md-input v-model="series.name" required />
				<span class="md-error">Please enter the series' name</span>
			</md-field>

			<md-field :class="requiredShortName">
				<label>Shortname of the Series</label>
				<md-input v-model="series.shortname" required />
				<span class="md-error">Please enter the series' shortname</span>
			</md-field>

			<md-field :class="requiredLogo">
				<label>Logo</label>
				<md-input v-model="series.logo" required />
				<span class="md-error">Please enter a URL</span>
			</md-field>

			<md-field>
				<label>Homepage</label>
				<md-input v-model="series.homepage" />
			</md-field>

			<md-field :class="requiredPriority">
				<label for="priority">Priority</label>
				<md-select id="priority" v-model="series.priority" name="priority" placeholder="Priority" required>
					<md-option v-for="i in PRIORITY_MAX" :key="i" :value="i">
						{{ i }}
					</md-option>
				</md-select>
				<span class="md-error">Please choose a priority</span>
			</md-field>

			<div v-if="vehicleClasses.length">
				<md-chip v-for="(vcl, index) in vehicleClasses" :key="vcl.id" class="md-primary" md-deletable @md-delete="removeVehicleClass(vcl, index)">
					{{ vcl.name }}
				</md-chip>
			</div>

			<md-autocomplete v-model="chosenVC" md-dense :md-options="tmpVehicleClasses.map(x=>({
				'id':x.id,
				'name':x.name,
				'category':x.VehicleClassCategory.name,
				'toLowerCase':()=>x.name.toLowerCase(),
				'toString':()=>x.name + ' (' + (x.VehicleClassCategory.name) + ')'
			}))" :class="requiredVehicleClass"
			>
				<label>Vehicle Class</label>
				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<span class="color" :style="`background-color: ${item.color}`" />
					<md-highlight-text :md-term="typeof term === 'object' && term.name ? term.name : term.toString()">
						{{ item }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a vehicle class</span>
			</md-autocomplete>

			<md-dialog-actions>
				<md-button class="md-primary md-accent" @click="showSeriesDialog = false">
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
			chosenVC: '',
			vehicleClasses: [],
			tmpVehicleClasses: [],
			PRIORITY_MAX: constants.PRIORITY_MAX
		};
	},
	computed: {
		requiredName() {
			return {
				'md-invalid': !(this.series.name.length > 0)
			};
		},
		requiredShortName() {
			return {
				'md-invalid': !(this.series.shortname.length > 0)
			};
		},
		requiredLogo() {
			return {
				'md-invalid': !(this.series.logo.length >= 1)
			};
		},
		requiredPriority() {
			return {
				'md-invalid': !(this.series.priority >= 1)
			};
		},
		requiredVehicleClass() {
			return {
				'md-invalid': !this.vehicleClasses.length
			};
		}
	},
	watch: {
		showDialog(newValue) {
			this.showSeriesDialog = newValue;
		},
		showSeriesDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_SERIES);

			if (newValue === true && this.updateMode === false) {
				// Reset all values
				Object.keys(this.series).forEach(key => (this.series[key] = ''));
				// Reset arrays
				this.resetArrays();
				// Reset values for the chosen category
				this.chosenVC = {
					'id':'',
					'name':'',
					'category':'',
					'toLowerCase':()=>'',
					'toString':()=>''
				};
			}
			if (newValue === true && this.updateMode === true && this.activeSeries !== undefined) {
				// Might need to reset the object
				this.resetActiveSeries();
				// Reset arrays
				this.resetArrays();
				// Move all vehicle classes to corresponding array
				this.series.SeriesTypes.forEach(st => {
					let index = this.tmpVehicleClasses.findIndex(tvc => tvc.id == st.class);
					let vclass = this.tmpVehicleClasses[index];
					let newobj = {
						'id':vclass.id,
						'name':vclass.name,
						'category':vclass.VehicleClassCategory.name,
						'toLowerCase':()=>vclass.name.toLowerCase(),
						'toString':()=>vclass.name + ' (' + (vclass.VehicleClassCategory.name) + ')'
					};
					this.vehicleClasses.push(newobj);
					this.tmpVehicleClasses.splice(index, 1);
				});
			}
		},
		activeSeries(newValue) {
			if (newValue === undefined) return;

			this.series = newValue;

			if (newValue === true && this.updateMode === true)
				this.resetActiveSeries();
		},
		chosenVC(newValue) {
			if (newValue !== undefined && newValue.name && newValue.name.length) {
				this.vc.forEach(vc => {
					if (vc.name === newValue.name) {
						this.vehicleClasses.push(newValue);
						let index = this.tmpVehicleClasses.findIndex(tcl => tcl.id == newValue.id);
						this.tmpVehicleClasses.splice(index, 1);
						this.chosenVC = {
							'id':'',
							'name':'',
							'category':'',
							'toLowerCase':()=>'',
							'toString':()=>''
						};
					}
				});
			}
		}
	},
	methods: {
		sendRequest() {
			this.$root.$emit(strings.SEND_REQUEST_CRUD_SERIES, this.series,this.vehicleClasses);
		},
		removeVehicleClass(vc, index) {
			this.vehicleClasses.splice(index, 1);
			vc.VehicleClassCategory = { name: vc.category };
			this.tmpVehicleClasses.push(vc);
		},
		validInput() {
			return this.series.name.length &&
			this.series.shortname.length &&
			this.series.logo.length &&
			this.series.priority >= 1 &&
			this.vehicleClasses.length;
		},
		resetActiveSeries() {
			this.series = JSON.parse(JSON.stringify(this.activeSeries));
		},
		resetArrays() {
			this.vehicleClasses.splice(0);
			this.tmpVehicleClasses.splice(0);
			this.tmpVehicleClasses = Array.from(this.vc);
		}
	}
};
</script>

<style lang="scss">
.md-dialog {
	min-width: 50%;
}
</style>
