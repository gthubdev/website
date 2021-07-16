<template>
<div class="py-4">
	<div class="flex justify-between items-baseline mb-4">
		<h3 v-if="type == 'edit'" class="text-lg mb-3">
			Edit "{{ data.name }}"
		</h3>
		<h3 v-else class="text-lg mb-3">
			Add a new Vehicle Class
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
			<label for="category" class="block mb-1">Vehicle category</label>
			<dropdown v-model="data.category" :options="categories" option-label="name" class="w-full" placeholder="Select a category" />
			<small v-if="invalidFields.category">{{ invalidFields.category }}</small>
		</div>
	</form>
</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

export default {
	components: { InputText, Dropdown },
	layout: 'admin',
	middleware: 'auth',
	async asyncData({ $axios, params }) {
		const categories = await $axios.$get('/api/vehiclecategory');
		if (typeof parseInt(params.id) === 'number')
			try {
				const res = await $axios.$get('/api/vehicleclass/' + params.id);
				return {
					type: 'edit',
					data: {
						...res,
						category: res.VehicleClassCategory.id
					},
					categories
				};
			} catch (err) {
				return {
					type: 'new',
					data: {
						name: '',
						category: ''
					},
					categories
				};
			} else
			return {
				type: 'new',
				data: {
					name: '',
					category: ''
				},
				categories
			};
	},
	data() {
		return {
			type: 'new',
			data: {
				name: '',
				category: ''
			},
			categories: [],
			invalidFields: {},
			loading: false
		};
	},
	methods: {
		validateItem() {
			let valid = true;
			const requiredFields = [
				'name',
				'category'
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
				this.data.category = this.data.category.id;
				if (this.data.id)
					await this.$axios.put(`/api/vehicleclass/${this.data.id}`, this.data);
				else
					await this.$axios.post('/api/vehicleclass', this.data);

				this.$router.push('/admin/classes');
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
