/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Camera, ZoomIn, ZoomOut, Maximize2, Smartphone, ChevronLeft, ChevronRight, Move, Type, Ruler, Share2, Layers, Play, DollarSign } from 'lucide-react';

export default function RingConfigurator() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const ringGroupRef = useRef(null);
  const rendererRef = useRef(null);
  
  const [viewMode, setViewMode] = useState('3d');
  const [metalType, setMetalType] = useState('yellow-gold');
  const [diamondColor, setDiamondColor] = useState('white');
  const [diamondSize, setDiamondSize] = useState('1-carat');
  const [ringSize, setRingSize] = useState('7');
  const [bandWidth, setBandWidth] = useState('medium');
  const [engraving, setEngraving] = useState('');
  const [showEngraving, setShowEngraving] = useState(false);
  const [zoom, setZoom] = useState(10);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showARInfo, setShowARInfo] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Comparison mode
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonConfigs, setComparisonConfigs] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // 360° animation
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFrames, setRecordedFrames] = useState([]);
  const [showAnimationPreview, setShowAnimationPreview] = useState(false);
  
  // Social sharing
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  
  // Price calculator
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  
  const [ringPosition, setRingPosition] = useState({ x: 0, y: -0.5, z: 0 });
  const [ringScale, setRingScale] = useState(1);
  const [isPositioning, setIsPositioning] = useState(false);
  
  const ringStyles = [
    { name: 'Classic Solitaire', diamond: 'white', metal: 'yellow-gold', width: 'medium', size: '1-carat' },
    { name: 'Rose Romance', diamond: 'pink', metal: 'rose-gold', width: 'thin', size: '0.75-carat' },
    { name: 'Blue Elegance', diamond: 'blue', metal: 'white-gold', width: 'medium', size: '1-carat' },
    { name: 'Vintage Gold', diamond: 'yellow', metal: 'yellow-gold', width: 'wide', size: '1.5-carat' },
    { name: 'Platinum Dream', diamond: 'white', metal: 'platinum', width: 'medium', size: '1-carat' },
    { name: 'Pink Platinum', diamond: 'pink', metal: 'platinum', width: 'thin', size: '0.75-carat' }
  ];
  
  const metals = {
    'yellow-gold': { color: 0xffd700, name: 'Yellow Gold', metalness: 0.95, price: 800 },
    'white-gold': { color: 0xe5e5e5, name: 'White Gold', metalness: 0.95, price: 850 },
    'rose-gold': { color: 0xffc0a0, name: 'Rose Gold', metalness: 0.95, price: 820 },
    'platinum': { color: 0xd0d0d0, name: 'Platinum', metalness: 0.98, price: 1200 }
  };
  
  const diamonds = {
    'white': { color: 0xffffff, name: 'White Diamond' },
    'pink': { color: 0xffb6c1, name: 'Pink Diamond' },
    'blue': { color: 0xadd8e6, name: 'Blue Diamond' },
    'yellow': { color: 0xffffe0, name: 'Yellow Diamond' }
  };
  
  const diamondSizes = {
    '0.5-carat': { name: '0.5 Carat', price: 1200, scale: 0.8 },
    '0.75-carat': { name: '0.75 Carat', price: 2400, scale: 0.9 },
    '1-carat': { name: '1.0 Carat', price: 4500, scale: 1.0 },
    '1.5-carat': { name: '1.5 Carat', price: 8200, scale: 1.2 },
    '2-carat': { name: '2.0 Carat', price: 15000, scale: 1.4 }
  };
  
  const bandWidths = {
    'thin': { scale: 0.8, name: 'Thin (2mm)', price: 0 },
    'medium': { scale: 1.0, name: 'Medium (3mm)', price: 100 },
    'wide': { scale: 1.3, name: 'Wide (4mm)', price: 250 }
  };
  
  // Calculate total price
  const calculatePrice = () => {
    const metalPrice = metals[metalType].price;
    const diamondPrice = diamondSizes[diamondSize].price;
    const bandPrice = bandWidths[bandWidth].price;
    const engravingPrice = showEngraving && engraving ? 50 : 0;
    
    // Premium for colored diamonds
    const colorMultiplier = diamondColor === 'white' ? 1 : 1.3;
    
    const total = metalPrice + (diamondPrice * colorMultiplier) + bandPrice + engravingPrice;
    return Math.round(total);
  };
  
  // Add current config to comparison
  const addToComparison = () => {
    if (comparisonConfigs.length >= 3) {
      alert('Maximum 3 rings for comparison');
      return;
    }
    
    const config = {
      id: Date.now(),
      metal: metalType,
      diamond: diamondColor,
      diamondSize,
      bandWidth,
      engraving: showEngraving ? engraving : '',
      size: ringSize,
      price: calculatePrice()
    };
    
    setComparisonConfigs([...comparisonConfigs, config]);
    setComparisonMode(true);
  };
  
  // Remove from comparison
  const removeFromComparison = (id) => {
    setComparisonConfigs(comparisonConfigs.filter(c => c.id !== id));
    if (comparisonConfigs.length <= 1) {
      setComparisonMode(false);
      setShowComparison(false);
    }
  };
  
  // Start 360° recording
  const start360Recording = () => {
    setIsRecording(true);
    setRecordedFrames([]);
    setAutoRotate(false);
    
    const frames = [];
    const totalFrames = 36; // 10 degree increments
    let currentFrame = 0;
    
    const captureFrame = () => {
      if (currentFrame >= totalFrames) {
        setIsRecording(false);
        setRecordedFrames(frames);
        setShowAnimationPreview(true);
        return;
      }
      
      // Capture current frame
      if (rendererRef.current && ringGroupRef.current) {
        const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
        frames.push(dataUrl);
        
        // Rotate ring
        ringGroupRef.current.rotation.y += (Math.PI * 2) / totalFrames;
        
        currentFrame++;
        setTimeout(captureFrame, 100);
      }
    };
    
    setTimeout(captureFrame, 100);
  };
  
  // Capture and share current view
  const captureForSharing = () => {
    if (rendererRef.current) {
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      setShareImage(dataUrl);
      setShowShareModal(true);
    }
  };
  
  // Share functions
  const shareToSocial = (platform) => {
    const configText = `My custom ring: ${metals[metalType].name} with ${diamonds[diamondColor].name} (${diamondSizes[diamondSize].name}) - $${calculatePrice().toLocaleString()}`;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(configText)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
        break;
      case 'pinterest':
        if (shareImage) {
          window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(shareImage)}&description=${encodeURIComponent(configText)}`);
        }
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out my custom ring&body=${encodeURIComponent(configText)}`;
        break;
      default:
        break;
    }
  };
  
  const applyStyle = (index) => {
    setIsAnimating(true);
    setSelectedStyle(index);
    const style = ringStyles[index];
    
    setTimeout(() => {
      setMetalType(style.metal);
      setDiamondColor(style.diamond);
      setBandWidth(style.width);
      setDiamondSize(style.size);
    }, 150);
    
    setTimeout(() => setIsAnimating(false), 600);
  };
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    if (viewMode === 'photo') {
      scene.background = null;
    } else {
      scene.background = new THREE.Color(0xf5f5f5);
    }
    
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, zoom);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: viewMode === 'photo',
      preserveDrawingBuffer: true // For screenshots
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);
    
    const ringGroup = new THREE.Group();
    ringGroupRef.current = ringGroup;
    
    const widthScale = bandWidths[bandWidth].scale;
    const diamondScale = diamondSizes[diamondSize].scale;
    
    const bandGeometry = new THREE.TorusGeometry(1, 0.15 * widthScale, 16, 100);
    const metalConfig = metals[metalType];
    const bandMaterial = new THREE.MeshStandardMaterial({
      color: metalConfig.color,
      metalness: metalConfig.metalness,
      roughness: 0.1
    });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.rotation.x = Math.PI / 2;
    band.castShadow = true;
    band.name = 'band';
    ringGroup.add(band);
    
    if (showEngraving && engraving) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#333';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(engraving, 256, 40);
      
      const texture = new THREE.CanvasTexture(canvas);
      const engravingMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        color: 0x888888,
        metalness: 0.5,
        roughness: 0.5
      });
      
      const engravingGeometry = new THREE.PlaneGeometry(1.5, 0.15);
      const engravingMesh = new THREE.Mesh(engravingGeometry, engravingMaterial);
      engravingMesh.position.y = -0.05;
      engravingMesh.rotation.x = Math.PI / 2;
      engravingMesh.name = 'engraving';
      ringGroup.add(engravingMesh);
    }
    
    const settingGeometry = new THREE.CylinderGeometry(0.25 * diamondScale, 0.3 * diamondScale, 0.15, 6);
    const setting = new THREE.Mesh(settingGeometry, bandMaterial);
    setting.position.y = 0.4;
    setting.castShadow = true;
    setting.name = 'setting';
    ringGroup.add(setting);
    
    const diamondGeometry = new THREE.OctahedronGeometry(0.4 * diamondScale, 0);
    const diamondConfig = diamonds[diamondColor];
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: diamondConfig.color,
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 0.3,
      ior: 2.4
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.y = 0.65 * diamondScale;
    diamond.castShadow = true;
    diamond.name = 'diamond';
    ringGroup.add(diamond);
    
    const prongGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.35 * diamondScale, 8);
    
    for (let i = 0; i < 6; i++) {
      const prong = new THREE.Mesh(prongGeometry, bandMaterial);
      const angle = (i * Math.PI) / 3;
      prong.position.x = Math.cos(angle) * 0.22 * diamondScale;
      prong.position.z = Math.sin(angle) * 0.22 * diamondScale;
      prong.position.y = 0.475 * diamondScale;
      prong.castShadow = true;
      prong.name = 'prong';
      ringGroup.add(prong);
    }
    
    const detailGeometry = new THREE.SphereGeometry(0.04 * widthScale, 16, 16);
    for (let i = 0; i < 12; i++) {
      const detail = new THREE.Mesh(detailGeometry, bandMaterial);
      const angle = (i * Math.PI * 2) / 12;
      detail.position.x = Math.cos(angle) * 1.15;
      detail.position.z = Math.sin(angle) * 1.15;
      detail.castShadow = true;
      ringGroup.add(detail);
    }
    
    scene.add(ringGroup);
    
    ringGroup.position.set(ringPosition.x, ringPosition.y, ringPosition.z);
    ringGroup.scale.setScalar(ringScale);
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    
    const handleMouseDown = (e) => {
      if (isPositioning) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      rotation.y += deltaX * 0.01;
      rotation.x += deltaY * 0.01;
      
      rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.x));
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      if (isPositioning) {
        const newScale = Math.max(0.5, Math.min(2, ringScale + e.deltaY * -0.001));
        setRingScale(newScale);
      } else {
        const delta = e.deltaY * 0.01;
        const newZoom = Math.max(5, Math.min(20, zoom + delta));
        setZoom(newZoom);
      }
    };
    
    const handleTouchStart = (e) => {
      if (isPositioning || e.touches.length !== 1) return;
      isDragging = true;
      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };
    
    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      
      rotation.y += deltaX * 0.01;
      rotation.x += deltaY * 0.01;
      
      rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.x));
      
      previousMousePosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };
    
    const handleTouchEnd = () => {
      isDragging = false;
    };
    
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchmove', handleTouchMove);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (autoRotate && !isDragging && !isPositioning && !isRecording) {
        rotation.y += 0.005;
      }
      
      ringGroup.rotation.y = rotation.y;
      ringGroup.rotation.x = rotation.x;
      
      camera.position.z = zoom;
      
      renderer.render(scene, camera);
    };
    animate();
    
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [metalType, diamondColor, diamondSize, zoom, autoRotate, viewMode, bandWidth, engraving, showEngraving, isPositioning, ringPosition, ringScale, isRecording]);
  
  useEffect(() => {
    if (!ringGroupRef.current) return;
    
    const metalConfig = metals[metalType];
    const diamondConfig = diamonds[diamondColor];
    
    ringGroupRef.current.children.forEach(child => {
      if (child.name === 'band' || child.name === 'setting' || child.name === 'prong' || !child.name) {
        if (child.material) {
          child.material.color.setHex(metalConfig.color);
          child.material.metalness = metalConfig.metalness;
        }
      } else if (child.name === 'diamond') {
        if (child.material) {
          child.material.color.setHex(diamondConfig.color);
        }
      }
    });
    
    ringGroupRef.current.position.set(ringPosition.x, ringPosition.y, ringPosition.z);
    ringGroupRef.current.scale.setScalar(ringScale);
  }, [metalType, diamondColor, ringPosition, ringScale]);
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Diamond Ring Configurator Pro</h1>
            <p className="text-gray-600 text-sm mt-1">
              Full-featured jewelry customization platform
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                viewMode === '3d' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Maximize2 size={18} />
              3D
            </button>
            <button
              onClick={() => setViewMode('photo')}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                viewMode === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Camera size={18} />
              Photo
            </button>
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
          <button
            onClick={captureForSharing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Share2 size={18} />
            Share Design
          </button>
          <button
            onClick={addToComparison}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <Layers size={18} />
            Add to Compare ({comparisonConfigs.length}/3)
          </button>
          {comparisonConfigs.length > 0 && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition whitespace-nowrap"
            >
              View Comparison
            </button>
          )}
          <button
            onClick={start360Recording}
            disabled={isRecording}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${
              isRecording 
                ? 'bg-red-600 text-white cursor-not-allowed' 
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            <Play size={18} />
            {isRecording ? 'Recording...' : 'Create 360° View'}
          </button>
          <button
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <DollarSign size={18} />
            Price Details
          </button>
        </div>
      </div>
      
      {/* Style Gallery */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => applyStyle(selectedStyle > 0 ? selectedStyle - 1 : ringStyles.length - 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {ringStyles.map((style, index) => (
                  <button
                    key={index}
                    onClick={() => applyStyle(index)}
                    className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedStyle === index
                        ? 'border-blue-600 bg-blue-50 scale-105 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold text-gray-800">{style.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{diamondSizes[style.size].name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => applyStyle(selectedStyle < ringStyles.length - 1 ? selectedStyle + 1 : 0)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          {viewMode === 'photo' && (
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(data:image/svg+xml,%3Csvg width="1200" height="800" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="grad"%3E%3Cstop offset="0%25" style="stop-color:%23f0e6d8;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23e8d5c4;stop-opacity:1" /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width="1200" height="800" fill="url(%23grad)" /%3E%3Cellipse cx="600" cy="450" rx="140" ry="220" fill="%23ffd4b8" opacity="0.9" /%3E%3Cellipse cx="650" cy="350" rx="90" ry="120" fill="%23ffcaa8" opacity="0.7" /%3E%3Cellipse cx="620" cy="280" rx="50" ry="60" fill="%23ffc098" opacity="0.5" /%3E%3C/svg%3E)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          <div 
            ref={mountRef} 
            className={`w-full h-full relative z-10 transition-all duration-300 ${
              isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`} 
          />
          
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2">
            <button
              onClick={() => setZoom(Math.max(5, zoom - 1))}
              className="p-2 hover:bg-gray-100 rounded transition"
            >
              <ZoomIn size={20} />
            </button>
            <div className="text-xs text-center text-gray-600">{Math.round(zoom)}</div>
            <button
              onClick={() => setZoom(Math.min(20, zoom + 1))}
              className="p-2 hover:bg-gray-100 rounded transition"
            >
              <ZoomOut size={20} />
            </button>
          </div>
          
          {/* Positioning Tool */}
          {viewMode === 'photo' && (
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
              <button
                onClick={() => setIsPositioning(!isPositioning)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isPositioning ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Move size={18} />
                {isPositioning ? 'Positioning...' : 'Position Ring'}
              </button>
              
              {isPositioning && (
                <div className="space-y-2 text-sm">
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">X Position</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={ringPosition.x}
                      onChange={(e) => setRingPosition({...ringPosition, x: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">Y Position</label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={ringPosition.y}
                      onChange={(e) => setRingPosition({...ringPosition, y: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">Scale</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={ringScale}
                      onChange={(e) => setRingScale(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* AR Button */}
          <button
            onClick={() => setShowARInfo(true)}
            className="absolute bottom-4 left-4 bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg font-medium hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Smartphone size={20} />
            View in AR
          </button>
        </div>
        
        {/* Configuration Panel */}
        <div className="w-96 bg-white shadow-2xl overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Metal Type */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Ruler size={18} />
                Metal Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(metals).map(([key, metal]) => (
                  <button
                    key={key}
                    onClick={() => setMetalType(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      metalType === key
                        ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: `#${metal.color.toString(16).padStart(6, '0')}` }}
                    />
                    <div className="text-sm font-medium text-gray-700">{metal.name}</div>
                    <div className="text-xs text-gray-500">+${metal.price}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Diamond Size */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Diamond Size</h3>
              <div className="space-y-2">
                {Object.entries(diamondSizes).map(([key, size]) => (
                  <button
                    key={key}
                    onClick={() => setDiamondSize(key)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      diamondSize === key
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{size.name}</span>
                      <span className="text-sm text-gray-500">+${size.price.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Band Width */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Band Width</h3>
              <div className="space-y-2">
                {Object.entries(bandWidths).map(([key, width]) => (
                  <button
                    key={key}
                    onClick={() => setBandWidth(key)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      bandWidth === key
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{width.name}</span>
                      {width.price > 0 && <span className="text-sm text-gray-500">+${width.price}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Diamond Color */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Diamond Color</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(diamonds).map(([key, diamond]) => (
                  <button
                    key={key}
                    onClick={() => setDiamondColor(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      diamondColor === key
                        ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded mb-2 border border-gray-300"
                      style={{ backgroundColor: `#${diamond.color.toString(16).padStart(6, '0')}` }}
                    />
                    <div className="text-sm font-medium text-gray-700">{diamond.name}</div>
                    {key !== 'white' && <div className="text-xs text-gray-500">+30% premium</div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Engraving */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Type size={18} />
                Engraving
              </h3>
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showEngraving}
                  onChange={(e) => setShowEngraving(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Add personal engraving (+$50)</span>
              </label>
              {showEngraving && (
                <input
                  type="text"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, 20))}
                  placeholder="Enter text (max 20 chars)"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 outline-none"
                  maxLength={20}
                />
              )}
            </div>
            
            {/* Ring Size */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Ring Size</h3>
              <select
                value={ringSize}
                onChange={(e) => setRingSize(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 outline-none"
              >
                {['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map(size => (
                  <option key={size} value={size}>Size {size}</option>
                ))}
              </select>
            </div>
            
            {/* Auto Rotate */}
            <div>
              <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Auto-rotate</span>
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
            
            {/* Price */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <div className="text-sm opacity-90">Total Price</div>
              <div className="text-4xl font-bold mt-1">${calculatePrice().toLocaleString()}</div>
              <div className="text-xs opacity-75 mt-2">
                Free shipping & 30-day returns
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
                Add to Cart
              </button>
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
                Save Design
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Price Breakdown Modal */}
      {showPriceBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">Price Breakdown</h3>
              <button
                onClick={() => setShowPriceBreakdown(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">{metals[metalType].name} Band</span>
                <span className="font-semibold">${metals[metalType].price}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">{diamondSizes[diamondSize].name} {diamonds[diamondColor].name}</span>
                <span className="font-semibold">${(diamondSizes[diamondSize].price * (diamondColor === 'white' ? 1 : 1.3)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-700">Band Width: {bandWidths[bandWidth].name}</span>
                <span className="font-semibold">${bandWidths[bandWidth].price}</span>
              </div>
              {showEngraving && engraving && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-700">Personal Engraving</span>
                  <span className="font-semibold">$50</span>
                </div>
              )}
              {diamondColor !== 'white' && (
                <div className="flex justify-between py-2 border-b text-purple-600">
                  <span>Colored Diamond Premium (30%)</span>
                  <span className="font-semibold">Included</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-blue-600">${calculatePrice().toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowPriceBreakdown(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Comparison Modal */}
      {showComparison && comparisonConfigs.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">Compare Rings</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonConfigs.map((config) => (
                <div key={config.id} className="border-2 border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800">Ring {comparisonConfigs.indexOf(config) + 1}</h4>
                    <button
                      onClick={() => removeFromComparison(config.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Metal:</span> {metals[config.metal].name}</div>
                    <div><span className="font-medium">Diamond:</span> {diamonds[config.diamond].name}</div>
                    <div><span className="font-medium">Size:</span> {diamondSizes[config.diamondSize].name}</div>
                    <div><span className="font-medium">Band:</span> {bandWidths[config.bandWidth].name}</div>
                    {config.engraving && (
                      <div><span className="font-medium">Engraving:</span> "{config.engraving}"</div>
                    )}
                    <div><span className="font-medium">Ring Size:</span> {config.size}</div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">${config.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowComparison(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}
      
      {/* 360° Animation Preview */}
      {showAnimationPreview && recordedFrames.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">360° Animation Ready!</h3>
              <button
                onClick={() => setShowAnimationPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-gray-100 rounded-lg p-8">
                <img 
                  src={recordedFrames[0]} 
                  alt="360 preview" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              
              <p className="text-gray-700">
                Captured {recordedFrames.length} frames of your ring rotation!
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                  Download as GIF
                </button>
                <button className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Share Animation
                </button>
              </div>
              
              <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                💡 In production, use a GIF encoder library like gif.js to convert frames to an animated GIF
              </div>
            </div>
            
            <button
              onClick={() => setShowAnimationPreview(false)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">Share Your Design</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {shareImage && (
              <div className="bg-gray-100 rounded-lg p-4">
                <img src={shareImage} alt="Ring design" className="w-full rounded-lg shadow-lg" />
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-gray-700 text-center">
                {metals[metalType].name} with {diamonds[diamondColor].name}<br />
                <span className="text-2xl font-bold text-blue-600">${calculatePrice().toLocaleString()}</span>
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="px-4 py-3 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition"
                >
                  Twitter
                </button>
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Facebook
                </button>
                <button
                  onClick={() => shareToSocial('pinterest')}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Pinterest
                </button>
                <button
                  onClick={() => shareToSocial('email')}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                >
                  Email
                </button>
              </div>
              
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'my-ring-design.png';
                  link.href = shareImage;
                  link.click();
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Download Image
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* AR Info Modal */}
      {showARInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">View in AR</h3>
              <button
                onClick={() => setShowARInfo(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p className="font-medium">To enable AR viewing:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Export your 3D ring model as .usdz (iOS) or .glb (Android)</li>
                <li>Use model-viewer web component or AR Quick Look (iOS)</li>
                <li>Add AR button with proper file links</li>
                <li>Users can view the ring in their real space</li>
              </ol>
              
              <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono mt-4">
                &lt;model-viewer<br/>
                &nbsp;&nbsp;src="ring.glb"<br/>
                &nbsp;&nbsp;ios-src="ring.usdz"<br/>
                &nbsp;&nbsp;ar<br/>
                &nbsp;&nbsp;ar-modes="webxr scene-viewer quick-look"<br/>
                &gt;&lt;/model-viewer&gt;
              </div>
            </div>
            
            <button
              onClick={() => setShowARInfo(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}