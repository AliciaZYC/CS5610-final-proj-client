import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaTrash } from "react-icons/fa";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  title: string;
  points: number;
  questionText: string;
  choices: Answer[];
}

interface Props {
  onSave: (question: Question) => void;
  onCancel: () => void;
}

function MultipleChoiceEditor({ onSave, onCancel }: Props) {
  const [question, setQuestion] = useState<Question>({
    title: "",
    points: 1,
    questionText: "",
    choices: [{ text: "", isCorrect: true }],
  });

  const handleAddChoice = () => {
    setQuestion({
      ...question,
      choices: [...question.choices, { text: "", isCorrect: false }],
    });
  };

  const handleChoiceChange = (index: number, text: string) => {
    const newChoices = question.choices.map((choice, i) => {
      if (i === index) return { ...choice, text };
      return choice;
    });
    setQuestion({ ...question, choices: newChoices });
  };

  const handleChoiceCorrectChange = (index: number) => {
    const newChoices = question.choices.map((choice, i) => {
      return { ...choice, isCorrect: i === index };
    });
    setQuestion({ ...question, choices: newChoices });
  };

  const handleRemoveChoice = (index: number) => {
    const newChoices = question.choices.filter((_, i) => i !== index);
    setQuestion({ ...question, choices: newChoices });
  };

  return (
    <div className="my-4">
      {/* Title and Points Section */}
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

      {/* Question Text Section */}
      <h5>Question:</h5>
      <ReactQuill
        theme="snow"
        value={question.questionText}
        onChange={(value) => setQuestion({ ...question, questionText: value })}
        style={{ marginBottom: "20px" }}
      />

      {/* Answers Section */}
      <h5>Answers:</h5>
      {question.choices.map((choice, index) => (
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
          <input
            type="radio"
            name="correctAnswer"
            checked={choice.isCorrect}
            onChange={() => handleChoiceCorrectChange(index)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            value={choice.text}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
            className="form-control"
            style={{ flex: "1", marginRight: "10px" }}
          />
          {question.choices.length > 1 && (
            <button
              onClick={() => handleRemoveChoice(index)}
              className="btn btn-link text-danger"
            >
              <FaTrash />
            </button>
          )}
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
        <button className="btn btn-secondary" onClick={handleAddChoice}>
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

export default MultipleChoiceEditor;
