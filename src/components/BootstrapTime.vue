<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		modelValue: String,
		title: { type: String, required: true },
		help: { type: String, required: false },
	},
	computed: {
		id() {
			return this.title.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/g, "");
		},
	},
	emits: ["update:modelValue"],
});
</script>

<template>
	<div>
		<label :for="'input-' + id" class="col-form-label">{{ title }}</label>
		<input
                  type="time"
			class="form-control"
			aria-describedby="'input-help-' + id"
			:id="'input-' + id"
			:value="modelValue"
			@change="$emit('update:modelValue', ($event.target! as HTMLInputElement).value)"
		/>
		<span :id="'input-help-' + id" class="form-text">{{ help }}</span>
	</div>
</template>

