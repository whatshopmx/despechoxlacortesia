import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Management</CardTitle>
          <CardDescription>View and manage your billing information</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Billing management coming soon</p>
            <p className="text-sm text-muted-foreground">This feature is under development</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
