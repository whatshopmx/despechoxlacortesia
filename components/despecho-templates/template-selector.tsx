"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { DESPECHO_TEMPLATES, type DespechoTemplate, type DespechoChallengeType } from "@/lib/despecho-templates"

// Importar los componentes de plantillas
import { ChatToxico } from "./chat-toxico"
import { InstagramDespechado } from "./instagram-despechado"
import { MemeDespecho } from "./meme-despecho"
import { RevistaDrama } from "./revista-drama"
import { TikTokDespecho } from "./tiktok-despecho"
import { PerfilCitas } from "./perfil-citas"
import { NotificacionRedFlag } from "./notificacion-redflag"

interface TemplateSelectorProps {
  onSelectTemplate?: (template: DespechoTemplate) => void
  initialTemplate?: DespechoChallengeType
}

export function TemplateSelector({ onSelectTemplate, initialTemplate = "chat_toxico" }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DespechoChallengeType>(initialTemplate)
  const { toast } = useToast()

  const handleSelectTemplate = (template: DespechoTemplate) => {
    setSelectedTemplate(template.type)

    if (onSelectTemplate) {
      onSelectTemplate(template)
    }

    toast({
      title: "Plantilla seleccionada",
      description: `Has seleccionado la plantilla "${template.title}"`,
    })
  }

  const renderTemplatePreview = (type: DespechoChallengeType) => {
    switch (type) {
      case "chat_toxico":
        return <ChatToxico />
      case "instagram_despechado":
        return <InstagramDespechado />
      case "meme_despecho":
        return <MemeDespecho />
      case "revista_drama":
        return <RevistaDrama />
      case "tiktok_despecho":
        return <TikTokDespecho />
      case "perfil_citas":
        return <PerfilCitas />
      case "notificacion_redflag":
        return <NotificacionRedFlag />
      default:
        return <div>Plantilla no encontrada</div>
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Plantillas de La Lotería del Despecho</h1>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="easy">Fáciles</TabsTrigger>
          <TabsTrigger value="popular">Populares</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESPECHO_TEMPLATES.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-2xl">{template.emoji}</span> {template.title}
                    </CardTitle>
                    <Badge
                      variant={
                        template.difficulty === "easy"
                          ? "default"
                          : template.difficulty === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {template.difficulty === "easy"
                        ? "Fácil"
                        : template.difficulty === "medium"
                          ? "Medio"
                          : "Difícil"}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    <span className="font-medium">Ejemplo:</span> {template.promptExamples[0]}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full"
                    variant={selectedTemplate === template.type ? "default" : "outline"}
                  >
                    {selectedTemplate === template.type ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="easy">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESPECHO_TEMPLATES.filter((t) => t.difficulty === "easy").map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-2xl">{template.emoji}</span> {template.title}
                    </CardTitle>
                    <Badge>Fácil</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    <span className="font-medium">Ejemplo:</span> {template.promptExamples[0]}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full"
                    variant={selectedTemplate === template.type ? "default" : "outline"}
                  >
                    {selectedTemplate === template.type ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESPECHO_TEMPLATES.filter((t) =>
              ["meme_despecho", "chat_toxico", "notificacion_redflag"].includes(t.type),
            ).map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span className="text-2xl">{template.emoji}</span> {template.title}
                    </CardTitle>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    <span className="font-medium">Ejemplo:</span> {template.promptExamples[0]}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full"
                    variant={selectedTemplate === template.type ? "default" : "outline"}
                  >
                    {selectedTemplate === template.type ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4">Vista previa</h2>
        <div className="flex justify-center">{renderTemplatePreview(selectedTemplate)}</div>
      </div>
    </div>
  )
}
