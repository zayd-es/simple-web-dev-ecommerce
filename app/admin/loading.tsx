import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Glow background effect */}
        <div className="absolute inset-0 rounded-full bg-slate-200/50 blur-xl animate-pulse" />
        
        {/* Main Spinner */}
        <Loader2 className="h-10 w-10 animate-spin text-slate-900 relative z-10" />
      </div>
      
      <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 animate-pulse">
        Loading data...
      </p>
    </div>
  )
}