import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Download, Eraser, Paintbrush } from 'lucide-react';

const GraffitiCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444'); // Vermelho vibrante
  const [brushSize, setBrushSize] = useState(15);
  const [opacity, setOpacity] = useState(0.6); // Para efeito de transparência do spray

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      // Guarda o conteúdo atual antes de redimensionar
      const tempImage = canvas.toDataURL();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      
      // Reaplica as configurações após redimensionar
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // Restaura o desenho anterior
      const img = new Image();
      img.src = tempImage;
      img.onload = () => ctx.drawImage(img, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    
    // Configuração do Efeito Spray/Grafite
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.shadowBlur = brushSize / 2; // Brilho suave nas bordas
    ctx.shadowColor = color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `pixacao-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 overflow-hidden select-none">
      {/* HUD de Ferramentas */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl z-50 shadow-2xl">
        
        {/* Seletor de Cor */}
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-full border-2 border-zinc-700 cursor-pointer overflow-hidden"
          />
        </div>

        {/* Tamanho da Tinta */}
        <div className="hidden md:flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Tamanho</label>
          <input 
            type="range" min="2" max="60" value={brushSize} 
            onChange={(e) => setBrushSize(e.target.value)}
            className="w-32 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Opacidade (Pressão do Spray) */}
        <div className="hidden md:flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Pressão</label>
          <input 
            type="range" min="0.1" max="1" step="0.1" value={opacity} 
            onChange={(e) => setOpacity(e.target.value)}
            className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="h-8 w-[1px] bg-zinc-800" />

        {/* Ações */}
        <div className="flex gap-2">
          <button 
            onClick={downloadCanvas}
            className="p-3 bg-zinc-800 hover:bg-white hover:text-black rounded-xl transition-all duration-300 group"
            title="Download Arte"
          >
            <Download size={20} className="group-active:scale-90" />
          </button>
          
          <button 
            onClick={clearCanvas}
            className="p-3 bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300"
            title="Limpar Mural"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Mural (Canvas) */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block w-full h-full cursor-crosshair touch-none relative z-10"
      />

      {/* Textura de Fundo (Parede/Concreto) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />
    </div>
  );
};

export default GraffitiCanvas;
