'use strict'
import { exec } from 'child_process';

export default function sendEvents(eventHub) {
    eventHub.on('sendKey', (key) => {
        //console.log(key)
    })
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