'use strict'

import { appConfig } from './appConfig.mjs'
import { featureStates } from './toggler.mjs'

let broadcasterFunction

export default function keyBroadcaster(eventHub) {
    let windowTargets = appConfig.slots.map(slot => slot.windowID)
    windowTargets.shift()
    function broadcastEvent(key) {
        if (key.key == undefined) {
            return
        }
        console.log(`Broadcasting ${key.shiftKey ? "SHIFT+" : ""}${key.altKey ? "ALT+" : ""}${key.ctrlKey ? "CTRL+" : ""}${key.key} ${key.state ? "key down" : "key up"}.`)
        windowTargets.forEach(windowID => {
            key.windowID = windowID
            eventHub.emit('sendKey', key)
        })
    }
    if (featureStates.keyBroadcaster) {
        eventHub.on('key', broadcastEvent)
        broadcasterFunction = broadcastEvent
    } else {
        eventHub.off('key', broadcasterFunction)
    }
}