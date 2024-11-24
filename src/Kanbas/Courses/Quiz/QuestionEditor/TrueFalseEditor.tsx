import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TrueFalseEditorProps {
  onSave: (questionData: any) => void;
  onCancel: () => void;
  question: {
    id: string;
    title: string;
    questionText: string;
    isTrue: boolean;
    points: number;
  };
}

function TrueFalseEditor({ onSave, onCancel, question }: TrueFalseEditorProps) {
  // const [question, setQuestion] = useState({
  //   title: "",
  //   points: 1,
  //   questionText: "",
  //   isTrue: true,
  // });
  const [questionState, setQuestionState] = useState(question);

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
      <h5>Question:</h5>
      <ReactQuill
        theme="snow"
        value={questionState.questionText}
        onChange={(value) =>
          setQuestionState({ ...questionState, questionText: value })
        }
        style={{ marginBottom: "20px" }}
      />
      <div>
        <h5>Answers:</h5>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="isTrue"
            checked={questionState.isTrue}
            onChange={() =>
              setQuestionState({ ...questionState, isTrue: true })
            }
          />
          <label className="form-check-label">True</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="isTrue"
            checked={!questionState.isTrue}
            onChange={() =>
              setQuestionState({ ...questionState, isTrue: false })
            }
          />
          <label className="form-check-label">False</label>
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-success" onClick={onSave}>
          Save
        </button>
        <button className="btn btn-danger ms-2" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TrueFalseEditor;