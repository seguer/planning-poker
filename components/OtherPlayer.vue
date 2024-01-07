<template>
	<v-card>
		<v-row>
			<v-col :cols="otherPlayer.config.role === 'voting' ? 2 : 12">
				<v-card-title>{{ otherPlayer.name }}</v-card-title>
				<v-card-text v-if="otherPlayer.config.role === 'observing'"><em>Observing</em></v-card-text>

				<v-card-text v-if="player.config.showDebug">
					<pre>{{ votes }}</pre>
				</v-card-text>
			</v-col>
			<v-col v-if="otherPlayer.config.role === 'voting'">
				<v-card-text>
					<p>Effort: <vote-value :vote="votes[1].e" :show-votes="showVotes" /></p>
					<p class="mt-4">Complexity: <vote-value :vote="votes[1].c" :show-votes="showVotes" /></p>
					<p class="mt-4">Unknowns: <vote-value :vote="votes[1].u" :show-votes="showVotes" /></p>
				</v-card-text>
			</v-col>
			<v-col v-if="otherPlayer.config.role === 'voting'" cols="auto">
				<v-card theme="light" class="fill-height">&nbsp;</v-card>
			</v-col>
			<v-col v-if="otherPlayer.config.role === 'voting'">
				<v-card-text>
					<p>Story Points: <vote-value :vote="votes[2].sp" :show-votes="showVotes" /></p>
				</v-card-text>
			</v-col>
		</v-row>
	</v-card>
</template>

<script setup lang="ts">
const props = defineProps({
	player: {
		type: Object,
		required: true,
	},
	otherPlayer: {
		type: Object,
		required: true,
	},
	votes: {
		type: Object,
		required: false,
		default() {
			return {
				1: {
					e: null,
					c: null,
					u: null,
				},
				2: {
					sp: null,
				},
			}
		},
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
