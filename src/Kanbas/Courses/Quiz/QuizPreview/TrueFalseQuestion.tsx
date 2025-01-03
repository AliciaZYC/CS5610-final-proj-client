import React from "react";

interface QuestionProps {
  question: {
    id: string;
    title: string;
    questionText: string;
    choices?: { text: string; isCorrect: boolean }[];
    isTrue?: boolean;
  };
  answer: any;
  onChange: (answer: any) => void;
  isFaculty: boolean;
}

function TrueFalseQuestion({
  question,
  answer,
  onChange,
  isFaculty,
}: QuestionProps) {
  return (
    <div style={styles.container}>
      <h4 style={styles.title}>{question.title}</h4>
      <div style={styles.content}>
        <p style={styles.questionText}>{question.questionText}</p>
        <div style={styles.choicesContainer}>
          <label htmlFor={`true-${question.id}`} style={styles.choiceLabel}>
            <input
              type="radio"
              id={`true-${question.id}`}
              name={`question-${question.id}`}
              // checked={question.isTrue}
              checked={isFaculty ? question.isTrue === true : answer === true}
              disabled={isFaculty}
              onChange={() => onChange(true)}
              style={styles.radioInput}
            />
            True
          </label>
          <label htmlFor={`false-${question.id}`} style={styles.choiceLabel}>
            <input
              type="radio"
              id={`false-${question.id}`}
              name={`question-${question.id}`}
              // checked={!question.isTrue}
              checked={isFaculty ? question.isTrue === false : answer === false}
              disabled={isFaculty}
              onChange={() => onChange(false)}
              style={styles.radioInput}
            />
            False
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: "20px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    backgroundColor: "#f4f4f4",
    padding: "15px",
    margin: 0,
    fontSize: "18px",
    color: "#555",
    borderBottom: "1px solid #ddd",
  },
  content: {
    backgroundColor: "#fff",
    padding: "15px",
  },
  questionText: {
    fontSize: "16px",
    marginBottom: "15px",
    color: "#333",
  },
  choicesContainer: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "15px",
    marginTop: "10px",
  },
  choiceLabel: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s, border-color 0.3s",
    fontSize: "16px",
    color: "#333",
  },
  choiceLabelHover: {
    backgroundColor: "#f0f0f0",
    borderColor: "#bbb",
  },
  radioInput: {
    marginRight: "10px",
  },
};

export default TrueFalseQuestion;
