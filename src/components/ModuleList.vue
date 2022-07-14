<script lang="ts">
import { defineComponent } from "vue";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";
import type {
	CourseEvent,
	CourseSection,
	CourseSections,
} from "@/interface.js";
import {
	getCourseItemKey,
	convertCourseItemToCourseItemOption,
} from "@/interface";
import type { PropType } from "vue";

export default defineComponent({
	props: {
		basket: {
			type: Object as PropType<CourseSections>,
			required: true,
		},
		videoList: Map<string, any>,
		sessionList: [] as any[],
		basicsList: Array<string>,
	},
	emits: ["scheduleUpdate"],
	methods: {
		addToBasket(event: Event) {
			// We don't actually add to our own basket, instead notify the
			// parent and they'll track it.
			if (event.target) {
				const target = event.target as HTMLElement;
				const targetId = (
					target.parentElement as HTMLElement
				).id;

				this.$emit("scheduleUpdate", {
					id: targetId,
					section: targetId.split(":")[0],
					title: target.innerText,
				});
			}
		},
		getVideosForTag(tag: string) {
			// return Object.keys(this.videoList[tag]);
			// You're really telling me THIS is better???
			if (!this.videoList) return [];
			return Object.keys(
				this.videoList[
					tag as keyof typeof this.videoList
				]
			);
		},
		shouldBeActive(key: string) {
			let output = "";
			// Check if the key is in one of the training sections
			Object.keys(this.basket).forEach((section) => {
				this.basket[section].trainings.forEach(
					(training) => {
						if (
							getCourseItemKey(
								training
							) === key
						) {
							output = "active";
						}
					}
				);
			});
			return output;
		},
		unKebab(value: string) {
			return value
				.split("-")
				.map(
					(x) =>
						x.charAt(0).toUpperCase() +
						x.slice(1)
				)
				.join(" ");
		},
	},
});
</script>

<template>
	<div class="module-list">
		<b>Basics</b>
		<ul class="list-group a">
			<a
				v-for="key in basicsList"
				@click="addToBasket"
				:id="'basics:' + key"
			>
				<li
					:class="
						'list-group-item ' +
						shouldBeActive(`basics:${key}`)
					"
				>
					{{ unKebab(key) }}
				</li>
			</a>
		</ul>
		<b>Sessions</b>
		<ul class="list-group a">
			<a
				v-for="sessionKey in Object.keys(sessionList)"
				@click="addToBasket"
				:id="'session:' + sessionKey"
			>
				<li
					:class="
						'list-group-item ' +
						shouldBeActive(
							`session:${sessionKey}`
						)
					"
				>
					{{
						(sessionList as any)[sessionKey]
							.title
					}}
				</li>
			</a>
		</ul>
		<b>Individual Videos</b>
		<div v-for="tag in Object.keys(videoList as any)" :key="tag">
			<b>{{ tag.toUpperCase() }}</b>
			<ul class="list-group a">
				<a
					:key="videoKey"
					:id="'video:' + videoKey"
					v-for="videoKey in Object.keys((videoList as any)[tag].videos)"
					@click="addToBasket"
				>
					<li
						class="list-group-item"
						:class="
							'list-group-item ' +
							shouldBeActive(
								`video:${videoKey}`
							)
						"
					>
						{{
							(videoList as any)[tag]
								.videos[
								videoKey
							].title
						}}

						<span
							class="uncaptioned"
							v-if="!(videoList as any)[tag].videos[videoKey].captioned"
							title="This video lacks captions, it is not appropriate for users with a hearing impairment. Captions are welcome if you have time, just ask WG-GOAT!"
							>🧏‍♀️</span
						>
					</li>
				</a>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.module-list {
	max-height: 700px;
	overflow-y: scroll;
}

.uncaptioned {
	cursor: help;
}
</style>
