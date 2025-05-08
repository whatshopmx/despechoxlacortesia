import { CardGeneratorUnified } from "@/components/card-generator-unified"

export default function CardGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generador de Cartas Unificado</h1>
      <p className="text-gray-600 mb-8">
        Crea cartas personalizadas para todas las experiencias de La Cortesía: campañas, multimesas y grupal.
      </p>

      <CardGeneratorUnified />
    </div>
  )
}
