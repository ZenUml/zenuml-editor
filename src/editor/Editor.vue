<script setup lang="ts">
import FileSelector from './FileSelector.vue'
import CodeMirror from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import {debounce} from '../utils'
import {computed, defineComponent, inject, reactive, toRefs} from 'vue'
import {Store} from '../store'
import {Tabs, Tab} from 'vue3-tabs-component'

const store = inject('store') as Store

/**
 * Here we save a switch for auto report user code to the parent window.
 */
let autoReport = false

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
  if (autoReport) {
    // if autoReport is true, we report the code to the parent window as `get` method
    sendBack(window.top, 'get', store.state.activeFile.code)
  }
}, 250)

const activeMode = computed(() => {
  return 'javascript'
})

/**
 * Here we use `sendBack` to send message to the parent window. It will check if the parent window exists.
 * @param target the target window, should be parent window.
 * @param method the method name, should be `get` or `replace` or `autoReport`
 * @param content the content to send
 */
function sendBack(target:Window | null, method:string, content:string) {
  if (!target) return
  if (target === window) return
  target.postMessage({method, result: content}, '*')
}

/**
 * This is the message handler for the parent window. It will handle the message from the parent window.
 * @param ev event
 */
async function handle_message(ev: any) {
  const sourceWindow = ev.source
  const message = ev.data
  if (message.method === 'replace') {
    if (message.hasOwnProperty('code')) {
      store.state.activeFile.code = message.code
      sendBack(sourceWindow, message.method, 'ok')
    } else {
      sendBack(sourceWindow, message.method, 'error: missing field: code')
    }
  }

  if (message.method === 'get') {
    sendBack(sourceWindow, message.method, store.state.activeFile.code)
  }

  if (message.method === 'autoReport') {
    if (message.hasOwnProperty('enabled')) {
      autoReport = Boolean(message.enabled)
      sendBack(sourceWindow, message.method, 'ok')
    } else {
      sendBack(sourceWindow, message.method, 'error: missing field: value')
    }
  }
}

/**
 * add a event listener for the message event from parent window
 */
window.addEventListener('message', handle_message, false);

</script>

<template>
  <div>
    <Tabs :options="{ useUrlFragment: false, defaultTabHash: 'zenuml' }"
          nav-item-class="tab-item"
          :cache-lifetime=0
    >
      <Tab name="ZenUML">
        <FileSelector/>
        <div class="editor-container">
          <CodeMirror
              @change="onChange"
              :value="store.state.activeFile.code"
              :mode="activeMode"
          />
          <Message :err="store.state.errors[0]"/>
        </div>
      </Tab>
      <Tab name="Cheat sheet">
        <div label="Cheat sheet">

          <div
              data-code-wrap-id="0"
              id="htmlCodeEl"
              data-type="html"
              class="code-wrap"
              onTransitionEnd={this.updateCodeWrapCollapseStates.bind(this)}
          >
            <div class="cheat-sheet">
              <table>
                <tr>
                  <th>Feature</th>
                  <th>Sample</th>
                </tr>
                <tr>
                  <td>Participant</td>
                  <td>ParticipantA<br/>ParticipantB</td>
                </tr>
                <tr>
                  <td>Message</td>
                  <td>A.messageA()</td>
                </tr>
                <tr>
                  <td>Asyc message</td>
                  <td>Alice-&gt;Bob: How are you?</td>
                </tr>
                <tr>
                  <td>Nested message</td>
                  <td>A.messageA() {'{'}<br/>&nbsp;&nbsp;B.messageB()<br/>{'}'}</td>
                </tr>
                <tr>
                  <td class="tg-0pky">Self-message</td>
                  <td class="tg-0pky">internalMessage()</td>
                </tr>
                <tr>
                  <td>Alt</td>
                  <td>if (condition1) {'{'}<br/>&nbsp;&nbsp;A.methodA()<br/>{'}'} else if (condition2) {'{'}<br/>&nbsp;&nbsp;B.methodB()<br/>{'}'}
                    else {'{'}<br/>&nbsp;&nbsp;C.methodC()<br/>{'}'}
                  </td>
                </tr>
                <tr>
                  <td>Loop</td>
                  <td>while (condition) {'{'}<br/>&nbsp;&nbsp;A.methodA()<br/>{'}'}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<style>
.tabs-component-tabs {
  display: flex;
  place-items: center;
  justify-content: center;
  background-color: var(--bg);
  position: relative;
  height: var(--header-height);
  padding-left: 0;
  margin-bottom: 0;
  margin-top: 0;

}

.tab-item {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  list-style: none;
}

.tab-item + .tab-item {
  margin-left: 20px;
}

.tab-item .is-active {
  color: var(--color-branding);
  cursor: text;
}

.tabs-component-tab-a {
  text-decoration: none;
  color: #999;
}
</style>

<style scoped>
.editor-container {
  height: calc(100% - var(--header-height) - var(--toolbox-height));
  overflow: hidden;
  position: relative;
}

.cheat-sheet table {
  margin: auto;
  width: 100%;
}

.cheat-sheet th {
  background: #444857;
}

.cheat-sheet tr:nth-child(even) {
  background-color: #2d303a;
}

.cheat-sheet tr > td,
.cheat-sheet tr > th {
  padding: 10px 5px;
  color: #a6accd;
}
</style>
