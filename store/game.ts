export const useGameStore = defineStore('game', {
	state: () => ({
		host: false,
		playerId: null,
		currentRound: 1,
		showVotes: false,
		/**
		 * Map by player id (peer id)
		 *
		 * id: {
		 *   1: {
		 *     e: 3,
		 *     c: 3,
		 *     u: 3,
		 *   },
		 *   2: {
		 *     sp: 5,
		 *   },
		 * },
		 */
		votes: {},
		players: {},
		playerIds: [],
	}),
	getters: {
	},
	actions: {
		setHost(host: boolean): void {
			this.host = host
		},
		setCurrentRound(round: Number): void {
			this.currentRound = round
			this.votes = {}
		},
		setRoundVotes(id: string, round: Number, data: object): void {
			if (this.votes[id] === undefined) {
				this.votes[id] = {
					1: {},
					2: {},
				}
			}

			this.votes[id][round] = data
		},
		addPlayer(id: string): void {
			this.playerIds.push(id)
		},
		removePlayer(id: string): void {
			const index = this.playerIds.indexOf(id)

			if (index > -1) {
				this.playerIds.splice(index, 1)
				delete this.votes[id]
				delete this.players[id]
			}
		},
		updateInfo(id: string, data: object): void {
			this.players[id] = data
		},
		setShowVotes(showVotes: boolean): void {
			this.showVotes = showVotes
		},
		setVotes(data: object): void {
			for (const id in data) {
				this.votes[id] = data[id]
			}
		},
		updateVotes(id: string, data: object): void {
			this.votes[id] = data
		},
		setPlayers(data: object): void {
			this.players = data
		},
		setPlayerIds(data: object): void {
			this.playerIds = data
		},
	}
})
