import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MultipleChoiceEditor from "./QuestionEditor/MultipleChoiceEditor";
import TrueFalseEditor from "./QuestionEditor/TrueFalseEditor";
import FillInBlanksEditor from "./QuestionEditor/FillInBlanksEditor";
import { fetchQuizDetails, updateQuizDetails } from "./client";
import { setQuizDetails as reduxSetQuizDetails } from "./reducer";
import { useDispatch, useSelector } from "react-redux";

export default function QuestionEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  // const dispatch = useDispatch();
  const quiz = useSelector(
    (state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid) || {}
  );

  const [quizDetails, setQuizDetails] = useState({
    _id: qid || `quiz-${Date.now()}`,
    title: quiz.title || "",
    description: quiz.description || "",
    quizType: quiz.quizType || "Graded Quiz",
    assignmentGroup: quiz.assignmentGroup || "Quizzes",
    shuffleAnswers: quiz.shuffleAnswers || false,
    timeLimit: quiz.timeLimit || 20,
    multipleAttempts: quiz.multipleAttempts || false,
    showCorrectAnswers: quiz.showCorrectAnswers || "",
    accessCode: quiz.accessCode || "",
    oneQuestionAtATime: quiz.oneQuestionAtATime || true,
    webcamRequired: quiz.webcamRequired || false,
    lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
    dueDate: quiz.dueDate || "",
    availableDate: quiz.availableDate || "",
    untilDate: quiz.untilDate || "",
    questions: quiz.questions || [],
  });

  useEffect(() => {
    if (cid && qid && !quiz._id) {
      fetchQuizDetails(cid, qid!)
        .then((details) => {
          dispatch(reduxSetQuizDetails(details));
          setQuizDetails(details);
        })
        .catch((error) =>
          console.error("Failed to fetch quiz details:", error)
        );
    }
  }, [cid, qid, quiz._id]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleSave = async (questionData: any) => {
    console.log(questionData);
    const updatedQuestions = questionData.id
      ? quizDetails.questions.map((q: any) =>
          q.id === questionData.id ? questionData : q
        )
      : [...quizDetails.questions, questionData];
    const updatedQuiz = { ...quizDetails, questions: updatedQuestions };
    const response = await updateQuizDetails(quizDetails._id, updatedQuiz);
    setQuizDetails(response); // Update state with server response
    dispatch(reduxSetQuizDetails(response)); // Update Redux store
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
      {quizDetails.questions.map((question: any, index: any) => {
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
