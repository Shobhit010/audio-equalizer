import { useState } from 'react'
import AudioVisualizer from './components/AudioVisualizer'

function App() {
    const [isListening, setIsListening] = useState(false);

    return (
        <div className="App" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#121212',
            color: 'white'
        }}>
            <h1 style={{ marginBottom: '20px', fontWeight: 300, letterSpacing: '2px' }}>
                CIRCULAR <span style={{ color: '#00F0FF', fontWeight: 600 }}>EQUALIZER</span>
            </h1>

            <div style={{ position: 'relative', width: '400px', height: '400px' }}>
                <AudioVisualizer isActive={isListening} />
            </div>

            <div style={{ marginTop: '40px', zIndex: 10 }}>
                <button
                    onClick={() => setIsListening(!isListening)}
                    style={{
                        padding: '12px 32px',
                        fontSize: '18px',
                        background: isListening ? 'transparent' : '#00F0FF',
                        color: isListening ? '#00F0FF' : '#121212',
                        border: `2px solid #00F0FF`,
                        borderRadius: '50px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        boxShadow: isListening ? 'none' : '0 0 20px rgba(0, 240, 255, 0.5)'
                    }}
                >
                    {isListening ? 'Stop Visualization' : 'Start Visualization'}
                </button>
            </div>

            {!isListening && (
                <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
                    Click start and allow microphone access
                </p>
            )}
        </div>
    )
}

export default App
