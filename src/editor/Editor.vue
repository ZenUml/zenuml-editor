<script setup lang="ts">
import CodeMirror from '../codemirror/CodeMirror.vue'
import Message from '../Message.vue'
import {debounce} from '../utils'
import {computed, inject} from 'vue'
import {Store} from '../store'
import {Tabs, Tab} from 'vue3-tabs-component';
import ToolBox from "./ToolBox.vue";
import CheatSheet from "./CheatSheet.vue";

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

  if (message.method === 'theme') {
    if (message.hasOwnProperty('theme')) {
      store.state.theme = message.theme
      sendBack(sourceWindow, message.method, 'ok')
    } else {
      sendBack(sourceWindow, message.method, 'error: missing field: theme')
    }
  }

  if (message.method === 'png') {
    const iframe = document.querySelector('iframe')
    if (iframe) {
      iframe.contentWindow?.postMessage({action: 'get_png'}, '*')
    }
  }

  if (parent && message.action && message.action === 'cmd_png') {
    sendBack(parent, 'png', message.png)
  }
  
  if (parent && message.action && message.action === 'cmd_error') {
    sendBack(parent, 'error', JSON.stringify({message:message.message, stack:message.stack}))
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
        <ToolBox />
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
        <CheatSheet />
      </Tab>
    </Tabs>
  </div>
</template>

<style>
.tabs-component-panel {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
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

</style>
