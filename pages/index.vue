<template>
	<v-container>
		<v-card>
			<v-row>
				<v-col>
					<v-card-title>Create Room</v-card-title>

					<v-card-text>Description about creating a room</v-card-text>
				</v-col>
				<v-col align-self="center" cols="auto">
					<v-btn class="mr-4" theme="light" @click="create">Create</v-btn>
				</v-col>
			</v-row>
		</v-card>

		<v-card class="mt-8">
			<v-row>
				<v-col>
					<v-card-title>Join Room</v-card-title>

					<v-card-text>Description about joining a room</v-card-text>
				</v-col>
				<v-col align-self="center" cols="auto">
					<v-btn class="mr-4" theme="light" @click="join">Join</v-btn>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog v-model="dialogs.join" persistent :close-on-back="false" max-height="80%" max-width="80%" width="300px">
			<v-card>
				<v-card-text class="text-center">
					<v-card-title>Session code</v-card-title>
					<v-card-text class="text-center">
						<v-text-field v-model="sessionCode.code" label="Code*" autofocus required @keyup.enter="join" />
					</v-card-text>
				</v-card-text>
				<v-card-actions>
					<v-btn color="red" @click="dialogs.join = false">Cancel</v-btn>
					<v-spacer />
					<v-btn color="primary" @click="join">Join</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'app',
})
</script>

<script lang="ts">
import { PlanningPoker } from '~/services/PlanningPoker'

export default {
	components: {},
	data() {
		return {
			dialogs: {
				join: false,
			},
			join: {
				roomId: '',
			},
		}
	},
	computed: {},
	methods: {
		async create() {
			const id = PlanningPoker.generateRoomId()
			this.$router.push({ name: 'room-roomId', params: { roomId: id } })
		},
		async join() {
			if (this.join.roomId === null || this.join.roomId === '') {
				this.dialogs.join = true
			} else {
				this.dialogs.join = false
				this.$router.push({ name: 'room-roomId', params: { roomId: this.join.roomId } })
			}
		},
	},
}
</script>
