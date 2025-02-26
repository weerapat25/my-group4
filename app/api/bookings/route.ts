import { NextResponse } from "next/server"
import { XMLParser, XMLBuilder } from "fast-xml-parser"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const XML_FILE_PATH = path.join(DATA_DIR, "bookings.xml")

interface Booking {
  date: string
  name: string
  surname: string
  email: string
  referenceNumber: string
  expirationTime: string
}

async function ensureDataDirectoryExists() {
  try {
    await fs.access(DATA_DIR)
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readBookings(): Promise<Booking[]> {
  await ensureDataDirectoryExists()

  try {
    const xmlData = await fs.readFile(XML_FILE_PATH, "utf-8")
    const parser = new XMLParser()
    const result = parser.parse(xmlData)
    return result.bookings.booking || []
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File doesn't exist, return an empty array
      return []
    }
    console.error("Error reading bookings:", error)
    throw error
  }
}

async function writeBookings(bookings: Booking[]): Promise<void> {
  await ensureDataDirectoryExists()

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: true,
    suppressEmptyNode: true,
  })
  const xmlData = builder.build({ bookings: { booking: bookings } })
  await fs.writeFile(XML_FILE_PATH, xmlData, "utf-8")
}

function generateReferenceNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  const { name, surname, email } = await request.json()

  // Validate input
  if (!name || !surname || !email) {
    return NextResponse.json({ message: "All fields are required" }, { status: 400 })
  }

  const bookings = await readBookings()

  // Check if email already exists
  if (bookings.some((booking) => booking.email === email)) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 })
  }

  // Check if booking limit is reached
  if (bookings.length >= 200) {
    return NextResponse.json({ message: "Booking limit reached" }, { status: 400 })
  }

  const referenceNumber = generateReferenceNumber()
  const now = new Date()
  const expirationTime = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

  const newBooking: Booking = {
    date: now.toISOString(),
    name,
    surname,
    email,
    referenceNumber,
    expirationTime: expirationTime.toISOString(),
  }

  bookings.push(newBooking)
  await writeBookings(bookings)

  return NextResponse.json({ referenceNumber }, { status: 201 })
}

export async function GET() {
  const bookings = await readBookings()
  return NextResponse.json(bookings)
}

