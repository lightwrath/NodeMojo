'use strict'

import { appConfig } from './appConfig.mjs'
import keyBroadcaster from './keyBroadcaster.mjs'
import macros from './macros.mjs'

export let featureStates = {
    keyBroadcaster: false,
    macros: false
}

export function toggler(eventHub) {
    const toggleKeys = appConfig.toggleKeys
    eventHub.on('key', (key) => {
        if (key.state) {
            return 
        }

        if (key.key === toggleKeys.keyBroadcaster) {
            featureStates.keyBroadcaster = !featureStates.keyBroadcaster
            keyBroadcaster(eventHub)
            console.log(`Key broadcaster is now ${featureStates.keyBroadcaster ? "enabled" : "disabled"}`)
        } else if (key.key === toggleKeys.macros) {
            featureStates.macros = !featureStates.macros
            macros(eventHub)
            console.log(`Macros are now ${featureStates.macros ? "enabled" : "disabled"}`)
        } else if (key.key === toggleKeys.printConfig) {
            console.log(appConfig)
        }
    })
}