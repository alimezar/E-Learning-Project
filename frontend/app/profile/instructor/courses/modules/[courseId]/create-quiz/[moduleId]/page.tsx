"use client";

import { useState, useEffect } from "react";

export default function ManageQuizzes() {
  const [type, setType] = useState<string>("mcq");
  const [size, setSize] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]); // List of quizzes for the module
  const moduleId = window.location.pathname.split("/").pop(); // Get moduleId from URL

  // Fetch quizzes for the module
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/quizzes?moduleId=${moduleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes.");
        }
        const data = await response.json();
        setQuizzes(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while fetching quizzes.");
      }
    };

    if (moduleId) {
      fetchQuizzes();
    }
  }, [moduleId]);

  const handleCreateQuiz = async () => {
    try {
      setError(null);
      setSuccess(null);

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

      const existingQuizResponse = await fetch(
        `http://localhost:3001/quizzes?moduleId=${moduleId}&instructorOnly=true`
      );
      if (!existingQuizResponse.ok) {
        throw new Error("Failed to check existing quizzes.");
      }

      const existingQuiz = await existingQuizResponse.json();
      if (existingQuiz.length > 0) {
        setError("A quiz for this module is already initialized by an instructor.");
        return;
      }

      const response = await fetch("http://localhost:3001/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, moduleId, type, size }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz.");
      }

      const newQuiz = await response.json();
      setQuizzes((prev) => [...prev, newQuiz]); // Add the new quiz to the list
      setSuccess("Quiz created successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating the quiz.");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz.");
      }

      setSuccess("Quiz deleted successfully!");
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while deleting the quiz.");
    }
  };

  const handleUpdateQuiz = async (quiz: any) => {
    try {
      setError(null);
      setSuccess(null);

      const response = await fetch(`http://localhost:3001/quizzes/${quiz._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error("Failed to update quiz.");
      }

      setSuccess("Quiz updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while updating the quiz.");
    }
  };

  const handleSizeChangeForQuiz = (quizId: string, newSize: number) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz._id === quizId ? { ...quiz, size: newSize } : quiz
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Manage Quizzes</h1>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Create Quiz Section */}
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
        <label htmlFor="size" style={styles.label}>
          Quiz Size (Number of Questions) (Max: 10):
        </label>
        <input
          id="size"
          type="number"
          min="1"
          max="10"
          value={size}
          onChange={(e) =>
            setSize(Math.min(10, Math.max(1, Number(e.target.value))))
          }
          style={styles.input}
        />
      </div>

      <button onClick={handleCreateQuiz} style={styles.button}>
        Create Quiz
      </button>

      {/* List Quizzes Section */}
      <h2 style={styles.subheader}>Existing Quizzes</h2>
      {quizzes.length > 0 ? (
        <ul style={styles.quizList}>
          {quizzes.map((quiz) => (
            <li key={quiz._id} style={styles.quizItem}>
              <p>
                <strong>Type:</strong> {quiz.type} | <strong>Size:</strong>{" "}
                {quiz.size}
              </p>
              <div style={styles.formGroup}>
                <label htmlFor={`size-${quiz._id}`} style={styles.label}>
                  Update Quiz Size:
                </label>
                <input
                  id={`size-${quiz._id}`}
                  type="number"
                  min="1"
                  max="10"
                  value={quiz.size}
                  onChange={(e) =>
                    handleSizeChangeForQuiz(
                      quiz._id,
                      Math.min(10, Math.max(1, Number(e.target.value)))
                    )
                  }
                  style={styles.input}
                />
              </div>
              <button
                onClick={() => handleUpdateQuiz(quiz)}
                style={styles.updateButton}
              >
                Update Quiz
              </button>
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                style={styles.deleteButton}
              >
                Delete Quiz
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noQuizzes}>No quizzes found for this module.</p>
      )}
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
    textAlign: "center" as const, // Explicitly cast as const
    marginBottom: "1rem",
    color: "#333",
  },
  subheader: {
    fontSize: "1.5rem",
    marginTop: "2rem",
    marginBottom: "1rem",
    color: "#555",
  },
  formGroup: { marginBottom: "1.5rem" },
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
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "#f44336",
    marginBottom: "1rem",
    textAlign: "center" as const, // Explicitly cast as const
  },
  success: {
    color: "#4CAF50",
    marginBottom: "1rem",
    textAlign: "center" as const, // Explicitly cast as const
  },
  quizList: { listStyleType: "none", padding: 0 },
  quizItem: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  updateButton: {
    marginRight: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noQuizzes: {
    textAlign: "center" as const, // Explicitly cast as const
    fontStyle: "italic",
    color: "#777",
  },
};
