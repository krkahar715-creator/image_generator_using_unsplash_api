import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadMorePhotos,
  searchPhotos,
} from './redux/features/searchslice.js'

function SearchBar({ onSearch, isLoading, isDisabled }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const searchQuery = query.trim()
    if (searchQuery) {
      onSearch(searchQuery)
    }
  }

  return (
    <form
      className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-white/10 bg-gray-900/80 p-3 shadow-xl shadow-black/20 backdrop-blur sm:flex-row"
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        aria-label="Search"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-950 px-5 py-4 text-base text-white outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
        name="query"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for something..."
        required
        type="search"
      />
      <button
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-4 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 active:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
        disabled={isLoading || isDisabled}
        type="submit"
      >
        Search
      </button>
    </form>
  )
}

function App() {
  const dispatch = useDispatch()
  const {
    results: photos,
    isLoading,
    isLoadingMore,
    error,
    hasSearched,
    currentPage,
    totalPages,
  } = useSelector((state) => state.search)

  function handleSearch(query) {
    dispatch(searchPhotos(query))
  }

  return (
    <main className="min-h-screen w-full bg-gray-950 px-4 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next image
          </h1>
          <p className="text-gray-400">Search beautiful photos from Unsplash.</p>
        </header>

        <SearchBar
          isDisabled={isLoadingMore}
          isLoading={isLoading}
          onSearch={handleSearch}
        />

        {error && (
          <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-red-400/30 bg-red-950/50 p-4 text-red-200" role="alert">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="mt-10 text-center text-gray-300" role="status">
            Searching for photos...
          </p>
        )}

        {!isLoading && !error && hasSearched && photos.length === 0 && (
          <p className="mt-10 text-center text-gray-400">
            No photos found. Try a different search.
          </p>
        )}

        {photos.length > 0 && (
          <>
            <section aria-label="Search results" className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <a
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-gray-900"
                  href={photo.links.html}
                  key={photo.id}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt={photo.alt_description || 'Photo from Unsplash'}
                    className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    src={photo.urls.regular}
                  />
                  <p className="px-4 py-3 text-sm text-gray-300">
                    Photo by {photo.user.name}
                  </p>
                </a>
              ))}
            </section>

            {currentPage < totalPages && (
              <div className="mt-10 text-center">
                <button
                  className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoadingMore}
                  onClick={() => dispatch(loadMorePhotos())}
                  type="button"
                >
                  {isLoadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default App
