<script setup lang="ts">
import {Store} from '../store'
import {computed, inject, ref, Ref, VNode} from 'vue'
import {addCode, defaultDiagramName} from "../utils";

const store = inject('store') as Store

const pending = ref(false)
const pendingFilename = ref('Comp.vue')
const importMapFile = 'import-map.json'
const showImportMap = inject('import-map') as Ref<boolean>
const files = computed(() =>
    Object.entries(store.state.files)
        .filter(([name, file]) => name !== importMapFile && !file.hidden)
        .map(([name]) => name)
)

function startAddFile() {
  // let i = 0
  // let name = `Comp.vue`
  // while (true) {
  //   let hasConflict = false
  //   for (const file in store.state.files) {
  //     if (file === name) {
  //       hasConflict = true
  //       name = `Comp${++i}.vue`
  //       break
  //     }
  //   }
  //   if (!hasConflict) {
  //     break
  //   }
  // }

  pendingFilename.value = defaultDiagramName()
  pending.value = true
}

function cancelAddFile() {
  pending.value = false
}

function focus({el}: VNode) {
  ;(el as HTMLInputElement).focus()
}

function doneAddFile() {
  if (!pending.value) return
  const filename = pendingFilename.value

  // if (!/\.(vue|js|ts|css)$/.test(filename)) {
  //   store.state.errors = [
  //     `Playground only supports *.vue, *.js, *.ts, *.css files.`
  //   ]
  //   return
  // }

  if (filename in store.state.files) {
    store.state.errors = [`File "${filename}" already exists.`]
    return
  }

  store.state.errors = []
  cancelAddFile()
  store.addFile(filename)
}

const fileSel = ref(null)

function horizontalScroll(e: WheelEvent) {
  e.preventDefault()
  const el = fileSel.value! as HTMLElement
  const direction =
      Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  const distance = 30 * (direction > 0 ? 1 : -1)
  el.scrollTo({
    left: el.scrollLeft + distance
  })
}

function insertCode(param: string) {
  //todo: every time add code this way, will cause the editor scroll to the top. Should make it scroll to the inserted code.
  store.state.activeFile.code = addCode(store.state.activeFile.code, param)
}

</script>

<template>
  <div class="toolbox">
    <svg id="addNewParticipantButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('NewParticipant')"
    >
      <title>New participant</title>
      <g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <g id="Participant-Copy" stroke="#bbbfd3">
          <rect id="Rectangle" x="8.5" y="4.5" width="34" height="10" rx="3"/>
          <path d="M25.5,15 L25.5,47.5" id="Line" stroke-linecap="square" stroke-dasharray="5"/>
        </g>
      </g>
    </svg>

    <svg id="addAsyncMessageButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('A->B:message')"
    >
      <title>Async message</title>
      <g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <g id="Message-Copy">
          <path d="M40.5,5 L40.5,47" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
          <path d="M11.6315789,20 L37,20" id="Line-2" stroke="#bbbfd3" stroke-width="4" stroke-linecap="square"/>
          <path
              d="M31.9736842,13.7258398 L37.5869926,25.0263158 L26.3603759,25.0263158 L31.9736842,13.7258398 Z"
              id="Triangle" stroke="#bbbfd3" stroke-width="4"
              transform="translate(31.973684, 20.000000) rotate(90.000000) translate(-31.973684, -20.000000) "
          />
          <path d="M9.5,5 L9.5,47" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"
          />
          <rect id="Rectangle" fill="#bbbfd3" x="25" y="13" width="3" height="6"/>
          <rect id="Rectangle" fill="#bbbfd3" x="25" y="21" width="3" height="6"/>
        </g>
      </g>
    </svg>
    <svg
        id="addSyncMessageButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        @click="insertCode('A.message \n')"
    >
      <title>Sync message</title>
      <g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <g id="Execution-Copy" stroke="#bbbfd3">
          <path d="M40.5,5 L40.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"/>
          <rect id="Rectangle" fill="#bbbfd3" x="37.5" y="20.5" width="6" height="13"/>
          <path d="M11.6315789,20 L34.3684211,20" id="Line-2" stroke-width="4" stroke-linecap="square"/>
          <polygon id="Triangle" stroke-width="4" fill="#bbbfd3"
                   transform="translate(32.473684, 20.000000) rotate(90.000000) translate(-32.473684, -20.000000) "
                   points="32.4736842 15.4736842 36.4736842 24.5263158 28.4736842 24.5263158"
          />
          <path d="M9.5,5 L9.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"/>
        </g>
      </g>
    </svg>
    <svg
        id="addReturnValueButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        @click="insertCode('result = A.message \n')"
    >
      <title>Return value</title>
      <g id="Execution-Copy-4" stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <path d="M40.5,5 L40.5,47" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
        <rect id="Rectangle" stroke="#bbbfd3" fill="#bbbfd3" x="37.5" y="20.5" width="6" height="13"/>
        <path d="M11.6315789,20 L34.3684211,20" id="Line-2" stroke="#bbbfd3" stroke-width="4" stroke-linecap="square"/>
        <polygon id="Triangle" stroke="#bbbfd3" stroke-width="4" fill="#bbbfd3"
                 transform="translate(32.473684, 20.000000) rotate(90.000000) translate(-32.473684, -20.000000) "
                 points="32.4736842 15.4736842 36.4736842 24.5263158 28.4736842 24.5263158"
        />
        <path d="M9.5,5 L9.5,47" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
        <path d="M36.5,34 L17.0526316,34" id="Line" stroke="#bbbfd3" stroke-width="4" stroke-linecap="square"
              stroke-dasharray="3"/>
        <path d="M11.5,34 L18,34" id="Line-2-Copy" stroke="#bbbfd3" stroke-width="4" stroke-linecap="square"
              transform="translate(15.000000, 34.000000) rotate(-180.000000) translate(-15.000000, -34.000000) "
        />
        <g
            id="Group-Copy"
            transform="translate(19.500000, 34.000000) rotate(-180.000000) translate(-19.500000, -34.000000) translate(14.000000, 27.000000)"
        >
          <path d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z"
                id="Triangle" stroke="#bbbfd3" stroke-width="4"
                transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "
          />
          <path
              d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z"
              id="Triangle-Copy" stroke="#bbbfd3" stroke-width="4"
              transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "
          />
          <rect id="Rectangle" fill="#bbbfd3" x="0" y="0" width="3" height="6"/>
          <rect id="Rectangle" fill="#bbbfd3" x="0" y="8" width="3" height="6"/>
        </g>
      </g>
    </svg>
    <svg id="addSelfMessageButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('A.message() {\nselfMessage()\n}')"
    >
      <title>Self message</title>
      <g id="Execution-Copy-2" stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <path d="M20.5,4 L20.5,46" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
        <rect id="Rectangle" stroke="#bbbfd3" fill="#bbbfd3" x="17.5" y="24.5" width="6" height="13"/>
        <g id="Group-2" transform="translate(20.000000, 12.000000)" stroke="#bbbfd3" stroke-width="4">
          <g id="Group">
            <path d="M1,1 L23,1" id="Line-2" stroke-linecap="square"/>
            <path d="M17.0526316,12.5 L22.5,12.5" id="Line-2" stroke-linecap="square"/>
            <path d="M23,12 L23,1" id="Line-2" stroke-linecap="square"/>
            <polygon id="Triangle" fill="#bbbfd3"
                     transform="translate(10.526316, 12.000000) rotate(270.000000) translate(-10.526316, -12.000000) "
                     points="10.5263158 7.47368421 14.5263158 16.5263158 6.52631579 16.5263158"
            />
          </g>
        </g>
      </g>
    </svg>

    <svg id="addNewInstanceButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('a = new A()')"
    >
      <title>New instance</title>
      <g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <g id="Creation-Copy">
          <path d="M40.5,32 L40.5,49" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
          <path d="M11.6315789,26 L29,26" id="Line-2" stroke="#bbbfd3" stroke-width="4" fill="#bbbfd3"
                stroke-linecap="square"/>
          <polygon id="Triangle" stroke="#bbbfd3" stroke-width="4" fill="#bbbfd3"
                   transform="translate(28.526316, 26.000000) rotate(90.000000) translate(-28.526316, -26.000000) "
                   points="28.5263158 21.4736842 32.5263158 30.5263158 24.5263158 30.5263158"
          />
          <path d="M9.5,5 L9.5,47" id="Line" stroke="#bbbfd3" stroke-linecap="square" stroke-dasharray="5"/>
          <rect id="Rectangle" stroke="#bbbfd3" x="35.5" y="20.5" width="10" height="10" rx="3"/>
        </g>
      </g>
    </svg>

    <svg id="addConditionalButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('if(condition) {\n  A.method()\n}')"
    >
      <title>Conditional</title>
      <g stroke="none" stroke-width="4" fill="none" fill-rule="evenodd">
        <g id="Alt-Copy">
          <rect id="Rectangle" stroke="#bbbfd3" x="4.5" y="8.5" width="40" height="35"/>
          <path d="M5.57147686,20.9013672 L22,21" id="Line-3" stroke="#bbbfd3" stroke-linecap="square"/>
          <text id="Alt" font-family="Arial-Black, Arial Black" font-size="14" font-weight="700" fill="#bbbfd3">
            <tspan x="14" y="37">
              Alt
            </tspan>
          </text>
          <path d="M25.5,15.2006836 L22.1101562,20.9013672" id="Line-3" stroke="#bbbfd3" stroke-linecap="square"/>
          <path d="M25.5,15.2006836 L25.5,9" id="Line-4" stroke="#bbbfd3" stroke-linecap="square"/>
        </g>
      </g>
    </svg>

    <svg id="addLoopButton" width="25px" height="25px" viewBox="0 0 50 50" version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         @click="insertCode('while(condition) {\n  A.method()\n}')"
    >
      <title>Loop</title>
      <g stroke="none" strokeWidth="4" fill="none" fill-rule="evenodd">
        <g id="Loop-Copy">
          <rect id="Rectangle" stroke="#bbbfd3" x="4.5" y="8.5" width="40" height="35"/>
          <path d="M5.57147686,20.9013672 L22,21" id="Line-3" stroke="#bbbfd3" stroke-linecap="square"/>
          <text id="Loop" font-family="Arial-Black, Arial Black" font-size="14" font-weight="700" fill="#bbbfd3">
            <tspan x="6" y="37">
              Loop
            </tspan>
          </text>
          <path d="M25.5,15.2006836 L22.1101562,20.9013672" id="Line-3" stroke="#bbbfd3" stroke-linecap="square"/>
          <path d="M25.5,15.2006836 L25.5,9" id="Line-4" stroke="#bbbfd3" stroke-linecap="square"/>
        </g>
      </g>
    </svg>

    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" @click="insertCode('//Note\nA.message()')">
      <title>Note</title>
      <g>
        <path d="M26 26H3L3 8H20.2404L26 13.4493V26Z" stroke="#bbbfd3" stroke-width="2"/>
        <line x1="19" y1="9" x2="19" y2="15" stroke="#bbbfd3" stroke-width="2"/>
        <line x1="18" y1="15" x2="26" y2="15" stroke="#bbbfd3" stroke-width="2"/>
      </g>
    </svg>

  </div>
  <div
      class="file-selector"
      :class="{ 'has-import-map': showImportMap }"
      @wheel="horizontalScroll"
      ref="fileSel"
  >
    <div
        v-for="(file, i) in files"
        class="file"
        :class="{ active: store.state.activeFile.filename === file }"
        @click="store.setActive(file)"
    >
      <span class="label">{{
          file === importMapFile ? 'Import Map' : file
        }}</span>
      <span v-if="i > 0" class="remove" @click.stop="store.deleteFile(file)">
        <svg class="icon" width="12" height="12" viewBox="0 0 24 24">
          <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
          <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </div>
    <div v-if="pending" class="file pending">
      <input
          v-model="pendingFilename"
          spellcheck="false"
          @blur="doneAddFile"
          @keyup.enter="doneAddFile"
          @keyup.esc="cancelAddFile"
          @vnodeMounted="focus"
      />
    </div>
    <!--    <button class="add" @click="startAddFile">+</button>-->

    <div v-if="showImportMap" class="import-map-wrapper">
      <div
          class="file import-map"
          :class="{ active: store.state.activeFile.filename === importMapFile }"
          @click="store.setActive(importMapFile)"
      >
        <span class="label">Import Map</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbox {
  display: flex;
  place-items: center;
  height: var(--toolbox-height);
  white-space: nowrap;
  padding: 8px 20px;
}

.toolbox > svg {
  margin: 0 10px;
  stroke: red;
}

.file-selector {
  display: flex;
  box-sizing: border-box;
  border-bottom: 1px solid var(--border);
  background-color: var(--bg);
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  height: var(--header-height);
}

.file-selector::-webkit-scrollbar {
  height: 1px;
}

.file-selector::-webkit-scrollbar-track {
  background-color: var(--border);
}

.file-selector::-webkit-scrollbar-thumb {
  background-color: var(--color-branding);
}

.file-selector.has-import-map .add {
  margin-right: 10px;
}

.file {
  display: inline-block;
  font-size: 13px;
  font-family: var(--font-code);
  cursor: pointer;
  color: var(--text-light);
  box-sizing: border-box;
}

.file.active {
  color: var(--color-branding);
  border-bottom: 3px solid var(--color-branding);
  cursor: text;
}

.file span {
  display: inline-block;
  padding: 8px 10px 6px;
  line-height: 20px;
}

.file.pending input {
  width: 90px;
  height: 30px;
  line-height: 30px;
  outline: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0 0 0 10px;
  margin-top: 2px;
  margin-left: 6px;
  font-family: var(--font-code);
  font-size: 12px;
}

.file .remove {
  display: inline-block;
  vertical-align: middle;
  line-height: 12px;
  cursor: pointer;
  padding-left: 0;
}

.add {
  font-size: 18px;
  font-family: var(--font-code);
  color: #999;
  vertical-align: middle;
  margin-left: 6px;
  position: relative;
  top: -1px;
}

.add:hover {
  color: var(--color-branding);
}

.icon {
  margin-top: -1px;
}

.import-map-wrapper {
  position: sticky;
  margin-left: auto;
  top: 0;
  right: 0;
  padding-left: 30px;
  background-color: var(--bg);
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 25%
  );
}

.dark .import-map-wrapper {
  background: linear-gradient(
      90deg,
      rgba(26, 26, 26, 0) 0%,
      rgba(26, 26, 26, 1) 25%
  );
}
</style>
