"use client"

import { Button } from "@/components/ui/button"
import { Target, Eye, Users, Award, Heart } from "lucide-react"

export function QuienesSomosSection() {
  return (
    <section
      id="quienes-somos"
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      style={{
        backgroundImage: "url('/fondos/grunge.jpg')", // ← tu imagen
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* capa oscura para mejorar el contraste del contenido */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Efecto de líneas geométricas */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ffffff08_50%,transparent_55%)] bg-[length:18px_18px]" />

      {/* Patrón de puntos sutiles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[length:26px_26px]" />

      {/* Efectos de partículas sutiles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent" />

      {/* Difuminado suave desde la sección anterior */}
      <div className="pointer-events-none absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/50" />

      {/* Difuminado suave hacia la sección siguiente */}
      <div className="pointer-events-none absolute -bottom-20 left-0 right-0 h-20 bg-gradient-to-t from-transparent to-black/50" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-10 md:mb-12">
          <div className="flex justify-center mb-3">
            <div className="h-1 w-12 bg-yellow-500" />
          </div>
          <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white mb-2 drop-shadow-2xl">
            QUIÉNES{" "}
            <span className="text-yellow-500 drop-shadow-2xl">SOMOS</span>
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto drop-shadow-lg">
            Más que un gimnasio, somos una comunidad dedicada a transformar vidas
            a través del fitness y el bienestar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center mb-12 md:mb-14">
          {/* Imagen */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/muscular-person-training-intensely-in-modern-gym-w.jpg"
                alt="IMPERIOUS Fitness Gym Team"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-5 py-4 rounded-2xl shadow-2xl">
              <div className="text-center">
                <div className="font-bebas text-2xl md:text-3xl">5+</div>
                <div className="text-xs md:text-sm font-semibold">
                  Años de Experiencia
                </div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-4 md:space-y-5">
            <h3 className="font-bebas text-3xl md:text-4xl text-white drop-shadow-2xl">
              IMPERIOUS{" "}
              <span className="text-yellow-500 drop-shadow-2xl">
                FITNESS GYM
              </span>
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed drop-shadow-lg">
              En IMPERIOUS Fitness Gym, nos dedicamos a proporcionar un ambiente
              de entrenamiento excepcional donde cada miembro puede alcanzar sus
              metas físicas y mejorar su calidad de vida. Nuestro equipo de
              profesionales certificados está comprometido con tu éxito.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700/50">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-bebas text-xl text-yellow-500">
                    200+
                  </div>
                  <div className="text-xs text-gray-300">Miembros Felices</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700/50">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-bebas text-xl text-yellow-500">3+</div>
                  <div className="text-xs text-gray-300">Entrenadores Pro</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-14">
          {/* Misión */}
          <div className="rounded-2xl p-6 md:p-7 border border-yellow-500/30 bg-[#1a1a1a]/80 backdrop-blur-sm shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2.5 md:p-3 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-bebas text-2xl md:text-3xl text-white drop-shadow-lg">
                NUESTRA MISIÓN
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed drop-shadow-lg">
              En GYM IMPERIOUS FITNESS transformamos la motivación en acción y
              los sueños en resultados. Nuestra misión es acompañarte en el
              camino hacia tu mejor versión, brindándote energía, apoyo y
              disciplina cada día. Aquí no solo entrenas el cuerpo: fortaleces
              la mente, conquistas tus miedos y demuestras que nada es
              imposible cuando crees en ti.
            </p>
          </div>

          {/* Visión */}
          <div className="rounded-2xl p-6 md:p-7 border border-yellow-500/30 bg-[#1a1a1a]/80 backdrop-blur-sm shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2.5 md:p-3 rounded-xl shadow-lg">
                <Eye className="h-6 w-6 text-black" />
              </div>
              <h3 className="font-bebas text-2xl md:text-3xl text-white drop-shadow-lg">
                NUESTRA VISIÓN
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed drop-shadow-lg">
              A futuro, GYM IMPERIOUS FITNESS se consolidará como una cadena de
              gimnasios reconocida a nivel nacional e internacional por su
              excelencia en el servicio, su compromiso con el desarrollo integral
              de las personas y su aporte a la formación de una comunidad activa,
              saludable y disciplinada. Buscamos convertirnos en un referente en
              el mundo del fitness, inspirando a más personas a vivir con
              constancia, ética y pasión deportiva.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="text-center mb-10 md:mb-12">
          <h3 className="font-bebas text-3xl md:text-4xl text-white mb-8 drop-shadow-2xl">
            NUESTROS{" "}
            <span className="text-yellow-500 drop-shadow-2xl">VALORES</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="bg-yellow-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-yellow-500" />
              </div>
              <h4 className="font-bebas text-xl md:text-2xl text-white mb-2 drop-shadow-lg">
                PASIÓN
              </h4>
              <p className="text-sm text-gray-300 drop-shadow-lg">
                Amamos lo que hacemos y nos apasiona ver el progreso de cada
                miembro.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="bg-yellow-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <h4 className="font-bebas text-xl md:text-2xl text-white mb-2 drop-shadow-lg">
                COMUNIDAD
              </h4>
              <p className="text-sm text-gray-300 drop-shadow-lg">
                Creemos en el poder del apoyo mutuo y el trabajo en equipo.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="bg-yellow-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <h4 className="font-bebas text-xl md:text-2xl text-white mb-2 drop-shadow-lg">
                EXCELENCIA
              </h4>
              <p className="text-sm text-gray-300 drop-shadow-lg">
                Nos esforzamos por superar expectativas en cada aspecto de
                nuestro servicio.
              </p>
            </div>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center mt-8 md:mt-10 pt-6 border-t border-yellow-500/20">
          <Button
            size="lg"
            onClick={() =>
              document
                .getElementById("membresias")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 text-base md:text-lg font-bold h-12 px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-yellow-400"
          >
            Únete a Nuestra Comunidad
          </Button>
        </div>
      </div>
    </section>
  )
}
