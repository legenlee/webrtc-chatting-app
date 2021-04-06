<template>
  <div class="app">
    <chat-page />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ChatPage from "@/pages/ChatPage.vue";

@Component({
  components: {
    ChatPage,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
