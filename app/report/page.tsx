import { Suspense } from "react"
import BookingTable from "@/components/BookingTable"

export default function ReportPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Booking Report</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingTable />
      </Suspense>
    </main>
  )
}

