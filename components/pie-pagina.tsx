import Link from "next/link"
import { Instagram, MapPin, Clock } from "lucide-react"

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

export function Footer() {
  return (
    <footer id="contacto" className="bg-secondary border-t border-primary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-bebas text-4xl text-primary mb-4 tracking-wider">IMPERIUS FITNESS GYM</div>
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
              © 2025 Imperius Fitness Gym. Todos los derechos reservados.
            </p>
            {/* Enlaces legales a la derecha */}
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
