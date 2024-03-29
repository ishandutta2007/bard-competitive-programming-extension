import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum TriggerMode {
  Always = 'always',
  Manually = 'manually',
}

export const TRIGGER_MODE_TEXT = {
  [TriggerMode.Always]: { title: 'Always', desc: 'CPBard is queried on every search' },
  [TriggerMode.Manually]: {
    title: 'Manually',
    desc: 'CPBard is queried when you manually click a button',
  },
}

export enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

export enum Language {
  Auto = 'auto',
  English = 'english',
  Chinese = 'chinese',
  Spanish = 'spanish',
  French = 'french',
  Korean = 'korean',
  Japanese = 'japanese',
  German = 'german',
  Portuguese = 'portuguese',
}

export const Prompt =
  'Suggest 3 different algorithms for this problem in decreasing order of time complexity.\
 Next, suggest 3-4 relevant papers(with publishing year) related to this algorithm.\
 Here is the full story of the problem:\
'

export interface SitePrompt {
  site: string
  prompt: string
}

const userConfigWithDefaultValue = {
  triggerMode: TriggerMode.Always,
  theme: Theme.Auto,
  language: Language.Auto,
  prompt: Prompt,
  promptOverrides: [] as SitePrompt[],
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  return Browser.storage.local.set(updates)
}

export enum ProviderType {
  BARD = 'bard',
}

interface GPT3ProviderConfig {
  model: string
  apiKey: string
}

export interface ProviderConfigs {
  provider: ProviderType
  configs: {
    [ProviderType.BARD]: GPT3ProviderConfig | undefined
  }
}

export async function getProviderConfigs(): Promise<ProviderConfigs> {
  const { provider = ProviderType.BARD } = await Browser.storage.local.get('provider')
  const configKey = `provider:${ProviderType.BARD}`
  const result = await Browser.storage.local.get(configKey)
  return {
    provider,
    configs: {
      [ProviderType.BARD]: result[configKey],
    },
  }
}

export async function saveProviderConfigs(
  provider: ProviderType,
  configs: ProviderConfigs['configs'],
) {
  return Browser.storage.local.set({
    provider,
    [`provider:${ProviderType.GPT3}`]: configs[ProviderType.GPT3],
  })
}
