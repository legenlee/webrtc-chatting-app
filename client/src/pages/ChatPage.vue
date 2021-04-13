<template>
  <div class="chat-page">
    <header class="header chat-page__header">
      <span class="header__inner-text">WebRTC 채팅 앱</span>
      <span class="waiting header__inner-text" v-if="disabled">
        Waiting for connection...
      </span>
    </header>
    <chat-list ref="chat-list" :list="chatModelList" />
    <chat-form v-model="chatInput" @send="sendChat" :disabled="disabled" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { io } from "socket.io-client";
import ChatList from "@/components/Chat/ChatList.vue";
import ChatForm from "@/components/Chat/ChatForm.vue";
import { ChatModel, Message, RTCIceCandidateEvent } from "@/types";

const socket = io("ws://192.168.1.3:3000");

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
  private disabled = false;
  private initiator = false;

  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;

  private chatRoomId = "";
  private chatUserId = "";
  private chatInput = "";
  private chatModelList: ChatModel[] = [];

  public created() {
    this.disabled = true;

    socket.on("room-created", this.onRoomCreated);
    socket.on("room-ready", this.createPeerConnection);
    socket.on("room-full", this.onRoomFull);
    socket.on("message", this.receiveSignaling);

    socket.emit("create-or-join", prompt("Enter a Room Id"));
  }

  private onRoomCreated(chatUserId: string, chatRoomId: string) {
    this.chatUserId = chatUserId;
    this.chatRoomId = chatRoomId;
    this.initiator = true;
  }

  private onRoomJoined(chatUserId: string, chatRoomId: string) {
    this.chatUserId = chatUserId;
    this.chatRoomId = chatRoomId;
    this.initiator = false;
  }

  private onRoomReady() {
    this.createPeerConnection();
  }

  private onRoomFull() {
    socket.emit("create-or-join", prompt("Room is full, Re-enter a Room id."));
  }

  private async receiveSignaling(message: Message) {
    switch (message.type) {
      case "offer": {
        this.peerConnection?.setRemoteDescription(message.sessionDescription);

        this.sendSignaling(
          (await this.peerConnection?.createAnswer()) as RTCSessionDescription
        );
        break;
      }

      case "answer": {
        this.peerConnection?.setRemoteDescription(message.sessionDescription);
        break;
      }

      case "candidate": {
        this.peerConnection?.addIceCandidate(
          new RTCIceCandidate(message.candidate)
        );

        this.disabled = false;
        break;
      }

      default: {
        console.log("Something went wrong... Payload: " + message);
        break;
      }
    }
  }

  private handleIceCandidate(event: RTCIceCandidateEvent) {
    const candidate = event.candidate as RTCIceCandidate;

    if (candidate) {
      socket.emit("message", {
        type: "candidate",
        candidate,
      });
    }
  }

  private async createPeerConnection() {
    try {
      this.peerConnection = new RTCPeerConnection(configuration);
      this.peerConnection.addEventListener(
        "icecandidate",
        this.handleIceCandidate
      );

      if (this.initiator) {
        this.dataChannel = this.peerConnection.createDataChannel("chat");
        this.dataChannel?.addEventListener("message", this.receiveChat);

        this.sendSignaling(
          (await this.peerConnection.createOffer()) as RTCSessionDescription
        );
      } else {
        this.peerConnection.addEventListener("datachannel", (event) => {
          this.dataChannel = event.channel;
          this.dataChannel?.addEventListener("message", this.receiveChat);
        });
      }
    } catch (e) {
      console.log(`Failed to create PeerConnection. Reason: ${e.message}`);
    }
  }

  private sendChat() {
    if (!this.dataChannel) {
      console.log("Connection has not initiated.");
      return;
    } else if (this.dataChannel.readyState === "closed") {
      console.log("Connection was lost.");
      return;
    }

    const chatModel: ChatModel = {
      id: this.chatUserId,
      text: this.chatInput,
      date: window.performance.now(),
    };

    this.dataChannel?.send(JSON.stringify({ ...chatModel, isMine: false }));
    this.insertChatModel({ ...chatModel, isMine: true });
    this.scrollDown();
  }

  private receiveChat(event: MessageEvent) {
    this.insertChatModel(JSON.parse(event.data));
    this.scrollDown();
  }

  private scrollDown() {
    this.$nextTick(() => {
      const { $el: chatItemContainer } = this.$refs["chat-list"] as Vue;
      chatItemContainer.scrollTop = chatItemContainer.scrollHeight;
    });
  }

  private insertChatModel(chatModel: ChatModel) {
    this.chatModelList = [...this.chatModelList, chatModel];
  }

  private sendSignaling(sessionDescription: RTCSessionDescription) {
    this.peerConnection?.setLocalDescription(sessionDescription);

    socket.emit("message", {
      type: sessionDescription.type,
      sessionDescription,
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.chat-page {
  margin: 0 auto;
  max-width: 500px;
  min-width: 320px;
  height: 100vh;

  display: flex;
  flex-direction: column;

  &__header {
    background-color: $primary;
    padding: 12px 16px;

    color: $white;
    font-weight: bold;

    .header__inner-text:not(:last-child) {
      margin-right: 0.3em;
    }
  }

  &__chat-list {
    padding: 8px;
    flex-grow: 1;
  }

  &__chat-form {
    padding: 8px;
    flex-shrink: 0;
  }
}
</style>
