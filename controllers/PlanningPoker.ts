import { PlanningPoker as Game } from '~/services/PlanningPoker'
import { useGameStore } from '~/store/game'
import { useUserStore } from '~/store/user'

export class PlanningPoker {
	private userStore = null
	private gameStore = null
	private roomId = ''
	private game = null

	public data = reactive({
		dialogs: {
			playerInfo: false,
		},
		player: {
			name: '',
			id: '',
			config: {
				role: 'voting',
				showDebug: false,
			},
		},
		host: false,
		game: null,
		loading: true,
		disconnected: false,
	})

	constructor(roomId: string) {
		this.roomId = roomId
		this.game = new Game(this.roomId)
		this.gameStore = useGameStore()
		this.userStore = useUserStore()

		this.data.host = computed(() => this.gameStore.host)
		this.data.game = this.gameStore
		this.data.player.name = computed(() => this.userStore.name)
		this.data.player.id = computed(() => this.userStore.id)
		this.data.player.config.role = computed({
			get: () => this.userStore.config.role,
			set: (role) => {
				this.userStore.setRole(role)
			},
		})
		this.data.player.config.showDebug = computed({
			get: () => this.userStore.config.showDebug,
			set: (debug) => {
				this.userStore.setDebug(debug)
			},
		})

		onMounted(this.mounted.bind(this))
	}

	private mounted() {
		this.start()
	}

	async private start() {
		if (this.data.player.name === '') {
			this.data.dialogs.playerInfo = true
			return
		}

		try {
			await this.game.joinRoom()

			this.game.once('receive-state', () => {
				nextTick(() => {
					this.data.loading = false
				})
			})

			this.game.on('room-closed', () => {
				nextTick(() => {
					this.data.disconnected = true
				})
			})
		} catch (e) {
			// "peer-unavailable"?
			await this.game.createRoom()
			this.gameStore.setHost(true)
			this.game.reset()
			this.data.loading = false

			watch(() => this.gameStore.showVotes, (newShowVotes) => {
				this.game.queueSync()
			})
		}

		watch(() => this.gameStore.votes[this.gameStore.playerId], (newVotes, oldVal) => {
			this.game.sendVotes(newVotes)
		}, { deep: true })

		watch(this.userStore.config, () => {
			this.game.sendInfo()
		}, { deep: true })
	}

	public playerInfoUpdated() {
		this.data.dialogs.playerInfo = false
		this.start()
	}
}
