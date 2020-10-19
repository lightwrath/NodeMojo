'use strict'
import iohook from 'iohook';
import robot from 'robotjs';

import defineKeys from './defineKeys.json';
import { initMacroConfig } from './configManager.mjs'
import { events } from './sendKeys.mjs'

iohook.start('keydown');
iohook.start('keyup');

let featureActive = false
export async function macros(appConfig) {
    if (featureActive) {
        featureActive = !featureActive
        iohook.off('keydown', await keyboardEvents.keyDown)
        iohook.off('keyup', await keyboardEvents.keyUp)
        delete appConfig.macros
    } else {
        featureActive = !featureActive
        appConfig = initMacroConfig(appConfig)
        console.log(appConfig)
        keyboardEvents(appConfig.config)
        pixelEvents(appConfig.config)
    }
}

async function keyboardEvents(slots) {
    async function keyDown(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        for (let slotNum = 0; slotNum < slots.length; slotNum++) {
            const slot = slots[slotNum]
            let execNextStep = false
            for (const macro of slot.hotkeys) {
                if (macro.triggers.key && macro.triggers.key.keyPress === definedKey) {
                    macro.triggers.key.keyPressState = true
                    execNextStep = true
                }
            }
        if (execNextStep) {
            triggers(macroList)
        }
    }
    async function keyUp(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        for (let slotNum = 0; slotNum < slots.length; slotNum++) {
            const slot = slots[slotNum]
            let execNextStep = false
            for (const macro of slot.hotkeys) {
                if (macro.triggers.key && macro.triggers.key.keyPress === definedKey) {
                    macro.triggers.key.keyPressState = false
                    execNextStep = true
                }
            }
        if (execNextStep) {
            triggers(macroList)
        }
    }
    keyboardEvents.keyDown = keyDown
    keyboardEvents.keyUp = keyUp
    iohook.on('keydown', keyDown)
    iohook.on('keyup', keyUp)
}

function pixelEvents(slots) {
    async function matchPixel(colour, x, y) { 
        if (robot.getPixelColor(x, y) === colour) {
           return true;
        } else {
           return false;
        }
    }
    function evalPixelStates(slots) {
        for (let slotNum = 0; slotNum < slots.length; slotNum++) {
            const slot = slots[slotNum]
            let execNextStep = false
            for (const macro of slot.hotkeys) {
                if (macro.triggers.pixel && await matchPixel(
                    macro.triggers.pixel.colour,
                    macro.triggers.pixel.xPosition,
                    macro.triggers.pixel.yPosition)) 
                {
                    macro.triggers.pixel.state = true
                    execNextStep = true
                } else if (macro.triggers.pixel && macro.triggers.pixel.state === true) {
                    macro.triggers.pixel.state = false
                    execNextStep = true
                }
            }
            if (execNextStep) {
                triggers(macroList)
            }
        }
    }
    const timerId = setInterval(() => {
        evalPixelStates(slots)
        if (!featureActive) {
            clearInterval(timerId)
        }
    }, 250)
}

async function triggers(macroList) {
    function evalTriggers(triggers) {
        if (triggers.key && !triggers.key.keyPressState) {
            return false
        }
        if (triggers.pixel && !triggers.pixel.state) {
            return false
        }
        return true
    }
    for (const macro of macroList) {
        if (evalTriggers(macro.triggers)) {
            if (!macro.triggers.state) {
                macro.triggers.state = true
                process.stdout.write(`${macro.name} triggered: `)
                events(macro.events, true)
            }
        } else if (macro.triggers.state) {
            macro.triggers.state = false
            process.stdout.write(`${macro.name} ended: `)
            events(macro.events, false)
        }
    }
}