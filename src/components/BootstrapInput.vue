<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
	props: {
		modelValue: Object as PropType<string | null>, // TODO: this feels wrong.
		title: { type: String, required: true },
		help: { type: String, required: false },
	},
	computed: {
		id() {
			return this.title
				.toLowerCase()
				.replace(/\s/g, "-")
				.replace(/[^a-z0-9-]/g, "");
		},
	},
	emits: ["update:modelValue"],
	watch: {
		title(newTitle) {
			console.log(newTitle);
		},
	},
});
</script>

<template>
	<div>
		<label :for="'input-' + id" class="col-form-label">{{
			title
		}}</label>
		<input
			class="form-control"
			aria-describedby="'input-help-' + id"
			:id="'input-' + id"
			:value="modelValue"
			@input="
				$emit(
					'update:modelValue',
					($event.target as HTMLInputElement)
						.value
				)
			"
		/>
		<span :id="'input-help-' + id" class="form-text">{{
			help
		}}</span>
	</div>
</template>
