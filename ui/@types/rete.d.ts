declare module 'rete-react-render-plugin';
declare module 'rete-area-plugin';
declare module 'rete-context-menu-plugin';
declare module 'rete-minimap-plugin'
declare module 'rete-connection-path-plugin'
declare module 'rete-connection-reroute-plugin'
declare module 'rete-auto-arrange-plugin'
declare module 'rete-history-plugin'

import { Control, NodeEditor } from 'rete';
declare module 'rete' {
    export interface Control {
        readonly update: () => void
    }
    export interface NodeEditor {
        readonly trigger: (string, T?) => void
        readonly on: (string, handler: () => T) => void
    }
}