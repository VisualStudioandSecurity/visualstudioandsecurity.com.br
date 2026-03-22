import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Download, Wind, RotateCcw } from 'lucide-react';

const GraffitiCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444'); 
  const [brushSize, setBrushSize] = useState(15);
  const [paintLevel, setPaintLevel] = useState(100); // 0 a 100%
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const tempImage = canvas.toDataURL();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const img = new Image();
      img.src = tempImage;
      img.onload = () => ctx.drawImage(img, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.nativeEvent.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.nativeEvent.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (paintLevel <= 0) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || paintLevel <= 0) {
      if (isDrawing && paintLevel <= 0) stopDrawing();
      return;
    }

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.shadowBlur = brushSize / 2;
    ctx.shadowColor = color;
    
    ctx.lineTo(x, y);
    ctx.stroke();

    // Consumo de tinta baseado no tamanho do pincel
    setPaintLevel(prev => Math.max(0, prev - (brushSize / 100)));
  };

  const stopDrawing = () => setIsDrawing(false);

  const reloadPaint = () => {
    setIsShaking(true);
    // Simula o tempo de agitar a lata
    setTimeout(() => {
      setPaintLevel(100);
      setIsShaking(false);
    }, 1500);
  };

  const downloadCanvas = () => {
    const link = document.createElement('a');
    link.download = `graffiti-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 overflow-hidden select-none font-sans">
      
      {/* UI - Barra de Tinta (Lata de Spray) */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center gap-4 z-50">
        <div className="relative w-16 h-48 bg-zinc-800 rounded-t-3xl rounded-b-lg border-2 border-zinc-700 p-1 flex flex-col-reverse overflow-hidden shadow-2xl">
          {/* Nível da Tinta */}
          <div 
            className="w-full transition-all duration-300 rounded-b-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            style={{ height: `${paintLevel}%`, backgroundColor: color }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
        </div>
        
        <button 
          onClick={reloadPaint}
          disabled={isShaking}
          className={`p-4 rounded-full bg-zinc-100 text-black shadow-xl transition-all ${isShaking ? 'animate-bounce opacity-50' : 'hover:scale-110 active:rotate-12'}`}
        >
          {isShaking ? <RotateCcw className="animate-spin" /> : <Wind size={24} />}
        </button>
        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Shake to Reload</span>
      </div>

      {/* Menu Superior */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl z-50 shadow-2xl">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
        />
        
        <div className="flex flex-col">
          <input 
            type="range" min="5" max="50" value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24 h-1 bg-zinc-700 accent-white appearance-none rounded-full"
          />
        </div>

        <button onClick={downloadCanvas} className="p-2 text-white hover:text-green-400 transition-colors">
          <Download size={20} />
        </button>
        
        <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,window.innerWidth, window.innerHeight)} className="p-2 text-white hover:text-red-500 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      {/* Canvas Principal */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block w-full h-full cursor-crosshair touch-none relative z-10"
      />

      {/* Parede de Fundo */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] bg-repeat shadow-[inner_0_0_100px_rgba(0,0,0,1)]" />
    </div>
  );
};

export default GraffitiCanvas;
