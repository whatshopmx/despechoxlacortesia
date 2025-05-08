"use client"

import { useState } from "react"
import { TemplateSelector } from "@/components/despecho-templates/template-selector"
import type { DespechoTemplate, DespechoChallengeType } from "@/lib/despecho-templates"
import { ChatToxico } from "@/components/despecho-templates/chat-toxico"
import { InstagramDespechado } from "@/components/despecho-templates/instagram-despechado"
import { MemeDespecho } from "@/components/despecho-templates/meme-despecho"
import { RevistaDrama } from "@/components/despecho-templates/revista-drama"
import { TikTokDespecho } from "@/components/despecho-templates/tiktok-despecho"
import { PerfilCitas } from "@/components/despecho-templates/perfil-citas"
import { NotificacionRedFlag } from "@/components/despecho-templates/notificacion-redflag"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Share2, Download, Copy, Check } from "lucide-react"

export default function DespechoTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DespechoChallengeType>("chat_toxico")
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSelectTemplate = (template: DespechoTemplate) => {
    setSelectedTemplate(template.type)
    setGeneratedContent(null)
  }

  const handleGenerate = (content: string) => {
    setGeneratedContent(content)
    toast({
      title: "Contenido generado",
      description: "Se ha generado el contenido con éxito",
    })
  }

  const handleShare = () => {
    if (navigator.share && generatedContent) {
      navigator
        .share({
          title: "Contenido de La Lotería del Despecho",
          text: generatedContent,
        })
        .catch((err) => {
          console.error("Error al compartir:", err)
        })
    } else {
      toast({
        title: "Compartir no disponible",
        description: "Tu navegador no soporta la función de compartir",
      })
    }
  }

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Contenido copiado",
        description: "El contenido ha sido copiado al portapapeles",
      })
    }
  }

  const renderActiveTemplate = () => {
    switch (selectedTemplate) {
      case "chat_toxico":
        return <ChatToxico onSendMessage={(message) => handleGenerate(message)} />
      case "instagram_despechado":
        return <InstagramDespechado onAddComment={(comment) => handleGenerate(comment)} />
      case "meme_despecho":
        return <MemeDespecho onGenerate={(top, bottom) => handleGenerate(`${top} / ${bottom}`)} onShare={handleShare} />
      case "revista_drama":
        return (
          <RevistaDrama
            onGenerate={(headline, subheadline) => handleGenerate(`${headline}: ${subheadline}`)}
            onShare={handleShare}
          />
        )
      case "tiktok_despecho":
        return (
          <TikTokDespecho onGenerate={(text, caption) => handleGenerate(`${text} ${caption}`)} onShare={handleShare} />
        )
      case "perfil_citas":
        return <PerfilCitas onGenerate={(bio) => handleGenerate(bio)} onShare={handleShare} />
      case "notificacion_redflag":
        return (
          <NotificacionRedFlag
            onGenerate={(title, message) => handleGenerate(`${title} ${message}`)}
            onShare={handleShare}
          />
        )
      default:
        return <div>Selecciona una plantilla</div>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">La Lotería del Despecho</h1>
          <p className="text-xl text-gray-600">Plantillas para expresar tu despecho con estilo</p>
        </div>

        <Tabs defaultValue="template" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">Usar Plantilla</TabsTrigger>
            <TabsTrigger value="select">Seleccionar Plantilla</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="p-4 bg-gray-50 rounded-lg border">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Crea tu contenido</h2>
              {renderActiveTemplate()}
            </div>

            {generatedContent && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Contenido Generado</CardTitle>
                  <CardDescription>Puedes copiar o compartir este contenido</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="whitespace-pre-wrap">{generatedContent}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="select">
            <TemplateSelector onSelectTemplate={handleSelectTemplate} initialTemplate={selectedTemplate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
