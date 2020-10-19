'use strict'

import { appConfig } from './appConfig.mjs'
import { featureStates } from './toggler.mjs'

function convertKeyEvent(keyEvent) {
    let keyString = [];
    const key = defineKeys[keyEvent.keycode];
    if (keyEvent.shiftKey) {
        keyString.push("Shift_R")
    } else if (keyEvent.altKey) {
        keyString.push("Alt_R")
    } else if (keyEvent.ctrlKey) {
        keyString.push("Control_R")
    } else if (keyEvent.metaKey) {
        keyString.push("Meta_R")
    }
    keyString.push(key);
    return keyString.join('+')
}

let broadcasterFunction

export default function keyBroadcaster(eventHub) {
    const windowTargets = appConfig.slots.map(slot => slot.windowID)
    function broadcastEvent(key) {
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
    
    /*let keyBoardcaster = false
    iohook.on('keydown', function(keyEvent) {
        if (keyBoardcaster) {
            const keyString = convertKeyEvent(keyEvent);
            console.log("Broadcast keys: " + keyString)
            for (const client of appConfig.config) {
                exec(`xdotool keydown --window ${client.windowID} ${keyString}`)
            }
        }
        if (keyEvent.keycode === 3655) {
            if (keyBoardcaster) {
                keyBoardcaster = false;
                console.log("keyboard broadcaster toggled off")
            } else {
                keyBoardcaster = true;
                console.log("keyboard broadcaster toggled on")
            }
        }
    })
    iohook.on('keyup', function(keyEvent) {
        if (keyBoardcaster) {
            const keyString = convertKeyEvent(keyEvent);
            for (const client of appConfig.config) {
                exec(`xdotool keyup --window ${client.windowID} ${keyString}`)
            }
        }
    })
    iohook.start('keydown');
    iohook.start('keyup');
    */
}