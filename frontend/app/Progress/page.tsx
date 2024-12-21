'use client';

import { useState, useEffect } from 'react';

// /*
type Progress = {
    userId: string;
    courseId: string;
    completedPercentage: number;
    completedModules: string[];
    lastAccessed: string;
    averageScore: number;
};
//*/

const ProgressPage = () => {
    const [progressData, setProgressData] = useState<Progress[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch progress data from the backend
    const fetchProgress = async () => {
        try {
            const response = await fetch('http://localhost:3001/progress');
            if (!response.ok) throw new Error('Failed to fetch progress data');
            const data = await response.json();
            setProgressData(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching progress data');
        }
    };

    // Initialize progress
    const initializeProgress = async (userId: string, courseId: string) => {
        try {
            const response = await fetch('http://localhost:3001/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, courseId }),
            });
            if (!response.ok) throw new Error('Failed to initialize progress');
            fetchProgress(); // Refresh data after initialization
        } catch (err: any) {
            setError(err.message || 'An error occurred while initializing progress');
        }
    };

    // Complete a module
    const completeModule = async (userId: string, courseId: string, moduleId: string) => {
        try {
            const response = await fetch('http://localhost:3001/progress/complete', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, courseId, moduleId }),
            });
            if (!response.ok) throw new Error('Failed to complete module');
            fetchProgress(); // Refresh data after module completion
        } catch (err: any) {
            setError(err.message || 'An error occurred while completing the module');
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);



    return (
        <div style={styles.containerStyle}>
            <h1>Progress Management</h1>

            {error && <p style={styles.errorStyle}>{error}</p>}

            {/* Display all progress */}
            <div>
                <h2>All Progress</h2>
                {progressData.length === 0 ? (
                    <p>No progress data available</p>
                ) : (
                    <table style={styles.tableStyle}  >
                        <thead>
                            <tr>
                                <th style={styles.thStyle}>User ID</th>
                                <th style={styles.thStyle}>Course ID</th>
                                <th style={styles.thStyle}>Completed Percentage</th>
                                <th style={styles.thStyle}>Completed Modules</th>
                                <th style={styles.thStyle}>Last Accessed</th>
                                <th style={styles.thStyle}>Average Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progressData.map((progress) => (
                                <tr key={`${progress.userId}-${progress.courseId}`}>
                                    <td style={styles.tdStyle}>{progress.userId}</td>
                                    <td style={styles.tdStyle}>{progress.courseId}</td>
                                    <td style={styles.tdStyle}>{progress.completedPercentage}%</td>

                                    <td style={styles.tdStyle}>

                                        {Array.isArray(progress.completedModules) && progress.completedModules.length > 0
                                            ? progress.completedModules.join(', ')
                                            : 'None'}

                                    </td>

                                    <td style={styles.tdStyle}>{new Date(progress.lastAccessed).toLocaleString()}</td>
                                    <td style={styles.tdStyle}>{progress.averageScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Initialize progress */}
            <div style={{ marginTop: '20px' }}>
                <h2>Initialize Progress</h2>
                <form
                    style={styles.formStyle}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const userId = formData.get('userId') as string;
                        const courseId = formData.get('courseId') as string;
                        initializeProgress(userId, courseId);
                    }}
                >
                    <label>
                        User ID:
                        <input type="text" name="userId" required style={styles.inputStyle} />
                    </label>
                    <label>
                        Course ID:
                        <input type="text" name="courseId" required style={styles.inputStyle} />
                    </label>
                    <button type="submit" style={styles.buttonStyle}>
                        Initialize Progress
                    </button>
                </form>
            </div>

            {/* Complete a module */}
            <div style={{ marginTop: '20px' }}>
                <h2>Complete Module</h2>
                <form
                    style={styles.formStyle}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const userId = formData.get('userId') as string;
                        const courseId = formData.get('courseId') as string;
                        const moduleId = formData.get('moduleId') as string;
                        completeModule(userId, courseId, moduleId);
                    }}
                >
                    <label>
                        User ID:
                        <input type="text" name="userId" required style={styles.inputStyle} />
                    </label>
                    <label>
                        Course ID:
                        <input type="text" name="courseId" required style={styles.inputStyle} />
                    </label>
                    <label>
                        Module ID:
                        <input type="text" name="moduleId" required style={styles.inputStyle} />
                    </label>
                    <button type="submit" style={styles.buttonStyle}>
                        Complete Module
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    // Styles
    containerStyle: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: 'auto',
    },

    tableStyle: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
    },

    thStyle: {
        backgroundColor: '#f4f4f4',
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
        padding: '10px',
    },

    tdStyle: {
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
        padding: '10px',
    },

    formStyle: {
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },

    inputStyle: {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },

    buttonStyle: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },

    errorStyle: {
        color: 'red',
        marginTop: '10px',
    }
}


export default ProgressPage;