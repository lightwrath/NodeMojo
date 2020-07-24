'use strict' 

function instantTriggerProcessor(eventHub) {
    eventHub.on('trigger', function(triggerData) {
        let hotkey = appConfig[triggerData.character].hotKeys[triggerData.hotkey];
        if ((!hotkey.triggers.key || hotkey.triggers.key.active) && (!hotkey.triggers.pixel || hotkey.triggers.pixel.active)) {
            hotkey.triggers.active = true;
            if (hotkey.type !== "automatic" && hotkey.triggers.active && !hotkey.events.active) {
                eventHub.emit('macroEvent', {
                    config: appConfig,
                    character: triggerData.character,
                    hotkey: triggerData.hotkey,
                    active: true
                });
                hotkey.events.active = true;
            }
        } else {
            if (hotkey.triggers.active === true) {
                hotkey.triggers.active = false;
                if (hotkey.type !== "automatic" && !hotkey.triggers.active && hotkey.events.active) {
                    eventHub.emit('macroEvent', {
                        config: appConfig,
                        character: triggerData.character,
                        hotkey: triggerData.hotkey,
                        active: false
                    });
                    hotkey.events.active = false;
                }
            }
        }
    });
}

async function autoEventsManager(eventHub) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    while (true) {
        for (const characterName in appConfig) {
            for (const hotkeyName in appConfig[characterName].hotKeys) {
                let hotkey = appConfig[characterName].hotKeys[hotkeyName];
                if(hotkey.type === "automatic" && hotkey.triggers.active) {
                    let eventData = {
                        config: appConfig,
                        character: characterName,
                        hotkey: hotkeyName,
                        active: true
                    }
                    eventHub.emit('macroEvent', eventData);
                    hotkey.events.active = true;
                    break;
                } else if (hotkey.type === "automatic" && !hotkey.triggers.active) {
                    hotkey.events.active = false;
                }
            }
        }
        await sleep(Math.floor(Math.random() * (Math.floor(300) - Math.ceil(200))) + Math.ceil(200));
    }
}

export default async function main(eventHub) {
    instantTriggerProcessor(eventHub);
    autoEventsManager(eventHub);
}