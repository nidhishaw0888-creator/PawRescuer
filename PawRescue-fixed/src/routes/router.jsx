import { Navigate, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { PublicLayout } from '../layouts/PublicLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardRoute } from '../layouts/DashboardLayoutRoute'

import { LandingPage } from '../pages/public/LandingPage'
import { HowItWorksPage } from '../pages/public/HowItWorksPage'
import { VolunteerPage } from '../pages/public/VolunteerPage'
import { AboutPage } from '../pages/public/AboutPage'
import { SafetyPage } from '../pages/public/SafetyPage'
import { ContactPage } from '../pages/public/ContactPage'
import { LegalPage } from '../pages/public/LegalPage'
import { RescueMapPage } from '../pages/public/RescueMapPage'
import { RescueDetailsPage } from '../pages/public/RescueDetailsPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'

import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'

import { ReportEmergencyPage } from '../pages/reports/ReportEmergencyPage'

import { CitizenDashboard } from '../pages/citizen/CitizenDashboard'
import { CitizenReportsPage } from '../pages/citizen/CitizenReportsPage'

import { VolunteerDashboard } from '../pages/volunteer/VolunteerDashboard'
import { VolunteerActivePage } from '../pages/volunteer/VolunteerActivePage'
import { VolunteerHistoryPage } from '../pages/volunteer/VolunteerHistoryPage'
import { VolunteerProfilePage } from '../pages/volunteer/VolunteerProfilePage'

import { OrganizationDashboard } from '../pages/organization/OrganizationDashboard'
import { OrganizationQueuePage } from '../pages/organization/OrganizationQueuePage'
import { OrganizationTeamPage } from '../pages/organization/OrganizationTeamPage'
import { OrganizationProfilePage } from '../pages/organization/OrganizationProfilePage'

import { AdminDashboard } from '../pages/admin/AdminDashboard'
import { AdminReportsPage } from '../pages/admin/AdminReportsPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminVerificationsPage } from '../pages/admin/AdminVerificationsPage'
import { AdminReviewPage } from '../pages/admin/AdminReviewPage'

import { NotificationsPage } from '../pages/notifications/NotificationsPage'
import { RecoveryPage } from '../pages/recovery/RecoveryPage'

import { ROLES } from '../utils/constants'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PublicLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/safety" element={<SafetyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<LegalPage kind="privacy" />} />
      <Route path="/terms" element={<LegalPage kind="terms" />} />
      <Route path="/map" element={<RescueMapPage />} />
      <Route path="/rescues/:id" element={<RescueDetailsPage />} />
      <Route path="/report-emergency" element={<ReportEmergencyPage />} />
      <Route path="/recovery/:id" element={<RecoveryPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<DashboardRoute roles={[ROLES.CITIZEN]} />}>
        <Route path="/dashboard/citizen" element={<CitizenDashboard />} />
        <Route path="/dashboard/citizen/reports" element={<CitizenReportsPage />} />
      </Route>

      <Route element={<DashboardRoute roles={[ROLES.VOLUNTEER]} />}>
        <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
        <Route path="/dashboard/volunteer/active" element={<VolunteerActivePage />} />
        <Route path="/dashboard/volunteer/history" element={<VolunteerHistoryPage />} />
        <Route path="/dashboard/volunteer/profile" element={<VolunteerProfilePage />} />
      </Route>

      <Route element={<DashboardRoute roles={[ROLES.ORGANIZATION]} />}>
        <Route path="/dashboard/organization" element={<OrganizationDashboard />} />
        <Route path="/dashboard/organization/queue" element={<OrganizationQueuePage />} />
        <Route path="/dashboard/organization/team" element={<OrganizationTeamPage />} />
        <Route path="/dashboard/organization/profile" element={<OrganizationProfilePage />} />
      </Route>

      <Route element={<DashboardRoute roles={[ROLES.ADMIN]} />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/reports" element={<AdminReportsPage />} />
        <Route path="/dashboard/admin/users" element={<AdminUsersPage />} />
        <Route path="/dashboard/admin/verifications" element={<AdminVerificationsPage />} />
        <Route path="/dashboard/admin/review" element={<AdminReviewPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>,
  ),
)
