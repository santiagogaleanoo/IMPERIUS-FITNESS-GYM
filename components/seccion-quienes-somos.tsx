"use client"

import { Button } from "@/components/ui/button"
import { Target, Eye, Users, Award, Heart } from "lucide-react"

export function QuienesSomosSection() {
  return (
    <section id="quienes-somos" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="h-1 w-16 bg-primary" />
          </div>
          <h2 className="font-bebas text-5xl md:text-6xl text-secondary-foreground mb-4">
            QUIÉNES <span className="text-primary">SOMOS</span>
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto">
            Más que un gimnasio, somos una comunidad dedicada a transformar vidas a través del fitness y el bienestar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Imagen */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/muscular-person-training-intensely-in-modern-gym-w.jpg"
                alt="Imperius Fitness Gym Team"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg">
              <div className="text-center">
                <div className="font-bebas text-3xl">5+</div>
                <div className="text-sm">Años de Experiencia</div>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            <h3 className="font-bebas text-4xl text-secondary-foreground">
              IMPERIUS <span className="text-primary">FITNESS GYM</span>
            </h3>
            <p className="text-lg text-secondary-foreground/80 leading-relaxed">
              En Imperius Fitness Gym, nos dedicamos a proporcionar un ambiente de entrenamiento excepcional 
              donde cada miembro puede alcanzar sus metas físicas y mejorar su calidad de vida. Nuestro equipo 
              de profesionales certificados está comprometido con tu éxito.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bebas text-2xl text-primary">200+</div>
                  <div className="text-sm text-secondary-foreground/70">Miembros Felices</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bebas text-2xl text-primary">3+</div>
                  <div className="text-sm text-secondary-foreground/70">Entrenadores Pro</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Misión */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary p-3 rounded-xl">
                <Target className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bebas text-3xl text-secondary-foreground">NUESTRA MISIÓN</h3>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed text-lg">
              Brindar a nuestra comunidad las herramientas, el conocimiento y la motivación necesarios 
              para alcanzar sus objetivos de fitness, promoviendo un estilo de vida saludable y activo 
              a través de programas personalizados y equipamiento de última generación.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary p-3 rounded-xl">
                <Eye className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bebas text-3xl text-secondary-foreground">NUESTRA VISIÓN</h3>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed text-lg">
              Ser el gimnasio líder en la región, reconocido por nuestra excelencia en servicio, 
              resultados comprobados y comunidad unida. Aspiramos a ser el destino preferido para 
              quienes buscan transformar su vida a través del fitness.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="text-center">
          <h3 className="font-bebas text-4xl text-secondary-foreground mb-12">
            NUESTROS <span className="text-primary">VALORES</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bebas text-2xl text-secondary-foreground mb-3">PASIÓN</h4>
              <p className="text-secondary-foreground/70">
                Amamos lo que hacemos y nos apasiona ver el progreso de cada miembro.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bebas text-2xl text-secondary-foreground mb-3">COMUNIDAD</h4>
              <p className="text-secondary-foreground/70">
                Creemos en el poder del apoyo mutuo y el trabajo en equipo.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bebas text-2xl text-secondary-foreground mb-3">EXCELENCIA</h4>
              <p className="text-secondary-foreground/70">
                Nos esforzamos por superar expectativas en cada aspecto de nuestro servicio.
              </p>
            </div>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center mt-16 pt-8 border-t border-primary/20">
          <Button
            size="lg"
            onClick={() => document.getElementById("membresias")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-bold h-14 px-8"
          >
            Únete a Nuestra Comunidad
          </Button>
        </div>
      </div>
    </section>
  )
}