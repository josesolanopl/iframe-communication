interface IFrameSocketEvent {
    type: string
    data: any
}

type IFrameSocketEventHandler = (data: any) => void

export class IFrameSocket {
    private events: Record<string, IFrameSocketEventHandler[]> = {}

    constructor(
        private target: Window
    ) {
    }

    on(event: string, listener: IFrameSocketEventHandler) {
        if (!this.events[event]) {
            this.events[event] = []
        }

        this.events[event].push(listener)
    }

    off(event: string, listener: IFrameSocketEventHandler) {
        if (!this.events[event]) {
            return
        }

        const idx = this.events[event].indexOf(listener)

        if (idx > -1) {
            this.events[event].splice(idx, 1)
        }
    }

    emit(event: string, data: any) {
        this.target.postMessage({
            type: event,
            data,
        }, this.target.origin);
    }

    private listenToMessages() {
        window.addEventListener('message', (ev) => {
            if (typeof ev !== 'object') {
                
            }
        }, false)
    }

    dispose() {

    }
}