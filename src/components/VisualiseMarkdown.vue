<script lang="ts">
import { defineComponent } from "vue";
import type { CourseEvent } from "../interface.js";
import { dump } from "js-yaml";

export default defineComponent({
  props: {
    event: { type: Object, required: true },
  },
  data() {
    return {
      yaml_metadata: dump(this.event),
    };
  },
});
</script>

<template>
  <pre>
---
{{ yaml_metadata }}
---

Your event data goes here
        </pre
  >
</template>

<style scoped></style>
