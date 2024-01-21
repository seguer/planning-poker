<template>
	<v-app>
		<v-app-bar density="compact">
			<v-app-bar-title>Planning Poker</v-app-bar-title>

			<template v-slot:append>
				<v-switch v-model="darkMode" label="Dark" hide-details></v-switch>
			</template>
		</v-app-bar>

		<v-main>
			<slot />
		</v-main>
	</v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
import { useTheme } from 'vuetify'

const userStore = useUserStore()
const theme = useTheme()

useHead({
	titleTemplate: (title) => {
		return title ? `${title} - Planning Poker` : 'Planning Poker';
	}
})

theme.global.name.value = userStore.dark ? 'dark' : 'light'

const darkMode = computed({
	get: () => userStore.dark,
	set: (dark) => {
		userStore.setDark(dark)
		theme.global.name.value = dark ? 'dark' : 'light'
	}
})
</script>
