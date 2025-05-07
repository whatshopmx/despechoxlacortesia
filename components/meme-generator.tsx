"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { DialogFooter } from "@/components/ui/dialog"
import { ImageIcon, Download, Share2, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MemeGeneratorProps {
  initialText?: string
  initialCategory?: string
  onMemeGenerated?: (url: string) => void
  onClose?: () => void
}

// Meme templates
const MEME_TEMPLATES = {
  despecho: [
    {
      id: "despecho_1",
      name: "Corazón Roto",
      url: "/placeholder.svg?height=400&width=400&text=Corazón+Roto",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
      ],
    },
    {
      id: "despecho_2",
      name: "Mensaje en Visto",
      url: "/placeholder.svg?height=400&width=400&text=Mensaje+en+Visto",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
      ],
    },
  ],
  fiesta: [
    {
      id: "fiesta_1",
      name: "Baile Dramático",
      url: "/placeholder.svg?height=400&width=400&text=Baile+Dramático",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
      ],
    },
    {
      id: "fiesta_2",
      name: "Shot de Tequila",
      url: "/placeholder.svg?height=400&width=400&text=Shot+de+Tequila",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
      ],
    },
  ],
  general: [
    {
      id: "general_1",
      name: "Confesión Dramática",
      url: "/placeholder.svg?height=400&width=400&text=Confesión+Dramática",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#fff", shadow: true },
      ],
    },
    {
      id: "general_2",
      name: "Reacción Exagerada",
      url: "/placeholder.svg?height=400&width=400&text=Reacción+Exagerada",
      textPositions: [
        { x: 50, y: 20, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
        { x: 50, y: 80, maxWidth: 300, fontSize: 24, color: "#000", shadow: false },
      ],
    },
  ],
}

export function MemeGenerator({
  initialText = "",
  initialCategory = "general",
  onMemeGenerated,
  onClose,
}: MemeGeneratorProps) {
  const [category, setCategory] = useState(initialCategory)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [topText, setTopText] = useState(initialText)
  const [bottomText, setBottomText] = useState("")
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState("#ffffff")
  const [shadowEnabled, setShadowEnabled] = useState(true)
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Set initial template when category changes
  useEffect(() => {
    if (MEME_TEMPLATES[category as keyof typeof MEME_TEMPLATES]?.length > 0) {
      setSelectedTemplate(MEME_TEMPLATES[category as keyof typeof MEME_TEMPLATES][0].id)
    }
  }, [category])

  // Get current template
  const getCurrentTemplate = () => {
    for (const cat in MEME_TEMPLATES) {
      const templates = MEME_TEMPLATES[cat as keyof typeof MEME_TEMPLATES]
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) return template
    }
    return MEME_TEMPLATES.general[0]
  }

  // Generate meme
  const generateMeme = async () => {
    setIsGenerating(true)

    try {
      // In a real app, this would call an API to generate the meme
      // For now, we'll simulate a delay and return a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const template = getCurrentTemplate()
      const memeUrl = `${template.url}&topText=${encodeURIComponent(topText)}&bottomText=${encodeURIComponent(bottomText)}`

      setGeneratedMeme(memeUrl)

      if (onMemeGenerated) {
        onMemeGenerated(memeUrl)
      }

      toast({
        title: "¡Meme generado!",
        description: "Tu meme ha sido creado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error al generar el meme",
        description: "Ocurrió un error al generar el meme. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Download meme
  const downloadMeme = () => {
    if (!generatedMeme) return

    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = generatedMeme
    link.download = `meme-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Descargando meme",
      description: "Tu meme se está descargando.",
    })
  }

  // Share meme
  const shareMeme = async () => {
    if (!generatedMeme) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi meme de La Cortesía",
          text: "¡Mira este meme que creé con La Cortesía!",
          url: generatedMeme,
        })

        toast({
          title: "¡Compartido!",
          description: "Tu meme ha sido compartido exitosamente.",
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(generatedMeme)

      toast({
        title: "Enlace copiado",
        description: "El enlace del meme ha sido copiado al portapapeles.",
      })
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Generador de Memes</h2>
        <p className="text-sm text-muted-foreground">Crea un meme para compartir tu experiencia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - Controls */}
        <div className="space-y-4 order-2 md:order-1">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="despecho">Despecho</SelectItem>
                <SelectItem value="fiesta">Fiesta</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Plantilla</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecciona una plantilla" />
              </SelectTrigger>
              <SelectContent>
                {MEME_TEMPLATES[category as keyof typeof MEME_TEMPLATES]?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topText">Texto Superior</Label>
            <Textarea
              id="topText"
              placeholder="Texto en la parte superior"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bottomText">Texto Inferior</Label>
            <Textarea
              id="bottomText"
              placeholder="Texto en la parte inferior"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="fontSize">Tamaño de Texto</Label>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              id="fontSize"
              min={12}
              max={36}
              step={1}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Color de Texto</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="textColor"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="shadowEnabled" checked={shadowEnabled} onCheckedChange={setShadowEnabled} />
            <Label htmlFor="shadowEnabled">Sombra de Texto</Label>
          </div>

          <Button
            onClick={generateMeme}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generar Meme
              </>
            )}
          </Button>
        </div>

        {/* Right column - Preview */}
        <div className="relative order-1 md:order-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
            {generatedMeme ? (
              <img
                src={generatedMeme || "/placeholder.svg"}
                alt="Meme generado"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-4">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {isGenerating ? "Generando meme..." : "La vista previa aparecerá aquí"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {generatedMeme && (
            <div className="mt-2 flex justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadMeme}>
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Descargar</span>
              </Button>
              <Button variant="outline" size="sm" onClick={shareMeme}>
                <Share2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>
              <Button variant="outline" size="sm" onClick={generateMeme}>
                <RefreshCw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Regenerar</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </DialogFooter>
    </div>
  )
}
