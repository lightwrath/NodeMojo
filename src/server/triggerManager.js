'use strict' 

let triggerState = {}

function initTriggerState(team, characters) {
    function addToTriggerState (characterName, hotKeyName, triggers) {
        triggerState[hotKeyName] = {}
        triggerState[hotKeyName].character = characterName;
        triggerState[hotKeyName].combinedState = false;
        if (triggers.key) {
            triggerState[hotKeyName].key = false;
        }
        if (triggers.pixel) {
            triggerState[hotKeyName].pixel = false;
        }
    }
    for (let character of team.characters) {
        for (let hotKeyName in characters[character].hotKeys) {
            let hotKey = characters[character].hotKeys[hotKeyName]
            if (hotKey.triggers) {
                addToTriggerState(character, hotKeyName, hotKey.triggers)
            }
        }
    }
}

function triggerMonitor(eventHub) {
    eventHub.on('macroTrigger', triggerData => {
        let triggerEntry = triggerState[triggerData.hotkey];
        triggerEntry[triggerData.triggerType] = triggerData.state
        if ((typeof(triggerEntry.key) === "undefined" ||
            triggerEntry.key === true) &&
            (typeof(triggerEntry.pixel) === "undefined" ||
            triggerEntry.pixel === true)) {
                triggerEntry.combinedState = true;
                //console.log(triggerData)
                let eventData = {
                    character: triggerEntry.character,
                    hotkey: triggerData.hotkey,
                    active: true
                }
                eventHub.emit('macroEvent', eventData);
        }
        else {
            if (triggerEntry.combinedState === true) {
                let eventData = {
                    character: triggerEntry.character,
                    hotkey: triggerData.hotkey,
                    active: false
                }
                eventHub.emit('macroEvent', eventData);
            }
        }
    })
}

export default function main(team, characters, eventHub) {
    if (Object.keys(triggerState).length === 0) {
        initTriggerState(team, characters);
        console.log(triggerState);
    }
    triggerMonitor(eventHub)
}