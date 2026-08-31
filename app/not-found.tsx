import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function AdminNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-4 border border-slate-200/80">
        <FileQuestion className="size-7" />
      </div>  
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
        Admin Resource Not Found
      </h1>
      <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
        The product, order, or customer page you are looking for does not exist or has been removed from the database.
      </p>
      <Button asChild className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold px-5">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}