import EventEmitter from 'eventemitter3'
import lodash from 'lodash'
import { Engine } from '~/services/Engine'
import { useGameStore } from '~/store/game'
import { useUserStore } from '~/store/user'

const TEMPLATE_ROUND_1 = {
	e: null,
	c: null,
	u: null,
}

const TEMPLATE_ROUND_2 = {
	sp: null,
}

export class PlanningPoker extends EventEmitter {
	private engine: Engine
	private id: string
	private host = false
	private gameStore
	private userStore

	// Closure which throttles the sync method
	public queueSync

	constructor(id: string) {
		super()
		this.id = id
		this.engine = new Engine('PLANNING-POKER-' + id)
		this.gameStore = useGameStore()
		this.userStore = useUserStore()

		this.queueSync = lodash.throttle(
			this.sync.bind(this),
			100,
			{ leading: false, trailing: true }
		)

		/**
		 * What do we need to create a new game, and the Engine?
		 *
		 * Engine:
		 * - id (session code)
		 * - host info?
		 *
		 * PlanningPoker:
		 * - player info (host, voter, role?)
		 * - rounds/voting configuration, not at construction? start with default?
		 *
		 */
	}

	static public generateRoomId(): string {
		return Engine.generateId()
	}

	async public createRoom() {
		await this.engine.host()
		this.host = true
		this.gameStore.playerId = this.engine.peerId()
		this.userStore.id = this.engine.peerId()
		this.gameStore.addPlayer(this.gameStore.playerId)

		this.engine.on('connection-joined', this.onPlayerJoined.bind(this))
		this.engine.on('disconnection', this.onPlayerLeave.bind(this))
		this.engine.on('message', this.onMessage.bind(this))
	}

	async public joinRoom() {
		await this.engine.join()
		this.gameStore.playerId = this.engine.peerId()
		this.userStore.id = this.engine.peerId()
		this.engine.on('message', this.onMessage.bind(this))
		this.engine.on('connection-closed', this.onConnectionClosed.bind(this))
		this.sendInfo()
	}

	public reset() {
		this.gameStore.setCurrentRound(1)
		this.clearVotes()
	}

	public startRound(round: Number): object {
	}

	public clearRoundVotes() {
		this.gameStore.playerIds.forEach(playerId => {
			if (this.gameStore.currentRound === 1) {
				this.gameStore.setRoundVotes(playerId, 1, lodash.cloneDeep(TEMPLATE_ROUND_1))
			}

			if (this.gameStore.currentRound === 2) {
				this.gameStore.setRoundVotes(playerId, 2, lodash.cloneDeep(TEMPLATE_ROUND_2))
			}
		})

		this.sync()
	}

	public clearVotes() {
		this.gameStore.playerIds.forEach(playerId => {
			this.clearVotesForPlayer(playerId)
		})

		this.sync([], [], true)
	}

	public clearVotesForPlayer(playerId) {
		this.gameStore.setRoundVotes(playerId, 1, lodash.cloneDeep(TEMPLATE_ROUND_1))
		this.gameStore.setRoundVotes(playerId, 2, lodash.cloneDeep(TEMPLATE_ROUND_2))
	}

	public sync(whitelist = [], blacklist = [], forced = false) {
		// Sends out game updates, if used directly will not be throttled
		// cancel any syncs that are queued
		this.queueSync.cancel()

		blacklist.push(this.engine.peerId())

		const players = lodash.cloneDeep(this.gameStore.players)
		players[this.engine.peerId()] = {
			name: this.userStore.name,
			id: this.userStore.id,
			config: {
				role: this.userStore.config.role,
			},
		}

		const state = {
			showVotes: this.gameStore.showVotes,
			votes: this.gameStore.votes,
			players: players,
			playerIds: this.gameStore.playerIds,
			forced: forced,
		}

		this.engine.broadcast('state', state, whitelist, blacklist)
	}

	private onPlayerJoined(playerId) {
		this.gameStore.addPlayer(playerId)
		this.clearVotesForPlayer(playerId)
		this.queueSync([], [], true)
	}

	private onPlayerLeave(playerId) {
		this.gameStore.removePlayer(playerId)
		this.queueSync()
	}

	private onMessage(playerId:string, data: object) {
		switch (data.type) {
			case 'player-info':
				this.receiveInfo(playerId, data.data)
				break
			case 'state':
				this.receiveState(playerId, data.data)
				break
			case 'player-votes':
				this.receiveVotes(playerId, data.data)
				break
		}
	}

	private onConnectionClosed() {
		this.emit('room-closed')
	}

	private sendInfo() {
		this.engine.messageHost('player-info', {
			name: this.userStore.name,
			id: this.userStore.id,
			config: {
				role: this.userStore.config.role,
			},
		})
	}

	private receiveInfo(playerId: string, data: object) {
		this.gameStore.updateInfo(playerId, data)
		this.queueSync([], [], true)
	}

	private receiveState(playerId: string, state: object) {
		console.log('receiveState', state)
		delete state.players[this.gameStore.playerId]

		if (state.forced === false) {
			delete state.votes[this.gameStore.playerId]
		}

		this.gameStore.setShowVotes(state.showVotes)
		this.gameStore.setVotes(state.votes)
		this.gameStore.setPlayers(state.players)
		this.gameStore.setPlayerIds(state.playerIds)

		this.emit('receive-state')
	}

	private sendVotes(votes: object) {
		if (this.host === true) {
			this.receiveVotes(this.engine.peerId(), votes)
		} else {
			this.engine.messageHost('player-votes', votes)
		}
	}

	private receiveVotes(playerId: string, votes: object) {
		this.gameStore.updateVotes(playerId, votes)
		this.queueSync([], [playerId])
	}
}
