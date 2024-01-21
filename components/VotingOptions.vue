<template>
	<v-radio-group v-model="model" inline hide-details>
		<v-row no-gutters>
			<v-col>
				<v-radio label="N/A" value="N/A"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="1" value="1"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="2" value="2"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="3" value="3"></v-radio>
			</v-col>
		</v-row>
		<v-row no-gutters>
			<v-col>
				<v-radio label="5" value="5"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="8" value="8"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="13" value="13"></v-radio>
			</v-col>
			<v-col>
				<v-radio label="?" value="?"></v-radio>
			</v-col>
		</v-row>
	</v-radio-group>
</template>

<script setup lang="ts">
const model = defineModel()
</script>
