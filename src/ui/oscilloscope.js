export function drawOscilloscope(analyserNode) {
    const canvas = document.getElementById('oscilloscope');
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyserNode.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    let animationId = null;
  
    function draw() {
      animationId = requestAnimationFrame(draw);
  
      analyserNode.getByteTimeDomainData(dataArray);
  
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
  
      // canvasCtx.fillStyle = '#343a40';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = '#fff';
      canvasCtx.beginPath();
  
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
  
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
  
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }
  
    draw();
  
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }