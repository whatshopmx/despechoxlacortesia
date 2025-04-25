import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartCrack, LayoutDashboard, QrCode, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-semibold">
            <HeartCrack className="h-6 w-6" />
            <span className="text-lg">La Cortesía</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Despecho x La Cortesía
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Experiencias de marca que conectan con las emociones de tus clientes
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/experience?brand=spotify&campaign=spotify-premium2025&venue=venue-003">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ver Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Experiencias de Marca</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Conecta con tus clientes a través de experiencias emocionales
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  La Cortesía ofrece experiencias de marca que conectan con las emociones de tus clientes, creando
                  momentos memorables y generando lealtad.
                </p>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-primary" />
                      Experiencias con QR
                    </CardTitle>
                    <CardDescription>Conecta el mundo físico con el digital</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Crea experiencias de marca que se activan con códigos QR en tus productos o locales, ofreciendo
                      contenido exclusivo y recompensas.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/dashboard/qr-codes">Ver Más</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeartCrack className="h-5 w-5 text-primary" />
                      Juegos Emocionales
                    </CardTitle>
                    <CardDescription>Experiencias que conectan con las emociones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Juegos y experiencias que conectan con las emociones de tus clientes, creando momentos memorables
                      y generando lealtad.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/experience">Ver Demo</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-4 lg:col-span-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
                  Marcas que confían en nosotros
                </h2>
              </div>
              {["Don Julio", "Spotify", "Uber Eats"].map((brand, i) => (
                <div key={i} className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=80&width=80&text=${brand}`}
                      alt={brand}
                      className="h-16 w-16 rounded-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{brand}</h3>
                    <p className="text-sm text-muted-foreground">
                      Experiencias de marca que conectan con las emociones de los clientes.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} La Cortesía. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
