import React from 'react';
import { Monitor, Droplet, CreditCard, Server, Users, Network } from 'lucide-react';
export function Solutions() {
  return <section id="soluciones" className="py-20 bg-gray-800 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-800"></div>
      <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }}></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      {/* Animated tech lines */}
      <div className="absolute left-0 right-0 h-px top-20 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" style={{
      animation: 'pulse 4s infinite'
    }}></div>
      <div className="absolute left-0 right-0 h-px bottom-20 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" style={{
      animation: 'pulse 4s infinite 2s'
    }}></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">
            Productos a su disposición
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestras Soluciones
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Ofrecemos un ecosistema completo de herramientas tecnológicas
            diseñadas específicamente para estaciones de servicio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Monitor size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Sistema Integral de Gestión
              </h3>
              <p className="text-gray-400 mb-4">
                Solución completa y eficiente para la gestión de su estación de
                servicio, con sus unidades de negocio adicionales como shops,
                multiventa, cafeterías, lubricentros, boxes y lavaderos.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Control de inventario</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Gestión de ventas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Reportes en tiempo real</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Administración de personal</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Droplet size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Soluciones para Surtidores y Tanques
              </h3>
              <p className="text-gray-400 mb-4">
                Proveemos el hardware y el software que necesita para integrar
                el control y monitoreo del equipamiento en su estación.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Medición electrónica de tanques</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Control de despachos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Alertas de nivel crítico</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Detección de fugas</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Control de Personal
              </h3>
              <p className="text-gray-400 mb-4">
                Proveemos registro de asistencia, monitoreo y supervisión del
                desempeño del capital humano.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Control de asistencia</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Gestión de turnos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Evaluación de desempeño</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Reportes de productividad</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Network size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Infraestructura IP
              </h3>
              <p className="text-gray-400 mb-4">
                Ofrecemos la planificación e implementación de la
                infraestructura de su estación, garantizando conectividad
                continua y fiable entre sistemas y dispositivos.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Redes escalables</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Conectividad segura</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Instalación de equipos</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Mantenimiento preventivo</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Medios de Pago y Facturación
              </h3>
              <p className="text-gray-400 mb-4">
                Soluciones completas para procesar pagos y generar facturas
                electrónicas integradas con los sistemas fiscales.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Integración con AFIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Múltiples medios de pago</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Facturación electrónica</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Tarjetas de fidelización</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl hover:shadow-blue-900/20 transition-all group border border-white/5 hover:border-cyan-500/20 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Server size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Infraestructura Tecnológica
              </h3>
              <p className="text-gray-400 mb-4">
                Equipamiento completo para implementar nuestras soluciones de
                software con enfoque llave en mano.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Servidores dedicados</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Terminales de punto de venta</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Controladores de surtidores</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Sistemas de respaldo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 text-center">
          <a href="https://wa.me/3512266159" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-blue-500/30">
            Conocé todas nuestras soluciones
          </a>
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