'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function QuizDetails() {
  const params = useParams();
  const moduleId = params?.moduleId;
  const quizzesId = params?.quizzesId;

  const [quiz, setQuiz] = useState({
    title: '',
    questions: [] as { question: string; options: string[]; correctAnswer: string }[],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        if (!moduleId || !quizzesId) throw new Error('Module ID or Quiz ID is missing.');

        const response = await fetch(`http://localhost:3001/modules/${moduleId}/quizzes/${quizzesId}`);
        if (!response.ok) throw new Error('Failed to fetch quiz details.');

        const data = await response.json();
        setQuiz(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchQuizDetails();
  }, [moduleId, quizzesId]);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz: {quiz.title}</h1>
      <ul style={styles.questionList}>
        {quiz.questions.map((question, index) => (
          <li key={index} style={styles.questionItem}>
            <h2 style={styles.questionTitle}>Q{index + 1}: {question.question}</h2>
            <ul style={styles.optionsList}>
              {question.options.map((option, optIndex) => (
                <li key={optIndex} style={styles.optionItem}>
                  <input
                    type="radio"
                    id={`q${index}-opt${optIndex}`}
                    name={`q${index}`}
                    value={option}
                    style={styles.radioButton}
                  />
                  <label htmlFor={`q${index}-opt${optIndex}`} style={styles.optionLabel}>
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#333',
  },
  questionList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  questionItem: {
    marginBottom: '2rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  questionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#333',
  },
  optionsList: {
    listStyleType: 'none',
    padding: 0,
  },
  optionItem: {
    marginBottom: '0.5rem',
  },
  radioButton: {
    marginRight: '0.5rem',
  },
  optionLabel: {
    fontSize: '1rem',
    color: '#555',
  },
};
