<template>
	<span>
		<span v-if="showVotes === true && vote !== null">{{ vote }}</span>
		<span v-if="showVotes === false && vote !== null">
			<v-icon icon="mdi-check" color="success" />
		</span>
		<span v-if="vote === null">
			<v-progress-circular :size="14" :width="1" indeterminate />
		</span>
	</span>
</template>

<script setup lang="ts">
const props = defineProps({
	vote: {
		required: true,
	},
	showVotes: {
		type: Boolean,
		required: false,
		default() {
			return false
		}
	},
})
</script>
