import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]); /*changed*/
  const [quizQs, setQuizQs] = useState([]);
  const [quizAns, setQuizAns] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSection, setLoadingSection] = useState("");
  // const [activeFile, setActiveFile] = useState("");


  const [uploadedFiles, setUploadedFiles] = useState([]); /*new*/
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("uploaded_files")) || [];
    setUploadedFiles(saved);
  }, []);


  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);


  const handleFileUpload = async () => { /*new*/
    if (!file) return setError("Please select a file.");
    setLoadingSection("upload");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API}/upload`, formData);
      setSummary(res.data.summary);
      setError(null);

      // Save to local storage
      const newEntry = { name: file.name, date: new Date().toISOString() };
      const updatedFiles = [newEntry, ...uploadedFiles.filter(f => f.name !== file.name)];
      localStorage.setItem("uploaded_files", JSON.stringify(updatedFiles));
      setUploadedFiles(updatedFiles);

    } catch (err) {
      setError("Failed to upload document.");
    } finally {
      setLoadingSection("");
    }
  };

  const handleReupload = async (fileName) => {
    setError("Original file content not stored. Please reselect the file manually.");
  };

  const handleDeleteFile = (name) => {
    const filtered = uploadedFiles.filter(f => f.name !== name);
    setUploadedFiles(filtered);
    localStorage.setItem("uploaded_files", JSON.stringify(filtered));
  };

  const handleResetUploads = () => {
    localStorage.removeItem("uploaded_files");
    setUploadedFiles([]);
  }; /*new*/


  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoadingSection("ask");
    try {
      const res = await axios.post(`${API}/ask`, {
        question,
        session_id: sessionId, // <-- add this line
      });
      setQaHistory((prev) => [
        ...prev,
        {
          question,
          answer: res.data.answer,
        },
      ]);
      setError(null);
      setQuestion("");
    } catch (err) {
      setError("Failed to fetch answer.");
    } finally {
      setLoadingSection("");
    }
  };



  const generateQuiz = async () => {
    setLoadingSection("quiz");
    try {
      const res = await axios.post(`${API}/quiz/generate`);
      setQuizQs(res.data.questions);
      setQuizAns(new Array(res.data.questions.length).fill(""));
      setFeedback([]);
      setError(null);
    } catch (err) {
      setError("Quiz generation failed.");
    } finally {
      setLoadingSection("");
    }
  };


  const evaluateQuiz = async () => {
    setLoadingSection("quiz");
    try {
      const questionTexts = quizQs.map(q => (typeof q === "string" ? q : q.question));
      const res = await axios.post(`${API}/quiz/evaluate`, {
        questions: questionTexts,
        answers: quizAns,
      });
      setFeedback(res.data.feedback);
      setError(null);
    } catch (err) {
      setError("Quiz evaluation failed.");
    } finally {
      setLoadingSection("");
    }
  };
  

  return (
    <div className="container">
      <h1 className="brand-title">SmartDoc Assistant</h1>
      <p className="subtitle">Understand. Query. Learn — from any document.</p>


      {error && <p className="error">❌ {error}</p>}

      <div className="card">
        <h2>Upload Document (.pdf / .txt)</h2>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleFileUpload}>Upload</button>
        {loadingSection === "upload" && <p className="info">⏳ Uploading...</p>}
        {summary && (
          <div className="highlight-box">
            <h4>Auto Summary</h4>
            <p
              className="highlighted-text"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        )}
        {uploadedFiles.length > 0 && ( /*new*/
          <div className="stored-files">
            <h4>Previously Uploaded</h4>
            <ul>
              {uploadedFiles.map((f, i) => (
                <li key={i}>
                  <span>{f.name}</span>
                  <button onClick={() => handleReupload(f.name)}>📂</button>
                  <button onClick={() => handleDeleteFile(f.name)}>❌</button>
                </li>
              ))}
            </ul>
            <button onClick={handleResetUploads} className="reset-button-small">Clear All</button>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Ask Anything</h2>
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="button-row">
          <button onClick={askQuestion}>Ask</button>
          <button
            className="reset-button"
            disabled={qaHistory.length === 0}
            onClick={() => { /*changed*/
              localStorage.removeItem("session_id");
              setQaHistory([]); // Clear Q&A history
            }}
          >
            🔄 Reset
          </button>

        </div>
        {loadingSection === "ask" && <p className="info">⏳ Thinking...</p>}

        {qaHistory.length > 0 && ( /*changed*/
          <div className="qa-history">
            <h4>Previous Answers</h4>
            {qaHistory.map((qa, i) => (
              <div key={i} className="qa-item">
                <p><strong>Q{i + 1}:</strong> {qa.question}</p>
                <pre>{qa.answer}</pre>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="card">
        <h2>Challenge Me</h2>
        <button onClick={generateQuiz}>Generate Questions</button>
        {quizQs.length > 0 && (
          <div>
            {quizQs.map((qObj, i) => (
              <div key={i} className="quiz-question">
                <p><b>Q{i + 1}:</b> {qObj.question}</p>
                {qObj.options && Array.isArray(qObj.options) ? (
                  <div className="options">
                    {qObj.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={`q-${i}`}
                          value={opt}
                          checked={quizAns[i] === opt}
                          onChange={() => {
                            const updated = [...quizAns];
                            updated[i] = opt;
                            setQuizAns(updated);
                          }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows="3"
                    value={quizAns[i]}
                    onChange={(e) => {
                      const updated = [...quizAns];
                      updated[i] = e.target.value;
                      setQuizAns(updated);
                    }}
                  />
                )}
              </div>
            ))}

            <button onClick={evaluateQuiz}>Submit Answers</button>
          </div>
        )}
        {loadingSection === "quiz" && <p className="info">⏳ Evaluating...</p>}
        {feedback.length > 0 && (
          <div>
            <h4>Feedback</h4>
            {feedback.map((f, i) => (
              <pre key={i}>{f}</pre>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
