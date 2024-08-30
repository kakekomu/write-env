import * as core from '@actions/core'
import * as io from '@actions/io'
import { generateEnv } from './generate-env'
import { writeFile } from './write-file'
import { rmSync } from 'fs'
import { parseArgs } from './parse-args'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputs = parseArgs()
    const envContent = generateEnv(inputs)
    const outputPath = writeFile(inputs, 'output.txt', envContent)
    const options = { recursive: true, force: true }
    await io.cp(outputPath, inputs.env, options)
    rmSync(outputPath)
    core.debug(`Output: ${envContent}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
