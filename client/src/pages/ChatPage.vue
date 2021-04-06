<template>
  <div class="chat-page">
    <chat-list />
    <chat-form />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ChatList from "@/components/ChatList.vue";
import ChatForm from "@/components/ChatForm.vue";

/*global RTCConfiguration */
const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

@Component({
  components: {
    ChatList,
    ChatForm,
  },
})
export default class ChatPage extends Vue {
  @Prop({ type: Boolean, default: false })
  private loading!: boolean;

  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;

  public mounted() {
    this.startWebRTC();
  }

  public startWebRTC(isOfferer = false) {
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (event: any) => {
      //
    };
  }
}
</script>

<style lang="scss" scoped></style>
