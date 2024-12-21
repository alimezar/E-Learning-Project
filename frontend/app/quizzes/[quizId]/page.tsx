"use client";

import { CSSProperties, useState, useEffect } from "react";

const styles: { [key: string]: CSSProperties } = {
  container: {
    padding: "rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    fontFamily: "Trebuchet MS, Arial, sans-serif",
  },
  questionContainer: {
    marginBottom: "2rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    maxWidth: "600px",
    margin: "0 auto",
  },
  question: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
  },
  counter: {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    padding: "1rem",
    backgroundColor: "#f4f4f4",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "Trebuchet MS, Arial, sans-serif",
  },
};

type Question = {
  _id: string;
  question: string;
  options: string[];
  choice?: string;
};

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null); // Store module title
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setQuizId(resolvedParams.quizId);
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
        console.log("Quiz Data:", quizData); // Debugging log

        // Set module title from response
        setModuleTitle(quizData.moduleId.title);

        // Set questions from response
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

  const answeredCount = questions.filter((q) => q.choice).length;

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
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name={q._id}
                  value={option}
                  checked={q.choice === option}
                  onChange={() => handleOptionSelect(q._id, option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <div style={styles.counter}>
        Questions Answered: {answeredCount} / {questions.length}
      </div>
    </div>
  );
}
