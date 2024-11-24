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

  // const handleSave = (questionData: any) => {
  //   setQuizDetails((prevDetails) => {
  //     const questions = questionData.id
  //       ? prevDetails.questions.map((q: any) =>
  //           q.id === questionData.id ? questionData : q
  //         )
  //       : [...prevDetails.questions, questionData];
  //     return { ...prevDetails, questions };
  //   });
  //   // Optionally navigate back or dispatch an update
  //   // navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  // };
  const handleSave = () => {
    if (existingQuiz) {
      saveQuiz(quiz);
      // navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } else {
      createQuiz({ ...quiz, _id: new Date().getTime().toString() });
    }
    // navigate(`/Kanbas/Courses/${cid}/Quizzes`);
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
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  };

  const renderEditor = () => {
    switch (questionType) {
      case "multipleChoice":
        return (
          <MultipleChoiceEditor onSave={handleSave} onCancel={handleCancel} />
        );
      case "trueFalse":
        return <TrueFalseEditor onSave={handleSave} onCancel={handleCancel} />;
      case "fillInBlanks":
        return (
          <FillInBlanksEditor onSave={handleSave} onCancel={handleCancel} />
        );
      default:
        return null;
    }
  };

  // useEffect(() => {
  //   console.log("Current questions in quizDetails:", quizDetails.questions);
  // }, [quizDetails.questions]);

  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);

  return (
    <div>
      {quiz.questions.map((question: any, index: any) => {
        switch (question.type) {
          case "multiple-choice":
            return (
              <MultipleChoiceEditor
                key={question.id}
                question={question}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            );
          case "true-false":
            return (
              <TrueFalseEditor
                key={question.id}
                question={question}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            );
          case "fill-in-the-blanks":
            return (
              <FillInBlanksEditor
                key={question.id}
                question={question}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            );
          default:
            return null;
        }
      })}

      {/* Option to add a new question */}
      {!isCreatingQuestion ? (
        <div className=" d-flex justify-content-center align-items-center mb-4">
          <button
            className="btn btn-secondary"
            onClick={() => setIsCreatingQuestion(true)}
          >
            + New Question
          </button>
        </div>
      ) : (
        <div>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multipleChoice">Multiple Choice</option>
            <option value="trueFalse">True/False</option>
            <option value="fillInBlanks">Fill in the Blanks</option>
          </select>
          {renderEditor()}
        </div>
      )}
    </div>
  );
}
