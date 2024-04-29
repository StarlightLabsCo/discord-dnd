export function setupBufferedPlayerProcessor() {
    const processorCode = `
          // Incorporate RingBuffer inside the AudioWorkletProcessor
          class RingBuffer {
            constructor(length) {
              this.buffer = new Float32Array(length);
              this.writePointer = 0;
              this.readPointer = 0;
              this.availableData = 0;
            }

            push(data) {
              for (let i = 0; i < data.length; i++) {
                let sample = data[i];
                if (this.availableData >= this.buffer.length) return; // Buffer full
                this.buffer[this.writePointer] = sample;
                this.writePointer = (this.writePointer + 1) % this.buffer.length;
                this.availableData++;
              }
            }

            pull(amount) {
              let output = new Float32Array(amount);
              for (let i = 0; i < amount; i++) {
                if (this.availableData <= 0) {
                  output.set(new Float32Array(amount - i), i); // Fill the rest with zeros
                  break;
                }
                output[i] = this.buffer[this.readPointer];
                this.readPointer = (this.readPointer + 1) % this.buffer.length;
                this.availableData--;
              }
              return output;
            }

            clear() {
              this.writePointer = 0;
              this.readPointer = 0;
              this.availableData = 0;
              this.buffer = new Float32Array(this.buffer.length);
            }
          }

          class BufferedPlayerProcessor extends AudioWorkletProcessor {
              constructor() {
                  super();
                  this.ringBuffer = new RingBuffer(44100 * 300); // 5 minutes of audio
                  this.port.onmessage = event => {
                      if (event.data.push) {
                        this.ringBuffer.push(event.data.push);
                      } else if (event.data.clear) {
                        this.clearBuffer();
                      }
                  };
              }

              process(inputs, outputs) {
                  const output = outputs[0];
                  const outputChannel = output[0];
                  outputChannel.set(this.ringBuffer.pull(outputChannel.length));
                  return true;
              }

              clearBuffer() {
                this.ringBuffer.clear();
              }
          }

          registerProcessor('buffered-player-processor', BufferedPlayerProcessor);
          `;

    const blob = new Blob([processorCode], {
        type: "application/javascript",
    });
    const blobURL = URL.createObjectURL(blob);

    return blobURL;
}

export function clearBufferedPlayerNodeBuffer(
    bufferedPlayerNode: AudioWorkletNode | null
) {
    if (bufferedPlayerNode === null) {
        console.log("bufferedPlayerNode is null");
        return;
    }

    bufferedPlayerNode.port.postMessage({ clear: true });
}

export function bufferBase64Audio(
    audioContext: AudioContext,
    bufferedPlayerNode: AudioWorkletNode,
    audioBase64: string
) {
    audioContext.resume();

    const audioBytes = base64ToUint8Array(audioBase64);
    const audioFloat32Array = uint8ArrayToFloat32Array(audioBytes);

    bufferedPlayerNode.port.postMessage({ push: audioFloat32Array });
}

// Util functions
export function base64ToUint8Array(base64: string) {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function uint8ArrayToFloat32Array(u8a: Uint8Array) {
    const numSamples = u8a.length / 2; // because 16-bit samples
    const f32Array = new Float32Array(numSamples);
    let ptr = 0;

    for (let i = 0; i < numSamples; i++) {
        // Convert 2 bytes to a 16-bit signed integer
        const sample = (u8a[ptr + 1] << 8) | u8a[ptr];
        ptr += 2;

        // Normalize to [-1, 1]
        f32Array[i] =
            sample < 0x8000 ? sample / 0x8000 : (sample - 0x10000) / 0x8000;
    }

    return f32Array;
}
