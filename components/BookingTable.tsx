import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getBookings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch bookings")
  }
  return res.json()
}

export default async function BookingTable() {
  const bookings = await getBookings()

  return (
    <Table>
      <TableCaption>A list of all bookings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Surname</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Reference Number</TableHead>
          <TableHead>Expiration Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking: any) => (
          <TableRow key={booking.referenceNumber}>
            <TableCell>{new Date(booking.date).toLocaleString()}</TableCell>
            <TableCell>{booking.name}</TableCell>
            <TableCell>{booking.surname}</TableCell>
            <TableCell>{booking.email}</TableCell>
            <TableCell>{booking.referenceNumber}</TableCell>
            <TableCell>{new Date(booking.expirationTime).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

