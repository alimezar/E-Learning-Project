"use client";

import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

export default function ResponsePage({ params }: { params: Promise<{ responseId: string }> }) {
  const [responseId, setResponseId] = useState<string | null>(null);
  const [responseScore, setResponseScore] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchParams() {
      try {
        const resolvedParams = await params;
        setResponseId(resolvedParams.responseId);
      } catch (err) {
        setError("Failed to load page parameters.");
        console.error("Error resolving params:", err);
      }
    }

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!responseId) return;

    async function fetchResponse() {
      try {
        setError("");
        const res = await fetch(`http://localhost:3001/responses/${responseId}`);
        if (!res.ok) throw new Error("Failed to fetch response data");

        const responseText = await res.text();
        if (responseText) {
          const responseJson = JSON.parse(responseText);
          setResponseScore(responseJson.score || null);
          setQuestions(responseJson.questions || []);
        } else {
          setResponseScore(null);
        }
      } catch (err) {
        setError("Could not load the response. Please try again later.");
        console.error(err);
      }
    }

    fetchResponse();
  }, [responseId]);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      position: "relative",
      background: "linear-gradient(135deg, rgba(44, 41, 93, 0.8), rgba(30, 77, 77, 0.8)), url('/path-to-your-image.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", // Parallax effect
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
      color: "#ffc857", // Golden accent for headers
    },
    questionContainer: {
      marginBottom: "2rem",
      padding: "1rem",
      border: "1px solid #4c4a7f",
      borderRadius: "8px",
      backgroundColor: "#3e3966", // Slightly lighter background
      maxWidth: "600px",
      margin: "0 auto",
    },
    question: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "1rem",
      color: "#ffc857", // Golden yellow for questions
    },
    counter: {
      position: "fixed",
      top: "2rem",
      right: "2rem",
      padding: "1rem",
      backgroundColor: "#1e4d4d", // Teal background for counter
      border: "1px solid #4c4a7f", // Muted blue border
      borderRadius: "8px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      fontFamily: "Trebuchet MS, Arial, sans-serif",
      color: "#ffc857", // Golden yellow for contrast
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
    },
    optionLabel: {
      display: "block",
      padding: "0.5rem",
      margin: "0.5rem 0",
      borderRadius: "4px",
      backgroundColor: "#514d83", // Muted violet for option background
      color: "#ffffff", // White text for readability
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    optionLabelHover: {
      backgroundColor: "#1e4d4d", // Teal for hover effect
    },
    optionLabelSelected: {
      backgroundColor: "#ffc857", // Highlighted option with golden tone
      color: "#2c295d", // Darker contrast text
    },
    correctAnswer: {
      backgroundColor: "#4caf50", // Green for correct answer
      color: "#ffffff", // White text for contrast
      borderRadius: "12px", // Less pointy edges
      textAlign: "center", // Center the text
      padding: "0.5rem",
    },
    incorrectAnswer: {
      backgroundColor: "#f44336", // Red for incorrect answer
      color: "#ffffff", // White text for contrast
      borderRadius: "12px", // Less pointy edges
      textAlign: "center", // Center the text
      padding: "0.5rem",
    },
    submitButton: {
      display: "block",
      marginTop: "2rem",
      padding: "1rem 2rem",
      backgroundColor: "#ffc857", // Golden background for the button
      border: "none",
      borderRadius: "8px",
      color: "#2c295d", // Dark text for the button
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
      backgroundColor: "#1e4d4d", // Teal background for hover effect
    },
  };

  const handleGoModule = () => {
    const moduleId = questions[0]?.moduleId; // Assuming the moduleId is part of the questions
    if (moduleId) {
      router.push(`/profile/coursesDashboard/resources/${moduleId}`); // Redirect to the module page
    }
  };

  const getOptionStyle = (choice: string, answer: string) => {
    if (choice === answer) {
      return styles.correctAnswer;
    } else if (choice && choice !== answer) {
      return styles.incorrectAnswer;
    }
    return {};
  };

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>{error}</h1>
        <button style={styles.submitButton} onClick={handleGoModule}>
          Go to Module Page
        </button>
      </div>
    );
  }

  if (!responseId || responseScore === null) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Loading...</h1>
        <button style={styles.submitButton} onClick={handleGoModule}>
          Go to Module Page
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your score: {responseScore}/5</h1>
      {questions.map((question) => (
        <div key={question._id} style={styles.questionContainer}>
          <h2 style={styles.question}>{question.question}</h2>
          <p style={styles.optionLabel}>Correct Answer: {question.answer}</p>
          <p style={styles.optionLabel}>Your Choice: {question.choice || 'Not Answered'}</p>
          <div style={getOptionStyle(question.choice, question.answer)}>
            {question.choice === question.answer ? (
              <span>Correct</span>
            ) : (
              <span>Incorrect</span>
            )}
          </div>
        </div>
      ))}
      <button style={styles.submitButton} onClick={handleGoModule}>
        Go to Module Page
      </button>
    </div>
  );
}
