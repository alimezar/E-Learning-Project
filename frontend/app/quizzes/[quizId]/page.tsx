import { GetServerSideProps } from 'next';
import { useState } from 'react';

type Question = {
  _id: string;
  question: string;
  options: string[];
  choice?: string; // Optional, since user selects it
};

type QuizProps = {
  moduleTitle: string;
  questions: Question[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { quizId } = context.params!;
  const res = await fetch(`http://localhost:3001/quizzes/${quizId}`);
  const quizData = await res.json();

  return {
    props: {
      moduleTitle: quizData.moduleId.title,
      questions: quizData.questions,
    },
  };
};

const QuizPage = ({ moduleTitle, questions }: QuizProps) => {
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});

  const handleOptionSelect = (questionId: string, option: string) => {
    setUserChoices((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  return (
    <div>
      <h1>{moduleTitle}</h1>
      {questions.map((q, index) => (
        <div key={q._id} style={{ marginBottom: '20px' }}>
          <h2>
            {index + 1}. {q.question}
          </h2>
          <div>
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(q._id, option)}
                style={{
                  padding: '10px',
                  margin: '5px',
                  backgroundColor: userChoices[q._id] === option ? 'lightblue' : 'white',
                  border: '1px solid black',
                  cursor: 'pointer',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizPage;
