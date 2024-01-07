<template>
	<NuxtLayout>
		<Head>
			<Title>{{ title }}</Title>
		</Head>

		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
userStore.load()
</script>
