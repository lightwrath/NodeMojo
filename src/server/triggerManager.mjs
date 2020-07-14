'use strict' 

async function enableEvents(eventHub) {
    for (const characterName in appConfig) {
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            let hotkey = appConfig[characterName].hotKeys[hotkeyName]
            if(hotkey.triggers.resetOnTrigger) {
                if (hotkey.triggers.active && !hotkey.events.active) {
                    let eventData = {
                        config: appConfig,
                        character: characterName,
                        hotkey: hotkeyName,
                        active: hotkey.triggers.active
                    }
                    eventHub.emit('macroEvent', eventData);
                    hotkey.events.active = hotkey.triggers.active;
                    break;
                }
            } else {
                if (hotkey.triggers.active && !hotkey.events.active) {
                    let eventData = {
                        config: appConfig,
                        character: characterName,
                        hotkey: hotkeyName,
                        active: hotkey.triggers.active
                    }
                    eventHub.emit('macroEvent', eventData);
                    hotkey.events.active = hotkey.triggers.active;
                }
            }
        }
    }
}

async function disableEvents(eventHub) {
    for (const characterName in appConfig) {
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            let hotkey = appConfig[characterName].hotKeys[hotkeyName]
            if (!hotkey.triggers.active && hotkey.events.active) {
                let eventData = {
                    config: appConfig,
                    character: characterName,
                    hotkey: hotkeyName,
                    active: hotkey.triggers.active
                }
                eventHub.emit('macroEvent', eventData);
                hotkey.events.active = false;
            }
        }
    }
}

async function updateTriggers() {
    for (const characterName in appConfig) {
        for (const hotkeyName in appConfig[characterName].hotKeys) {
            let triggers = appConfig[characterName].hotKeys[hotkeyName].triggers
            if ((!triggers.key || triggers.key.active) && (!triggers.pixel || triggers.pixel.active)) {
                triggers.active = true
            } else {
                if (triggers.active === true) {
                    triggers.active = false;
                }
            }
        }
    }
}

export default async function main(eventHub) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (true) {
        await updateTriggers();
        enableEvents(eventHub);
        disableEvents(eventHub);
        await sleep(100);
    }
}