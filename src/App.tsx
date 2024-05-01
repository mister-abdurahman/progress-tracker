import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const fetchInProgress = useRef(false);
  const [data, setData] = useState(localStorage.getItem("importData") || []);
  const [fetchError, setFetchError] = useState<unknown>(null);
  const [runningImport, setRunningImport] = useState(true);
  const [intervalId, setIntervalId] = useState<any>(null);

  useEffect(() => {
    let countdownInterval: any;
    if (runningImport) {
      startCount(countdownInterval);
    } else {
      clearInterval(countdownInterval);
      setIntervalId(null);
    }

    return () => {
      setIntervalId(null);
      clearInterval(countdownInterval);
    };
  }, [runningImport]);

  useEffect(() => {
    if (!fetchInProgress.current && count === 30) {
      fetchInProgress.current = true;
      // importData();
      setTimeout(importData, 2000);
    }
  }, [count]);

  useEffect(() => {
    if (!fetchInProgress.current && count === 30) {
      fetchInProgress.current = true;
      // importData();
      setTimeout(importData, 2000);
    }
  }, [count]);

  const startCount = (countdownInterval: any) => {
    let counter = 0;
    countdownInterval = setInterval(() => {
      counter++;
      // count.current = counter;
      setCount(counter);
      setIntervalId(countdownInterval);

      if (counter >= 100) {
        localStorage.setItem("importData", JSON.stringify(data));
        clearInterval(countdownInterval);
        setIntervalId(null);
      }
    }, 100);
  };

  async function importData() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const fetchedData = await response.json();
      setData(fetchedData);
      console.log("ran");
    } catch (error) {
      setFetchError(error);
    }
  }

  function cancelImport() {
    clearInterval(intervalId);
    setRunningImport(false);
  }

  function restartImport() {
    setRunningImport(true);
  }

  return (
    <div className="App">
      <h1>Progress App</h1>
      <progress id="progress" value={count} max={100}></progress>
      <div className="card">
        <span>{count}%</span>
        {count > 0 && count < 100 && (
          <span style={{ marginLeft: ".5rem" }}>(In Progess)</span>
        )}
        <div>
          {count < 99 && <button onClick={cancelImport}>Cancel Import</button>}
          {!runningImport && (
            <button onClick={restartImport}>Restart Import</button>
          )}
        </div>
      </div>
      <div>
        {count === 100 && (
          <span>{data.length > 1 ? "Import Completed" : "Import failed"}</span>
        )}
        {fetchError ? <span>Error occured while Importing</span> : null}
      </div>

      {count === 100 && data.length > 1 ? (
        <div
          style={{
            border: "1rem",
            backgroundColor: "white",
            color: "black",
            marginTop: "1rem",
            borderRadius: "1.25rem",
            padding: ".2rem",
          }}
        >
          {data.map((item: { title: string; completed: boolean }, key) => (
            <span key={key}>
              {item.title} ({item.completed})
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
