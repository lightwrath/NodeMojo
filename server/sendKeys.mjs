'use strict'
import { exec } from 'child_process';

export default function sendKeys(eventHub) {
    eventHub.on('sendKey', (key) => {
        if (key.key === undefined) {
            return
        }
        const keyString = `${key.shiftKey ? "SHIFT+" : ""}${key.altKey ? "ALT+" : ""}${key.ctrlKey ? "CTRL+" : ""}${key.key}`
        if (key.state === true) {
            exec(`xdotool keydown --window ${key.windowID} ${typeof(keyString) == "string" ? keyString : keyString.join(' ')}`)
        } else if (key.state === false) {
            exec(`xdotool keyup --window ${key.windowID} ${typeof(keyString) == "string" ? keyString : keyString.join(' ')}`)
        } else if (key.state === null) {
            exec(`xdotool key --window ${key.windowID} ${typeof(keyString) == "string" ? keyString : keyString.join(' ')}`);
        }
    })
}

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

/*async function keyDownEvent(keys, windowTargets) {
    process.stdout.write(`Sending ${keys} key(s) down to ${windowTargets}.\n`)
    windowTargets.forEach(window => {
        exec(`xdotool keydown --window ${window} ${keys.join(' ')}`)
    })
}

async function keyUpEvent(keys, windowTargets) {
    process.stdout.write(`Sending ${keys} key(s) up to ${windowTargets}.\n`)
    windowTargets.forEach(window => {
        exec(`xdotool keyup --window ${window} ${keys.join(' ')}`)
    })
}

async function keyAutoEvent(events) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (events.keyAutoState === true) {
        console.log(`Sending keys ${events.keyAuto.keys} to ${events.windowID} automatically`)
        events.windowID.forEach(window => {
            exec(`xdotool key --window ${window} ${events.keyAuto.keys.join(' ')}`);
        })
        await sleep(events.keyAuto.timeout)
    }
}

export async function events(events, state) {
    if (events.keySync) {
        if (state) {
            keyDownEvent(events.keySync, events.windowID)
        } else {
            keyUpEvent(events.keySync, events.windowID)
        }
    } else {
        console.log("Something else happened")
    }
}*/