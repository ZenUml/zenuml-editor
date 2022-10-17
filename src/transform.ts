import { Store, File } from './store'
// @ts-ignore
import hashId from 'hash-sum'

export const COMP_IDENTIFIER = `__sfc__`
export async function compileFile(
  store: Store,
  { filename, compiled }: File
) {
  const { errors, descriptor } = { errors: [], descriptor: {
      styles: [{
        lang: 'css',
      }],
      template: {
        lang: 'html',
      },
      script: {
        lang: 'ts',
      },
      scriptSetup: {
        lang: 'ts',
      }
    }
  }
  if (errors.length) {
    store.state.errors = errors
    return
  }

  const scriptLang =
    (descriptor.script && descriptor.script.lang) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.lang)
  const isTS = scriptLang === 'ts'
  if (scriptLang && !isTS) {
    store.state.errors = [`Only lang="ts" is supported for <script> blocks.`]
    return
  }

  // const hasScoped = descriptor.styles.some((s) => s.scoped)
  let clientCode = ''
  let ssrCode = ''

  const appendSharedCode = (code: string) => {
    clientCode += code
    ssrCode += code
  }

  const clientScriptResult = [ 'clientScript.Abcd', {}]
  if (!clientScriptResult) {
    return
  }
  const [clientScript] = clientScriptResult
  clientCode += clientScript

  ssrCode += clientScript



  if (clientCode || ssrCode) {
    appendSharedCode(
      `\n${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}` +
        `\nexport default ${COMP_IDENTIFIER}`
    )
    compiled.js = clientCode.trimStart()
    compiled.ssr = ssrCode.trimStart()
  }

  store.state.errors = []
}
