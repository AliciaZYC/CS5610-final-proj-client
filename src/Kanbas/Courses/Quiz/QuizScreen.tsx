import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { PiArrowFatRightLight } from "react-icons/pi";

export default function QuizScreen() {
  return (
    <div id="wd-quiz" className="container-fluid">
      <div className="fs-2 fw-bold row mb-3">
        Q1 - HTML <br />
      </div>
      <div
        className="row d-flex align-items-center text-danger mb-3 rounded"
        style={{
          height: "40px",
          backgroundColor: "#f8d7da",
          overflow: "hidden",
        }}
      >
        <div className="d-flex align-items-center">
          <IoMdInformationCircleOutline className="me-2" />
          This is a preview of the published version of the quiz.
        </div>
      </div>
      <div className="row mb-3">
        Started: 2021-09-01 12:00:00 <br />
      </div>
      <h3 className="row mb-3 fw-bold">Quiz Instructions</h3>
      <hr />
      <div className="position-relative">
        <span className="position-absolute fs-5" style={{ top: "25px" }}>
          <PiArrowFatRightLight />
        </span>

        <div className="row mb-4 border rounded p-3 m-4 d-flex align-items-center justify-content-center">
          <div className="row mb-2 bg-light border rounded p-2">
            <div className="col-6 fs-5 fw-bold">Question 1</div>
            <div className="col-6 text-end fs-6">1 Point</div>
          </div>
          <div className="row mb-2">
            <span className="mb-3">
              This quiz is designed to test your knowledge of HTML, CSS, and
              JavaScript. The quiz consists of 10 questions, and you have 10
              minutes to complete it. You will receive your score at the end of
              the quiz.
            </span>
            <div>
              <hr />
              <input
                type="radio"
                className="me-3"
                name="trueFalse"
                value="True"
                id="true"
              />
              <label htmlFor="true">True</label>
              <hr />
              <input
                type="radio"
                className="me-3"
                name="trueFalse"
                value="False"
                id="false"
              />
              <label htmlFor="false">False</label>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="d-flex justify-content-end mb-3 me-2">
          <button className="d-flex align-items-center btn btn-secondary">
            <span className="me-2">Next</span>
            <IoMdArrowDropright />
          </button>
        </div>
      </div>
      <div className="d-flex border justify-content-end mb-3 p-3 rounded">
        <button className="d-flex align-items-center btn btn-secondary">
          <span>Submit Quiz</span>
        </button>
      </div>
    </div>
  );
}
