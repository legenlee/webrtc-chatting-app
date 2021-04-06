<template>
  <div class="chat-form chat-page__chat-form">
    <textarea
      class="chat-form__textarea"
      v-model="text"
      type="text"
      @keydown.enter="test"
    />
    <button class="chat-form__button" type="button">전송</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ChatForm extends Vue {
  private text = "";

  public test(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.$emit("submit", this.text);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.chat-form {
  &__button {
    font-size: inherit;
    padding: 6px 12px;

    background-color: $primary;
    color: $white;

    &--disabled {
      background-color: $light-gray;
      color: $gray;
    }
  }
}
</style>
