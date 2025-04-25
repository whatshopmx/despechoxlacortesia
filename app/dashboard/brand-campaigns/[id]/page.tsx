"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Download, Edit, MapPin, QrCode, Share, ShoppingBag, Sparkles, Users } from "lucide-react"
import Link from "next/link"
import { getBrandCampaignById } from "@/lib/brand-campaigns"
import { useState, useEffect } from "react"

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (campaignId) {
      const campaignData = getBrandCampaignById(campaignId)
      setCampaign(campaignData)
      setLoading(false)
    }
  }, [campaignId])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/dashboard/brand-campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Campaign Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>The campaign with ID {campaignId} could not be found.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/brand-campaigns">Return to Campaigns</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/dashboard/brand-campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{campaign.title}</h1>
          <Badge className="ml-2">{campaign.active ? "Active" : "Inactive"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Overview</CardTitle>
            <CardDescription>Details about the {campaign.brandName} campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                  }}
                >
                  <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{campaign.brandName}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Campaign Period</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Target Audience</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.targetAudience.join(", ")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Reward</div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.rewardDescription}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Venues</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.venues.length} venues</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Card Themes</div>
                <div className="flex flex-wrap gap-2">
                  {campaign.cardThemes.map((theme: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {theme.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Challenge Types</div>
                <div className="flex flex-wrap gap-2">
                  {campaign.challengeTypes.map((type: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {type.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Emotional Tiers</div>
                <div className="flex flex-wrap gap-2">
                  {campaign.emotionalTiers.map((tier: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={
                        tier === "mild"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : tier === "intense"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {tier}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Stats</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">QR Scans</div>
                <div className="text-2xl font-bold">324</div>
                <div className="text-xs text-muted-foreground">+12% from last week</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Rewards Claimed</div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-xs text-muted-foreground">48% conversion rate</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Unique Users</div>
                <div className="text-2xl font-bold">287</div>
                <div className="text-xs text-muted-foreground">89% new users</div>
              </div>

              <div className="h-[150px] w-full bg-muted rounded-md flex items-center justify-center mt-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="venues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="venues">Venues ({campaign.venues.length})</TabsTrigger>
          <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaign.venues.map((venue: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <CardDescription>
                    {venue.address}, {venue.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <img
                          src={venue.qrCode || `/api/qr?url=https://cort.es/${campaign.brandId}-${venue.id}`}
                          alt="QR Code"
                          className="h-32 w-32"
                        />
                      </div>
                    </div>
                    <div className="text-center text-sm font-medium">
                      {venue.shortLink || `cort.es/${campaign.brandId}-${venue.id}`}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <QrCode className="mr-2 h-4 w-4" />
                        Download QR
                      </Button>
                      <Button size="sm" asChild>
                        <Link
                          href={`/experience?brand=${campaign.brandId}&campaign=${campaign.id}&venue=${venue.id}`}
                          target="_blank"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qr-codes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Management</CardTitle>
              <CardDescription>Generate and manage QR codes for this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Campaign QR Code</div>
                    <div className="flex justify-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <img
                          src={`/api/qr?url=https://cort.es/${campaign.brandId}-${campaign.id}`}
                          alt="QR Code"
                          className="h-32 w-32"
                        />
                      </div>
                    </div>
                    <div className="text-center text-sm font-medium">
                      cort.es/{campaign.brandId}-{campaign.id}
                    </div>
                    <div className="flex justify-center mt-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm font-medium">QR Code Stats</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Scans:</span>
                        <span className="font-medium">324</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Unique Users:</span>
                        <span className="font-medium">287</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Conversion Rate:</span>
                        <span className="font-medium">48%</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate New QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
