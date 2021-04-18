<template>
<div class="resources">
	<DataView
		:value="tracks"
		paginator-position="bottom"
		:paginator="true"
		:rows="5"
		:always-show-paginator="false"
	>
		<template #list="slotProps">
			<div class="p-col-12">
				<div class="resource-list-item">
					{{ getCountryFlag(slotProps.data.country) }}
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
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	components: {
		DataView
	},
	computed: {
		...mapGetters({
			tracks: 'resources/tracks/get'
		})
	},
	methods: {
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		}
	}
};
</script>

<style scoped>

</style>
