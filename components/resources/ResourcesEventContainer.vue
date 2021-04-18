<template>
<div class="resources">
	<DataView
		:value="events"
		paginator-position="bottom"
		:paginator="true"
		:rows="5"
		:always-show-paginator="false"
	>
		<template #list="slotProps">
			<div class="p-col-12">
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
			events: 'resources/events/get'
		})
	}
};
</script>

<style scoped>

</style>
