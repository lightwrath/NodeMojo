import fs from 'fs'
import path from 'path'

export function  initConfig() {
    const config = JSON.parse(fs.readFileSync(path.resolve('./data/config.json')))
    let appConfig = config.teams[config.appConfig.activeTeam]
    appConfig.toggleKeys = config.appConfig.toggleKeys
    for (let slot of appConfig.slots) {
        slot.clientName = config.clients[slot.clientRef].name
        slot.executable = config.clients[slot.clientRef].executable
        slot.processName = config.clients[slot.clientRef].processName
        slot.windowXPosition = config.clients[slot.clientRef].xPosition
        slot.windowYPosition = config.clients[slot.clientRef].yPosition
        delete slot.clientRef
    }
    return appConfig
}

export function initMacroConfig(appConfig) {
    const config = JSON.parse(fs.readFileSync(path.resolve('./data/config.json')))
    for (const slot of appConfig.config) {
        if (slot.hotkeys) {
            delete slot.hotkeys
        }
        slot.hotkeys =  []
        slot.hotkeyRefs.forEach(hotkeyName => {
            slot.hotkeys.push(config.hotkeys[hotkeyName])
        })
        slot.hotkeys.sort(function(a, b) {
            if (a.order < b.order) {
                return -1
            }
            if (a.order > b.order) {
                return 1
            }
            return 0
        })
    }

    return appConfig
}