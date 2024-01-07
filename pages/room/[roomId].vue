<template>
	<v-container fluid>
		<v-row v-if="data.loading === false && data.disconnected === false">
			<v-col>
				<voting v-if="data.player.config.role === 'voting'" :player="data.player" :votes="data.game.votes[data.game.playerId]" />
				<observing v-if="data.player.config.role === 'observing'" :player="data.player" />

				<other-player v-for="otherPlayer in data.game.players" :player="data.player" :other-player="otherPlayer" :votes="data.game.votes[otherPlayer.id]" :show-votes="data.game.showVotes" class="mt-4" />
			</v-col>
			<v-col cols="2">
				<v-card v-if="data.host" class="mb-4">
					<v-card-title>Controls</v-card-title>
					<v-card-text>
						<v-btn-toggle v-model="data.game.showVotes" block divided mandatory variant="outlined">
							<v-btn :value="true">Show Votes</v-btn>
							<v-btn :value="false">Hide Votes</v-btn>
						</v-btn-toggle>
					</v-card-text>
				</v-card>

				<v-card>
					<v-card-title>Config</v-card-title>
					<v-card-text>
						<v-btn-toggle v-model="data.player.config.role" block divided mandatory variant="outlined">
							<v-btn value="voting">Voting</v-btn>
							<v-btn value="observing">Observing</v-btn>
						</v-btn-toggle>
						<v-switch v-model="data.player.config.showDebug" label="Show debug" hide-details></v-switch>
					</v-card-text>
				</v-card>

				<v-card v-if="data.player.config.showDebug" class="mt-4">
					<v-card-title>Debug</v-card-title>

					<v-card-text>
						<p>Game</p>
						<pre>{{ data.game }}</pre>

						<p class="mt-4">Dialogs</p>
						<pre>{{ data.dialogs }}</pre>

						<p class="mt-4">Player</p>
						<pre>{{ data.player }}</pre>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<loading v-model="data.loading" />
		<disconnected v-model="data.disconnected" />
		<player-info v-model="data.dialogs.playerInfo" @updated="playerInfoUpdated" />
	</v-container>
</template>

<script setup lang="ts">
import { PlanningPoker as Controller } from '~/controllers/PlanningPoker'

const { roomId } = useRoute().params

definePageMeta({
	layout: 'app',
})

useHead({
	title: `Room ${roomId}`,
})

const c = new Controller(roomId)

// Data
const data = c.data

// Methods
const playerInfoUpdated = c.playerInfoUpdated.bind(c)
</script>
