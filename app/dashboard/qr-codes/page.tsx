"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, QrCode, Share, Sparkles } from "lucide-react"
import Link from "next/link"
import { BRAND_CAMPAIGNS } from "@/lib/brand-campaigns"

export default function QRCodesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Get all venues from all campaigns
  const allVenues = BRAND_CAMPAIGNS.flatMap((campaign) =>
    campaign.venues.map((venue) => ({
      ...venue,
      campaignId: campaign.id,
      brandId: campaign.brandId,
      brandName: campaign.brandName,
      campaignTitle: campaign.title,
      primaryColor: campaign.primaryColor,
      secondaryColor: campaign.secondaryColor,
    })),
  )

  // Filter venues based on search query
  const filteredVenues = allVenues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.brandName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">QR Codes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate New QR
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search QR codes..."
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

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All QR Codes ({filteredVenues.length})</TabsTrigger>
          <TabsTrigger value="campaigns">By Campaign</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div
                  className="h-16 flex items-center justify-between px-4"
                  style={{
                    background: `linear-gradient(135deg, ${venue.primaryColor} 0%, ${venue.secondaryColor} 100%)`,
                  }}
                >
                  <span className="text-white font-medium">{venue.brandName}</span>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">{venue.campaignTitle}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <CardDescription>
                    {venue.address}, {venue.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <img
                      src={venue.qrCode || `/api/qr?url=https://cort.es/${venue.brandId}-${venue.id}`}
                      alt="QR Code"
                      className="h-32 w-32"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="text-center text-sm font-medium w-full">
                    {venue.shortLink || `cort.es/${venue.brandId}-${venue.id}`}
                  </div>
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" asChild>
                      <Link
                        href={`/experience?brand=${venue.brandId}&campaign=${venue.campaignId}&venue=${venue.id}`}
                        target="_blank"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {BRAND_CAMPAIGNS.map((campaign, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">
                  {campaign.brandName} - {campaign.title}
                </h3>
                <Badge>{campaign.venues.length} QR Codes</Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaign.venues.map((venue, venueIndex) => (
                  <Card key={venueIndex} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <CardDescription>
                        {venue.address}, {venue.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-2">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <img
                          src={venue.qrCode || `/api/qr?url=https://cort.es/${campaign.brandId}-${venue.id}`}
                          alt="QR Code"
                          className="h-32 w-32"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="text-center text-sm font-medium w-full">
                        {venue.shortLink || `cort.es/${campaign.brandId}-${venue.id}`}
                      </div>
                      <div className="flex justify-between w-full">
                        <Button variant="outline" size="sm">
                          <QrCode className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button size="sm" asChild>
                          <Link
                            href={`/experience?brand=${campaign.brandId}&campaign=${campaign.id}&venue=${venue.id}`}
                            target="_blank"
                          >
                            <Share className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
