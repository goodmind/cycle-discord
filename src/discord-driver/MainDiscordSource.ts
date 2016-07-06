import { DiscordSource } from '../interfaces'
import { Observable } from 'rxjs'
import { Client, Message } from 'discord.js'

import { StreamAdapter } from '@cycle/base'
import rxjsAdapter from '@cycle/rxjs-adapter'

export class MainDiscordSource implements DiscordSource {
  constructor (private client: Client,
               private _res: Observable<any>,
               private runStreamAdapter: StreamAdapter) {
    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(client))) {
      let method: any = (client as any)[name];
      if (!(method instanceof Function) || method === Client) continue
      Object.defineProperty(this, name, {
        value: function (...args: any[]) {
          return method.bind(client)(...args)
        }
      })
    }
  }

  private adapt (stream: Observable<any>) {
    return this.runStreamAdapter.adapt(stream, rxjsAdapter.streamSubscribe)
  }

  on (eventType: string) {
    let event = (() => {
      let event = Observable.fromEvent(this.client, eventType)

      switch (eventType) {
        case 'message':
          return event
            .filter((m: Message) => m.author.id != this.client.user.id && !m.author.bot && m.author.id != '159338627749380096')
        default:
          return event
      }
    })()

    return this.adapt(event)
  }
}
