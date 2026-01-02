import React from "react";
import { Linkedin, Mail, Phone, LocateIcon } from "lucide-react";
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-gray-900"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      {/* Tech lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                SIGES
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Más de 30 años desarrollando soluciones tecnológicas para el
              retail de combustibles y lubricantes.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/sistemasiges"
                className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#inicio"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#soluciones"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Soluciones
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Soluciones
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Sistema Integral de Gestión
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Control de Surtidores
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Control de Personal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Infraestructura IP
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Medios de Pago
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Mail size={14} />
                </div>
                <span className="text-gray-400">info@sistemassiges.com.ar</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Phone size={14} />
                </div>
                <span className="text-gray-400">+54 11 4567-8900</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <LocateIcon size={14} />
                </div>
                <span className="text-gray-400">
                  Av. Monseñor Pablo Cabrera 2074
                  <br />
                  Córdoba, Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Sistemas SIGES S.A. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
