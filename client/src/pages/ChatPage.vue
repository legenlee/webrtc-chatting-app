<template>
  <div class="chat-page">
    <chat-list />
    <chat-form />

    <div v-for="(text, index) in chatTextList" :key="index">{{ text }}</div>
    <button @click="sendChat">asd</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { io } from "socket.io-client";
import ChatList from "@/components/ChatList.vue";
import ChatForm from "@/components/ChatForm.vue";
import { Message, RTCIceCandidateEvent } from "@/types";

const socket = io("ws://192.168.1.3:3000");
// const socket = io();

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

  private initiator = false;

  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;

  public chatInput = "asdf";
  public chatTextList: string[] = [];

  public created() {
    socket.on("room-created", this.onRoomCreated);
    socket.on("room-ready", this.createPeerConnection);
    socket.on("room-full", this.onRoomFull);
    socket.on("message", this.receiveSignaling);

    socket.emit("create-or-join", prompt("방 이름"));
  }

  private onRoomCreated() {
    this.initiator = true;
  }

  private onRoomJoined() {
    this.initiator = false;
  }

  private onRoomReady() {
    this.createPeerConnection();
  }

  private onRoomFull() {
    //
  }

  private async receiveSignaling(message: Message) {
    switch (message.type) {
      case "offer": {
        this.peerConnection?.setRemoteDescription(message.sessionDescription);

        const description = (await this.peerConnection?.createAnswer()) as RTCSessionDescription;
        this.sendSignaling(description);
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
    console.log(this.initiator);

    try {
      this.peerConnection = new RTCPeerConnection(configuration);
      this.peerConnection.addEventListener(
        "icecandidate",
        this.handleIceCandidate
      );

      if (this.initiator) {
        this.dataChannel = this.peerConnection.createDataChannel("chat");
        this.dataChannel?.addEventListener("message", this.receiveChat);

        const description = (await this.peerConnection.createOffer()) as RTCSessionDescription;
        this.sendSignaling(description);
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

    this.dataChannel?.send("asdf");
  }

  private receiveChat(event: MessageEvent) {
    this.chatTextList = [...this.chatTextList, event.data];
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

<style lang="scss" scoped></style>
