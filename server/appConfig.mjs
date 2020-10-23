import fs from 'fs'
import path from 'path'

export let appConfig = {}

export function postConfig(newConfig) {
    appConfig = newConfig
}

export function  initAppConfig() {
    const config = JSON.parse(fs.readFileSync(path.resolve('./data/config.json')))
    appConfig = config.teams[config.appConfig.activeTeam]
    appConfig.toggleKeys = config.appConfig.toggleKeys
    for (let slot of appConfig.slots) {
        slot.clientName = config.clients[slot.clientRef].name
        slot.macros = slot.macroRefs.map(macroRef => JSON.parse(JSON.stringify(config.macros[macroRef])))
        slot.executable = config.clients[slot.clientRef].executable
        slot.processName = config.clients[slot.clientRef].processName
        slot.clientPID = null
        slot.windowID = null
        slot.windowXPosition = config.clients[slot.clientRef].xPosition
        slot.windowYPosition = config.clients[slot.clientRef].yPosition
        delete slot.macroRefs
        delete slot.clientRef
    }
    console.log(JSON.stringify(appConfig, null, 4))
}

export function hotRebuildConfig() {
    
}