"use client";

import { useState, useEffect } from "react";

type Question = {
  _id: string;
  question: string;
  options: string[];
  choice?: string; // The user's selected answer
};

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap the `params` Promise to get the quizId
    async function fetchParams() {
      const resolvedParams = await params;
      setQuizId(resolvedParams.quizId);
    }

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!quizId) return;

    // Fetch quiz data
    async function fetchQuiz() {
      try {
        const res = await fetch(`http://localhost:3001/quizzes/${quizId}`);
        const quizData = await res.json();
        setQuestions(quizData.questions);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
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

  return (
    <div>
      <h1>Quiz</h1>
      {questions.map((q) => (
        <div key={q._id} style={{ marginBottom: "20px" }}>
          <h2>{q.question}</h2>
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
    </div>
  );
}
