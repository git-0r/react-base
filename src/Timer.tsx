import { useEffect, useState } from 'react';
import { socket } from './socket';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState('');

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  function reverseTimer(duration: number, onCompletion: () => void) {
    let timeLeft = duration;
    const timerId = setInterval(() => {
      timeLeft--;
      setTimeLeft(formatTime(timeLeft));
      console.log(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerId);
        onCompletion();
      }
    }, 1000);
  }

  const onCompletion = () => {
    console.log('time khatam!');
  };

  useEffect(() => {
    socket.on('startTimer', () => {
      console.log('starting timer');

      reverseTimer(15, onCompletion);
    });
    // socket.on('timeOver', () => console.log('time khatam!'));
    return () => {
      socket.off();
    };
  });
  return <p>Time left: {timeLeft}</p>;
};

export default Timer;
