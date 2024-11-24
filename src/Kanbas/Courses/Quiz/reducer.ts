import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  id: string;
  title: string;
  questionText: string;
  type: string;
  choices: string[];
  isTrue: boolean;
}
interface Quiz {
  _id: string;
  title: string;
  description: string;
  quizType: string;
  points: number;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  untilDate: string;
  questions: Question[];
}
const initialState: { quizzes: Quiz[] } = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    addQuiz: (state, { payload: quiz }) => {
      const newQuiz: Quiz = {
        _id: new Date().getTime().toString(), // Generate unique ID
        title: quiz.title,
        description: quiz.description || "",
        quizType: quiz.quizType || "multiple-choice",
        points: quiz.points || 100,
        assignmentGroup: quiz.assignmentGroup || "Default Group",
        shuffleAnswers: quiz.shuffleAnswers || false,
        timeLimit: quiz.timeLimit || 0, // Default to no time limit
        multipleAttempts: quiz.multipleAttempts || false,
        showCorrectAnswers: quiz.showCorrectAnswers || "never",
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime || false,
        webcamRequired: quiz.webcamRequired || false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
        dueDate: quiz.dueDate || "2024-05-13T23:59",
        availableDate: quiz.availableDate || "2024-05-06T23:59",
        untilDate: quiz.untilDate || "2024-05-20T23:59",
        questions: quiz.questions || [],
      };

      state.quizzes = [...state.quizzes, newQuiz];
    },
    deleteQuiz: (state, { payload: quizzId }) => {
      state.quizzes = state.quizzes.filter((quiz: any) => quiz._id !== quizzId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    setQuizDetails: (state, action: PayloadAction<Quiz>) => {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      } else {
        // Optionally handle the case where the quiz isn't found in the array
        console.error("Quiz not found in the state");
      }
    },
  },
});

// Export the automatically generated action creators
export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz, setQuizDetails } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
