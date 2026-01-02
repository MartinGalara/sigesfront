import React from 'react';
import { BookOpen, Headset, RefreshCw, Monitor, Database, Lightbulb } from 'lucide-react';
export function Services() {
  return <section id="servicios" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900"></div>
      <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }}></div>
      {/* Animated tech lines */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" style={{
      animation: 'pulse 4s infinite'
    }}></div>
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" style={{
      animation: 'pulse 4s infinite 2s'
    }}></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">
            Crecimiento Empresarial
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Servicios Profesionales
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Complementamos nuestras soluciones con servicios profesionales para
            garantizar el máximo aprovechamiento de su inversión tecnológica.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Capacitación Integral
            </h3>
            <p className="text-gray-400">
              Capacitación del Sistema SIGES acorde a las necesidades de los
              diferentes usuarios del software según sus tareas operativas, ya
              sea in situ, en nuestras oficinas o de manera remota.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Headset size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Soporte Técnico 24/7
            </h3>
            <p className="text-gray-400">
              Servicio de atención al cliente 24/7 para garantizar su
              satisfacción, nuestro equipo está disponible a través de diversos
              canales: online, bot, correo electrónico y portal.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Actualizaciones Periódicas
            </h3>
            <p className="text-gray-400">
              Actualizaciones periódicas del software para garantizar el
              funcionamiento óptimo y la incorporación de nuevas funcionalidades
              y mejoras.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Monitor size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Acceso Remoto a SIGES
            </h3>
            <p className="text-gray-400">
              Acceso remoto para la gerencia permitiéndoles gestionar
              confortablemente y monitorear las operaciones desde cualquier
              lugar con conexión a Internet.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Database size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Servicio de BRS
            </h3>
            <p className="text-gray-400">
              Garantía en la protección y recuperación de datos críticos,
              asegurando la continuidad de operaciones y la recuperación rápida
              en caso de pérdida de datos o fallos.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/50 to-blue-900/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-cyan-500/20 transition-all group hover:shadow-lg hover:shadow-blue-900/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb size={28} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Diseño y Ejecución de Proyectos IT
            </h3>
            <p className="text-gray-400">
              El trabajo en equipo en I+D mejora la actualización de
              funcionalidades del sistema, desde la planificación,
              implementación y supervisión de soluciones tecnológicas para
              optimizar el rendimiento.
            </p>
          </div>
        </div>
        {/* Futuristic tech element */}
        <div className="mt-20 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-70"></div>
          <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Transformación Digital Completa
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Nuestro enfoque integral garantiza que su estación de servicio
                  esté equipada con la tecnología más avanzada, mejorando la
                  eficiencia operativa y la experiencia del cliente.
                </p>
                <a href="https://wa.me/3512266159" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-blue-500/30 inline-block">
                  Solicitar asesoramiento
                </a>
              </div>
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                    <img src="https://cdn3d.iconscout.com/3d/premium/thumb/technology-5349276-4468821.png" alt="Transformación digital" className="w-40 h-40 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      `}</style>
    </section>;
}