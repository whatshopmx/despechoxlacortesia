"use client"

import type { ReactNode } from "react"
import { ChallengeProvider } from "@/contexts/challenge-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, User } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"

interface SocialLayoutProps {
  children: ReactNode
}

export default function SocialLayout({ children }: SocialLayoutProps) {
  // Detect current path to highlight the right tab
  const pathname = usePathname()
  const currentTab = pathname.includes("/group") ? "group" : "individual"

  return (
    <ChallengeProvider>
      <div className="container max-w-5xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/experience">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Link>

          <h1 className="text-2xl font-bold">Experiencia Social</h1>

          <div className="w-20" />
        </div>

        <Tabs value={currentTab} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <Link href="/experience/social">
              <TabsTrigger value="individual" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Individual
              </TabsTrigger>
            </Link>
            <Link href="/experience/social/group">
              <TabsTrigger value="group" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Grupal
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </ChallengeProvider>
  )
}
