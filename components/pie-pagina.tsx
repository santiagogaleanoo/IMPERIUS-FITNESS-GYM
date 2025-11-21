"use client"

import Link from "next/link"
import { Instagram, MapPin, Clock, X } from "lucide-react"
import { useState } from "react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// Modal para Políticas y Términos
function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Políticas de Privacidad y Términos y Condiciones</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Políticas y Términos - Gym Imperious Fitness</h1>
              <p className="text-lg text-gray-600">POLÍTICAS DE PRIVACIDAD, TÉRMINOS Y CONDICIONES</p>
              <p className="text-gray-500">Versión 1.0</p>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Introducción</h3>
                <p className="text-gray-700">
                  Este documento establece los Términos y Condiciones de uso, así como las Políticas de Privacidad de
                  Gym Imperious Fitness, empresa identificada con NIT 01904960653, ubicada en Armenia, Quindío.
                  Estos términos aplican tanto para el uso presencial de las instalaciones del gimnasio como para el uso
                  de plataformas digitales, incluyendo la página web y redes sociales asociadas.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. OBJETO</h3>
                <p className="text-gray-700">
                  El presente documento tiene como objetivo regular las condiciones bajo las cuales los usuarios pueden
                  acceder y utilizar los servicios de Gym Imperious Fitness, ya sea de manera presencial o a través de
                  medios digitales administrados por terceros autorizados.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. ADMINISTRACIÓN DE LA PÁGINA WEB</h3>
                <p className="text-gray-700">
                  La página web será administrada por un tercero designado por Gym Imperious Fitness. Sin embargo,
                  cualquier movimiento, acción o decisión que se realice en nombre de la empresa deberá contar con la
                  autorización expresa y por escrito de los representantes legales: Hernán Darío Trejos Zapata (CC
                  1094957735) o Diego David Crisanto Díaz Misas (CC 1094960653). Cualquier acción no autorizada
                  será considerada una violación a los presentes términos y estará sujeta a sanciones legales.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. RESPONSABILIDAD DEL USUARIO</h3>
                <p className="text-gray-700">
                  El usuario se compromete a utilizar los servicios de forma responsable y conforme a la ley. Está
                  prohibido el uso indebido de la marca, el logotipo, contenidos, imágenes o cualquier material
                  perteneciente a Gym Imperious Fitness sin autorización expresa.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. PROTECCIÓN DE DATOS PERSONALES</h3>
                <p className="text-gray-700">
                  Gym Imperious Fitness garantiza la confidencialidad, seguridad y adecuado manejo de los datos
                  personales conforme a la Ley 1581 de 2012. Los datos recolectados serán utilizados únicamente para
                  fines administrativos, comerciales o informativos relacionados con la empresa.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. CONDICIONES DE CANCELACIÓN</h3>
                <p className="text-gray-700">
                  Las membresías o servicios adquiridos no son reembolsables una vez iniciada su vigencia, salvo casos
                  excepcionales debidamente justificados y evaluados por la administración. Las cancelaciones deberán
                  solicitarse por escrito a la empresa.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. PROPIEDAD INTELECTUAL</h3>
                <p className="text-gray-700">
                  Todo el contenido visual, textual y gráfico de Gym Imperious Fitness, incluyendo logotipos, marcas,
                  fotografías, textos y diseños, es propiedad exclusiva de la empresa. Queda prohibida su reproducción,
                  copia o distribución sin autorización.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. DISPOSICIONES FINALES</h3>
                <p className="text-gray-700">
                  Estos términos entran en vigencia a partir de su publicación. Gym Imperious Fitness se reserva el
                  derecho de actualizar la presente versión (1.0) cuando se considere necesario. El uso continuo de los
                  servicios implica la aceptación de las modificaciones realizadas.
                </p>
              </section>

              <div className="border-t pt-6 mt-6">
                <p className="text-center text-gray-600">
                  <strong>Gym Imperious Fitness © 2025</strong><br />
                  NIT: 01904960653<br />
                  Armenia, Quindío - Colombia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal para Misión y Visión
function MissionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl max-w-2xl w-full shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Misión y Visión
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-8">
            {/* Misión */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                <h3 className="text-2xl font-bold text-gray-800">MISIÓN</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                En <span className="font-semibold text-blue-600">GYM IMPERIOUS FITNESS</span> transformamos la motivación en acción y los sueños
                en resultados. Nuestra misión es acompañarte en el camino hacia tu mejor versión,
                brindándote energía, apoyo y disciplina cada día. Aquí no solo entrenas el cuerpo:
                fortaleces la mente, conquistas tus miedos y demuestras que nada es imposible
                cuando crees en ti.
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center mb-4">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
                <h3 className="text-2xl font-bold text-gray-800">VISIÓN</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                A futuro, <span className="font-semibold text-purple-600">GYM IMPERIOUS FITNESS</span> se consolidará como una cadena de gimnasios
                reconocida a nivel nacional e internacional por su excelencia en el servicio, su
                compromiso con el desarrollo integral de las personas y su aporte a la formación de
                una comunidad activa, saludable y disciplinada. Buscamos convertirnos en un
                referente en el mundo del fitness, inspirando a más personas a vivir con constancia,
                ética y pasión deportiva.
              </p>
            </div>

            {/* Información de propietarios */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white text-center">
              <p className="font-semibold text-lg">Propietarios</p>
              <p className="mt-2">Hernán Darío Trejos Zapata y Diego David Crisanto Díaz Misas</p>
              <p className="mt-1 text-blue-100">NIT: 01094960653</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showMissionModal, setShowMissionModal] = useState(false)

  return (
    <>
      <footer id="contacto" className="bg-secondary border-t border-primary/20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="font-bebas text-4xl text-primary mb-4 tracking-wider">GYM IMPERIOUS FITNESS</div>
              <p className="text-secondary-foreground/70 mb-6 leading-relaxed">
                Transforma tu cuerpo y mente. Síguenos en redes y únete al mejor gimnasio de la ciudad.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/imperius_fitnes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors group"
                >
                  <Instagram className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </a>
                <a
                  href="https://www.tiktok.com/@gym.imperius"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors group"
                >
                  <TikTokIcon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bebas text-2xl text-secondary-foreground mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#inicio" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="#membresias" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    Membresías
                  </Link>
                </li>
                <li>
                  <Link href="#tienda" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#instalaciones"
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    Instalaciones
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setShowMissionModal(true)}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    Misión y Visión
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bebas text-2xl text-secondary-foreground mb-4">Servicios</h3>
              <ul className="space-y-3">
                <li className="text-secondary-foreground/70">Entrenamiento Personalizado</li>
                <li className="text-secondary-foreground/70">Clases de Cardio</li>
                <li className="text-secondary-foreground/70">Jueves: Funcional</li>
                <li className="text-secondary-foreground/70">Viernes: Rumba Terapia</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bebas text-2xl text-secondary-foreground mb-4">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <a
                    href="https://maps.app.goo.gl/Ga6MAsfbp8PR4vVS9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    Calle 50 # 39 - 06
                    <br />
                    Villa Alejandra Manzana 1 # 10
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-secondary-foreground/70">
                    Entresemana
                    <br />
                    5:00 AM - 9:00 PM
                    <br />
                    Sabado, domingo y festivos
                    <br />
                    8:00 AM - 3:00 PM
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <a
                    href="https://wa.me/573013770036?text=Hola,%20estoy%20interesado%20en%20sus%20servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-foreground/70 hover:text-primary transition-colors"
                  >
                    301 3770036
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright a la izquierda */}
              <p className="text-secondary-foreground/70 text-sm">
                © 2025  GYM IMPERIOUS FITNESS. Todos los derechos reservados.
              </p>
              {/* Enlaces legales a la derecha */}
              <div className="flex gap-6 text-sm">
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  Política de Privacidad
                </button>
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modales */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <MissionModal isOpen={showMissionModal} onClose={() => setShowMissionModal(false)} />
    </>
  )
}