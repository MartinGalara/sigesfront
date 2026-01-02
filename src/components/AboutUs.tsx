import React from "react";
import { History, Code, Cpu, CheckCircle, Award, Globe, Leaf } from "lucide-react";
export function AboutUs() {
  return (
    <section id="nosotros" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">
            Quiénes Somos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Sobre Nosotros</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Sistemas SIGES S.A. es una empresa argentina con más de 30 años desarrollando soluciones
            tecnológicas para el sector de combustibles.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-lg transform transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-cyan-500/10 rounded-lg transform transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/5">
              <img
                src="/siges2.jpg"
                alt="Equipo de SIGES"
                className="rounded-lg w-full h-auto object-cover transform transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </div>
          </div>
          <div className="space-y-8 text-gray-300">
            <p className="text-lg">
              En Sistemas SIGES S.A. nos dedicamos a desarrollar soluciones de Tecnologías de la
              Información y la Comunicación (TICs) para el retail de combustibles y lubricantes a
              nivel nacional. Nuestro propósito es optimizar su gestión operativa, administrativa y
              contable.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4">
                  <History size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Trayectoria</h3>
                <p className="text-gray-400">
                  Más de tres décadas de experiencia evolucionando junto con la tecnología.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4">
                  <Code size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Desarrollo Propio</h3>
                <p className="text-gray-400">
                  Equipo de ingenieros y desarrolladores creando soluciones a medida.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4">
                  <Award size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Homologación</h3>
                <p className="text-gray-400">
                  Soluciones homologadas por las principales petroleras del país.
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mb-4">
                  <Leaf size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sustentabilidad</h3>
                <p className="text-gray-400">
                  Prácticas con enfoque sustentable para reducir el impacto ambiental.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* CEO Quote */}
        <div className="mt-20 bg-gradient-to-r from-gray-800/50 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col items-center text-center gap-4 relative z-10">
            <svg
              className="text-blue-500/20 w-12 h-12 mb-4 mx-auto"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-lg text-gray-300 italic max-w-2xl mx-auto">
              "En SIGES aspiramos a ser líderes nacionales en soluciones tecnológicas para la
              gestión integral de estaciones de servicio, reconocidos por nuestra innovación y
              calidad. Nos proponemos expandir nuestra presencia en toda Argentina, estableciendo
              alianzas estratégicas. Buscamos ser la referencia en el sector, anticipándonos a las
              tendencias y desafíos mediante la mejora continua."
            </p>
            <div className="mt-2">
              <h4 className="text-xl font-semibold text-white">Pablo Martins</h4>
              <p className="text-cyan-400">CEO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
