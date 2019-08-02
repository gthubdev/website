<template>
<div>
	<md-dialog :md-active.sync="showSeriesDialog">
		<md-dialog-content>
			<md-dialog-title>{{ headline }}</md-dialog-title>

			<md-field :class="requiredName">
				<label>Fullname</label>
				<md-input v-model="series.name" required />
				<span class="md-error">Please enter a name</span>
			</md-field>

			<md-field :class="requiredShortName">
				<label>Shortname</label>
				<md-input v-model="series.shortname" required />
				<span class="md-error">Please enter a shortname</span>
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
					<md-option v-for="i in 4" :key="i" :value="i">
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

			<md-autocomplete v-model="chosenVC" :md-options="tmpVehicleClasses.map(x=>({
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
export default {
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		activeSeries: {
			type: Object,
			default: null
		},
		mode: {
			type: String,
			default: ''
		},
		vc: {
			type: Array,
			default() { return []; }
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
			tmpVehicleClasses: []
		};
	},
	computed: {
		headline() {
			switch(this.mode) {
				case 'create':
					return 'Create a Series';
				case 'update':
					return 'Update ' + this.series.name;
				default:
					return '';
			}
		},
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
		showSeriesDialog(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudSeries');
			if (newValue === true && this.mode === 'create') {
				// Reset all values
				Object.keys(this.series).forEach(key => (this.series[key] = ''));
				// Reset arrays
				this.vehicleClasses.splice(0);
				this.tmpVehicleClasses.splice(0);
				this.tmpVehicleClasses = Array.from(this.vc);
				this.chosenVC = {
					'id':'',
					'name':'',
					'category':'',
					'toLowerCase':()=>'',
					'toString':()=>''
				};
			}
			if (newValue === true && this.mode === 'update' && this.activeSeries !== undefined) {
				// Might need to reset the object
				this.series = JSON.parse(JSON.stringify(this.activeSeries));
				// Reset arrays
				this.vehicleClasses.splice(0);
				this.tmpVehicleClasses.splice(0);
				this.tmpVehicleClasses = Array.from(this.vc);
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
			if (this.mode === 'update' && newValue !== undefined)
				// Need to copy the object in order to not change it when cancelling
				this.series = JSON.parse(JSON.stringify(this.activeSeries));
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
		async sendRequest() {
			const series = JSON.parse(JSON.stringify(this.series));
			series.vehicleClasses = this.vehicleClasses;
			if (this.mode === 'create') {
				try {
					const res = await this.$axios.$post('/api/calendar/series/create', {
						series
					});
					this.$root.$emit('seriesCreated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			} else if (this.mode === 'update') {
				// no need to update that
				delete series.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/series/update/' + series.id, {
						series
					});
					if (res.id && res.id >= 1)
					this.$root.$emit('seriesUpdated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			}
			this.showSeriesDialog = false;
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
		}
	}
};
</script>

<style lang="scss">
.md-dialog {
	min-width: 50%;
}
</style>
