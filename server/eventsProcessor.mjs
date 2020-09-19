'use strict'
import { exec } from 'child_process';

async function keyDownEvent(keys, windowTargets) {
    console.log(`Sending ${keys} key(s) down to ${windowTargets}`)
    windowTargets.forEach(window => {
        exec(`xdotool keydown --window ${window} ${keys}`)
    })
}

async function keyUpEvent(keys, windowTargets) {
    console.log(`Sending ${keys} key(s) up to ${windowTargets}`)
    windowTargets.forEach(window => {
        exec(`xdotool keyup --window ${window} ${keys}`)
    })
}

async function keyAutoEvent(events) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (events.keyAutoState === true) {
        console.log(`Sending keys ${events.keyAuto} to ${events.windowID} automatically`)
        events.windowID.forEach(window => {
            exec(`xdotool key --window ${window} ${events.keyAuto}`);
        })
        await sleep(250)
    }
}

export async function events(events, state) {
    if (events.keySync) {
        if (state) {
            keyDownEvent(events.keySync, events.windowID)
        } else {
            keyUpEvent(events.keySync, events.windowID)
        }
    } else if (events.keyAuto) {
        if (state) {
            events.keyAutoState = true
            keyAutoEvent(events)
        } else {
            events.keyAutoState = false
        }
    }
}