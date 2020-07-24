'use strict'
import { exec, execSync, spawn } from 'child_process';


let liveAutoKeyEvents = {};

async function keyDownEvent(keys, windowTarget) {
    exec(`xdotool keydown --window ${windowTarget} ${keys}`)
}

async function keyUpEvent(keys, windowTarget) {
    exec(`xdotool keyup --window ${windowTarget} ${keys}`)
}

async function keyAutoEvent(keys, windowTarget) {
    exec(`xdotool key --window ${windowTarget} ${keys}`);
}

async function eventProcessor(eventData) {
    const type = eventData.config[eventData.character].hotKeys[eventData.hotkey].type;
    const windowTarget = eventData.config[eventData.character].client.windowID;
    const keys = eventData.config[eventData.character].hotKeys[eventData.hotkey].events.key.join(' ');
    console.log(`Event - Character: ${eventData.character}, Hotkey: ${eventData.hotkey}, Key(s): ${keys}, Active: ${eventData.active}`);
    if (type === "automatic" && eventData.active) {
        keyAutoEvent(keys, windowTarget)
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

export function initEvents() {
    keyAutoEvent();
}