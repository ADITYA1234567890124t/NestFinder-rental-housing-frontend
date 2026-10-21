import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

// Layouts
import MainLayout from '@/layouts/MainLayout'
import DashLayout from '@/layouts/DashLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import Unauthorized from '@/pages/Unauthorized'

// Auth
import Login from '@/features/auth/Login'
import Register from '@/features/auth/Register'
import ForgotPassword from '@/features/auth/ForgotPassword'
import ResetPassword from '@/features/auth/ResetPassword'

// Property
import PropertyList from '@/features/property/PropertyList'
import PropertyDetails from '@/features/property/PropertyDetails'

import MyProperties from '@/features/property/MyProperties'
import AddProperty from '@/features/property/AddProperty'
import EditProperty from '@/features/property/EditProperty'

// Booking
import BookingPage from '@/features/booking/BookingPage'
import MyBookings from '@/features/booking/MyBookings'
import BookingHistory from '@/features/booking/BookingHistory'

// Payment
import PaymentPage from '@/features/payment/PaymentPage'
import PaymentSuccess from '@/features/payment/PaymentSuccess'

// Review
import ReviewPage from '@/features/review/ReviewPage'

// Complaint
import TenantComplaints from '@/features/complaint/TenantComplaints'

// Chat
import ChatPage from '@/features/chat/ChatPage'

// Favorite
import FavoritePage from '@/features/favorite/FavoritePage'

// Profile
import Profile from '@/features/profile/Profile'
import EditProfile from '@/features/profile/EditProfile'
import ChangePassword from '@/features/profile/ChangePassword'

// Owner
import OwnerDashboard from '@/features/owner/OwnerDashboard'

// Admin
import AdminDashboard from '@/features/admin/AdminDashboard'
import ManageUsers from '@/features/admin/ManageUsers'
import ManageProperties from '@/features/admin/ManageProperties'
import Complaints from '@/features/admin/Complaints'
import Reports from '@/features/admin/Reports'

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* DASHBOARD ROUTES */}
      <Route element={<DashLayout />}>

        {/* Shared */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />

        {/* TENANT */}
        <Route
          path="/tenant"
          element={
            <PrivateRoute roles={['TENANT']}>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/bookings"
          element={
            <PrivateRoute roles={['TENANT']}>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/bookings/:propertyId"
          element={
            <PrivateRoute roles={['TENANT']}>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/favorites"
          element={
            <PrivateRoute roles={['TENANT']}>
              <FavoritePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/payments"
          element={
            <PrivateRoute roles={['TENANT']}>
              <PaymentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/payments/success"
          element={
            <PrivateRoute roles={['TENANT']}>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/messages"
          element={
            <PrivateRoute roles={['TENANT']}>
              <ChatPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/reviews"
          element={
            <PrivateRoute roles={['TENANT']}>
              <ReviewPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/tenant/complaints"
          element={
            <PrivateRoute roles={['TENANT']}>
              <TenantComplaints />
            </PrivateRoute>
          }
        />

        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <PrivateRoute roles={['OWNER']}>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/properties"
          element={
            <PrivateRoute roles={['OWNER']}>
              <MyProperties />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/properties/add"
          element={
            <PrivateRoute roles={['OWNER']}>
              <AddProperty />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/properties/edit/:id"
          element={
            <PrivateRoute roles={['OWNER']}>
              <EditProperty />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <PrivateRoute roles={['OWNER']}>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/payments"
          element={
            <PrivateRoute roles={['OWNER']}>
              <PaymentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/owner/messages"
          element={
            <PrivateRoute roles={['OWNER']}>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Route>

      {/* ADMIN */}
      <Route element={<AdminLayout />}>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/properties"
          element={
            <AdminRoute>
              <ManageProperties />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <AdminRoute>
              <Complaints />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}
