import Browser from 'webextension-polyfill'
import { getProviderConfigs, ProviderType } from '../config'
import { BARDProvider, sendMessageFeedbackBard } from './providers/bard'
import { ConversationContext, Provider } from './types'

async function generateAnswers(
  port: Browser.Runtime.Port,
  question: string,
  conversationContext: ConversationContext | undefined,
) {
  const providerConfigs = await getProviderConfigs()

  let provider: Provider
  if (providerConfigs.provider === ProviderType.BARD) {
    provider = new BARDProvider()
  } else {
    throw new Error(`Unknown provider ${providerConfigs.provider}`)
  }

  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    controller.abort()
    cleanup?.()
  })

  const { cleanup } = await provider.generateAnswer({
    prompt: question,
    signal: controller.signal,
    onEvent(event) {
      if (event.type === 'done') {
        port.postMessage({ event: 'DONE' })
        return
      }
      port.postMessage(event.data)
    },
    conversationContext: conversationContext, //used for BARD
  })
}

Browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    console.debug('received msg', msg)
    try {
      await generateAnswers(
        port,
        msg.question,
        msg.conversationId,
        msg.parentMessageId,
        msg.conversationContext,
      )
    } catch (err: Error) {
      console.error(err)
      port.postMessage({ error: err.message })
    }
  })
})

Browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'FEEDBACK') {
    await sendMessageFeedbackBard(message.data)
  } else if (message.type === 'OPEN_OPTIONS_PAGE') {
    Browser.runtime.openOptionsPage()
  }
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.runtime.openOptionsPage()
  }
})
