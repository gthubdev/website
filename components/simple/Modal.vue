<template>
<transition>
	<div v-if="show" class="modal">
		<div class="modal-backdrop" @click="closeModal()">
			<div class="modal-dialog">
				<div class="modal-header">
					<slot name="header" />
					<button @click="closeModal()">
						<i class="pi pi-times" />
					</button>
				</div>
				<div class="modal-body">
					<slot name="body" />
				</div>
				<div class="modal-footer">
					<slot name="footer" />
				</div>
			</div>
		</div>
	</div>
</transition>
</template>

<script>
export default {
	name: 'Modal',
	data() {
		return {
			show: false
		};
	},
	methods: {
		openModal() {
			this.show = true;
		},
		closeModal() {
			this.show = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.modal {
	overflow-x: hidden;
	overflow-y: auto;
	position: fixed;
	inset: 0;
	z-index: 9;

	&-backdrop {
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		inset: 0;
		z-index: 1;
	}

	&-dialog {
		background: #fff;
		position: relative;
		width: 600px;
		margin: 50px auto;
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		z-index: 2;
		@media screen and (max-width: 992px) {
			width: 90%;
		}
	}

	&-header {
		padding: 20px 20px 10px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	&-body {
		padding: 10px 20px 10px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	&-footer {
		padding: 10px 20px 20px
	}
}

.fade-enter-active, .fade-leave-active {
	transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to {
	opacity : 0;
}
</style>
