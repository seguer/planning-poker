<template>
	<v-app>
		<v-app-bar density="compact">
			<v-app-bar-title>Planning Poker</v-app-bar-title>
		</v-app-bar>

		<v-main>
			<slot />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
useHead({
	titleTemplate: (title) => {
		return title ? `${title} - Planning Poker` : 'Planning Poker';
	}
})
</script>
