<template>
	<v-dialog persistent :close-on-back="false" max-height="80%" max-width="80%" width="300px">
		<v-card>
			<v-card-title>Player details</v-card-title>
			<v-card-text class="text-center">
				<v-text-field v-model="player.name" label="Name*" autofocus required @keyup.enter="save" />
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn color="primary" @click="save">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/user'
const userStore = useUserStore()

const player = reactive({
	name: '',
})

const emit = defineEmits(['updated'])

function save() {
	if (userStore.setName(player.name) === false) {
		return
	}

	emit('updated')
}
</script>
