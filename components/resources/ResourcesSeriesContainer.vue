<template>
<div class="resources">
	<DataView
		:value="series"
		paginator-position="bottom"
		:paginator="true"
		:rows="10"
		:always-show-paginator="false"
	>
		<template #list="slotProps">
			<div class="w-screen flex justify-between py-2 items-center">
				<div class="resource-list-item">
					{{ slotProps.data.name }}
				</div>
			</div>
		</template>
	</DataView>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import { mapGetters } from 'vuex';

export default {
	components: {
		DataView
	},
	computed: {
		...mapGetters({
			series: 'resources/series/get'
		})
	}
};
</script>

<style scoped>

</style>
