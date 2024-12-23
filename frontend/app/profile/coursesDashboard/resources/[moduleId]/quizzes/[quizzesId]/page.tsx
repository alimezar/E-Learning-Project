"use client";

import { CSSProperties, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    background: "linear-gradient(135deg, rgba(44, 41, 93, 0.8), rgba(30, 77, 77, 0.8)), url('/path-to-your-image.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    animation: "gradientAnimation 10s ease infinite",
    color: "#ffffff",
    minHeight: "100vh",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    fontFamily: "Trebuchet MS, Arial, sans-serif",
    color: "#ffc857",
  },
  questionContainer: {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #4c4a7f",
    borderRadius: "8px",
    backgroundColor: "#3e3966",
    maxWidth: "600px",
    margin: "0 auto",
  },
  question: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
    color: "#ffc857",
  },
  counter: {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    padding: "1rem",
    backgroundColor: "#1e4d4d",
    border: "1px solid #4c4a7f",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "Trebuchet MS, Arial, sans-serif",
    color: "#ffc857",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  optionLabel: {
    display: "block",
    padding: "0.5rem",
    margin: "0.5rem 0",
    borderRadius: "4px",
    backgroundColor: "#514d83",
    color: "#ffffff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  optionLabelHover: {
    backgroundColor: "#1e4d4d",
  },
  optionLabelSelected: {
    backgroundColor: "#ffc857",
    color: "#2c295d",
  },
  submitButton: {
    display: "block",
    marginTop: "2rem",
    padding: "1rem 2rem",
    backgroundColor: "#ffc857",
    border: "none",
    borderRadius: "8px",
    color: "#2c295d",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    maxWidth: "300px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  submitButtonHover: {
    backgroundColor: "#1e4d4d",
  },
};

type Question = {
  _id: string;
  question: string;
  options: string[];
  choice?: string;
  moduleId: string;
  difficulty: string;
  answer: string;
  __v: number;
};

export default function QuizPage({ params }: { params: Promise<{ quizzesId: string }> }) {
  const router = useRouter(); // Initialize router
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setQuizId(resolvedParams.quizzesId);
    }

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!quizId) return;

    async function fetchQuiz() {
      try {
        setError("");
        const res = await fetch(`http://localhost:3001/quizzes/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz data");
        const quizData = await res.json();
        setModuleTitle(quizData.moduleId.title);
        setQuestions(quizData.questions);
      } catch (err) {
        setError("Could not load the quiz. Please try again later.");
        console.error(err);
      }
    }

    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (questionId: string, selectedOption: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId ? { ...q, choice: selectedOption } : q
      )
    );
  };

  const handleSubmit = async () => {
    if (!quizId) {
      setError("Quiz ID is missing. Cannot submit the quiz.");
      return;
    }

    try {
      const quizResponse = await fetch(`http://localhost:3001/quizzes/${quizId}`);
      if (!quizResponse.ok) {
        throw new Error("Failed to fetch quiz details.");
      }

      const quizData = await quizResponse.json();
      const updatedQuiz = {
        questions: questions.map(({ _id, question, options, choice, answer, difficulty, moduleId }) => ({
          _id,
          question,
          options,
          choice,
          answer,
          difficulty,
          moduleId,
        })),
      };

      const updateQuizResponse = await fetch(`http://localhost:3001/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuiz),
      });

      if (!updateQuizResponse.ok) {
        const errorText = await updateQuizResponse.text();
        console.error("API Error Response:", errorText);
        throw new Error("Failed to update quiz choices.");
      }

      const userId = quizData.userId;
      const moduleId = quizData.moduleId;

      const module = await fetch(`http://localhost:3001/modules/${moduleId}`)
      const moduleData = await module.json()
      const courseId = moduleData.course_id

      if (!userId || !moduleId) {
        setError("User or Module ID is missing from the quiz details.");
        return;
      }

      const response = await fetch(`http://localhost:3001/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizId, userId, courseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the quiz. Please try again.");
      }

      const responseData = await response.json();
      const responseId = responseData._id;

      router.push(`/profile/coursesDashboard/resources/${moduleId}/quizzes/${quizId}/responses/${responseId}`);
    } catch (err) {
      console.error("Error submitting the quiz:", err);
      setError("An error occurred while submitting the quiz. Please try again.");
    }
  };

  const answeredCount = questions.filter((q) => q.choice && q.options.includes(q.choice)).length;

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        {moduleTitle ? `${moduleTitle} Quiz` : "Quiz"}
      </h1>
      {questions.map((q) => (
        <div key={q._id} style={styles.questionContainer}>
          <h2 style={styles.question}>{q.question}</h2>
          {q.options.map((option) => (
            <label
              key={option}
              style={{
                ...styles.optionLabel,
                ...(q.choice === option ? styles.optionLabelSelected : {}),
              }}
            >
              <input
                type="radio"
                name={q._id}
                value={option}
                checked={q.choice === option}
                onChange={() => handleOptionSelect(q._id, option)}
                style={{ display: "none" }}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <div style={styles.counter}>
        Questions Answered: {answeredCount} / {questions.length}
      </div>
      <button
        style={styles.submitButton}
        onClick={handleSubmit}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e4d4d")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffc857")}
      >
        Submit Quiz
      </button>
    </div>
  );
}
