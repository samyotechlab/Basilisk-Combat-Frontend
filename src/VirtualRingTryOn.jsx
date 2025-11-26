import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw } from 'lucide-react';

const VirtualRingTryOn = () => {
  const [mode, setMode] = useState('camera');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [handDetected, setHandDetected] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [handsInstance, setHandsInstance] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraRef = useRef(null);

  // Load MediaPipe Hands from CDN
  useEffect(() => {
    const loadMediaPipe = () => {
      // Check if already loaded
      if (window.Hands) {
        initializeHands();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        const cameraScript = document.createElement('script');
        cameraScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        cameraScript.crossOrigin = 'anonymous';
        
        cameraScript.onload = () => {
          initializeHands();
        };
        
        cameraScript.onerror = () => {
          setError('Failed to load camera utilities');
          setIsLoading(false);
        };
        
        document.head.appendChild(cameraScript);
      };
      
      script.onerror = () => {
        setError('Failed to load hand tracking library');
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadMediaPipe();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const initializeHands = () => {
    if (!window.Hands) {
      setTimeout(initializeHands, 100);
      return;
    }

    try {
      const hands = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      hands.onResults(onHandsResults);
      setHandsInstance(hands);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize hand tracking: ' + err.message);
      setIsLoading(false);
    }
  };

  const onHandsResults = (results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the source image/video
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      
      results.multiHandLandmarks.forEach((landmarks) => {
        // Get ring finger MCP joint (landmark 13) for ring placement
        const ringFingerMCP = landmarks[13];
        const ringFingerPIP = landmarks[14];
        const ringFingerDIP = landmarks[15];
        
        // Calculate ring position
        const x = ringFingerMCP.x * canvas.width;
        const y = ringFingerMCP.y * canvas.height;
        
        // Calculate ring size based on finger dimensions
        const dx = (ringFingerPIP.x - ringFingerMCP.x) * canvas.width;
        const dy = (ringFingerPIP.y - ringFingerMCP.y) * canvas.height;
        const fingerSegmentLength = Math.sqrt(dx * dx + dy * dy);
        const ringSize = fingerSegmentLength * 0.5;
        
        // Calculate rotation angle
        const angle = Math.atan2(dy, dx);
        
        // Draw the ring
        drawRing(ctx, x, y, ringSize, angle);
      });
    } else {
      setHandDetected(false);
    }
    
    ctx.restore();
  };

  const drawRing = (ctx, x, y, size, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Main ring band (gold)
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.7, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = size * 0.3;
    ctx.stroke();
    
    // Inner ring shadow
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.85, size * 0.6, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = size * 0.15;
    ctx.stroke();
    
    // Outer ring highlight
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 1.05, size * 0.75, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#FFEC8B';
    ctx.lineWidth = size * 0.08;
    ctx.stroke();
    
    // Diamond/jewel on top
    const jewelSize = size * 0.6;
    const jewelY = -size * 0.9;
    
    // Diamond base (dark)
    ctx.beginPath();
    ctx.moveTo(0, jewelY - jewelSize);
    ctx.lineTo(jewelSize * 0.6, jewelY);
    ctx.lineTo(0, jewelY + jewelSize * 0.4);
    ctx.lineTo(-jewelSize * 0.6, jewelY);
    ctx.closePath();
    ctx.fillStyle = '#B0E0E6';
    ctx.fill();
    
    // Diamond highlight
    ctx.beginPath();
    ctx.moveTo(0, jewelY - jewelSize);
    ctx.lineTo(jewelSize * 0.6, jewelY);
    ctx.lineTo(0, jewelY + jewelSize * 0.4);
    ctx.lineTo(-jewelSize * 0.6, jewelY);
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(0, jewelY, 0, 0, jewelY, jewelSize);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.3, '#E0FFFF');
    gradient.addColorStop(0.7, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Diamond outline
    ctx.strokeStyle = '#4682B4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Sparkle points
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-jewelSize * 0.25, jewelY - jewelSize * 0.4, jewelSize * 0.15, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(jewelSize * 0.2, jewelY - jewelSize * 0.3, jewelSize * 0.1, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.restore();
  };

  const startCamera = async () => {
    if (!handsInstance || !videoRef.current) return;
    
    try {
      setError('');
      
      if (window.Camera) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            await handsInstance.send({ image: videoRef.current });
          },
          width: 640,
          height: 480
        });
        
        await camera.start();
        cameraRef.current = camera;
      } else {
        // Fallback to getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 }
        });
        
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        if (canvasRef.current) {
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
        }
        
        detectHandsLoop();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or upload an image.');
    }
  };

  const detectHandsLoop = async () => {
    if (!handsInstance || !videoRef.current) return;
    
    const detect = async () => {
      if (mode === 'camera' && videoRef.current && videoRef.current.readyState === 4) {
        await handsInstance.send({ image: videoRef.current });
      }
      animationFrameRef.current = requestAnimationFrame(detect);
    };
    
    detect();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      setUploadedImage(event.target.result);
      
      const img = new Image();
      img.onload = async () => {
        if (canvasRef.current && handsInstance) {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          
          await handsInstance.send({ image: img });
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const switchToCamera = () => {
    setMode('camera');
    setUploadedImage(null);
    setHandDetected(false);
    if (canvasRef.current) {
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
    }
    if (handsInstance) {
      startCamera();
    }
  };

  const switchToUpload = () => {
    setMode('upload');
    setHandDetected(false);
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    if (mode === 'camera' && handsInstance && !isLoading) {
      startCamera();
    }
  }, [mode, handsInstance, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            💍 Virtual Ring Try-On
          </h1>
          <p className="text-gray-600 text-sm">Powered by MediaPipe Hands AI</p>
        </div>
        
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={switchToCamera}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'camera'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Camera size={20} />
            Live Camera
          </button>
          <button
            onClick={switchToUpload}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              mode === 'upload'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Upload size={20} />
            Upload Image
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">⚠️ Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={48} />
            <p className="text-gray-600 text-lg font-semibold">Loading AI Model...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        )}

        {!isLoading && (
          <div className="relative bg-black rounded-lg overflow-hidden mb-4 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="w-full h-auto"
            />
            
            <div className="absolute top-4 right-4">
              <div
                className={`px-4 py-2 rounded-full text-white font-semibold shadow-lg transition-all transform ${
                  handDetected ? 'bg-green-500 scale-105' : 'bg-red-500'
                }`}
              >
                {handDetected ? '✓ Hand Detected' : '✗ Show Your Hand'}
              </div>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
        />

        {mode === 'upload' && !isLoading && (
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg transform hover:scale-105"
            >
              📷 Choose Hand Image
            </button>
            <p className="text-gray-600 mt-3 text-sm">
              Upload a clear photo of your hand with fingers spread
            </p>
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center gap-2">
            <span>💡</span> Tips for Best Results:
          </h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold min-w-5">1.</span>
              <span>Show your hand clearly with <strong>fingers spread apart</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold min-w-5">2.</span>
              <span>Use <strong>good lighting</strong> - natural light works best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold min-w-5">3.</span>
              <span>Keep your hand <strong>steady</strong> for better detection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold min-w-5">4.</span>
              <span>Try different angles - <strong>palm facing camera</strong> works great!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VirtualRingTryOn;