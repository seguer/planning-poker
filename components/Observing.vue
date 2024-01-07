<template>
	<v-card variant="tonal">
		<v-row>
			<v-col cols="2">
				<v-card-title>{{ player.name }}</v-card-title>
				<v-card-text><em>Observing</em></v-card-text>
			</v-col>
			<v-col>
				<v-row no-gutters>
					<v-col>
						<v-card-title>Round 1</v-card-title>
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
})
</script>
