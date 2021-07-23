<template>
<div class="py-4">
	<div class="flex justify-between items-baseline mb-4">
		<h3 v-if="type === 'edit'" class="text-lg mb-3">
			Edit "{{ series.name }}"
		</h3>
		<h3 v-else class="text-lg mb-3">
			Add a new series
		</h3>
		<button class="btn btn-primary py-2 px-4" @click="saveItem">
			<span v-show="loading"><i class="pi pi-spinner pi-spin" /></span>
			<span v-show="!loading">Save</span>
		</button>
	</div>
	<form method="post" class="grid grid-cols-2 gap-4 p-8 rounded-md bg-white shadow-md">
		<!-- <pre>{{ invalidFields }}</pre> -->
		<div>
			<label class="block mb-1" for="name">Name</label>
			<input-text v-model="series.name" class="w-full " :class="invalidFields.name && 'p-invalid'" />
			<small v-if="invalidFields.name" class="text-red-600 text-capitalize">{{ invalidFields.name }}</small>
		</div>
		<div>
			<label class="block mb-1" for="shortname">Short name</label>
			<input-text v-model="series.shortname" class="w-full " :class="invalidFields.shortname && 'p-invalid'" />
			<small v-if="invalidFields.shortname" class="text-red-600 text-capitalize">{{ invalidFields.shortname }}</small>
		</div>
		<div>
			<label class="block mb-1" for="logo">Logo</label>
			<input-text v-model="series.logo" class="w-full " :class="invalidFields.logo && 'p-invalid'" />
			<small v-if="invalidFields.logo" class="text-red-600 text-capitalize">{{ invalidFields.logo }}</small>
		</div>
		<div>
			<label class="block mb-1" for="thumbnail">Thumbnail</label>
			<input-text v-model="series.thumbnail" class="w-full " :class="invalidFields.thumbnail && 'p-invalid'" />
			<small v-if="invalidFields.thumbnail" class="text-red-600 text-capitalize">{{ invalidFields.thumbnail }}</small>
		</div>
		<div>
			<label class="block mb-1" for="homepage">Homepage</label>
			<input-text v-model="series.homepage" class="w-full " :class="invalidFields.homepage && 'p-invalid'" />
			<small v-if="invalidFields.homepage" class="text-red-600 text-capitalize">{{ invalidFields.homepage }}</small>
		</div>
		<div>
			<label class="block mb-1" for="priority">Priority</label>
			<input-number v-model="series.priority" show-buttons button-layout="horizontal" class="w-full " :class="invalidFields.priority && 'p-invalid'" />
			<small v-if="invalidFields.priority" class="text-red-600 text-capitalize">{{ invalidFields.priority }}</small>
		</div>
		<div class="col-span-2">
			<label class="block mb-1" for="classes">Vehicle Classes</label>
			<auto-complete
				v-model="series.vehicleClasses"
				class="w-full"
				:suggestions="filteredClasses"
				:multiple="true"
				field="name"
				:dropdown="true"
				@complete="searchClass($event)"
			/>
		</div>
	</form>
</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import AutoComplete from 'primevue/autocomplete';

export default {
	components: { InputText, InputNumber, AutoComplete },
	layout: 'admin',
	middleware: 'auth',
	async asyncData({ $axios, params }) {
		const classes = await $axios.$get('/api/vehicleclass');
		if (typeof parseInt(params.id) === 'number')
			try {
				const res = await $axios.$get('/api/series/' + params.id);
				console.log(classes);
				return {
					type: 'edit',
					series: {
						...res,
						vehicleClasses: res.SeriesTypes.map(entity => entity.VehicleClass)
					},
					classes
				};
			} catch (err) {
				return {
					type: 'new',
					series: {
						name: '',
						shortname: '',
						logo: '',
						thumbnail: '',
						homepage: '',
						vehicleClasses: '',
						priority: 1
					},
					classes
				};
			} else
			return {
				type: 'new',
				series: {
					name: '',
					shortname: '',
					logo: '',
					thumbnail: '',
					homepage: '',
					vehicleClasses: [],
					priority: 1
				},
				classes
			};
	},
	data() {
		return {
			type: 'new',
			series: {
				name: '',
				shortname: '',
				logo: '',
				thumbnail: '',
				homepage: '',
				vehicleClasses: [],
				priority: 1
			},
			invalidFields: {},
			classes: [],
			filteredClasses: [],
			loading: false
		};
	},
	computed: {
		includedClasses() {
			return this.series.SeriesTypes ? this.series.SeriesTypes.map(entity => entity.VehicleClass.id) : [];
		}
	},
	methods: {
		searchClass(event) {
			if (!event.query.trim().length)
				this.filteredClasses = this.classes.filter(entity => !this.includedClasses.includes(entity.id));
			else
				this.filteredClasses = this.classes.filter(entity => !this.includedClasses.includes(entity.id) && entity.name.toLowerCase().startsWith(event.query.toLowerCase()));
		},
		validateItem() {
			let valid = true;
			const requiredFields = [
				'name',
				'shortname',
				'logo',
				'thumbnail'
			];

			const urlFields = [
				'logo',
				'thumbnail',
				'homepage'
			];

			for (const field of requiredFields)
				if (!this.series[field]) {
					valid = false;
					this.invalidFields[field] = `${field} is required`;
				}

			for (const field of urlFields)
				if (this.series[field].trim() !== '' && (!this.series[field].trim().startsWith('https://') && !this.series[field].trim().startsWith('http://'))) {
					valid = false;
					this.invalidFields[field] = `${field} is not a valid url`;
				} else {
					this.series[field] = this.series[field].trim();
				}

			this.series.vehicleClasses = this.series.vehicleClasses.map(entity => entity.id);

			return valid;
		},
		async saveItem() {
			this.loading = true;
			const valid = this.validateItem();
			if (!valid) {
				this.loading = false;
				return;
			}
			console.log(this.series.vehicleClasses);
			try {
				if (this.series.id)
					await this.$axios.put(`/api/calendar/series/${this.series.id}`, { series: this.series });
				else
					await this.$axios.post('/api/calendar/series', { series: this.series });

				this.$router.push('/admin/series');
			} catch (err) {
				console.log(err);
				this.$toast.add({ severity: 'error', summary: 'Oh no!', detail: 'Something went wrong while creating/updating a series.', life: 5000 });
			} finally {
				this.loading = false;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.p-autocomplete-multiple-container {
	width: 100% !important;
}
</style>
