<template>
  <li class="chat-item-wrapper">
    <div class="chat-item chat-list__item" :class="chatItemClass">
      <div class="chat-item__text">{{ item.text }}</div>
    </div>
  </li>
</template>

<script lang="ts">
import { ChatModel } from "@/types";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ChatListItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({ id: "", text: "", date: Date.now() }),
  })
  private item!: ChatModel;

  private get chatItemClass() {
    return {
      "chat-item--mine": this.item.isMine,
      "chat-item--not-mine": !this.item.isMine,
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.chat-item-wrapper {
  display: flex;
  flex-direction: row;

  margin-bottom: 10px;
}

.chat-item {
  max-width: 100%;

  border-radius: 2px;
  padding: 8px;

  box-shadow: 0px 2px 2px 2px rgba($black, 0.2);

  &--not-mine {
    //
  }

  &--mine {
    background-color: $primary;
    margin-left: auto;
  }

  &__text {
    white-space: pre-wrap;
  }
}
</style>
