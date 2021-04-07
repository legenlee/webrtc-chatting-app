<template>
  <div class="chat-form chat-page__chat-form">
    <textarea
      class="chat-form__textarea"
      v-model="chatInput"
      type="text"
      rows="3"
      @keydown.enter="beforeSend"
    />
    <button class="chat-form__button" type="button" @click="send">전송</button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, VModel, Vue } from "vue-property-decorator";

@Component
export default class ChatForm extends Vue {
  @VModel({ type: String, default: "" })
  private chatInput!: string;

  public send() {
    if (this.chatInput) {
      this.$emit("send", this.chatInput);
      this.chatInput = "";
    }
  }

  public beforeSend(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.chat-form {
  display: flex;
  flex-direction: row;
  gap: 8px;

  &__textarea {
    flex-grow: 1;
    padding: 12px 8px;

    resize: none;
    font-family: inherit;
    overflow: hidden;
  }

  &__button {
    flex-shrink: 0;
    font-size: inherit;

    border: none;
    border-radius: 2px;
    padding: 6px 24px;

    background-color: $primary;
    color: $white;

    &--disabled {
      background-color: $light-gray;
      color: $gray;
    }
  }
}
</style>
