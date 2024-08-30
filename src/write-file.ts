import * as core from '@actions/core'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Props } from './types'

export const writeFile = (
  inputs: Props,
  path: string,
  content: string
): string => {
  const existingPath = inputs.env
  const workspacePath = process.env['GITHUB_WORKSPACE']
  if (workspacePath === undefined) {
    throw new Error('GITHUB_WORKSPACE is not set')
  }
  const filePath = join(workspacePath, path)
  core.debug(`Checking if ${inputs.env} exists ...`)
  if (existsSync(inputs.env)) {
    core.debug(`File ${inputs.env} exists, appending content ...`)
    const existingContent = readFileSync(existingPath).toString()
    core.debug(`Existing content: ${existingContent}`)
    writeFileSync(filePath, `${existingContent}\n${content}`)
  } else {
    core.debug(`File ${inputs.env} does not exist, writing content ...`)
    writeFileSync(filePath, content)
  }
  // ファイルに書き出す
  return filePath
}
