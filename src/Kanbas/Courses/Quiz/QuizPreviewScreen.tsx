import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MultipleChoiceQuestion from "./QuizPreview/MultipleChoiceQuestion";
import TrueFalseQuestion from "./QuizPreview/TrueFalseQuestion";
import FillInBlanksQuestion from "./QuizPreview/FillInBlanksQuestion";

export interface QuestionProps {
  question: Question;
  answer: any;
  onChange: (answer: any) => void;
}

export interface Question {
  id: string;
  title: string;
  questionText: string;
  type: "multiple-choice" | "true-false" | "fill-in-blanks";
  choices?: Array<{ text: string; isCorrect: boolean }>;
  isTrue?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface AnswerMap {
  [key: string]: any;
}

function QuizPreviewScreen() {
  const { qid } = useParams<{ qid: string }>();
  // const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const quiz = useSelector(
    (state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid) || {}
  );

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      {quiz.questions.map((question: any) => {
        let QuestionComponent = null;

        switch (question.type) {
          case "multiple-choice":
            QuestionComponent = MultipleChoiceQuestion;
            break;
          case "true-false":
            QuestionComponent = TrueFalseQuestion;
            break;
          case "fill-in-blanks":
            QuestionComponent = FillInBlanksQuestion;
            break;
          default:
            return null;
        }

        return (
          QuestionComponent && (
            <QuestionComponent
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onChange={(answer: any) =>
                handleAnswerChange(question.id, answer)
              }
            />
          )
        );
      })}
    </div>
  );
}

export default QuizPreviewScreen;
