import * as core from '@actions/core'
import { Props } from './types'

export const parseArgs = (): Props => {
  core.debug('Parsing inputs ...')
  const inputs: Props = {
    env: core.getInput('env'),
    json: JSON.parse(core.getInput('json')),
    regex: core.getInput('regex')
  }
  core.debug(`Inputs: ${JSON.stringify(inputs)}`)
  return inputs
}
