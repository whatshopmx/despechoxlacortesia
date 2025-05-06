"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Type, Wand2, Download, Share2, Sparkles, Loader2, RefreshCw } from "lucide-react"
import {
  MEME_TEMPLATES,
  type MemeTemplate,
  generateMeme,
  generateAIMeme,
  getMemeTemplatesByCategory,
} from "@/services/meme-generator"
import { motion, AnimatePresence } from "framer-motion"
import { SocialShareButtons } from "./social-share-buttons"
import { useToast } from "@/hooks/use-toast"

interface MemeGeneratorProps {
  initialText?: string
  initialCategory?: string
  onMemeGenerated?: (memeUrl: string) => void
  onClose?: () => void
}

export function MemeGenerator({
  initialText = "",
  initialCategory = "general",
  onMemeGenerated,
  onClose,
}: MemeGeneratorProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [category, setCategory] = useState<string>(initialCategory)
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [fontSize, setFontSize] = useState<number>(32)
  const [textColor, setTextColor] = useState<string>("#FFFFFF")
  const [withEmojis, setWithEmojis] = useState<boolean>(true)
  const [aiPrompt, setAiPrompt] = useState<string>(initialText)
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null)
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [showShareOptions, setShowShareOptions] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [availableTemplates, setAvailableTemplates] = useState<MemeTemplate[]>([])

  // Inicializar con plantillas disponibles según la categoría
  useEffect(() => {
    const templates = category === "general" ? MEME_TEMPLATES : getMemeTemplatesByCategory(category)

    setAvailableTemplates(templates)

    // Seleccionar la primera plantilla por defecto
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0])

      // Inicializar textos vacíos para cada área de texto
      const initialTexts: Record<string, string> = {}
      templates[0].textAreas.forEach((area) => {
        initialTexts[area.id] = initialText || ""
      })
      setTexts(initialTexts)
    }
  }, [category, initialText, selectedTemplate])

  // Función para cambiar la plantilla seleccionada
  const handleTemplateChange = (templateId: string) => {
    const template = MEME_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)

      // Reiniciar textos para la nueva plantilla
      const newTexts: Record<string, string> = {}
      template.textAreas.forEach((area) => {
        newTexts[area.id] = ""
      })
      setTexts(newTexts)
    }
  }

  // Función para actualizar el texto de un área
  const handleTextChange = (areaId: string, value: string) => {
    setTexts((prev) => ({
      ...prev,
      [areaId]: value,
    }))
  }

  // Función para generar el meme manualmente
  const handleGenerateMeme = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    try {
      const memeUrl = await generateMeme(selectedTemplate.id, texts)
      setGeneratedMeme(memeUrl)
      setActiveTab("preview")

      if (onMemeGenerated) {
        onMemeGenerated(memeUrl)
      }

      // Mostrar toast de éxito
      toast({
        title: "¡Meme generado!",
        description: "Tu meme ha sido creado exitosamente.",
        duration: 3000,
      })

      // Reproducir sonido de éxito
      playSound("success")
    } catch (error) {
      console.error("Error generando meme:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el meme. Inténtalo de nuevo.",
        variant: "destructive",
      })

      // Reproducir sonido de error
      playSound("error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para generar el meme con IA
  const handleGenerateAIMeme = async () => {
    if (!aiPrompt) {
      toast({
        title: "Texto requerido",
        description: "Por favor, escribe algo para generar el meme.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const { memeUrl, caption } = await generateAIMeme(aiPrompt, category)
      setGeneratedMeme(memeUrl)
      setGeneratedCaption(caption)
      setActiveTab("preview")

      if (onMemeGenerated) {
        onMemeGenerated(memeUrl)
      }

      // Mostrar toast de éxito
      toast({
        title: "¡Meme AI generado!",
        description: "La IA ha creado un meme basado en tu texto.",
        duration: 3000,
      })

      // Reproducir sonido de magia
      playSound("magic")
    } catch (error) {
      console.error("Error generando meme con IA:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el meme con IA. Inténtalo de nuevo.",
        variant: "destructive",
      })

      // Reproducir sonido de error
      playSound("error")
    } finally {
      setIsGenerating(false)
    }
  }

  // Función para descargar el meme
  const handleDownloadMeme = () => {
    if (!generatedMeme) return

    // En una implementación real, esto descargaría la imagen
    // Para este ejemplo, simplemente mostramos un toast
    toast({
      title: "Meme descargado",
      description: "El meme se ha guardado en tu dispositivo.",
      duration: 3000,
    })

    // Reproducir sonido de descarga
    playSound("download")
  }

  // Función para compartir el meme
  const handleShareMeme = () => {
    setShowShareOptions(!showShareOptions)

    // Reproducir sonido de clic
    playSound("click")
  }

  // Función para reproducir sonidos
  const playSound = (soundType: "success" | "error" | "click" | "magic" | "download") => {
    // En una implementación real, esto reproduciría un archivo de audio
    console.log(`Reproduciendo sonido: ${soundType}`)
  }

  // Función para generar un nuevo meme aleatorio
  const handleRandomMeme = () => {
    const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
    setSelectedTemplate(randomTemplate)

    // Reiniciar textos para la nueva plantilla
    const newTexts: Record<string, string> = {}
    randomTemplate.textAreas.forEach((area) => {
      newTexts[area.id] = ""
    })
    setTexts(newTexts)

    // Reproducir sonido de clic
    playSound("click")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Generador de Memes</span>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="template" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Plantilla</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <span>IA Mágica</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!generatedMeme}>
              <Type className="h-4 w-4" />
              <span>Vista Previa</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="despecho">Despecho</SelectItem>
                      <SelectItem value="cringe">Cringe</SelectItem>
                      <SelectItem value="borracho">Borracho</SelectItem>
                      <SelectItem value="fiesta">Fiesta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="template">Plantilla</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedTemplate?.id}
                      onValueChange={handleTemplateChange}
                      disabled={availableTemplates.length === 0}
                    >
                      <SelectTrigger id="template" className="flex-1">
                        <SelectValue placeholder="Selecciona una plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRandomMeme}
                      disabled={availableTemplates.length === 0}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="space-y-4">
                    {selectedTemplate.textAreas.map((area) => (
                      <div key={area.id}>
                        <Label htmlFor={`text-${area.id}`}>
                          Texto {area.id === "top" ? "Superior" : area.id === "bottom" ? "Inferior" : area.id}
                        </Label>
                        <Textarea
                          id={`text-${area.id}`}
                          value={texts[area.id] || ""}
                          onChange={(e) => handleTextChange(area.id, e.target.value)}
                          placeholder={`Escribe el texto ${area.id === "top" ? "superior" : area.id === "bottom" ? "inferior" : ""}`}
                          maxLength={area.maxLength}
                          className="resize-none"
                          rows={2}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {texts[area.id]?.length || 0}/{area.maxLength} caracteres
                        </p>
                      </div>
                    ))}

                    <div>
                      <Label htmlFor="font-size">Tamaño de fuente</Label>
                      <div className="flex items-center gap-4">
                        <Slider
                          id="font-size"
                          min={12}
                          max={48}
                          step={1}
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          className="flex-1"
                        />
                        <span className="w-10 text-center">{fontSize}px</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="with-emojis" checked={withEmojis} onCheckedChange={setWithEmojis} />
                      <Label htmlFor="with-emojis">Incluir emojis</Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                {selectedTemplate ? (
                  <div className="relative w-full aspect-square max-w-xs mx-auto">
                    <img
                      src={selectedTemplate.imageUrl || "/placeholder.svg"}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-contain"
                    />
                    {selectedTemplate.textAreas.map((area) => (
                      <div
                        key={area.id}
                        className="absolute"
                        style={{
                          top: `${area.y / 5}%`,
                          left: `${area.x / 5}%`,
                          width: `${area.width / 5}%`,
                          textAlign: area.alignment as any,
                        }}
                      >
                        <p
                          className="font-bold break-words text-shadow-sm"
                          style={{
                            fontSize: `${fontSize}px`,
                            color: textColor,
                            textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                          }}
                        >
                          {texts[area.id] || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Selecciona una plantilla para comenzar</p>
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleGenerateMeme} className="w-full" disabled={!selectedTemplate || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Meme
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">¿Qué quieres convertir en meme?</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Escribe tu confesión, anécdota o idea loca..."
                  className="resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="ai-category">Estilo del meme</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="ai-category">
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="despecho">Despecho</SelectItem>
                    <SelectItem value="cringe">Cringe</SelectItem>
                    <SelectItem value="borracho">Borracho</SelectItem>
                    <SelectItem value="fiesta">Fiesta</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <Wand2 className="h-12 w-12 mx-auto mb-2 text-purple-500" />
                <h3 className="text-lg font-medium mb-1">Magia de IA</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nuestra IA convertirá tu texto en un meme épico con el estilo perfecto
                </p>

                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" onClick={() => setAiPrompt("")} disabled={!aiPrompt || isGenerating}>
                    Limpiar
                  </Button>
                  <Button
                    onClick={handleGenerateAIMeme}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    disabled={!aiPrompt || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generar con IA
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {generatedMeme && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="bg-gray-100 rounded-lg p-4 w-full max-w-md mx-auto">
                  <img
                    src={generatedMeme || "/placeholder.svg"}
                    alt="Meme generado"
                    className="w-full h-auto rounded-md"
                  />
                  {generatedCaption && <p className="text-center mt-2 font-medium text-sm">{generatedCaption}</p>}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <Button variant="outline" onClick={handleDownloadMeme} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                  <Button onClick={handleShareMeme} className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </Button>
                </div>

                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 w-full"
                    >
                      <SocialShareButtons
                        url={generatedMeme}
                        title="¡Mira el meme que creé con La Cortesía!"
                        caption={generatedCaption || ""}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <canvas ref={canvasRef} className="hidden" />
      </CardFooter>
    </Card>
  )
}
