import React, { useState } from 'react';

// Main App component
function App() {
    // State variables for managing input and results
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [alternativeImplementations, setAlternativeImplementations] = useState([]);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [error, setError] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyzeCode = async () => {
        if (!code.trim()) {
            showMessageBox('Please enter some code to analyze.');
            return;
        }

        setShowResults(true);
        setResults(null);
        setAlternativeImplementations([]);
        setYoutubeVideos([]);
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/analyze-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong on the server.');
            }

            const data = await response.json();
            
            setResults({
                time_complexity: data.time_complexity,
                time_complexity_explanation: data.time_complexity_explanation,
                space_complexity: data.space_complexity,
                space_complexity_explanation: data.space_complexity_explanation,
                optimization_suggestions: data.optimization_suggestions,
                identified_problem: data.identified_problem
            });
            setAlternativeImplementations(data.alternative_implementations || []);
            setYoutubeVideos(data.youtube_videos || []);

        } catch (err) {
            console.error('Error during analysis:', err);
            setError('Failed to analyze code: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMessageBox = (message) => {
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            text-align: center;
            font-family: 'Inter', sans-serif;
            color: #333;
            max-width: 80%;
        `;
        messageBox.innerHTML = `
            <p>${message}</p>
            <button style="
                margin-top: 15px;
                padding: 8px 15px;
                background-color: #3b82f6;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">OK</button>
        `;
        document.body.appendChild(messageBox);

        messageBox.querySelector('button').onclick = () => {
            document.body.removeChild(messageBox);
        };
    };

    const placeholderText = `// Enter your ${language} code here...`;


    return (
        <div className="app-container">
            <style>
                {`
                /* --- Modified Light/Dark Theme --- */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f9fafb; /* Light gray background */
                    color: #1f2937; /* Dark gray text */
                    margin: 0;
                }

                .app-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                /* --- Header --- */
                .app-header {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.8); /* White transparent */
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    border-bottom: 1px solid #e5e7eb; /* Light gray border */
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 96rem;
                    margin: 0 auto;
                    padding: 1rem 1.5rem;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #1f2937; /* Dark text */
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                /* --- Main Content --- */
                .main-content {
                    width: 100%;
                    max-width: 48rem; /* max-w-4xl */
                    padding: 1.5rem;
                    margin-top: 80px; /* Space for fixed header */
                }

                .main-title {
                    font-size: 2.25rem; /* text-4xl */
                    font-weight: 700;
                    text-align: center;
                    margin-bottom: 3rem; /* my-12 */
                }

                /* --- Cards & Sections --- */
                .content-card {
                    background-color: #ffffff; /* White cards */
                    border-radius: 0.75rem; /* rounded-lg */
                    padding: 1.5rem; /* p-6 */
                    margin-bottom: 2rem;
                    border: 1px solid #e5e7eb; /* Light gray border */
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .card-title {
                    font-size: 1.25rem; /* text-xl */
                    font-weight: 600;
                }

                /* --- Dark Sections (for code and videos) --- */
                .dark-section {
                    background-color: #1e1e1e;
                    border-color: #282828;
                }
                .dark-section .card-title,
                .dark-section p,
                .dark-section h3 {
                    color: #e0e0e0;
                }
                 .dark-section a p {
                    color: #aaa;
                }


                /* --- Forms & Code (remains dark) --- */
                textarea, select {
                    font-family: 'Fira Code', monospace;
                    background-color: #282828;
                    color: #e0e0e0;
                    border: 1px solid #444;
                    border-radius: 0.5rem; /* rounded-md */
                    padding: 0.75rem 1rem;
                    width: 100%;
                    box-sizing: border-box;
                }
                textarea:focus, select:focus {
                    outline: none;
                    border-color: #818cf8; /* Indigo focus */
                    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.25);
                }
                textarea {
                    min-height: 250px;
                    resize: vertical;
                }
                .code-block {
                    background-color: #282828;
                    color: #d4d4d4;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.875rem;
                    overflow-x: auto;
                    border: 1px solid #444;
                }

                /* --- Buttons & Tags --- */
                .analyze-button {
                    width: 100%;
                    padding: 0.75rem;
                    font-weight: 600;
                    color: white;
                    border-radius: 0.5rem; /* rounded-md */
                    border: none;
                    cursor: pointer;
                    background-image: linear-gradient(to right, #4f46e5, #7c3aed); /* from-indigo-600 to-purple-700 */
                    transition: all 0.3s ease;
                }
                .analyze-button:hover {
                    box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
                }
                .analyze-button:disabled {
                    background: #9ca3af; /* gray-400 */
                    cursor: not-allowed;
                }

                .tag {
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                .tag-purple { color: #c4b5fd; background-color: rgba(196, 181, 253, 0.1); }
                .tag-yellow { color: #1a1a1a; background-color: #facc15; } /* yellow-500 */
                .tag-sky { color: #0ea5e9; background-color: rgba(14, 165, 233, 0.1); } /* sky-500 */

                /* --- Complexity Metrics --- */
                .complexity-metrics {
                    display: flex;
                    gap: 1rem;
                }
                .complexity-item {
                    flex: 1;
                    text-align: center;
                }
                .complexity-value {
                    font-family: 'Fira Code', monospace;
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #6d28d9; /* Darker purple for light background */
                }
                .complexity-item p {
                    color: #6b7280; /* gray-500 */
                }
                 p {
                    color: #374151; /* gray-700 */
                }

                /* --- Icons --- */
                .icon {
                    width: 1.5rem; /* w-6 */
                    height: 1.5rem; /* h-6 */
                    color: #c4b5fd; /* text-purple-400 */
                }

                /* --- Footer --- */
                .app-footer {
                    width: 100%;
                    max-width: 64rem; /* max-w-6xl */
                    padding: 3rem 1.5rem; /* py-12 px-6 */
                    margin: 2rem auto 0;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                }

                .feature-block {
                    background-color: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem; /* rounded-lg */
                    padding: 2rem;
                    text-align: center;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .feature-block:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05), 0 0 15px rgba(124, 58, 237, 0.1);
                }

                .feature-icon {
                    font-size: 2.5rem; /* text-5xl */
                    color: #8b5cf6; /* a nice purple */
                    margin-bottom: 1rem;
                    display: inline-block;
                }

                .feature-title {
                    font-size: 1.125rem; /* text-lg */
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .feature-description {
                    color: #6b7280; /* gray-500 */
                    font-size: 0.875rem; /* text-sm */
                }

                /* --- Responsive --- */
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 640px) {
                    .complexity-metrics {
                        flex-direction: column;
                    }
                    .main-content {
                        padding: 1rem;
                        margin-top: 70px;
                    }
                    .main-title {
                        font-size: 1.875rem;
                    }
                }
                `}
            </style>

            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{color: '#8b5cf6'}}>
                            <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 4L10 20" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>CodeAnalyzer</span>
                    </div>
                    {/* Navigation links can go here */}
                </div>
            </header>

            <main className="main-content">
                <h1 className="main-title">Analyze Your Code with AI</h1>
                <p style={{textAlign: 'center', maxWidth: '600px', margin: '-2rem auto 3rem', color: '#6b7280'}}>
                    Get instant insights into time & space complexity, optimization suggestions, and curated learning resources for any programming language.
                </p>

                {!showResults ? (
                    <section className="content-card">
                        <div className="card-header">
                            <h2 className="card-title">Code Input</h2>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <label htmlFor="language-select" className="card-title" style={{fontSize: '1rem', fontWeight: '500'}}>Select Language</label>
                            <select
                                id="language-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="typescript">TypeScript</option>
                                <option value="csharp">C#</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                            </select>
                            <textarea
                                placeholder={placeholderText}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            ></textarea>
                            <button
                                className="analyze-button"
                                onClick={handleAnalyzeCode}
                                disabled={loading}
                            >
                                {loading ? 'Analyzing...' : 'Analyze with AI'}
                            </button>
                        </div>
                    </section>
                ) : (
                    <>
                        {loading && <div className="loader" style={{margin: '2rem auto', borderTopColor: '#7c3aed'}}></div>}
                        
                        {error && <div style={{color: '#f87171', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem'}}>{error}</div>}

                        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                            {/* --- Submitted Code --- */}
                            <section className="content-card dark-section">
                                <div className="card-header">
                                    <h2 className="card-title">Submitted Code</h2>
                                </div>
                                <pre className="code-block"><code>{code}</code></pre>
                            </section>

                            {/* --- Complexity Analysis --- */}
                            <section className="content-card">
                                <div className="card-header">
                                    <h2 className="card-title">Complexity Analysis</h2>
                                </div>
                                {loading ? <p>Analyzing code... Please wait.</p> : results ? (
                                    <>
                                        <div className="complexity-metrics">
                                            <div className="complexity-item">
                                                <p style={{fontSize: '0.875rem'}}>Time Complexity</p>
                                                <p className="complexity-value">{results.time_complexity || '-'}</p>
                                            </div>
                                            <div className="complexity-item">
                                                <p style={{fontSize: '0.875rem'}}>Space Complexity</p>
                                                <p className="complexity-value">{results.space_complexity || '-'}</p>
                                            </div>
                                        </div>
                                        <p style={{textAlign: 'center', marginTop: '1rem'}}>{results.time_complexity_explanation}</p>
                                    </>
                                ) : (
                                    <div className="complexity-metrics">
                                        <div className="complexity-item">
                                            <p style={{fontSize: '0.875rem'}}>Time Complexity</p>
                                            <p className="complexity-value">-</p>
                                        </div>
                                        <div className="complexity-item">
                                            <p style={{fontSize: '0.875rem'}}>Space Complexity</p>
                                            <p className="complexity-value">-</p>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* --- Optimization Suggestions --- */}
                            {(!loading && results) && (
                                <section className="content-card">
                                    <div className="card-header">
                                        <h2 className="card-title">Optimization Suggestions</h2>
                                    </div>
                                    {results.optimization_suggestions && results.optimization_suggestions.length > 0 ? (
                                        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                                            {results.optimization_suggestions.map((suggestion, index) => (
                                                <li key={index} style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                                                    <svg className="icon flex-shrink-0 w-5 h-5 mt-1" style={{width: '1.25rem', height: '1.25rem', color: '#16a34a', flexShrink: 0, marginTop: '0.25rem'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p>No optimization suggestions provided.</p>}
                                </section>
                            )}

                            {/* --- Alternative Implementations (Dark) --- */}
                            {(!loading && results) && (
                                <section className="content-card dark-section">
                                    <div className="card-header">
                                        <h2 className="card-title">Alternative Implementations</h2>
                                    </div>
                                    {alternativeImplementations?.length > 0 ? (
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                            {alternativeImplementations.map((alt, index) => (
                                                <div key={index}>
                                                    <h3 style={{fontWeight: 600, color: '#c4b5fd', marginBottom: '0.5rem'}}>{alt.title}</h3>
                                                    <pre className="code-block"><code>{alt.code}</code></pre>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p>No alternative implementations were provided.</p>}
                                </section>
                            )}

                            {/* --- Recommended Videos (Dark) --- */}
                            {(!loading && results) && (
                                <section className="content-card dark-section">
                                    <div className="card-header">
                                        <h2 className="card-title">Recommended Videos</h2>
                                    </div>
                                    {youtubeVideos?.length > 0 ? (
                                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                                            {youtubeVideos.map((video, index) => (
                                                <a key={index} href={video.url} target="_blank" rel="noopener noreferrer" style={{display: 'block', backgroundColor: '#282828', padding: '0.75rem', borderRadius: '0.5rem', textDecoration: 'none', transition: 'background-color 0.2s'}}>
                                                    <img src={video.thumbnail} alt={video.title} style={{borderRadius: '0.375rem', marginBottom: '0.5rem', width: '100%', aspectRatio: '16/9', objectFit: 'cover'}}/>
                                                    <h3 className="video-title" style={{fontWeight: 600, fontSize: '0.875rem'}}>{video.title}</h3>
                                                    <p className="video-channel" style={{fontSize: '0.75rem'}}>{video.channelTitle}</p>
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p>No relevant videos were found.</p>}
                                </section>
                            )}
                        </div>
                    </>
                )}
            </main>

            <footer className="app-footer">
                <div className="footer-grid">
                    <div className="feature-block">
                        <span className="feature-icon">⚡</span>
                        <h3 className="feature-title">Instant Analysis</h3>
                        <p className="feature-description">Get real-time complexity analysis powered by advanced AI.</p>
                    </div>
                    <div className="feature-block">
                        <span className="feature-icon">✨</span>
                        <h3 className="feature-title">Smart Suggestions</h3>
                        <p className="feature-description">Receive personalized optimization recommendations.</p>
                    </div>
                    <div className="feature-block">
                        <span className="feature-icon">▶︎</span>
                        <h3 className="feature-title">Learn More</h3>
                        <p className="feature-description">Discover curated YouTube videos to deepen your understanding.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
