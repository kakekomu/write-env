import * as core from '@actions/core'
import { generateEnv } from '../src/generate-env'

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>

describe('generateEnv', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
  })

  it('generates environment variables from JSON object', () => {
    const vars = {
      VAR1: 'value1',
      VAR2: 'value2',
      VAR3: 'value3'
    }
    const regex = undefined

    const result = generateEnv({ json: vars, regex, env: 'output.env' })

    expect(result).toEqual('VAR1=value1\nVAR2=value2\nVAR3=value3\n')
    expect(debugMock).not.toHaveBeenCalled()
  })

  it('skips variables that do not match the regex', () => {
    const vars = {
      VAR1: 'value1',
      VAR2: 'value2',
      VAR3: 'value3'
    }
    const regex = '^VAR[12]$'

    const result = generateEnv({ json: vars, regex, env: 'output.env' })

    expect(result).toEqual('VAR1=value1\nVAR2=value2\n')
    expect(debugMock).toHaveBeenCalledTimes(1)
    expect(debugMock).toHaveBeenCalledWith(
      'Skipping VAR3 because it does not match the regex ^VAR[12]$'
    )
  })
})
