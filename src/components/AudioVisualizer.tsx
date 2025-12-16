import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const requestRef = useRef<number>();

    useEffect(() => {
        const initAudio = async () => {
            if (!isActive) return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Initialize Audio Context
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const audioCtx = new AudioContext();
                audioContextRef.current = audioCtx;

                // Create Analyser
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256; // Smaller fftSize for fewer, wider bars (128 bins)
                analyserRef.current = analyser;

                // Create Source
                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                sourceRef.current = source;

                draw();
            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert('Microphone access denied or not available.');
            }
        };

        const stopAudio = () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        if (isActive) {
            initAudio();
        } else {
            stopAudio();
        }

        return () => {
            stopAudio();
        };
    }, [isActive]);

    const draw = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount; // 128
        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        // Clear canvas
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100; // Base circle radius

        // Draw circles for decoration
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#333';
        ctx.stroke();

        const barCount = 128; // Use a subset or all
        const step = (Math.PI * 2) / barCount;

        for (let i = 0; i < barCount; i++) {
            // Map i to the frequency data. 
            // We use a portion of the spectrum (usually the lower half has more energy) or the whole thing.
            // bufferLength is 128.
            const value = dataArray[i];
            const barHeight = (value / 255) * 150; // Max height 150px

            const angle = i * step;

            // Start point (on the circle circumference)
            const x1 = centerX + Math.cos(angle) * (radius + 5);
            const y1 = centerY + Math.sin(angle) * (radius + 5);

            // End point (extending outwards)
            const x2 = centerX + Math.cos(angle) * (radius + 5 + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + 5 + barHeight);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            // Dynamic coloring
            // Cyan to Purple gradient simulation
            // const hue = (i / barCount) * 360; // REMOVED: Unused variable causing TS6133
            ctx.strokeStyle = `hsl(${200 + (i / barCount) * 100}, 100%, 50%)`; // Blue to Purple range
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        requestRef.current = requestAnimationFrame(draw);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={800}
                style={{ width: '400px', height: '400px' }}
            />
        </div>
    );
};

export default AudioVisualizer;