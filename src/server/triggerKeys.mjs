'use strict'
import iohook from 'iohook';
import defineKeys from './defineKeys.json';

function keyboardMonitor(eventHub) {
    iohook.on('keydown', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        for (const characterName in appConfig) {
            for (const hotkeyName in appConfig[characterName].hotKeys) {
                if (appConfig[characterName].hotKeys[hotkeyName].triggers.key && definedKey === appConfig[characterName].hotKeys[hotkeyName].triggers.key.keyPress) {
                    appConfig[characterName].hotKeys[hotkeyName].triggers.key.active = true;
                    eventHub.emit('trigger', {
                        type: "key",
                        character: characterName,
                        hotkey: hotkeyName,
                        active: true
                    });
                }
            }
        }
    })
    iohook.on('keyup', function(keyEvent) {
        const definedKey = defineKeys[keyEvent.keycode]
        for (const characterName in appConfig) {
            for (const hotkeyName in appConfig[characterName].hotKeys) {
                if (appConfig[characterName].hotKeys[hotkeyName].triggers.key && definedKey === appConfig[characterName].hotKeys[hotkeyName].triggers.key.keyPress) {
                    appConfig[characterName].hotKeys[hotkeyName].triggers.key.active = false;
                    eventHub.emit('trigger', {
                        type: "key",
                        character: characterName,
                        hotkey: hotkeyName,
                        active: false
                    });
                }
            }
        }
    })
    iohook.start('keydown');
    iohook.start('keyup');
}

export default function main(eventHub) {
    keyboardMonitor(eventHub)
}