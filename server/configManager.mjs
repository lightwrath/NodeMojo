import config from './config.json'

export function  initConfig() {
    let appConfig = config.teams[config.appConfig.activeTeam]
    for (let configEntry of appConfig.config) {
        configEntry.clientName = config.clients[configEntry.clientRef].name
        configEntry.executable = config.clients[configEntry.clientRef].executable
        configEntry.processName = config.clients[configEntry.clientRef].processName
        configEntry.windowXPosition = config.clients[configEntry.clientRef].xPosition
        configEntry.windowYPosition = config.clients[configEntry.clientRef].yPosition
        configEntry.characterName = config.characters[configEntry.characterRef].name
        configEntry.hotkeyRefs = config.characters[configEntry.characterRef].hotkeyRefs
    }
    return appConfig
}

export function initMacroConfig(appConfig) {
    let macros = {}
    for (const character of appConfig.config) {
        character.hotkeyRefs.forEach(hotkeyName => {
            if (!macros[hotkeyName]) {
                macros[hotkeyName] = config.hotkeys[hotkeyName]
                macros[hotkeyName].characterName = []
                macros[hotkeyName].clientName = []
                macros[hotkeyName].events.windowID = []
            }
            macros[hotkeyName].characterName.push(character.characterName)
            macros[hotkeyName].clientName.push(character.clientName)
            macros[hotkeyName].events.windowID.push(character.windowID)
        })
    }
    appConfig.macros = []
    for (const macroEntry in macros) {
        appConfig.macros.push(macros[macroEntry])
    }
    appConfig.macros.sort(function(a, b) {
        if (a.priority < b.priority) {
            return -1
        }
        if (a.priority > b.priority) {
            return 1
        }
        return 0
    })
    return appConfig
}

let tmp = [
    {
        "hotkeyName": "Follow",
        "charaterNames": [
            "LightWrathYk",
            "LightWrathKa",
            "LightWrathKo",
            "LightWrathNe",
            "LightWrathVi"
        ],
        "clientName": [
            "WoW1",
            "WoW2",
            "WoW3",
            "WoW4",
            "WoW5"
        ],
        "priority": 0,
        "triggers": {
            "pixel": {
                "colour": "00ff00",
                "xPosition": "1030",
                "yPosition": "535"
            }
        },
        "events": {
            "key": [
                "F5",
                "F8"
            ],
            "windowID": [
                "1234567",
                "2234567",
                "3234567",
                "4234567",
                "5234567"
            ]
        }
    }
]