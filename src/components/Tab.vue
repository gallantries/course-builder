<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		id: { type: String, required: true },
		active: Boolean,
	},
	data() {
		let c = "tab-pane fade show";
		if (this.active) {
			c += " active";
		}
		return {
			class: c,
			ariaLabel: this.id + "-tab",
		};
	},
});
</script>

<template>
	<div
		:class="class"
		:id="id"
		role="tabpanel"
		:aria-labelledby="ariaLabel"
	>
		<slot />
	</div>
</template>

<style scoped></style>
