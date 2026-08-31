import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExpiredPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Soft Glow Background Effect */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-destructive/15 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="relative z-10 inline-flex items-center justify-center p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>

        {/* Title & Description */}
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Download Link Expired
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This verification link has expired for security reasons. You can request a new download link via your orders page.
          </p>
        </div>

        {/* Call to Action Button */}
        <div className="relative z-10 pt-2">
          <Button 
            asChild 
            size="lg" 
            className="w-full h-11 rounded-xl font-medium shadow-md transition-all duration-300 gap-2"
          >
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" /> Get New Link
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}