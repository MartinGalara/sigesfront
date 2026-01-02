import React from "react";
import { CheckCircle, Shield, Clock, HeadphonesIcon } from "lucide-react";
export function TrustSection() {
  return (
    <section className="py-20 bg-gray-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-800"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      {/* Animated particles */}
      <div className="particle-container absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/20 blur-xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              opacity: Math.random() * 0.3,
              animation: `float ${
                Math.random() * 10 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">
            Confianza y Experiencia
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Más de 400 estaciones confían en nosotros
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            En todo el país, cientos de estaciones de servicio han elegido
            nuestras soluciones para optimizar su operación.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
            <p className="text-gray-400">
              Nuestras soluciones cumplen con los más altos estándares de
              calidad y seguridad.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Shield size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguridad Total</h3>
            <p className="text-gray-400">
              Protegemos tus datos con los protocolos de seguridad más avanzados
              del mercado.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Clock size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-400">
              Nuestro equipo técnico está disponible las 24 horas para resolver
              cualquier incidencia.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/80 to-blue-900/10 backdrop-blur-sm rounded-xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <HeadphonesIcon size={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Atención Personalizada
            </h3>
            <p className="text-gray-400">
              Te asignamos un ejecutivo de cuenta dedicado para atender tus
              necesidades específicas.
            </p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/5">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 flex justify-center">
              <span>+400</span>
            </div>
            <p className="text-gray-400">Estaciones de servicio</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/5">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
              30+
            </div>
            <p className="text-gray-400">Años de experiencia</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/5">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
              99.9%
            </div>
            <p className="text-gray-400">Uptime garantizado</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-900/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/5">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2">
              24/7
            </div>
            <p className="text-gray-400">Soporte técnico</p>
          </div>
        </div>
      </div>
      <style jsx>{`
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
