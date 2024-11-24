import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaTrash } from "react-icons/fa";

interface Answer {
  text: string;
}

interface QuestionData {
  id?: string;
  type: string;
  title: string;
  points: number;
  questionText: string;
  correctAnswers: Answer[];
}

interface FillInBlanksEditorProps {
  onSave: (questionData: QuestionData) => void;
  onCancel: () => void;
  question?: QuestionData;
}

function FillInBlanksEditor({
  onSave,
  onCancel,
  question,
}: FillInBlanksEditorProps) {
  const [questionState, setQuestionState] = useState<QuestionData>({
    id: question?.id || "",
    type: "fill-in-the-blanks",
    title: question?.title || "",
    points: question?.points || 5,
    questionText: question?.questionText || "",
    correctAnswers: question?.correctAnswers || [{ text: "" }],
  });

  const handleAnswerChange = (index: number, value: string) => {
    let newAnswers = questionState.correctAnswers.map((answer, i) => {
      if (i === index) {
        return { ...answer, text: value };
      }
      return answer;
    });
    setQuestionState({ ...questionState, correctAnswers: newAnswers });
  };

  const addAnswer = () => {
    setQuestionState({
      ...questionState,
      correctAnswers: [...questionState.correctAnswers, { text: "" }],
    });
  };

  const removeAnswer = (index: number) => {
    let newAnswers = questionState.correctAnswers.filter((_, i) => i !== index);
    setQuestionState({ ...questionState, correctAnswers: newAnswers });
  };

  const handleSave = () => {
    const questionData = {
      ...questionState,
      id: questionState.id || `q-${Date.now()}`,
    };
    onSave(questionData);
  };

  return (
    <div className="my-4">
      {/* Title and Points */}
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
          value={questionState.title}
          onChange={(e) =>
            setQuestionState({ ...questionState, title: e.target.value })
          }
          style={{ maxWidth: "60%" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "10px" }}>Points:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Points"
            value={questionState.points}
            onChange={(e) =>
              setQuestionState({
                ...questionState,
                points: parseInt(e.target.value, 10),
              })
            }
            style={{ maxWidth: "80px" }}
          />
        </div>
      </div>

      {/* Question Text */}
      <h4>Question:</h4>
      <ReactQuill
        theme="snow"
        value={questionState.questionText}
        onChange={(value) =>
          setQuestionState({ ...questionState, questionText: value })
        }
        style={{ marginBottom: "20px" }}
      />

      {/* Correct Answers */}
      {questionState.correctAnswers.map((answer, index) => (
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
          <span style={{ marginRight: "10px" }}>Possible Answer:</span>
          <input
            type="text"
            className="form-control"
            placeholder="Correct Answer"
            value={answer.text}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            style={{ flex: "1", marginRight: "10px" }}
          />
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
          <button className="btn btn-success me-2" onClick={handleSave}>
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
