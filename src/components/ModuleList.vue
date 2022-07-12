<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import VideoLibraryDataService from "@/services/VideoLibraryDataService";

export default defineComponent({
	data() {
		return {
			videoList: Map<any, any>,
			sessionList: [] as any[],
			loading: false,
		};
	},
	props: {
		basket: {type: Array<string>, required: true}
	},
	emits: ['scheduleUpdate'],
	methods: {
		fetchData() {
			this.loading = true;
			VideoLibraryDataService.getVideosByTags().then((res) => {
				this.videoList = res.data;
				VideoLibraryDataService.getSessions().then((res) => {
					this.sessionList = res.data;
					this.loading = false;
				});
			});
		},
		addToBasket(event: Event) {
			if (event.target) {
				let target = event.target as Element;
				// @ts-ignore:next-line
				let targetId = target.parentElement.id;

				this.$emit('scheduleUpdate', {
					name: targetId,
					title: event.target.innerText
				});
			}
		},
		getVideosForTag(tag: string) {
			// return Object.keys(this.videoList[tag]);
			// You're really telling me THIS is better???
			return Object.keys(this.videoList[tag as keyof typeof this.videoList]);
		},
		shouldBeActive(key: string){
			return this.basket.indexOf(key) > -1 ? 'active' : '';
		}
	},
	mounted() {
		this.fetchData();
	},
});
</script>

<template>
	<div class="module-list">
		<b>Sessions</b>
		<ul class="list-group a">
			<a v-for="sessionKey in Object.keys(sessionList)" @click="addToBasket" :id="'session:' + sessionKey">
				<li :class="'list-group-item ' + shouldBeActive(`session:${sessionKey}`)">
					{{ sessionList[sessionKey].title }}
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
					v-for="videoKey in Object.keys(videoList[tag].videos)"
					class="b"
					@click="addToBasket"
				>
					<li class="list-group-item">
						{{ videoList[tag].videos[videoKey].title }}

						<span
							v-if="!videoList[tag].videos[videoKey].captioned"
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
