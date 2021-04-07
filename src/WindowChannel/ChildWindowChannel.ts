import { CONNECTION_EVENT, DISCONNECTION_EVENT } from "./MainWindowChannel";
import { isDefinedNotNull } from "./utils";
import { WindowChannel, WindowChannelConfig } from "./WindowChannel";

export class ChildWindowChannel extends WindowChannel {
    static getParent(): Window {
        if (isDefinedNotNull(window.opener)) {
            return window.opener
        }

        if (isDefinedNotNull(window.parent)) {
            return window.parent
        }

        throw new Error('No parent window')
    }

     constructor(config: WindowChannelConfig) {
        super(ChildWindowChannel.getParent(), config)
        this.emit(CONNECTION_EVENT, {
            origin: window.origin
        })
     }

     dispose() {
         this.emit(DISCONNECTION_EVENT, {
             origin: window.origin
         })
         super.dispose()
     }
}