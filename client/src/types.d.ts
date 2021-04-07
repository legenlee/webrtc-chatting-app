export interface RTCIceCandidateEvent extends Event {
  candidate?: RTCIceCandidate;
}

export type Message = {
  type?: "offer" | "answer" | "candidate";
  candidate?: RTCIceCandidate;
  sessionDescription: RTCSessionDescription;
};

export type Chat = {
  id: string;
  text: string;
  date: Date;
};
