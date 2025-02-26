import BookingForm from "@/components/BookingForm"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Customer Relations Assistant Booking</h1>
      <BookingForm />
      <Toaster />
    </main>
  )
}

