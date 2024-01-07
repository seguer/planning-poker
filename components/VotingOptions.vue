<template>
	<v-radio-group v-model="model" inline hide-details>
		<v-radio label="N/A" value="N/A"></v-radio>
		<v-radio class="ml-4" label="1" value="1"></v-radio>
		<v-radio class="ml-4" label="2" value="2"></v-radio>
		<v-radio class="ml-4" label="3" value="3"></v-radio>
		<v-radio class="ml-4" label="5" value="5"></v-radio>
		<v-radio class="ml-4" label="8" value="8"></v-radio>
		<v-radio class="ml-4" label="13" value="13"></v-radio>
		<v-radio class="ml-4" label="?" value="?"></v-radio>
	</v-radio-group>
</template>

<script setup lang="ts">
const model = defineModel()
</script>
