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

  const handleSave = (questionData: any) => {
    // Placeholder for save logic
    console.log("Saving data:", questionData);
    // Navigate back to quiz details
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
  };

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const renderEditor = () => {
    const currentQuestion = quizDetails.questions[selectedQuestionIndex];
    switch (questionType) {
      case "multipleChoice":
        return (
          <MultipleChoiceEditor onSave={handleSave} onCancel={handleCancel} />
        );
      case "trueFalse":
        return (
          <TrueFalseEditor
            onSave={handleSave}
            onCancel={handleCancel}
            question={currentQuestion}
          />
        );
      case "fillInBlanks":
        return (
          <FillInBlanksEditor onSave={handleSave} onCancel={handleCancel} />
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    console.log("Current questions in quizDetails:", quizDetails.questions);
  }, [quizDetails.questions]);

  return (
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
  );
}