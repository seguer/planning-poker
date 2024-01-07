<template>
	<v-card variant="tonal">
		<v-row>
			<v-col cols="2">
				<v-card-title>{{ player.name }}</v-card-title>

				<v-card-text v-if="player.config.showDebug">
					<pre>{{ votes }}</pre>
				</v-card-text>
			</v-col>
			<v-col>
				<v-row no-gutters>
					<v-col>
						<v-card-title>Round 1</v-card-title>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col>
						<v-card-text>
							<p><strong>Effort</strong> <em class="text-caption">How much overall work is there to do? Are we modifying a line, a method, a class?</em></p>
							<voting-options v-model="votes[1].e" />

							<p class="mt-2"><strong>Complexity</strong> <em class="text-caption">How complicated are the changes? Are we implementing understood algorithms? Are we integrating a brand new library?</em></p>
							<voting-options v-model="votes[1].c" />

							<p class="mt-2"><strong>Unknowns</strong> <em class="text-caption">What do we not know? Are we concerned about unknown unknowns? Do we have an implementation plan?</em></p>
							<voting-options v-model="votes[1].u" />
						</v-card-text>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="auto">
				<v-card theme="light" class="fill-height">&nbsp;</v-card>
			</v-col>
			<v-col>
				<v-row no-gutters>
					<v-col>
						<v-card-title>Round 2</v-card-title>
					</v-col>
				</v-row>
				<v-row no-gutters>
					<v-col>
						<v-card-text>
							<p class="text-caption">Story Points</p>
							<voting-options v-model="votes[2].sp" />
						</v-card-text>
					</v-col>
				</v-row>
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
	votes: {
		type: Object,
		required: false,
	},
})
</script>
