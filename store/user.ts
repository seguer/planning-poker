import { Storage } from '~/services/Storage'

const storage = new Storage('user')

export const useUserStore = defineStore('user', {
	state: () => ({
		name: '',
		id: null,
		config: {
			role: 'voting',
			showDebug: false,
		},
	}),
	getters: {
	},
	actions: {
		load(): void {
			const user = storage.getItem('user')

			if (user !== null) {
				this.name = user.name
				this.config.role = user.config.role
				this.config.showDebug = user.config.showDebug
			}
		},
		save(): void {
			storage.setItem('user', {
				name: this.name,
				config: {
					role: this.config.role,
					showDebug: this.config.showDebug,
				},
			})
		},
		setName(name: string): boolean {
			if (name.trim().length === 0) {
				return false
			}

			this.name = name
			this.save()
			return true
		},
		setRole(role: string): boolean {
			if (role !== 'voting' && role !== 'observing') {
				return false
			}

			this.config.role = role
			this.save()
			return true
		},
		setDebug(debug: boolean): boolean {
			this.config.showDebug = debug
			this.save()
			return true
		},
	}
})
