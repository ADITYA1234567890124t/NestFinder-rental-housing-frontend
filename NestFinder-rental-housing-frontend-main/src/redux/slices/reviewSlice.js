import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import reviewApi from '@/api/reviewApi'

const pageItems = (payload) => Array.isArray(payload) ? payload : payload?.content || []

export const fetchPropertyReviews = createAsyncThunk('review/byProperty', async ({ pid, params }, { rejectWithValue }) => { try { const { data } = await reviewApi.getByProperty(pid, params); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const addReview             = createAsyncThunk('review/add',        async (payload, { rejectWithValue })       => { try { const { data } = await reviewApi.add(payload);          return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const deleteReview          = createAsyncThunk('review/delete',     async (id, { rejectWithValue })            => { try { await reviewApi.delete(id); return id }                  catch (e) { return rejectWithValue(e.response?.data?.message) } })

const reviewSlice = createSlice({
  name: 'review',
  initialState: { reviews: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchPropertyReviews.pending,   (s) => { s.loading = true })
      .addCase(fetchPropertyReviews.fulfilled, (s, { payload }) => { s.loading = false; s.reviews = pageItems(payload) })
      .addCase(fetchPropertyReviews.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(addReview.fulfilled,            (s, { payload }) => { s.reviews.unshift(payload) })
      .addCase(deleteReview.fulfilled,         (s, { payload }) => { s.reviews = s.reviews.filter(r => r.id !== payload) })
  },
})
export default reviewSlice.reducer
