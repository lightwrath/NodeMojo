'use strict'
import { appConfig } from './appConfig.mjs'
import { addPixel, clearPixels } from './pixels.mjs'
import { featureStates } from './toggler.mjs'

function pushPixels() {
    for (const slot of appConfig.slots) {
        slot.macros.forEach(macro => {
            if (macro.triggers.pixel) {
                const pixel = {
                    color: macro.triggers.pixel.color,
                    x: macro.triggers.pixel.xPosition,
                    y: yPosition,
                    slotName: slot.slotName,
                    macro: macro.name
                }
                addPixel(pixel)
            }
        })
    }
}

async function evaluateTriggersFor(eventHub, slot) {
    function evalTriggers(triggers) {
        if (triggers.keyboard && !triggers.keyboard.state) {
            return false
        }
        if (triggers.pixel && !triggers.pixel.state) {
            return false
        }
        return true
    }
    const macroToTrigger = slot.macros.find(macro => {
        const triggerState = evalTriggers(macro.triggers)
        if (macro.triggers.state != triggerState) {
            macro.triggers.state = triggerState
            return true
        }
    })
    if (macroToTrigger) {
        if (macroToTrigger.triggers.state) {
            console.log(`${macroToTrigger.name}: Sending ${macroToTrigger.events.keySync.concat()} to ${slot.slotName}`)
        }
        eventHub.emit('sendKey', {
            key: macroToTrigger.events.keySync, 
            windowID: slot.windowID,
            state: macroToTrigger.triggers.state 
        })
    }
}

let keyListenerFuncRef = null
let pixelListenerFuncRef = null

export default function macros(eventHub) {
    function keyListener(key) {
        for (const slot of appConfig.slots) {
            let keyMatchFound = false
            slot.macros.forEach(macro => {
                if (
                macro.triggers.keyboard.key === key.key &&
                key.state) {
                    macro.triggers.keyboard.state = true
                    keyMatchFound = true
                } else if (
                macro.triggers.keyboard.key === key.key &&
                !key.state) {
                    macro.triggers.keyboard.state = false
                    keyMatchFound = true
                }
            })
            if (keyMatchFound) {
                evaluateTriggersFor(eventHub, slot)
            }
        }
    }
    
    function pixelListener(pixel) {
        console.log(pixel)
    }
    if (featureStates.macros) {
        pushPixels()
        keyListenerFuncRef = keyListener
        pixelListenerFuncRef = pixelListener
        eventHub.on('key', keyListener)
        eventHub.on('pixel', pixelListener)
    } else {
        clearPixels()
        eventHub.off('key', keyListenerFuncRef)
        eventHub.off('key', pixelListenerFuncRef)
    }
}

/*
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
}*/