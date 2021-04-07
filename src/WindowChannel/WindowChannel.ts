import { isObject } from "./utils";

export interface WindowChannelEvent<Data = any> {
    contentType: string
    namespace: string
    type: string
    data: WindowChannelEventData<Data>
}

export interface WindowChannelEventData<Data = any> {
    source?: MessageEventSource | null
    data: Data
}

export type WindowChannelEventHandler<Data = any> = (data: WindowChannelEventData<Data>) => void

export const contentType = 'application/window-channel-v1'

export interface WindowChannelConfig {
    origin: string
    namespace?: string
}

export class WindowChannel {
    private events: Record<string, WindowChannelEventHandler[]> = {}

    get namespace() {
        return this.config.namespace || 'default'
    }

    constructor(
        private target: Window,
        private config: WindowChannelConfig,
    ) {
        this.listenToMessages();
    }

    on<Data = any>(event: string, listener: WindowChannelEventHandler<Data>) {
        if (!this.events[event]) {
            this.events[event] = []
        }

        this.events[event].push(listener)
    }

    off<Data = any>(event: string, listener: WindowChannelEventHandler<Data>) {
        if (!this.events[event]) {
            return
        }

        const idx = this.events[event].indexOf(listener)

        if (idx > -1) {
            this.events[event].splice(idx, 1)
        }
    }

    emit<Data = any>(event: string, data?: Data) {
        const message: WindowChannelEvent = {
            data: {
                data,
            },
            contentType,
            type: event,
            namespace: this.namespace || 'default',
        }
        this.target.postMessage(message, this.config.origin);
    }

    private listenToMessages() {
        window.addEventListener('message', this.processMessage.bind(this), false)
    }

    private isAllowed(ev: MessageEvent<WindowChannelEvent>) {
        if (this.config.origin === '*') {
            return true;
        }

        if (this.config.origin !== ev.origin) {
            return false;
        }

        if (!isObject(ev.data)) {
            return false;
        }

        const { namespace, contentType: evContentType } = ev.data
        
        if (this.namespace !== namespace) {
            return false;
        }

        if (contentType !== evContentType) {
            return false;
        }

        return true;
    }

    private processMessage(ev: MessageEvent<WindowChannelEvent>) {

        if (!this.isAllowed(ev)) {
            return
        }

        const { type, data } = ev.data

        if (type in this.events) {
            this.events[type].forEach(listener => {
                listener.bind(this)({...data, source: ev.source})
            })
        }

    }

    dispose() {
        window.removeEventListener('message', this.processMessage, false)
        this.events = {}
    }
}