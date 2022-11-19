<template>
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
        <td>A.messageA() {<br/>&nbsp;&nbsp;B.messageB()<br/>}</td>
      </tr>
      <tr>
        <td class="tg-0pky">Self-message</td>
        <td class="tg-0pky">internalMessage()</td>
      </tr>
      <tr>
        <td>Alt</td>
        <td>if (condition1) {<br/>&nbsp;&nbsp;A.methodA()<br/>} else if (condition2) {<br/>&nbsp;&nbsp;B.methodB()<br/>}
          else {<br/>&nbsp;&nbsp;C.methodC()<br/>}
        </td>
      </tr>
      <tr>
        <td>Loop</td>
        <td>while (condition) {<br/>&nbsp;&nbsp;A.methodA()<br/>}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">



</script>

<style scoped>

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
  padding: 10px 15px;
  color: #a6accd;
}
</style>
