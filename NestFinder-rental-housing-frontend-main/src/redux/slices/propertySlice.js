import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import propertyApi from '@/api/propertyApi'

const pageItems = (payload) => Array.isArray(payload) ? payload : payload?.content || []
const pageTotal = (payload) => Array.isArray(payload) ? 1 : payload?.totalPages || 0
const pageElements = (payload) => Array.isArray(payload) ? payload.length : payload?.totalElements || 0

export const fetchProperties     = createAsyncThunk('property/fetchAll',    async (params, { rejectWithValue }) => { try { const { data } = await propertyApi.getAll(params);    return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchPropertyById   = createAsyncThunk('property/fetchById',   async (id, { rejectWithValue })     => { try { const { data } = await propertyApi.getById(id);       return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchOwnerProperties= createAsyncThunk('property/fetchOwner',  async ({ ownerId, params }, { rejectWithValue }) => { try { const { data } = await propertyApi.getByOwner(ownerId, params); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const createProperty      = createAsyncThunk('property/create',      async (formData, { rejectWithValue }) => { try { const { data } = await propertyApi.create(formData); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const updateProperty      = createAsyncThunk('property/update',      async ({ id, formData }, { rejectWithValue }) => { try { const { data } = await propertyApi.update(id, formData); return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const deleteProperty      = createAsyncThunk('property/delete',      async (id, { rejectWithValue })     => { try { await propertyApi.delete(id); return id } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const searchProperties    = createAsyncThunk('property/search',      async (params, { rejectWithValue }) => { try { const { data } = await propertyApi.search(params);    return data.data } catch (e) { return rejectWithValue(e.response?.data?.message) } })

const propertySlice = createSlice({
  name: 'property',
  initialState: { list: [], selected: null, ownerList: [], searchResults: [], loading: false, error: null, totalPages: 0, totalElements: 0 },
  reducers: {
    clearSelected: (state) => { state.selected = null },
    clearError:    (state) => { state.error    = null },
  },
  extraReducers: (b) => {
    const p = (s) => { s.loading = true;  s.error = null }
    const r = (s, a) => { s.loading = false; s.error = a.payload }
    b
      .addCase(fetchProperties.pending,      p)
      .addCase(fetchProperties.fulfilled,    (s, { payload }) => { s.loading = false; s.list = pageItems(payload); s.totalPages = pageTotal(payload); s.totalElements = pageElements(payload) })
      .addCase(fetchProperties.rejected,     r)
      .addCase(fetchPropertyById.pending,    p)
      .addCase(fetchPropertyById.fulfilled,  (s, { payload }) => { s.loading = false; s.selected = payload })
      .addCase(fetchPropertyById.rejected,   r)
      .addCase(fetchOwnerProperties.pending,   p)
      .addCase(fetchOwnerProperties.fulfilled, (s, { payload }) => { s.loading = false; s.ownerList = pageItems(payload) })
      .addCase(fetchOwnerProperties.rejected,  r)
      .addCase(createProperty.fulfilled,  (s, { payload }) => { s.ownerList.unshift(payload) })
      .addCase(updateProperty.fulfilled,  (s, { payload }) => { s.ownerList = s.ownerList.map(p => p.id === payload.id ? payload : p); s.selected = payload })
      .addCase(deleteProperty.fulfilled,  (s, { payload }) => { s.ownerList = s.ownerList.filter(p => p.id !== payload) })
      .addCase(searchProperties.pending,   p)
      .addCase(searchProperties.fulfilled, (s, { payload }) => { s.loading = false; s.searchResults = pageItems(payload); s.totalPages = pageTotal(payload); s.totalElements = pageElements(payload) })
      .addCase(searchProperties.rejected,  r)
  },
})

export const { clearSelected, clearError } = propertySlice.actions
export default propertySlice.reducer
