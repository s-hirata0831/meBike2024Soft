import React from 'react';
import useSound from 'use-sound';
import Sound from '..sounds/Sunny.wav';

const sound : React.FC = () =>{
    const [play, { stop, pause }] = useSound(Sound);

  return (
    <div>
      <button onClick={() => play()}>Play</button>
      <button onClick={() => stop()}>Stop</button>
      <button onClick={() => pause()}>Pause</button>
    </div>
  )
}

export default sound
