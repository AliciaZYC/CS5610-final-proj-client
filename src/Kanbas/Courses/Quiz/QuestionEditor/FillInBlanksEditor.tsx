import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaTrash } from "react-icons/fa";

interface FillInBlanksEditorProps {
  onSave: (questionData: any) => void;
  onCancel: () => void;
}

interface Answer {
  text: string;
}

interface QuestionData {
  title: string;
  points: number;
  questionText: string;
  correctAnswers: Answer[];
}

function FillInBlanksEditor({ onSave, onCancel }: FillInBlanksEditorProps) {
  const [question, setQuestion] = useState<QuestionData>({
    title: "",
    points: 1,
    questionText: "",
    correctAnswers: [{ text: "" }],
  });

  const handleAnswerChange = (index: number, value: string) => {
    let newAnswers = question.correctAnswers.map((answer, i) => {
      if (i === index) {
        return { ...answer, text: value };
      }
      return answer;
    });
    setQuestion({ ...question, correctAnswers: newAnswers });
  };

  const addAnswer = () => {
    setQuestion({
      ...question,
      correctAnswers: [...question.correctAnswers, { text: "" }],
    });
  };

  const removeAnswer = (index: number) => {
    let newAnswers = question.correctAnswers.filter((_, i) => i !== index);
    setQuestion({ ...question, correctAnswers: newAnswers });
  };

  return (
    <div className="my-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Question Title"
          value={question.title}
          onChange={(e) => setQuestion({ ...question, title: e.target.value })}
          style={{ maxWidth: "60%" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "10px" }}>Points:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Points"
            value={question.points}
            onChange={(e) =>
              setQuestion({ ...question, points: parseInt(e.target.value, 10) })
            }
            style={{ maxWidth: "80px" }}
          />
        </div>
      </div>
      <h4>Question:</h4>
      <ReactQuill
        theme="snow"
        value={question.questionText}
        onChange={(value) => setQuestion({ ...question, questionText: value })}
        style={{ marginBottom: "20px" }}
      />
      {question.correctAnswers.map((answer, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <span>Possible Answer:</span>
          <input
            type="text"
            className="form-control"
            placeholder="Correct Answer"
            value={answer.text}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
          <br />
          <button
            onClick={() => removeAnswer(index)}
            className="btn btn-link text-danger"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button className="btn btn-secondary" onClick={addAnswer}>
          Add Answer
        </button>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => onSave(question)}
          >
            Save
          </button>
          <button className="btn btn-danger" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FillInBlanksEditor;
