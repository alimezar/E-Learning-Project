//Vizarde 7ot el code beta3 creating the quizzes here "use client";

import { useState } from "react";

export default function InitiateQuiz() {
  const [type, setType] = useState<string>("mcq");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [size, setSize] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateQuiz = async () => {
    try {
      setError(null);
      setSuccess(null);

      const moduleId = window.location.pathname.split("/").pop(); // Get moduleId from URL
      const cookies = document.cookie.split("; ");
      const userCookie = cookies.find((cookie) => cookie.startsWith("user="));
      let userId: string | null = null;

      if (userCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
          userId = userData.id;
        } catch (error) {
          throw new Error("Failed to parse user ID from cookies.");
        }
      }

      if (!userId || !moduleId) {
        throw new Error("User ID or Module ID is missing.");
      }

      const response = await fetch("http://localhost:3001/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, moduleId, type, difficulty, size }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz.");
      }

      setSuccess("Quiz created successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating the quiz.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Initiate Quiz</h1>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.formGroup}>
        <label htmlFor="type" style={styles.label}>
          Quiz Type:
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
        >
          <option value="mcq">Multiple Choice (MCQ)</option>
          <option value="trueFalse">True/False</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="difficulty" style={styles.label}>
          Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={styles.select}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label htmlFor="size" style={styles.label}>
          Quiz Size (Number of Questions):
        </label>
        <input
          id="size"
          type="number"
          min="1"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <button onClick={handleCreateQuiz} style={styles.button}>
        Initiate Quiz
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "2rem",
    textAlign: "center" as const,
    marginBottom: "1rem",
    color: "#333",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#555",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "1rem",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#f44336",
    marginBottom: "1rem",
    textAlign: "center" as const,
  },
  success: {
    color: "#4CAF50",
    marginBottom: "1rem",
    textAlign: "center" as const,
  },
};
