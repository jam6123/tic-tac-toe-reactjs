import { useEffect, useState } from "react"

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

type Player = "X" | "O";
type Box = Player | null;
type Winner = Player | "Draw" | "";

const initialBoxes = Array.from<Box>({ length: 9}).fill(null);
const randomizePlayer = (): Player => {
  const players: ["X", "O"] = ["X", "O"];
  const initialPlayer = players[Math.round(Math.random())];

  return initialPlayer;
}

function App() {
  const [boxes, setBoxes] = useState(initialBoxes);
  const [player, setPlayer] = useState<Player>(randomizePlayer());
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [history, setHistory] = useState<Array<(Box)[]>>([]);
  const [winner, setWinner] = useState<Winner>("");

  function changePlayer() {
    if(player === "X") {
      setPlayer("O");
    }else {
      setPlayer("X");
    }
  }

  function saveStep() {
    setHistory(prev => {
      return [...prev, boxes];
    })
  }

  function undo() {
    if(history.length === 0 || winner) return;

    changePlayer();
    setBoxes(history[history.length - 1]);

    const historyCopy = [...history]
    historyCopy.pop();
    setHistory(historyCopy);
  }

  function mark(index: number) {
    if(boxes[index] !== null || winner) return;
    
    saveStep();
    changePlayer();
    
    const boxesCopy = [...boxes];
    boxesCopy[index] = player;

    setBoxes(boxesCopy);
  }

  function restart() {
    setBoxes(initialBoxes);
    setPlayer(randomizePlayer());
    setWinningLine([]);
    setHistory([]);
    setWinner("");
  }

  function checkWinner() {
    const result = winningLines.find(arr => {
      const value = new Set(arr.map(num => boxes[num]));
      return value.size === 1 && [...value][0] != null;
    });
    
    if(result) {
      setWinningLine(result);
      setWinner(boxes[result[0]]!);
    
      // if all box is marked
    }else if(!boxes.includes(null)) {
      setWinner("Draw");
    }
  }

  useEffect(() => {
    checkWinner();

  }, [boxes]);

  return (
    <>
      <h1>Winner: {winner}</h1>
      <div className="board">
        {boxes.map((value, index) => {
          return (
            <button 
              key={index} 
              className="box"
              onClick={() => mark(index)}
              style={{
                backgroundColor: `${winningLine.includes(index) ? "green" : "white"}`
              }}
            >
              {value}
            </button>
          )
        })}
      </div>
      <button onClick={undo} disabled={winner !== ""}>Undo</button>
      <button onClick={restart}>Restart</button>
    </>
  )
}

export default App
