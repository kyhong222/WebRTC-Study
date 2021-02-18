import { sendMessage, onMessage } from "./message.js"

(async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  document.getElementById('localAudio').srcObject = mediaStream;

  const rtcPeerConnection = new RTCPeerConnection();
  mediaStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track));

  /**
   * 이벤트리스터랑 버튼을 생성해서
   * 버튼을 누를시, destination으로의 통신을 요청하여
   * dest와 통화를 하도록 구현해야함
   * 
   * SIP.js보니까 특정 ws주소로 걸드만...
   * 미디어 릴레이 서버 키고 거따가 걸면 될거같은데?
   */

  rtcPeerConnection.addEventListener('negotiationneeded', async () => {
    const sdpOffer = await rtcPeerConnection.createOffer();

    rtcPeerConnection.setLocalDescription(sdpOffer);

    sendMessage('SDP', sdpOffer);
  })

  onMessage('SDP', sdpAnswer => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
  });

  rtcPeerConnection.addEventListener('track', e => {
    document.getElementById('remoteAudio').srcObject = new MediaStream([e.track])
  });

})();