<template>
	<v-dialog persistent no-click-animation :close-on-back="false" width="auto">
		<v-card>
			<v-card-text class="text-center">
				<p>Loading room</p>
				<v-progress-circular indeterminate class="mt-4" />
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
