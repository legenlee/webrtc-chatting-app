<template>
  <div class="modal">
    <div class="modal__mask">
      <div class="modal__content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class ChatJoinRoomModal extends Vue {}
</script>

<style lang="scss" scoped>
.room-join-modal {
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
