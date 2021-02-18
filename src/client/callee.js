import { sendMessage, onMessage } from "./message.js"

(async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  document.getElementById('localAudio').srcObject = mediaStream;

  // 이후 코드는 모두 이 async 함수 안에 작성한다.
  const rtcPeerConnection = new RTCPeerConnection();
  mediaStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track));

  onMessage('SDP', async sdpOffer => {

    await rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdpOffer));

    const sdpAnswer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(sdpAnswer);

    sendMessage('SDP', sdpAnswer);
  });

  rtcPeerConnection.addEventListener('track', e => {
    document.getElementById('remoteAudio').srcObject = new MediaStream([e.track])
  });

})();