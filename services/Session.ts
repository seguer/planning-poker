import { Peer } from 'peerjs'
import EventEmitter from 'eventemitter3'

export class Session extends EventEmitter {
	static PREFIX = 'SDK-RPG-'

	private id: string = ''
	private isHost: boolean = false
	private peer: Peer|null = null
	private connections = {}
	private connected = false

	constructor(id: string) {
		super()
		this.id = id
	}

	async public host(): Promise {
		return new Promise((resolve, reject) => {
			this.isHost = true
			this.peer = new Peer(Session.PREFIX + this.id)
			this.peer.on('open', () => {
				this.connected = true
				resolve()
			})
			this.peer.on('close', () => {
				this.connected = false
			})
			this.peer.on('error', (e) => {
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
			this.isHost = false
			this.peer = new Peer()
			this.peer.on('open', () => {
				const c = this.peer.connect(Session.PREFIX + this.id)
				this.connections[c.peer] = c
				this.setupConnection(c)

				c.on('open', () => {
					this.connected = true
					resolve()
				})
				c.on('close', () => {
					this.connected = false
				})
				c.on('error', (e) => {
					reject(e)
				})
			})
			this.peer.on('error', (e) => {
				reject(e)
			})
		})
	}

	public isHost(): boolean {
		return this.isHost
	}

	public isConnected(): boolean {
		return this.connected
	}

	public peerId(): string|undefined {
		return this?.peer?.id
	}

	public broadcast(type, data) {
		console.log('broadcast', type, data)
		const message = {
			type,
			data,
		}

		for (const id in this.connections) {
			if (this.connections[id].peer !== this.peerId) {
				this.connections[id].send(message)
			}
		}
	}

	private setupConnection(connection) {
		connection.on('data', (data) => { this.receiveData(connection, data) })
		connection.on('close', () => { this.receiveClose(connection) })
	}

	private receiveData(connection, data) {
		this.emit('data', data)
	}

	private receiveClose(connection) {
		delete this.connections[connection.peer]
		this.emit('disconnection', connection.peer)
	}
}
