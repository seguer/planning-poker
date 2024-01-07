import EventEmitter from 'eventemitter3'
import randomatic from 'randomatic'
import { Peer } from 'peerjs'

export class Engine extends EventEmitter {
	private id: string = ''
	private peer: Peer|null = null
	private connections = {}
	private connected = false

	constructor(id: string) {
		super()
		this.id = id
	}

	static public generateId(): string {
		return randomatic('A', 10, { exclude: 'ILOVW' })
	}

	async public host(): Promise {
		return new Promise((resolve, reject) => {
			this.peer = new Peer(this.id)

			this.peer.on('open', () => {
				this.connected = true
				resolve()
			})
			this.peer.on('close', () => {
				this.connected = false
			})
			this.peer.on('error', (e) => {
				this.connected = false
				this.peer = null
				reject(e)
			})
			this.peer.on('connection', (c) => {
				this.connections[c.peer] = c
				this.setupConnection(c)
			})
		})
	}

	async public join() {
		return new Promise((resolve, reject) => {
			this.peer = new Peer()
			this.peer.on('open', () => {
				const c = this.peer.connect(this.id)
				this.connections[c.peer] = c

				c.on('open', () => {
					this.connected = true
					this.setupConnection(c)
					resolve()
				})
				c.on('close', () => {
					this.emit('connection-closed')
					this.connected = false
					this.peer = null
				})
				c.on('error', (e) => {
					console.error(e)
				})
			})
			this.peer.on('error', (e) => {
				this.connected = false
				this.peer = null
				reject(e)
			})
		})
	}

	public isConnected(): boolean {
		return this.connected
	}

	public peerId(): string|undefined {
		return this?.peer?.id
	}

	public broadcast(type: string, data = {}, whitelist = [], blacklist = []) {
		const message = {
			type,
			data,
		}

		for (const id in this.connections) {
			if (this.connections[id].peer !== this.peerId() &&
				(whitelist.length === 0 || whitelist.includes(this.connections[id].peer)) &&
				blacklist.includes(this.connections[id].peer) === false
			) {
				this.connections[id].send(message)
			}
		}
	}

	public message(id: string, type: string, data = {}) {
		return this.broadcast(type, data, [id])
	}

	public messageHost(type: string, data = {}) {
		return this.broadcast(type, data, [this.id])
	}

	private setupConnection(connection) {
		connection.on('data', (data) => { this.receiveData(connection, data) })
		connection.on('close', () => { this.receiveClose(connection) })

		if (connection.peer !== this.peerId()) {
			connection.on('open', () => {
				this.emit('connection-joined', connection.peer)
			})
		}
	}

	private receiveData(connection, data) {
		this.emit('message', connection.peer, data)
	}

	private receiveClose(connection) {
		delete this.connections[connection.peer]
		this.emit('disconnection', connection.peer)
	}
}
