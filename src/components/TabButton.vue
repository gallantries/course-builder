<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		text: { type: String, required: true },
		active: { type: Boolean, required: false },
	},
	data() {
		const id_safe = this.text
			.toLowerCase()
			.replace(/ /, "-")
			.replace(/[^\w-]/, "");
		return {
			id_safe: id_safe,
			tab_id: id_safe + "-tab",
			tab_target: `#${id_safe}`,
		};
	},
});
</script>

<template>
	<button
		:class="'nav-link' + (active ? ' active' : '')"
		:id="tab_id"
		data-bs-toggle="tab"
		:data-bs-target="tab_target"
		type="button"
		role="tab"
		:aria-controls="id_safe"
		aria-selected="true"
	>
		{{ text }}
	</button>
</template>

<style scoped></style>
