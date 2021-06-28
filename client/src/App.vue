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
@import "@/styles/variables.scss";

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  height: 100vh;

  overflow: hidden;
  color: $black;

  &--theme-dark {
    background-color: $gray;
    color: $white;
  }
}
</style>
