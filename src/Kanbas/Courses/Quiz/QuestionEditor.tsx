import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MultipleChoiceEditor from "./QuestionEditor/MultipleChoiceEditor";
import TrueFalseEditor from "./QuestionEditor/TrueFalseEditor";
import FillInBlanksEditor from "./QuestionEditor/FillInBlanksEditor";
// import { fetchQuizDetails, updateQuizDetails } from "./client";
// import { setQuizDetails as reduxSetQuizDetails } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { addQuiz, updateQuiz } from "./reducer";
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

export default function QuestionEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const existingQuiz = quizzes.find(
    (quiz: any) => quiz._id === qid && quiz.course === cid
  );
  const [quiz, setQuiz] = useState(
    existingQuiz || {
      title: "",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      shuffleAnswers: false,
      timeLimit: 20,
      multipleAttempts: false,
      showCorrectAnswers: "",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      dueDate: "",
      availableDate: "",
      untilDate: "",
      questions: [],
      course: cid,
    }
  );

  const [questionType, setQuestionType] = useState("multipleChoice");
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [currentlyEditingQuestion, setCurrentlyEditingQuestion] =
    useState<any>(null);

  // Modify handleSave to accept questionData and update quiz's questions array
  const handleSave = (questionData: any) => {
    // Update the quiz's questions array
    const updatedQuestions = quiz.questions ? [...quiz.questions] : [];

    const existingQuestionIndex = updatedQuestions.findIndex(
      (q: any) => q.id === questionData.id
    );

    if (existingQuestionIndex >= 0) {
      // Update existing question
      updatedQuestions[existingQuestionIndex] = questionData;
    } else {
      // Add new question
      updatedQuestions.push(questionData);
    }

    // Update the quiz state with new questions
    const updatedQuiz = { ...quiz, questions: updatedQuestions };
    setQuiz(updatedQuiz);

    // Save the updated quiz to backend
    if (existingQuiz) {
      saveQuiz(updatedQuiz);
    } else {
      createQuiz({ ...updatedQuiz, _id: new Date().getTime().toString() });
    }

    // Reset the editing state
    setCurrentlyEditingQuestion(null);
    setIsCreatingQuestion(false);
  };

  const createQuiz = async (quiz: any) => {
    const newQuiz = await coursesClient.createQuizForCourse(
      cid as string,
      quiz
    );
    dispatch(addQuiz(newQuiz));
  };

  const saveQuiz = async (quiz: any) => {
    await quizzesClient.updateQuiz(quiz);
    dispatch(updateQuiz(quiz));
  };

  const handleCancel = () => {
    // Reset the editing state
    setCurrentlyEditingQuestion(null);
    setIsCreatingQuestion(false);
    // Optionally navigate back if needed
    // navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  };

  const renderEditor = () => {
    switch (questionType) {
      case "multipleChoice":
        return (
          <MultipleChoiceEditor
            onSave={handleSave}
            onCancel={handleCancel}
            question={currentlyEditingQuestion}
          />
        );
      case "trueFalse":
        return (
          <TrueFalseEditor
            onSave={handleSave}
            onCancel={handleCancel}
            question={currentlyEditingQuestion}
          />
        );
      case "fillInBlanks":
        return (
          <FillInBlanksEditor
            onSave={handleSave}
            onCancel={handleCancel}
            question={currentlyEditingQuestion}
          />
        );
      default:
        return null;
    }
  };

  const editQuestion = (question: any) => {
    setCurrentlyEditingQuestion(question);
    setIsCreatingQuestion(true);
    setQuestionType(
      question.type === "multiple-choice"
        ? "multipleChoice"
        : question.type === "true-false"
        ? "trueFalse"
        : "fillInBlanks"
    );
  };

  const deleteQuestion = (question: any) => {
    const updatedQuestions = quiz.questions.filter(
      (q: any) => q.id !== question.id
    );
    const updatedQuiz = { ...quiz, questions: updatedQuestions };
    setQuiz(updatedQuiz);
    // Save the updated quiz to backend
    if (existingQuiz) {
      saveQuiz(updatedQuiz);
    }
  };

  const [answers, setAnswers] = useState<AnswerMap>({});
  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };
  return (
    <div>
      {!isCreatingQuestion ? (
        <div>
          {/* List existing questions */}
          {quiz.questions.map((question: any, index: any) => (
            <div key={question.id || index}>
              <div>
                <h5>{question.title || `Question ${index + 1}`}</h5>
                {/* Display question text */}
                <div
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />
                <button
                  onClick={() => editQuestion(question)}
                  className="btn btn-warning me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteQuestion(question)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
              <hr />
            </div>
          ))}

          {/* Option to add a new question */}
          <div className=" d-flex justify-content-center align-items-center mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsCreatingQuestion(true);
                setCurrentlyEditingQuestion(null);
              }}
            >
              + New Question
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Question Type Selector */}
          {!currentlyEditingQuestion && (
            <div>
              <label>Select Question Type: </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <option value="multipleChoice">Multiple Choice</option>
                <option value="trueFalse">True/False</option>
                <option value="fillInBlanks">Fill in the Blanks</option>
              </select>
            </div>
          )}
          {renderEditor()}
        </div>
      )}
    </div>
  );
}
