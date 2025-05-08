import { ChallengeGenerator } from "@/components/challenge-generator"

export default function ChallengeGeneratorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Generador de Retos</h1>
      <p className="text-center text-gray-600 mb-8">
        Crea retos personalizados combinando diferentes tipos, formatos y tonos para La Cortesía.
      </p>

      <ChallengeGenerator />

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">¿Cómo funciona?</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-lg mb-2">1. Selecciona las categorías</h3>
            <p className="text-gray-600">
              Elige el tipo de reto, formato de interacción y tono que deseas para tu reto. Puedes seleccionar una,
              varias o ninguna categoría según tus preferencias.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-lg mb-2">2. Genera el reto</h3>
            <p className="text-gray-600">
              Haz clic en el botón de actualizar para generar un reto basado en tus selecciones, o usa el botón "Generar
              Reto Aleatorio" para obtener uno completamente al azar.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-lg mb-2">3. Comparte y disfruta</h3>
            <p className="text-gray-600">
              Copia el reto generado y compártelo con tus amigos o úsalo en tu próxima sesión de La Cortesía.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
