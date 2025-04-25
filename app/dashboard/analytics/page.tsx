import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Analytics</CardTitle>
          <CardDescription>View detailed analytics for your campaigns</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Analytics dashboard coming soon</p>
            <p className="text-sm text-muted-foreground">This feature is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
