<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";
import { stringifyStyle } from "@vue/shared";

export default defineComponent({
	props: {
		modelValue: Object as PropType<Array<string> | null>,
		text: { type: String, required: true },
		help: { type: String, required: false },
	},
	data() {
		return {
			loading: false,
			instructors: Map<string, string>,
			instructor_keys: [] as Array<string>,
		};
	},
	emits: ["update:modelValue"],
	computed: {
		id() {
			return this.text
				.toLowerCase()
				.replace(/\s/g, "-")
				.replace(/[^a-z0-9-]/g, "");
		},
	},
	methods: {
		fetchData() {
			this.loading = true;
			// Load videos
			VideoLibraryDataService.getInstructors().then((res) => {
				this.instructors = res.data;
				this.instructor_keys = Object.keys(res.data);
				this.instructor_keys.sort((a, b) => {
					return res.data[a].name.localeCompare(
						res.data[b].name
					);
				});
				this.loading = false;
			});
		},
		// We could use EventTarget but it claims it has no options type and
		// I can't be arsed.
		shareUpdates(event: any) {
			const selected = [...event.target.options]
				.filter((option) => option.selected)
				.map((option) => option.value);
			this.$emit("update:modelValue", selected);
		},
	},
	mounted() {
		this.fetchData();
	},
});
</script>

<template>
	<div>
		<label :for="'input-' + id" class="col-form-label">{{
			text
		}}</label>
		<select
			:id="'input-' + id"
			class="form-select"
			multiple
			:aria-describedby="'input-help-' + id"
			style="height: 8em"
			@change="shareUpdates($event)"
		>
			<option
				v-for="key in instructor_keys"
				:value="key"
				:key="key"
				:selected="modelValue!.indexOf(key) > -1"
			>
				{{ (instructors as any)[key].name }} (@{{
					key
				}})
			</option>
		</select>

		<span :id="'input-help-' + id" class="form-text">{{
			help
		}}</span>
	</div>
</template>
