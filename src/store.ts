import { version, reactive } from 'vue'
import * as defaultCompiler from 'vue/compiler-sfc'
import { utoa, atou, defaultDiagramName } from './utils'
import {
  SFCScriptCompileOptions,
  SFCAsyncStyleCompileOptions,
  SFCTemplateCompileOptions
} from 'vue/compiler-sfc'

const defaultMainFile = defaultDiagramName()

const welcomeCode = `
// An example for a RESTful endpoint<br>
// Go to the "Cheat sheet" tab or https://docs.zenuml.com
// to find all syntax<br>
// \`POST /v1/book/{id}/borrow\`
BookLibService.Borrow(id) {
  User = Session.GetUser()
  if(User.isActive) {
    try {
      BookRepository.Update(id, onLoan, User)
      receipt = new Receipt(id, dueDate)
    } catch (BookNotFoundException) {
      ErrorService.onException(BookNotFoundException)
    } finally {
      Connection.close()
    }
  }
  return receipt
}

result = A.message {
}
a = new A()
//Note
A.message()
`.trim()

export class File {
  filename: string
  code: string
  hidden: boolean
  compiled = {
    js: '',
    css: '',
    ssr: ''
  }

  constructor(filename: string, code = '', hidden = false) {
    this.filename = filename
    this.code = code
    this.hidden = hidden
  }
}

export interface StoreState {
  mainFile: string
  files: Record<string, File>
  activeFile: File
  errors: (string | Error)[]
  vueRuntimeURL: string
  vueServerRendererURL: string
  // used to force reset the sandbox
  resetFlip: boolean
}

export interface SFCOptions {
  script?: Omit<SFCScriptCompileOptions, 'id'>
  style?: SFCAsyncStyleCompileOptions
  template?: SFCTemplateCompileOptions
}

export interface Store {
  state: StoreState
  options?: SFCOptions
  compiler: typeof defaultCompiler
  vueVersion?: string
  init: () => void
  setActive: (filename: string) => void
  addFile: (filename: string | File) => void
  deleteFile: (filename: string) => void
  getImportMap: () => any
  initialShowOutput: boolean
}

export interface StoreOptions {
  serializedState?: string
  showOutput?: boolean
  defaultVueRuntimeURL?: string
  defaultVueServerRendererURL?: string
}

export class ReplStore implements Store {
  state: StoreState
  compiler = defaultCompiler
  vueVersion?: string
  options?: SFCOptions
  initialShowOutput: boolean

  private defaultVueRuntimeURL: string
  private defaultVueServerRendererURL: string
  constructor({
    serializedState = '',
    defaultVueRuntimeURL = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`,
    defaultVueServerRendererURL = `https://unpkg.com/@vue/server-renderer@${version}/dist/server-renderer.esm-browser.js`,
    showOutput = false,
  }: StoreOptions = {}) {
    let files: StoreState['files'] = {}

    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename in saved) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      files = {
        [defaultMainFile]: new File(defaultMainFile, welcomeCode)
      }
    }

    this.defaultVueRuntimeURL = defaultVueRuntimeURL
    this.defaultVueServerRendererURL = defaultVueServerRendererURL
    this.initialShowOutput = showOutput

    let mainFile = defaultMainFile
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }
    this.state = reactive({
      mainFile,
      files,
      activeFile: files[mainFile],
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL,
      vueServerRendererURL: this.defaultVueServerRendererURL,
      resetFlip: true
    })

    this.initImportMap()
  }

  init() { }

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename]
  }

  addFile(fileOrFilename: string | File): void {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    this.state.files[file.filename] = file
    if (!file.hidden) this.setActive(file.filename)
  }

  deleteFile(filename: string) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      if (this.state.activeFile.filename === filename) {
        this.state.activeFile = this.state.files[this.state.mainFile]
      }
      delete this.state.files[filename]
    }
  }

  serialize() {
    return '#' + utoa(JSON.stringify(this.getFiles()))
  }

  getFiles() {
    const exported: Record<string, string> = {}
    for (const filename in this.state.files) {
      exported[filename] = this.state.files[filename].code
    }
    return exported
  }
  private initImportMap() {
    // const map = this.state.files['import-map.json']
    // if (!map) {
    //   this.state.files['import-map.json'] = new File(
    //     'import-map.json',
    //     JSON.stringify(
    //       {
    //         imports: {
    //           vue: this.defaultVueRuntimeURL
    //         }
    //       },
    //       null,
    //       2
    //     )
    //   )
    // } else {
    //   try {
    //     const json = JSON.parse(map.code)
    //     if (!json.imports.vue) {
    //       json.imports.vue = this.defaultVueRuntimeURL
    //       map.code = JSON.stringify(json, null, 2)
    //     }
    //     if (!json.imports['vue/server-renderer']) {
    //       json.imports['vue/server-renderer'] = this.defaultVueServerRendererURL
    //       map.code = JSON.stringify(json, null, 2)
    //     }
    //   } catch (e) {}
    // }
  }

  getImportMap() {
  //   try {
  //     return JSON.parse(this.state.files['import-map.json'].code)
  //   } catch (e) {
  //     this.state.errors = [
  //       `Syntax error in import-map.json: ${(e as Error).message}`
  //     ]
  //     return {}
  //   }
  }

}
