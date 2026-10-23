import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchPhotos } from '../../api/mediaApi'

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred while searching.'
}

export const searchPhotos = createAsyncThunk(
  'search/searchPhotos',
  async (query, { rejectWithValue }) => {
    try {
      return {
        query,
        data: await fetchPhotos(query, 1),
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const loadMorePhotos = createAsyncThunk(
  'search/loadMorePhotos',
  async (_, { getState, rejectWithValue }) => {
    const { query, currentPage } = getState().search

    try {
      return {
        data: await fetchPhotos(query, currentPage + 1),
        page: currentPage + 1,
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    condition: (_, { getState }) => {
      const { search } = getState()
      return (
        Boolean(search.query) &&
        !search.isLoading &&
        !search.isLoadingMore &&
        search.currentPage < search.totalPages
      )
    },
  },
)

const initialState = {
  query: '',
  results: [],
  isLoading: false,
  isLoadingMore: false,
  error: '',
  hasSearched: false,
  currentPage: 0,
  totalPages: 0,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPhotos.pending, (state, action) => {
        state.query = action.meta.arg
        state.results = []
        state.isLoading = true
        state.isLoadingMore = false
        state.error = ''
        state.hasSearched = true
        state.currentPage = 0
        state.totalPages = 0
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.results = action.payload.data.results
        state.currentPage = 1
        state.totalPages = action.payload.data.total_pages
        state.isLoading = false
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.error = action.payload || action.error.message || 'Search failed.'
        state.isLoading = false
      })
      .addCase(loadMorePhotos.pending, (state) => {
        state.isLoadingMore = true
        state.error = ''
      })
      .addCase(loadMorePhotos.fulfilled, (state, action) => {
        state.results.push(...action.payload.data.results)
        state.currentPage = action.payload.page
        state.totalPages = action.payload.data.total_pages
        state.isLoadingMore = false
      })
      .addCase(loadMorePhotos.rejected, (state, action) => {
        if (!action.meta.condition) {
          state.error =
            action.payload || action.error.message || 'Loading more photos failed.'
        }
        state.isLoadingMore = false
      })
  },
})

export const { clearSearch } = searchSlice.actions
export default searchSlice.reducer
