<template>
<Dialog :header="headline" :visible.sync="showSeriesDialog" :modal="true">
	<div class="flex flex-row">
		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="name" v-model="series.name" type="text" class="full-width" />
				<label for="name">Full Name of the Series</label>
			</span>
		</div>

		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="shortname" v-model="series.shortname" type="text" class="full-width" />
				<label for="name">Short Name of the Series</label>
			</span>
		</div>
	</div>

	<br>

	<div class="flex flex-row">
		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="logo" v-model="series.logo" type="text" class="full-width" />
				<label for="name">Logo of the Series</label>
			</span>
		</div>

		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="thumbnail" v-model="series.thumbnail" type="text" class="full-width" />
				<label for="name">Thumbnail of the Logo</label>
			</span>
		</div>
	</div>

	<br>

	<div class="flex flex-row">
		<div class="pt-2 flex-grow">
			<Dropdown
				v-model="series.priority"
				:options="availablePriorities"
				option-label="name"
				option-value="value"
				placeholder="Select a priority"
			/>
		</div>

		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="homepage" v-model="series.homepage" type="text" class="full-width" />
				<label for="name">Homepage of the Series</label>
			</span>
		</div>
	</div>

	<br>

	<div>
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

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-else :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import PickList from 'primevue/picklist';
import { mapGetters } from 'vuex';

export default {
	components: {
		Dialog, Dropdown, InputText, PickList
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		}
	},
	data() {
		return {
			showSeriesDialog: false,
			action: '',
			headline: '',
			series: {
				name: '',
				shortname: '',
				priority: '',
				logo: '',
				thumbnail: '',
				homepage: ''
			},
			availablePriorities: [],
			pickListData: [[], []]
		};
	},
	computed: {
		...mapGetters({
			vehicleClasses: 'resources/classes/get'
		})
	},
	watch: {
		showDialog(newValue) {
			this.showSeriesDialog = newValue;
		},
		showSeriesDialog(newValue) {
			if (newValue === false)
				this.$emit('series-crud-closed');

			if (newValue === true) {
				this.action = 'Create';
				this.headline = 'Create a series';
				this.series = {
					name: '',
					shortname: '',
					priority: '',
					logo: '',
					thumbnail: '',
					homepage: ''
				};
				this.pickListData = [this.vehicleClasses, []];
			}
		}
	},
	created() {
		for (let i = 1; i <= 4; i++)
			this.availablePriorities.push({ value: i, name: 'Priority ' + i });

		this.showSeriesDialog = this.showDialog;
	},
	methods: {
		close() {
			this.showSeriesDialog = false;
		},
		sendRequest() {
			this.series.vehicleClasses = [];
			this.pickListData[1].forEach(vc => this.series.vehicleClasses.push(vc.id));
			this.$emit('send-request', this.series);
		},
		validInput() {
			return this.validFullName() &&
				this.validShortName() &&
				this.validLogo() &&
				this.validThumbnail() &&
				this.validPriority() &&
				this.validHomepage() &&
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
		validThumbnail() {
			return this.series.thumbnail.startsWith('https://') || this.series.thumbnail.startsWith('http://');
		},
		validPriority() {
			return !isNaN(Number(this.series.priority)) && Number(this.series.priority) >= 1 && Number(this.series.priority) <= 4;
		},
		validHomepage() {
			return this.series.homepage.trim() === '' || this.series.homepage.startsWith('https://') || this.series.homepage.startsWith('http://');
		},
		validVehicleClasses() {
			return this.pickListData[1].length > 0;
		},
		sourceListChanged() {
			this.pickListData[0].sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		},
		targetListChanged() {
			this.pickListData[1].sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		}
	}
};
</script>

<style scoped>

</style>
