import { Props } from './types'
import * as core from '@actions/core'

export function generateEnv({ json: vars, regex }: Props): string {
  const lines: string[] = []
  for (const key in vars) {
    if (regex && !new RegExp(regex).test(key)) {
      core.debug(`Skipping ${key} because it does not match the regex ${regex}`)
      continue
    }
    lines.push(`${key}=${vars[key]}`)
  }
  return `${lines.join('\n')}\n`
}
