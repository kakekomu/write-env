import * as core from '@actions/core'
import fs from 'fs'
import { writeFile } from '../src/write-file'

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let existsSyncMock: jest.SpiedFunction<typeof fs.existsSync>
let readFileSyncMock: jest.SpiedFunction<typeof fs.readFileSync>
let writeFileSyncMock: jest.SpiedFunction<typeof fs.writeFileSync>

describe('writeFile', () => {
  const inputs = {
    env: 'existing-file.txt',
    json: { key: 'value' }
  }
  const path = 'output.txt'
  const content = 'Hello, world!'

  beforeEach(() => {
    jest.clearAllMocks()
    process.env['GITHUB_WORKSPACE'] = ''
    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    existsSyncMock = jest.spyOn(fs, 'existsSync').mockImplementation()
    readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation()
    writeFileSyncMock = jest.spyOn(fs, 'writeFileSync').mockImplementation()
    process.env['GITHUB_WORKSPACE'] = ''
  })

  it('appends content if file exists', () => {
    existsSyncMock.mockReturnValue(true)
    readFileSyncMock.mockReturnValue('Existing content')

    const result = writeFile(inputs, path, content)

    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Checking if existing-file.txt exists ...'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'File existing-file.txt exists, appending content ...'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      'Existing content: Existing content'
    )
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'output.txt',
      'Existing content\nHello, world!'
    )
    expect(result).toBe('output.txt')
  })

  it('writes content if file does not exist', () => {
    existsSyncMock.mockReturnValue(false)

    const result = writeFile(inputs, path, content)

    expect(debugMock).toHaveBeenNthCalledWith(
      1,
      'Checking if existing-file.txt exists ...'
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      'File existing-file.txt does not exist, writing content ...'
    )
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'output.txt',
      'Hello, world!'
    )
    expect(result).toBe('output.txt')
  })

  it('throws an error if GITHUB_WORKSPACE is not set', () => {
    delete process.env['GITHUB_WORKSPACE']
    expect(() => writeFile(inputs, path, content)).toThrow()
  })
})
