import { StreamAdapter } from '@cycle/base'
import rxjsAdapter from '@cycle/rxjs-adapter'

import { Client } from 'discord.js'
import { DiscordSource } from '../interfaces'
import { MainDiscordSource } from './MainDiscordSource'
import { Observable as O, Observable } from 'rxjs';

export function makeDiscordDriver (token: string): Function {
  let client = new Client()
      client.loginWithToken(token)

  function discordDriver (request: Observable<any>, runSA: StreamAdapter): DiscordSource {
    let response = request.share()
        response.subscribe(x => console.log('fugg reply'), err => console.log(err))

    let discordSource = new MainDiscordSource(client, response, runSA)

    return discordSource
  }

  (discordDriver as any).streamAdapter = rxjsAdapter

  return discordDriver
}
