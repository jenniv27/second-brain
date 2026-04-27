import { useState, useEffect, useCallback } from 'react'
import * as storage from '../services/storage'

const BOOKS_KEY = 'read:books'

// Goodreads CSV column names (lowercase, trimmed)
const COL = {
  title:          'title',
  author:         'author',
  authorLF:       'author l-f',
  additionalAuth: 'additional authors',
  isbn:           'isbn',
  isbn13:         'isbn13',
  myRating:       'my rating',
  avgRating:      'average rating',
  publisher:      'publisher',
  binding:        'binding',
  pages:          'number of pages',
  yearPublished:  'year published',
  origPubYear:    'original publication year',
  dateRead:       'date read',
  dateAdded:      'date added',
  bookshelves:    'bookshelves',
  shelvesWith:    'bookshelves with positions',
  exclusiveShelf: 'exclusive shelf',
  myReview:       'my review',
  spoiler:        'spoiler',
  privateNotes:   'private notes',
  readCount:      'read count',
  ownedCopies:    'owned copies',
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/)
  if (lines.length < 2) return []

  // Parse headers
  const headers = splitCSVRow(lines[0]).map(h => h.trim().toLowerCase())

  const get = (row, colName) => {
    const idx = headers.indexOf(colName)
    return idx >= 0 ? (row[idx] ?? '').trim() : ''
  }

  const books = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const row = splitCSVRow(lines[i])
    const title = get(row, COL.title)
    if (!title) continue

    const myRating = parseInt(get(row, COL.myRating), 10) || 0
    const avgRating = parseFloat(get(row, COL.avgRating)) || 0
    const pages = parseInt(get(row, COL.pages), 10) || 0
    const yearPublished = parseInt(get(row, COL.yearPublished), 10) || parseInt(get(row, COL.origPubYear), 10) || 0

    const exclusiveShelf = get(row, COL.exclusiveShelf) || 'to-read'
    const bookshelves = get(row, COL.bookshelves)
      .split(',').map(s => s.trim()).filter(Boolean)

    // Goodreads ISBN fields are wrapped in ="..." — strip that
    const isbn = get(row, COL.isbn).replace(/[="]/g, '')
    const isbn13 = get(row, COL.isbn13).replace(/[="]/g, '')

    books.push({
      id:             isbn13 || isbn || `gr-${i}`,
      title,
      author:         get(row, COL.author) || get(row, COL.authorLF),
      additionalAuthors: get(row, COL.additionalAuth),
      isbn,
      isbn13,
      myRating,
      avgRating,
      publisher:      get(row, COL.publisher),
      binding:        get(row, COL.binding),
      pages,
      yearPublished,
      dateRead:       get(row, COL.dateRead),
      dateAdded:      get(row, COL.dateAdded),
      shelf:          exclusiveShelf,   // 'read' | 'currently-reading' | 'to-read'
      bookshelves,
      myReview:       get(row, COL.myReview),
      privateNotes:   get(row, COL.privateNotes),
      readCount:      parseInt(get(row, COL.readCount), 10) || 0,
    })
  }
  return books
}

// Proper CSV row parser handling quoted fields with embedded commas/newlines
function splitCSVRow(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

export { parseCSV }

export function useBooks() {
  const [books, setBooks]   = useState(() => storage.cacheRead(BOOKS_KEY, []))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    storage.getItem(BOOKS_KEY, []).then(data => {
      setBooks(data)
      setLoaded(true)
    })
  }, [])

  const importBooks = useCallback((parsed) => {
    setBooks(prev => {
      const prevById = new Map(prev.map(b => [b.id, b]))
      const next = [...prev]

      for (const b of parsed) {
        if (prevById.has(b.id)) {
          const idx = next.findIndex(x => x.id === b.id)
          if (idx >= 0) next[idx] = { ...prevById.get(b.id), ...b }
        } else {
          next.push(b)
          prevById.set(b.id, b)
        }
      }

      storage.setItem(BOOKS_KEY, next)
      return next
    })
    return parsed.length
  }, [])

  const clearBooks = useCallback(() => {
    setBooks([])
    storage.setItem(BOOKS_KEY, [])
  }, [])

  const shelves = {
    read:              books.filter(b => b.shelf === 'read'),
    currentlyReading:  books.filter(b => b.shelf === 'currently-reading'),
    toRead:            books.filter(b => b.shelf === 'to-read'),
  }

  return {
    books,
    loaded,
    shelves,
    totalBooks: books.length,
    importBooks,
    clearBooks,
  }
}
