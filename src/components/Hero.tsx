import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <section
      id="inicio"
      className="relative w-full min-h-screen flex items-center pt-16 bg-gray-900 overflow-hidden"
    >
      {/* Futuristic animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900"></div>
        {/* Animated particles */}
        <div className="particle-container absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/30 blur-xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                opacity: Math.random() * 0.5,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      {/* Animated tech lines */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          style={{
            animation: "pulse 4s infinite",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          style={{
            animation: "pulse 4s infinite 1s",
          }}
        ></div>
        <div
          className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          style={{
            animation: "pulse 4s infinite 2s",
          }}
        ></div>
        <div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"
          style={{
            animation: "pulse 4s infinite 0.5s",
          }}
        ></div>
        <div
          className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
          style={{
            animation: "pulse 4s infinite 1.5s",
          }}
        ></div>
        <div
          className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"
          style={{
            animation: "pulse 4s infinite 2.5s",
          }}
        ></div>
      </div>
      <div className="container mx-auto px-6 z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full px-3 py-1 text-xs font-medium text-white">
            Más de 30 años de innovación tecnológica
          </div>
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 transition-all duration-1000 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Soluciones{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              tecnológicas avanzadas
            </span>{" "}
            para el retail de combustibles
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 mb-8 transition-all duration-1000 delay-300 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            Desarrollamos soluciones de Tecnologías de la Información y la Comunicación para el
            retail de combustibles y lubricantes a nivel nacional.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <a
              href="https://wa.me/3512266159"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-blue-500/30"
            >
              Contactanos
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#soluciones"
              className="border border-gray-400 hover:border-white text-white px-8 py-4 rounded-full text-lg font-medium transition-all backdrop-blur-sm bg-white/5 hover:bg-white/10"
            >
              Conocé más
            </a>
          </div>
          <div
            className={`mt-16 grid grid-cols-2 justify-items-center gap-4 lg:flex lg:items-center lg:gap-6 transition-all duration-1000 delay-700 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <img src="/ypf.png" alt="Cliente YPF" className="h-12 w-24 object-contain" />
            </div>
            <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <img src="/shell.png" alt="Cliente Shell" className="h-12 w-24 object-contain" />
            </div>
            <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <img src="/axion.jpg" alt="Cliente Axion" className="h-12 w-24 object-contain" />
            </div>
            <div className="p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
              <img src="/puma.png" alt="Cliente Puma" className="h-12 w-24 object-contain" />
            </div>

            <p className="text-gray-400 text-sm col-span-2 text-center mt-4 lg:col-auto lg:text-left lg:mt-0">
              Y muchas estaciones más...
            </p>
          </div>
        </div>
      </div>
      {/* Floating tech elements */}
      <div className="absolute right-10 top-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute right-20 bottom-1/3 w-32 h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>
    </section>
  );
}
