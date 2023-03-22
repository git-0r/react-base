import { SyntheticEvent, useEffect, useState } from 'react';
import DrawingBoard from 'drawing-board/src/App';
import { socket } from './socket';
// import Timer from './Timer';

type FabricCanvas = fabric.Canvas | null;

const App = () => {
  const [canvas, setCanvas] = useState<FabricCanvas>(null);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState(true);
  const [players, setPlayers] = useState<{
    [key: string]: { username: string; isConnected: boolean; score: number };
  }>({});
  const [playerCount, setPlayerCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('');

  useEffect(() => {
    function onConnect() {
      console.log('connected');
    }

    function onDisconnect(reason: string) {
      console.log('dis-connected', reason);
    }

    const canvasUpdate = (data: fabric.Object) => {
      console.log(canvas);

      if (!canvas) return;
      console.log('canvas update received!', data);
      canvas?.loadFromJSON(data, () => canvas.renderAll());
      canvas.isDrawingMode = false;
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('canvasUpdate', canvasUpdate);
    socket.on('playersData', data => {
      console.log(data);
      setPlayers(data.players);
      setPlayerCount(data.count);
    });
    socket.on('playerAdded', () => setForm(false));
    socket.on('start', playerUsername => {
      if (playerUsername === username) {
        setIsPlaying(true);
        setCurrentPlayer('');
      } else {
        setCurrentPlayer(`${playerUsername}'s turn`);
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off();
    };
  }, [canvas, username]);

  const onCanvasUpdate = (canvas: FabricCanvas) => {
    if (!canvas) return;
    console.log('canvas update sent!', canvas);
    socket.emit('canvasUpdate', JSON.stringify(canvas));
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (username?.length < 5)
      setError('username should be minimum 5 charater long!');
    if (typeof username !== 'string') setError('username should be a string');
    if (!error) socket.emit('newPlayer', username);
  };

  const handleChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setUsername(target.value);
  };

  if (!form && playerCount < 2) {
    return <p>waiting for more people to join.</p>;
  }

  return form ? (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>username</label>
        <input
          type='text'
          required
          minLength={5}
          id='username'
          name='username'
          placeholder='enter your username'
          onChange={handleChange}
        />
        <button>Enter</button>
      </form>
    </div>
  ) : (
    <div>
      <DrawingBoard
        canvas={canvas}
        setCanvas={setCanvas}
        onCanvasUpdate={onCanvasUpdate}
        controls={isPlaying}
      />
      {currentPlayer && <p>{currentPlayer}</p>}
      {/* <Timer /> */}
      <ul>
        {Object.keys(players)?.map(id =>
          players[id].isConnected ? (
            <li key={id}>
              <p>
                {players[id].username} {players[id].score}
              </p>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default App;
