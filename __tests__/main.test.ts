/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as io from '@actions/io'
import * as parseArgs from '../src/parse-args'
import * as WriteFile from '../src/write-file'
import fs from 'fs'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let parseArgsMock: jest.SpiedFunction<typeof parseArgs.parseArgs>
let writeFileMock: jest.SpiedFunction<typeof WriteFile.writeFile>
let cpMock: jest.SpiedFunction<typeof io.cp>
let rmSyncMock: jest.SpiedFunction<typeof fs.rmSync>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    writeFileMock = jest.spyOn(WriteFile, 'writeFile').mockImplementation()
    rmSyncMock = jest.spyOn(fs, 'rmSync').mockImplementation()
    parseArgsMock = jest
      .spyOn(parseArgs, 'parseArgs')
      .mockImplementation(() => ({
        env: 'production',
        json: { key: 'value' },
        regex: '^[A-Za-z]+$'
      }))
    cpMock = jest.spyOn(io, 'cp').mockImplementation()
  })

  it('calls run when imported', async () => {
    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).not.toHaveBeenCalled()
    expect(parseArgsMock).toHaveBeenCalled()
    expect(writeFileMock).toHaveBeenCalled()
    expect(cpMock).toHaveBeenCalled()
    expect(debugMock).toHaveBeenCalledTimes(1)
  })

  it('calls setFailed when error is thrown', async () => {
    cpMock.mockImplementation(() => {
      throw new Error('Test error')
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith('Test error')
    expect(rmSyncMock).not.toHaveBeenCalled()
  })
})
