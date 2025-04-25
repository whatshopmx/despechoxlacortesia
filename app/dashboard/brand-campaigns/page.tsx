"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, Download, Plus, ExternalLink, Users, MapPin } from "lucide-react"
import { BRAND_CAMPAIGNS, type BrandCampaign } from "@/lib/brand-campaigns"
import Link from "next/link"

export default function BrandCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<BrandCampaign[]>(BRAND_CAMPAIGNS)

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group campaigns by status
  const activeCampaigns = filteredCampaigns.filter((campaign) => campaign.active)
  const inactiveCampaigns = filteredCampaigns.filter((campaign) => !campaign.active)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Brand Campaigns</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Campaigns ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Campaigns ({inactiveCampaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div
                  className="h-32 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                  }}
                >
                  <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-16 w-auto" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                  <CardDescription>{campaign.brandName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{campaign.targetAudience.join(", ")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{campaign.venues.length} venues</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {campaign.cardThemes.slice(0, 3).map((theme, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {theme.replace("_", " ")}
                        </Badge>
                      ))}
                      {campaign.cardThemes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{campaign.cardThemes.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-medium">Reward:</span> {campaign.rewardDescription}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/brand-campaigns/${campaign.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inactiveCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-shadow opacity-70">
                <div
                  className="h-32 flex items-center justify-center grayscale"
                  style={{
                    background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                  }}
                >
                  <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-16 w-auto" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                  <CardDescription>{campaign.brandName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/brand-campaigns/${campaign.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
