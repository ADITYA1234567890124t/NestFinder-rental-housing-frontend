import { configureStore } from '@reduxjs/toolkit'
import authReducer     from './slices/authSlice'
import propertyReducer from './slices/propertySlice'
import bookingReducer  from './slices/bookingSlice'
import favoriteReducer from './slices/favoriteSlice'
import paymentReducer  from './slices/paymentSlice'
import reviewReducer   from './slices/reviewSlice'
import chatReducer     from './slices/chatSlice'
import profileReducer  from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    property: propertyReducer,
    booking:  bookingReducer,
    favorite: favoriteReducer,
    payment:  paymentReducer,
    review:   reviewReducer,
    chat:     chatReducer,
    profile:  profileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export default store
