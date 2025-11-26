/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

const RingTryOn = () => {
  const [selectedRing, setSelectedRing] = useState(0);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [predictions, setPredictions] = useState([]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Ring collection
  const rings = [
    {
      id: 1,
      name: 'Classic Diamond',
      bandColor: '#E8E8E8',
      gemColor: '#B9F2FF',
      gemType: 'diamond',
      price: '$2,499'
    },
    {
      id: 2,
      name: 'Rose Gold Elegance',
      bandColor: '#E8B4A8',
      gemColor: '#FFD700',
      gemType: 'citrine',
      price: '$1,899'
    },
    {
      id: 3,
      name: 'Sapphire Dream',
      bandColor: '#C0C0C0',
      gemColor: '#0F52BA',
      gemType: 'sapphire',
      price: '$3,299'
    },
    {
      id: 4,
      name: 'Emerald Eternity',
      bandColor: '#FFD700',
      gemColor: '#50C878',
      gemType: 'emerald',
      price: '$2,799'
    },
    {
      id: 5,
      name: 'Ruby Romance',
      bandColor: '#E5E4E2',
      gemColor: '#E0115F',
      gemType: 'ruby',
      price: '$3,499'
    }
  ];

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setLoading(true);
      await tf.ready();
      const loadedModel = await handpose.load();
      setModel(loadedModel);
      setLoading(false);
    } catch (error) {
      console.error('Error loading model:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImageLoaded(true);
          detectHands(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const detectHands = async (image) => {
    if (!model || !image) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = image.width;
      canvas.height = image.height;
      
      ctx.drawImage(image, 0, 0);
      
      const hands = await model.estimateHands(canvas);
      setPredictions(hands);
      
      if (hands.length > 0) {
        drawRings(ctx, hands, image);
      }
    } catch (error) {
      console.error('Error detecting hands:', error);
    }
  };

  const drawRings = (ctx, hands, image) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0);

    hands.forEach((hand) => {
      const landmarks = hand.landmarks;
      
      // Ring finger keypoints (indices 13-16)
      const fingerBase = landmarks[13]; // MCP joint
      const fingerMiddle = landmarks[14]; // PIP joint
      const fingerTop = landmarks[15]; // DIP joint
      const fingerTip = landmarks[16]; // Tip
      
      // Calculate ring position (between base and middle of finger)
      const ringPos = {
        x: (fingerBase[0] + fingerMiddle[0]) / 2,
        y: (fingerBase[1] + fingerMiddle[1]) / 2
      };
      
      // Calculate finger angle
      const angle = Math.atan2(
        fingerMiddle[1] - fingerBase[1],
        fingerMiddle[0] - fingerBase[0]
      );
      
      // Calculate ring width based on finger width
      const fingerWidth = Math.sqrt(
        Math.pow(fingerTop[0] - fingerBase[0], 2) +
        Math.pow(fingerTop[1] - fingerBase[1], 2)
      );
      const ringWidth = fingerWidth * 0.35;
      const ringHeight = ringWidth * 0.5;
      
      drawRing(ctx, ringPos, ringWidth, ringHeight, angle);
    });
  };

  const drawRing = (ctx, position, width, height, angle) => {
    const ring = rings[selectedRing];
    
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(angle);
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Ring band
    ctx.fillStyle = ring.bandColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Metallic gradient
    const gradient = ctx.createLinearGradient(-width, -height, width, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner shadow for depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.7, height * 0.7, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw gemstones
    const gemCount = 5;
    const gemSpacing = width * 0.35;
    const startX = -(gemCount - 1) * gemSpacing / 2;
    
    for (let i = 0; i < gemCount; i++) {
      const gemX = startX + i * gemSpacing;
      const gemY = -height * 1.3;
      const gemSize = i === 2 ? width * 0.25 : width * 0.18;
      
      // Gem shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      
      // Gem base
      ctx.fillStyle = ring.gemColor;
      ctx.beginPath();
      ctx.arc(gemX, gemY, gemSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Gem facets
      ctx.shadowColor = 'transparent';
      
      // Bright spot
      const gemGradient = ctx.createRadialGradient(
        gemX - gemSize * 0.3, gemY - gemSize * 0.3, 0,
        gemX, gemY, gemSize
      );
      gemGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gemGradient.addColorStop(0.5, ring.gemColor);
      gemGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      
      ctx.fillStyle = gemGradient;
      ctx.beginPath();
      ctx.arc(gemX, gemY, gemSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Sparkle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(gemX - gemSize * 0.3, gemY - gemSize * 0.3, gemSize * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  useEffect(() => {
    if (imageLoaded && imageRef.current && model) {
      detectHands(imageRef.current);
    }
  }, [selectedRing, imageLoaded, model]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI-Powered Ring Try-On</h1>
          <p className="text-gray-600">Upload a photo to see rings on your hand using AI hand detection</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading AI Model...</p>
          </div>
        )}

        {!loading && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Canvas Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {!imageLoaded ? (
                  <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Upload Your Photo</h3>
                    <p className="text-gray-500 mb-6">Choose a clear photo showing your hand</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold"
                    >
                      Choose Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Change Photo
                      </button>
                      {predictions.length === 0 && (
                        <div className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm text-center">
                          No hands detected. Try another photo.
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              {imageLoaded && (
                <div className="flex items-center justify-between mt-6 bg-white rounded-2xl shadow-lg p-4">
                  <button
                    onClick={() => setSelectedRing((prev) => (prev - 1 + rings.length) % rings.length)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Ring {selectedRing + 1} of {rings.length}</p>
                    <p className="font-semibold text-gray-800">{rings[selectedRing].name}</p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRing((prev) => (prev + 1) % rings.length)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Ring Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {rings[selectedRing].name}
                </h2>
                <p className="text-3xl font-bold text-purple-600 mb-4">
                  {rings[selectedRing].price}
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold">
                  Add to Cart
                </button>
              </div>

              {/* Ring Gallery */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Ring</h3>
                <div className="space-y-3">
                  {rings.map((ring, index) => (
                    <button
                      key={ring.id}
                      onClick={() => setSelectedRing(index)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedRing === index
                          ? 'border-purple-600 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-8 h-8 rounded-full shadow-inner"
                          style={{ backgroundColor: ring.bandColor }}
                        />
                        <div
                          className="w-5 h-5 rounded-full shadow-lg"
                          style={{ backgroundColor: ring.gemColor }}
                        />
                      </div>
                      <p className="font-medium text-gray-800">{ring.name}</p>
                      <p className="text-sm text-gray-500">{ring.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Info */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ AI Technology</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Real-time hand detection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Automatic ring positioning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Realistic 3D rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    Perfect angle adjustment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RingTryOn;