import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizDetails, updateQuizDetails } from "./client";
import { setQuizDetails as reduxSetQuizDetails } from "./reducer";
import QuestionEditor from "./QuestionEditor";
import ReactQuill from "react-quill";

function QuizEditor() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  }, [cid, qid, dispatch, quiz._id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuizDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (qid) {
      await updateQuizDetails(qid, quizDetails);
      navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    } else {
      console.error("Quiz ID is missing!");
    }
  };

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Quizzes`);
  };

  const [activeTab, setActiveTab] = useState("detail");

  return (
    <div
      className="col-12"
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "20px 0",
        padding: "20px",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      <hr />
      <div className="nav nav-tabs">
        <button
          className={`nav-link ${activeTab === "detail" ? "active" : ""}`}
          onClick={() => setActiveTab("detail")}
        >
          Details
        </button>
        <button
          className={`nav-link ${activeTab === "question" ? "active" : ""}`}
          onClick={() => setActiveTab("question")}
        >
          Questions
        </button>
      </div>
      <br />
      {activeTab === "detail" && (
        <>
          <input
            type="text"
            name="title"
            value={quizDetails.title}
            onChange={handleChange}
            className="form-control mb-2"
            placeholder="Unnamed Quiz"
          />
          <ReactQuill
            theme="snow"
            value={quizDetails.description}
            onChange={(value) =>
              setQuizDetails({
                ...quizDetails,
                description: value,
              })
            }
            style={{ marginBottom: "20px" }}
          />
          <br />
          <br />
          <div className="mb-3 row">
            <label
              htmlFor="wd-group"
              className="col-sm-2 col-form-label text-end"
            >
              Quiz Type
            </label>
            <div className="col-sm-10">
              <select
                id="wd-group"
                name="quizType"
                value={quizDetails.quizType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Graded Quiz" selected>
                  Graded Quiz
                </option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Graded Survey">Graded Survey</option>
                <option value="Ungraded Survey">Ungraded Survey</option>
              </select>
            </div>
          </div>

          <div className="mb-3 row">
            <label
              htmlFor="wd-group"
              className="col-sm-2 col-form-label text-end"
            >
              Assignment Group
            </label>
            <div className="col-sm-10">
              <select
                name="assignmentGroup"
                value={quizDetails.assignmentGroup}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Quizzes" selected>
                  Quizzes
                </option>
                <option value="Exams">Exams</option>
                <option value="Assignments">Assignments</option>
                <option value="Projects">Projects</option>
              </select>
              <br />

              <h5>Options</h5>

              <input
                type="checkbox"
                name="shuffleAnswers"
                style={{ marginRight: "10px" }}
                checked={quizDetails.shuffleAnswers}
                onChange={(e) =>
                  setQuizDetails({
                    ...quizDetails,
                    shuffleAnswers: e.target.checked,
                  })
                }
              />
              <label>Shuffle Answers</label>
              <br />
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  name="time limit"
                  style={{ marginRight: "10px" }}
                  checked={Boolean(quizDetails.timeLimit)}
                  onChange={handleChange}
                />
                <label>Time Limit</label>
                <input
                  type="number"
                  name="timeLimit"
                  value={quizDetails.timeLimit}
                  onChange={handleChange}
                  className="form-control mx-2 my-2"
                  placeholder="Time Limit (minutes)"
                  style={{ width: "100px" }}
                />
                <label>Minutes</label>
              </div>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="checkbox"
                  name="multipleAttempts"
                  style={{ marginRight: "10px" }}
                  checked={quizDetails.multipleAttempts}
                  onChange={(e) =>
                    setQuizDetails({
                      ...quizDetails,
                      multipleAttempts: e.target.checked,
                    })
                  }
                />
                <label>Allow Multiple Attempts</label>
              </div>
            </div>
          </div>
          <div className="mb-3 row">
            <label
              htmlFor="wd-group"
              className="col-sm-2 col-form-label text-end"
            >
              Assign
            </label>

            <div
              className="col-sm-10"
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <h5>Assign to</h5>
              <input
                type="text"
                className="form-control"
                value="Everyone"
                readOnly
              />
              <br />
              <h5>Due</h5>
              <input
                type="datetime-local"
                className="form-control"
                name="dueDate"
                value={quizDetails.dueDate}
                onChange={handleChange}
              />
              <br />
              <div className="row">
                <div className="col-sm-6">
                  <h5>Available from</h5>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="availableDate"
                    value={quizDetails.availableDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-6">
                  <h5>Until</h5>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="untilDate"
                    value={quizDetails.untilDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end my-4">
              <button className="btn btn-success me-2">Save</button>
              <button className="btn btn-danger">Cancel</button>
            </div>
          </div>
        </>
      )}
      {activeTab === "question" && (
        <div>
          <p>Questions editor will be implemented here.</p>
          <QuestionEditor />
        </div>
      )}
      <div className="d-flex justify-content-center">
        <button onClick={handleSave} className="btn btn-danger">
          {qid ? "Update" : "Create"} & Save
        </button>
        <button onClick={handleCancel} className="btn btn-secondary  ms-2">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default QuizEditor;
