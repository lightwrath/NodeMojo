'use strict'
import iohook from 'iohook';

import appConfig from './main.mjs'

//import { macros } from './macroProcessor.mjs'

export let featureStates = {
    keyBroadcaster: false,
    macros: false
}

export function toggler(key) {
    const toggleKeys = appConfig.toggleKeys
    if (key === toggleKeys.keyBroadcaster) {
        featureStates.keyBroadcaster = !featureStates.keyBroadcaster
        console.log(`Key broadcaster is now ${featureStates.keyBroadcaster ? "enabled" : "disabled"}`)
    } else if (key === toggleKeys.macros) {
        featureStates.macros = !featureStates.macros
        console.log(`Macros are now ${featureStates.macros ? "enabled" : "disabled"}`)
    }
}