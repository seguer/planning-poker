export class Storage {
	private namespace: string = ''

	constructor(namespace: string) {
		this.namespace = namespace
	}

	public setItem(key: string, value): void {
		const namespacedKey = `${this.namespace}-${key}`
		const encodedValue = JSON.stringify(value)

		localStorage.setItem(namespacedKey, encodedValue)
	}

	public getItem(key: string) {
		const namespacedKey = `${this.namespace}-${key}`
		const value = localStorage.getItem(namespacedKey)

		if (value === null) {
			return value // null
		}

		return JSON.parse(value) // decoded value
	}

	public deleteItem(key: string): void {
		const namespacedKey = `${this.namespace}-${key}`

		localStorage.removeItem(namespacedKey)
	}
}
