import { WindowChannel, WindowChannelConfig, WindowChannelEventData } from "./WindowChannel";

export const CONNECTION_EVENT = 'connection'
export const DISCONNECTION_EVENT = 'disconnection'

export type ConnectionEvent = WindowChannelEventData<{ origin: string }>

export class MainWindowChannel extends WindowChannel {
    private connectionsMap: Record<string, MessageEventSource | null> = {}

    get connections() {
        return Object.keys(this.connectionsMap).length
    }

    constructor(child: Window, config: WindowChannelConfig) {
        super(child, config)
        this.on(CONNECTION_EVENT, this.onConnected)
        this.on(DISCONNECTION_EVENT, this.onDisconnected)
    }

    private isValidConnectionEvent(ev: ConnectionEvent) {
        if(!ev.data) {
            return false
        }

        if (!ev.data.origin) {
            return false
        }
        
        return true
    }
    
    private onConnected(ev: ConnectionEvent) {
        if (!this.isValidConnectionEvent(ev)) {
            return
        }

        if (!ev.source) {
            return false
        }


        this.connectionsMap[ev.data.origin] = ev.source
    }

    private onDisconnected(ev: ConnectionEvent) {
        if (!this.isValidConnectionEvent(ev)) {
            return
        }

        delete this.connectionsMap[ev.data.origin]
    }
}