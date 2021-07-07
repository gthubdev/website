<template>
<div class="py-4">
	<div class="flex justify-between items-baseline mb-4">
		<h3 v-if="type == 'edit'" class="text-lg mb-3">
			Edit "{{ data.name }}"
		</h3>
		<h3 v-else class="text-lg mb-3">
			Add a new Track
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
			<input-text v-model="data.name" class="w-full " :class="invalidFields.name && 'p-invalid'" />
			<small v-if="invalidFields.name" class="text-red-600 text-capitalize">{{ invalidFields.name }}</small>
		</div>
		<div>
			<label for="length" class="block mb1">Track Length</label>
			<input-number
				v-model="data.length"
				class="w-full "
				suffix=" km"
				mode="decimal"
				:step="0.001"
				:min-fraction-digits="3"
				:max-fraction-digits="3"
				:class="invalidFields.length && 'p-invalid'"
			/>
			<small v-if="invalidFields.length" class="text-red-600 text-capitalize">{{ invalidFields.length }}</small>
		</div>
		<div>
			<label for="country" class="block mb-1">Country</label>
			<auto-complete
				v-model="data.country"
				:class="invalidFields.country && 'p-invalid'"
				class="w-full"
				:suggestions="filteredCountries"
				:dropdown="true"
				@complete="searchCountry($event)"
			/>
			<small v-if="invalidFields.country" class="text-red-600 text-capitalize">{{ invalidFields.country }}</small>
		</div>
		<div>
			<label for="timezone" class="block mb-1">Timezone</label>
			<auto-complete
				v-model="data.timezone"
				:class="invalidFields.timezone && 'p-invalid'"
				class="w-full"
				:suggestions="filteredTimezones"
				:dropdown="true"
				@complete="searchZone($event)"
			/>
			<small v-if="invalidFields.timezone" class="text-red-600 text-capitalize">{{ invalidFields.timezone }}</small>
		</div>
	</form>
</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import AutoComplete from 'primevue/autocomplete';
import cl from 'country-list';

export default {
	components: { InputText, InputNumber, AutoComplete },
	layout: 'admin',
	middleware: 'auth',
	async asyncData({ $axios, store, params }) {
		let timezones = await $axios.$get('/api/resources/timezones');
		timezones = timezones.map(zone => zone.name);
		if (typeof parseInt(params.id) === 'number')
			try {
				const res = await $axios.$get('/api/track/' + params.id);
				return {
					type: 'edit',
					data: res,
					timezones
				};
			} catch (err) {
				return {
					type: 'new',
					data: {
						name: '',
						length: 0,
						country: ''
					},
					timezones
				};
			} else
			return {
				type: 'new',
				data: {
					name: '',
					length: 0,
					country: ''
				},
				timezones
			};
	},
	data() {
		return {
			type: 'new',
			data: {
				name: '',
				length: 0,
				country: '',
				timezone: ''
			},
			timezones: [],
			countries: cl.getNames(),
			filteredCountries: [],
			filteredTimezones: [],
			invalidFields: {},
			loading: false
		};
	},
	methods: {
		searchCountry(event) {
			this.filteredCountries = event.query.trim().length ? this.countries.filter(country => country.includes(event.query)) : this.countries;
		},
		searchZone(event) {
			this.filteredTimezones = event.query.trim().length ? this.timezones.filter(zone => zone.includes(event.query)) : this.timezones;
		},
		validateItem() {
			let valid = true;
			const requiredFields = [
				'name',
				'length',
				'country',
				'timezone'
			];

			for (const field of requiredFields)
				if (!this.data[field]) {
					valid = false;
					this.invalidFields[field] = `${field} is required`;
				}

			return valid;
		},
		async saveItem() {
			this.loading = true;
			const valid = this.validateItem();
			if (!valid) {
				this.loading = false;
				return;
			}
			try {
				if (this.data.id)
					await this.$axios.put(`/api/track/${this.data.id}`, this.data);
				else
					await this.$axios.post('/api/track', this.data);

				this.$router.push('/admin/tracks');
			} catch (err) {
				console.log(err);
				this.$toast.add({ severity: 'error', summary: 'Oh no!', detail: 'Something went wrong while creating/updating a vehicle category.', life: 5000 });
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
