// 

export const playNotificationSound = (() => {
  let audioContext;
  let audioBuffers = {};

  const initializeAudioContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const loadSound = async (url) => {
    if (!audioBuffers[url]) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers[url] = await audioContext.decodeAudioData(arrayBuffer);
    }
    return audioBuffers[url];
  };

  return (url, volume = 1) => {
    // Check if the audio context is allowed to start
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    } else if (!audioContext) {
      initializeAudioContext();
    }

    loadSound(url).then((audioBuffer) => {
      if (audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Create a gain node
        const gainNode = audioContext.createGain();
        gainNode.gain.value = volume; // Set the volume (0 to 1)

        // Connect the nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Start playing the sound
        source.start(0);
      }
    }).catch((error) => console.error(`Error loading sound: ${error}`));
  };
})();
