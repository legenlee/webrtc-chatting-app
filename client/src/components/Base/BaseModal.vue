<template>
  <div class="base-modal" :aria-hidden="!visible">
    <div class="base-modal__mask" @click="close">
      <div class="base-modal__content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, VModel, Vue } from "vue-property-decorator";

@Component
export default class BaseModal extends Vue {
  @VModel({ type: Boolean, default: false })
  private visible!: boolean;

  @Emit("close")
  public close(...args: unknown[]) {
    return args;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.base-modal {
  @include base-style();

  &__content {
  }
}
</style>
