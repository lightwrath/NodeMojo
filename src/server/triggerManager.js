'use strict' 

let triggerState = {}

function initTriggerState(team, characters) {
    function addToTriggerState (hotKeyName, triggers) {
        triggerState[hotKeyName] = {}
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
                addToTriggerState(hotKeyName, hotKey.triggers)
            }
        }
    }
}

function triggerMonitor(eventHub) {
    eventHub.on('trigger', eventData => {
        let triggerEntry = triggerState[eventData.hotkey];
        triggerEntry[eventData.triggerType] = eventData.state
        if ((typeof(triggerEntry.key) === "undefined" ||
            triggerEntry.key === true) &&
            (typeof(triggerEntry.pixel) === "undefined" ||
            triggerEntry.pixel === true)) {
                triggerEntry.combinedState = true;
                console.log("PASS EVENT" + eventData)//EVENT HERE
        }
        else {
            if (triggerEntry.combinedState === true) {
                console.log("FAIL EVENT" + eventData)//EVENT HERE
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