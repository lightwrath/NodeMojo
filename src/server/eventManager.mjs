'use strict'
import { exec, execSync, spawn } from 'child_process';


let liveAutoKeyEvents = [];

async function keyDownEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keydown --window ${windowTarget} ${keys}`)
}

async function keyUpEvent(keys, windowTarget) {
    keys = keys.join(' ')
    exec(`xdotool keyup --window ${windowTarget} ${keys}`)
}

async function keyAutoEvent(keys, windowTarget, hotkey) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    let sendKeyCounter = 0;
    keys = keys.join(' ')
    while (liveAutoKeyEvents.includes(hotkey)) {
        exec(`xdotool key --window ${windowTarget} ${keys}`)
        await sleep(250);
        sendKeyCounter++;
    }
    console.log(`Hotkey: ${hotkey} - Automatic key(s) ${keys} sent ${sendKeyCounter} times.`);
}

async function eventProcessor(eventData) {
    const type = eventData.config[eventData.character].hotKeys[eventData.hotkey].type
    const windowTarget = eventData.config[eventData.character].client.windowID;
    const keys = eventData.config[eventData.character].hotKeys[eventData.hotkey].events.key;
    
    console.log(`Event - Character: ${eventData.character}, Hotkey: ${eventData.hotkey}, Key(s): ${keys}, Active: ${eventData.active}`)
    if (type === "automatic") {
        if (eventData.active === true) {
            liveAutoKeyEvents.push(eventData.hotkey)
            keyAutoEvent(keys, windowTarget, eventData.hotkey)
        } else {
            const arrIndex = liveAutoKeyEvents.indexOf(eventData.hotkey);
            if (arrIndex > -1) {
                liveAutoKeyEvents.splice(arrIndex, 1);
            }
        }
    } else {
        if (eventData.active === true) {
            keyDownEvent(keys, windowTarget);
        } else {
            keyUpEvent(keys, windowTarget);
        }
    }
}

export function macrosOn(eventHub) {
    console.log("Macros toggled on")
    eventHub.on('macroEvent', eventProcessor);
}
export function macrosOff(eventHub) {
    console.log("Macros toggled off")
    eventHub.off('macroEvent', eventProcessor);
}