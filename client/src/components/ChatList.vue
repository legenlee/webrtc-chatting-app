<template>
  <ul class="chat-list chat-page__chat-list">
    <chat-list-item v-for="(item, index) in list" :key="index" :item="item" />
  </ul>
</template>

<script lang="ts">
import { ChatModel } from "@/types";
import { Component, Prop, Vue } from "vue-property-decorator";
import ChatListItem from "./ChatListItem.vue";

@Component({
  components: {
    ChatListItem,
  },
})
export default class ChatList extends Vue {
  @Prop({ type: Array, default: () => [] })
  private readonly list!: ChatModel[];
}
</script>

<style lang="scss" scoped>
.chat-list {
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
