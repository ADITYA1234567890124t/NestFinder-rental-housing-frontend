import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import favoriteApi from '@/api/favoriteApi'

const pageItems = (payload) => Array.isArray(payload) ? payload : payload?.content || []

/* =========================
   FETCH FAVORITES
========================= */
export const fetchFavorites = createAsyncThunk(
  'favorite/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.getAll(params)
      return response.data.data
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || 'Failed to fetch favorites'
      )
    }
  }
)

/* =========================
   ADD FAVORITE
========================= */
export const addFavorite = createAsyncThunk(
  'favorite/add',
  async (propertyId, { rejectWithValue }) => {
    try {
      await favoriteApi.add(propertyId)
      return propertyId
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || 'Failed to add favorite'
      )
    }
  }
)

/* =========================
   REMOVE FAVORITE
========================= */
export const removeFavorite = createAsyncThunk(
  'favorite/remove',
  async (propertyId, { rejectWithValue }) => {
    try {
      await favoriteApi.remove(propertyId)
      return propertyId
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || 'Failed to remove favorite'
      )
    }
  }
)

const favoriteSlice = createSlice({
  name: 'favorite',

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH FAVORITES
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false
        state.items = pageItems(action.payload)
      })

      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ADD FAVORITE
      .addCase(addFavorite.fulfilled, (state, action) => {
        const propertyId = action.payload

        const alreadyExists = state.items.some(
          (item) => item.id === propertyId
        )

        if (!alreadyExists) {
          state.items.push({
            id: propertyId,
          })
        }
      })

      // REMOVE FAVORITE
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        )
      })
  },
})

export default favoriteSlice.reducer
