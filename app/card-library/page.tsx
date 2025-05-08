import { CardLibrary } from "@/components/card-library"

export default function CardLibraryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Biblioteca de Cartas</h1>
      <p className="text-gray-600 mb-8">
        Explora nuestra colección de cartas predefinidas para todas las experiencias de La Cortesía.
      </p>

      <CardLibrary />
    </div>
  )
}
