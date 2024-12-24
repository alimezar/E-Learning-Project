"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ManageQuestionsPage() {
  const params = useParams();
  const moduleId = params?.moduleId; // Get moduleId from dynamic folder
  const router = useRouter(); // To handle navigation
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [type, setType] = useState<string>("mcq");
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]); // Default to 4 empty options
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]); // Holds the list of questions for the module

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);

    // Adjust options based on type
    if (selectedType === "trueFalse") {
      setOptions(["True", "False"]);
      setAnswer(""); // Reset answer
    } else {
      setOptions(["", "", "", ""]); // Reset to default 4 options
      setAnswer(""); // Reset answer
    }
  };

  // Fetch questions for the module
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3001/questions?moduleId=${moduleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions.");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while fetching questions.");
      }
    };

    if (moduleId) {
      fetchQuestions();
    }
  }, [moduleId]);

  const handleCreateQuestion = async () => {
    try {
      setError(null);
      setSuccess(null);

      // Get userId from cookies
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

      // Ensure the answer matches one of the options
      if (!options.includes(answer)) {
        throw new Error("The answer must match one of the options.");
      }

      const payload = {
        userId,
        moduleId,
        difficulty,
        type,
        question,
        options,
        answer,
      };

      const response = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create question.");
      }

      setSuccess("Question created successfully!");
      setQuestion(""); // Reset fields after success
      setOptions(type === "trueFalse" ? ["True", "False"] : ["", "", "", ""]);
      setAnswer("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating the question.");
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: any) => {
    try {
      setError(null);
      setSuccess(null);

      // Ensure the answer matches one of the options
      if (!updatedQuestion.options.includes(updatedQuestion.answer)) {
        throw new Error("The answer must match one of the options.");
      }

      const response = await fetch(`http://localhost:3001/questions/${updatedQuestion._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuestion),
      });

      if (!response.ok) {
        throw new Error("Failed to update question.");
      }

      setSuccess(`Question updated successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while updating the question.");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete question.");
      }

      setSuccess("Question deleted successfully!");
      // Remove the deleted question from the state
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while deleting the question.");
    }
  };

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId
          ? { ...q, options: q.options.map((option: string, i: number) => (i === index ? value : option)) }
          : q
      )
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Manage Questions</h1>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {/* Create Question Section */}
      <div style={styles.section}>
        <h2 style={styles.subheader}>Create Question</h2>

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
          <label htmlFor="type" style={styles.label}>
            Question Type:
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            style={styles.select}
          >
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="trueFalse">True/False</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="question" style={styles.label}>
            Question:
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Options:</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => setOptions((prev) => prev.map((o, i) => (i === index ? e.target.value : o)))}
              placeholder={`Option ${index + 1}`}
              style={styles.input}
              disabled={type === "trueFalse"}
            />
          ))}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="answer" style={styles.label}>
            Correct Answer:
          </label>
          <input
            id="answer"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={styles.input}
          />
        </div>

        <button onClick={handleCreateQuestion} style={styles.button}>
          Create Question
        </button>
      </div>

      {/* Editable Questions Section */}
      <h2 style={styles.subheader}>Questions in Module</h2>
      {questions.length > 0 ? (
        <ul style={styles.questionList}>
          {questions.map((q) => (
            <li key={q._id} style={styles.questionItem}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Difficulty:</label>
                <select
                  value={q.difficulty}
                  onChange={(e) =>
                    setQuestions((prevQuestions) =>
                      prevQuestions.map((question) =>
                        question._id === q._id ? { ...question, difficulty: e.target.value } : question
                      )
                    )
                  }
                  style={styles.select}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Question Type:</label>
                <select
                  value={q.type}
                  onChange={(e) =>
                    setQuestions((prevQuestions) =>
                      prevQuestions.map((question) =>
                        question._id === q._id
                          ? {
                              ...question,
                              type: e.target.value,
                              options: e.target.value === "trueFalse" ? ["True", "False"] : ["", "", "", ""],
                            }
                          : question
                      )
                    )
                  }
                  style={styles.select}
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="trueFalse">True/False</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Question:</label>
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    setQuestions((prevQuestions) =>
                      prevQuestions.map((question) =>
                        question._id === q._id ? { ...question, question: e.target.value } : question
                      )
                    )
                  }
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Options:</label>
                {q.options.map((option: string, index: number) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(q._id, index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={styles.input}
                    disabled={q.type === "trueFalse"} // Disable inputs for true/false type
                  />
                ))}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Correct Answer:</label>
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) =>
                    setQuestions((prevQuestions) =>
                      prevQuestions.map((question) =>
                        question._id === q._id ? { ...question, answer: e.target.value } : question
                      )
                    )
                  }
                  style={styles.input}
                />
              </div>

              <button onClick={() => handleUpdateQuestion(q)} style={styles.updateButton}>
                Update Question
              </button>
              <button onClick={() => handleDeleteQuestion(q._id)} style={styles.deleteButton}>
                Delete Question
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noQuestions}>No questions found for this module.</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "Arial, sans-serif" },
  header: { fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center" as const },
  subheader: { fontSize: "1.5rem", fontWeight: "bold", marginTop: "2rem" },
  error: { color: "red", marginBottom: "1rem", textAlign: "center" as const },
  success: { color: "green", marginBottom: "1rem", textAlign: "center" as const },
  formGroup: { marginBottom: "1rem" },
  label: { display: "block", fontWeight: "bold", marginBottom: "0.5rem" },
  select: { width: "100%", padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  input: { width: "100%", padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "0.5rem" },
  textarea: { width: "100%", padding: "0.5rem", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  button: {
    display: "block",
    width: "100%",
    padding: "1rem",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  updateButton: {
    display: "block",
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#2196F3",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  deleteButton: {
    display: "block",
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#f44336",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  questionList: { listStyle: "none", padding: 0 },
  questionItem: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  noQuestions: { textAlign: "center" as const, fontStyle: "italic" },
};
