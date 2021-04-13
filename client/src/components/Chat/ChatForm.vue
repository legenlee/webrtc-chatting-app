<template>
  <div class="chat-form chat-page__chat-form">
    <textarea
      class="chat-form__textarea"
      :class="{
        'chat-form__textarea--disabled': disabled,
      }"
      v-model="chatInput"
      type="text"
      rows="3"
      :disabled="disabled"
      @keydown.enter="beforeSend"
    />

    <button
      class="chat-form__button"
      :class="{
        'chat-form__button--disabled': disabled,
      }"
      type="button"
      :disabled="disabled"
      @click="send"
    >
      전송
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class ChatForm extends Vue {
  @VModel({ type: String, default: "" })
  private chatInput!: string;

  @Prop({ type: Boolean, default: false })
  private disabled!: boolean;

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

    &--disabled {
      cursor: not-allowed;
    }
  }

  &__button {
    flex-shrink: 0;
    font-size: inherit;

    border: none;
    border-radius: 2px;
    padding: 6px 24px;

    background-color: $primary;
    color: $white;
    cursor: pointer;

    &--disabled {
      background-color: $light-gray;
      color: $white;
      cursor: not-allowed;
    }
  }
}
</style>
