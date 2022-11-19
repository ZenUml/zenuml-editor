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

const onChange = debounce((code: string) => {
  store.state.activeFile.code = code
}, 250)

const activeMode = computed(() => {
  return 'javascript'
})
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
