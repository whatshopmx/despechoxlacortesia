import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Settings management coming soon</p>
            <p className="text-sm text-muted-foreground">This feature is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
