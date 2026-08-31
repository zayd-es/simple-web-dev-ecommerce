"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { emailOrderHistory } from "@/actions/order"
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react"

export default function MyOrdersPage() {
  const [data, action] = useActionState(emailOrderHistory, {})

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form action={action} className="w-full max-w-lg">
        <Card className="rounded-2xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-2 shadow-sm">
              <Mail className="size-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              My Orders
            </CardTitle>
            <CardDescription className="text-slate-500 text-sm leading-relaxed">
              Enter your email address below and we will send you your complete order history along with direct download links.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </Label>
              <Input 
                type="email" 
                required 
                name="email" 
                id="email" 
                placeholder="name@example.com"
                className="rounded-xl border-slate-200 focus:border-slate-400 focus:ring-slate-400/20 h-11 px-4 text-slate-900 placeholder:text-slate-400"
              />
              {data.error && (
                <div className="flex items-center gap-2 mt-2 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200/60">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{data.error}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6">
            {data.message ? (
              <div className="w-full flex items-center gap-2.5 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200/60">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                <span>{data.message}</span>
              </div>
            ) : (
              <SubmitButton />
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button 
      className="w-full h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold shadow-sm transition-all hover:shadow-md active:scale-[0.99] disabled:opacity-70" 
      size="lg" 
      disabled={pending} 
      type="submit"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          Sending link...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          Send History Link
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  )
}