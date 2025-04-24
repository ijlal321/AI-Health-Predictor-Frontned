import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function PredictionCard({ title, description, icon: Icon, href, stats }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <Icon className="h-6 w-6 text-rose-500" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-500">{description}</CardDescription>

        {stats && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href}>Start Prediction</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
