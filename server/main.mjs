'use strict'

import { launchClients, positionClients } from './clients.mjs'
import keyboardBroadcaster from './keyboardBroadcaster.mjs'
import toggler from './toggler.mjs'
import { initConfig } from './configManager.mjs'

let appConfig = initConfig()
appConfig = launchClients(appConfig)
positionClients(appConfig)
keyboardBroadcaster(appConfig)
toggler(appConfig)
console.log(appConfig)