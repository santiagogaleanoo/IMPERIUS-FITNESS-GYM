"use client"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export function CTASection() {
  return (
    <section
      id="contacto"
      className="relative py-14 md:py-16 overflow-hidden"
      style={{
        backgroundImage: "url('/fondos/grunge.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Líneas diagonales */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 6px)",
        }}
      />

      {/* Textura extra */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,#ffffff08_50%,transparent_55%)] bg-[length:18px_18px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[length:26px_26px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent" />

      {/* Difuminados arriba/abajo */}
      <div className="pointer-events-none absolute -top-16 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-black/50" />
      <div className="pointer-events-none absolute -bottom-16 left-0 right-0 h-16 bg-gradient-to-t from-transparent to-black/50" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">

          {/* TÍTULO MÁS PEQUEÑO */}
          <h2 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-white mb-3 tracking-tight">
            ¿NECESITAS{" "}
            <span className="text-primary">MÁS INFORMACIÓN?</span>
          </h2>

          {/* DESCRIPCIÓN REDUCIDA */}
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
            Contáctanos y resolveremos todas tus dudas. Estamos aquí para ayudarte
            a comenzar tu transformación.
          </p>

          {/* BOTÓN REDUCIDO */}
          <div className="flex justify-center">
            <a
              href="https://wa.me/573013770036?text=Hola,%20estoy%20interesado%20en%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-black hover:bg-primary/90 text-base md:text-lg font-bold h-12 px-6 rounded-md transition-all"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Contáctanos</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
