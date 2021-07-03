<template>
<div class="py-4">
	<div class="flex justify-between items-baseline mb-4">
		<h3 v-if="type == 'edit'" class="text-lg mb-3">
			Edit "{{ series.name }}"
		</h3>
		<h3 v-else class="text-lg mb-3">
			Add a new series
		</h3>
		<button class="btn btn-primary py-2 px-4">
			Save
		</button>
	</div>
	<form method="post" class="grid grid-cols-2 gap-4 p-8 rounded-md bg-white shadow-md">
		<div>
			<label class="block mb-1" for="name">Name</label>
			<input-text v-model="series.name" class="w-full" />
		</div>
		<div>
			<label class="block mb-1" for="name">Short name</label>
			<input-text v-model="series.shortname" class="w-full" />
		</div>
		<div>
			<label class="block mb-1" for="name">Logo</label>
			<input-text v-model="series.logo" class="w-full" />
		</div>
		<div>
			<label class="block mb-1" for="name">Thumbnail</label>
			<input-text v-model="series.thumbnail" class="w-full" />
		</div>
		<div>
			<label class="block mb-1" for="name">Homepage</label>
			<input-text v-model="series.homepage" class="w-full" />
		</div>
		<div>
			<label class="block mb-1" for="name">Priority</label>
			<input-number v-model="series.priority" show-buttons button-layout="horizontal" class="w-full" />
		</div>
	</form>
</div>
</template>

<script>
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

export default {
	components: { InputText, InputNumber },
	layout: 'admin',
	async asyncData({ $axios, params }) {
		if (typeof params.id !== 'number')
			try {
				const res = await $axios.$get('/api/series/' + params.id);
				console.log(res);
				return {
					type: 'edit',
					series: res
				};
			} catch (err) {
				return {
					type: 'new'
				};
			} else
			return {
				type: 'new'
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
				priority: 0
			}
		};
	}
};
</script>

<style scoped lang="scss">

</style>
