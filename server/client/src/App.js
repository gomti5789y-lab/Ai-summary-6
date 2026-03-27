import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    setText(res.data.text);
  };

  const getSummary = async () => {
    const res = await axios.post("http://localhost:5000/summary", { text });
    setSummary(res.data.summary);
  };

  const speak = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Document Tool</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>Extracted Text</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        cols={50}
      />

      <br />
      <button onClick={getSummary}>Generate Summary</button>
      <button onClick={speak}>Play Voice</button>

      <h3>Summary</h3>
      <p>{summary}</p>
    </div>
  );
}

export default App;
