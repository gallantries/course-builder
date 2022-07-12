<script lang="ts">
import { defineComponent } from "vue";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";

export default defineComponent({
	data() {
		return {
			videoList: Map<any, any>,
			sessionList: [] as any[],
			basicsList: ["setup", "setup-gat", "code-of-conduct", "certificates", "logistics", "feedback"],
			loading: false,
		};
	},
	props: {
		basket: { type: Array<string>, required: true },
	},
	emits: ["scheduleUpdate"],
	methods: {
		fetchData() {
			this.loading = true;
			// Load videos
			VideoLibraryDataService.getVideosByTags().then((res) => {
				this.videoList = res.data;
				// And sessions
				VideoLibraryDataService.getSessions().then((res) => {
					this.sessionList = res.data;
					this.loading = false;
				});
			});
		},
		addToBasket(event: Event) {
			if (event.target) {
				const target = event.target as HTMLElement;
				const targetId = (target.parentElement as HTMLElement).id;

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
			return Object.keys(this.videoList[tag as keyof typeof this.videoList]);
		},
		shouldBeActive(key: string) {
			if (this.basket.filter((x) => (x as any).id === key).length > 0) {
				console.log(key);
			}
			return this.basket.filter((x) => (x as any).id === key).length > 0 ? "active" : "";
		},
		unKebab(value: string) {
			return value
				.split("-")
				.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
				.join(" ");
		},
	},
	mounted() {
		this.fetchData();
	},
});
</script>

<template>
	<div class="module-list">
		<b>Basics</b>
		<ul class="list-group a">
			<a v-for="key in basicsList" @click="addToBasket" :id="'basics:' + key">
				<li :class="'list-group-item ' + shouldBeActive(`basics:${key}`)">
					{{ unKebab(key) }}
				</li>
			</a>
		</ul>
		<b>Sessions</b>
		<ul class="list-group a">
			<a v-for="sessionKey in Object.keys(sessionList)" @click="addToBasket" :id="'session:' + sessionKey">
				<li :class="'list-group-item ' + shouldBeActive(`session:${sessionKey}`)">
					{{ (sessionList as any)[sessionKey].title }}
				</li>
			</a>
		</ul>
		<b>Individual Videos</b>
		<div v-for="tag in Object.keys(videoList)" :key="tag">
			<b>{{ tag.toUpperCase() }}</b>
			<ul class="list-group a">
				<a
					:key="videoKey"
					:id="'video:' + videoKey"
					v-for="videoKey in Object.keys((videoList as any)[tag].videos)"
					@click="addToBasket"
				>
					<li class="list-group-item" :class="'list-group-item ' + shouldBeActive(`video:${videoKey}`)">
						{{ (videoList as any)[tag].videos[videoKey].title }}

						<span
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
</style>
