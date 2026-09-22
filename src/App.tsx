import React, { useState, useMemo } from 'react';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/merchant/DashboardOverview';
import { HomeDashboardView } from './components/merchant/HomeDashboardView';
import { MyPGsView } from './components/merchant/MyPGsView';
import { AddNewPGWizard } from './components/merchant/AddNewPGWizard';
import { EarningsView } from './components/merchant/EarningsView';
import { ResidentsView } from './components/merchant/ResidentsView';
import { EnquiriesView } from './components/merchant/EnquiriesView';
import { VisitsView } from './components/merchant/VisitsView';
import { AvailabilityView } from './components/merchant/AvailabilityView';
import { ReviewsView } from './components/merchant/ReviewsView';
import { NotificationsView } from './components/merchant/NotificationsView';
import { ProfileView } from './components/merchant/ProfileView';
import { ThreeStepOnboarding } from './components/onboarding/ThreeStepOnboarding';
import { LoginPage } from './components/auth/LoginPage';
import { WhatsAppModal } from './components/merchant/WhatsAppModal';
import { PGDetailModal } from './components/merchant/PGDetailModal';

import { 
  INITIAL_REVIEWS, 
  INITIAL_MERCHANT_PROFILE 
} from './data/merchantDashboardData';

import { 
  PGListing, 
  EnquiryItem, 
  MerchantReview, 
  DashboardTab,
} from './types/merchant';

import { Sparkles } from 'lucide-react';
import { useInitializeAuth, useLogout } from './features/auth/hooks/useAuth';
import { useAuthStore } from './stores/authStore';
import { useMerchantPgs, usePauseMerchantPg, useResumeMerchantPg, useSubmitMerchantPg } from './features/merchantPgs/hooks/useMerchantPgs';
import { toLegacyPg } from './features/merchantPgs/mapper';
import type { MerchantPg } from './contracts/merchantPg';
import { useMerchantEnquiries } from './features/merchantEnquiries/hooks/useMerchantEnquiries';
import { toEnquiryItem } from './features/merchantEnquiries/mapper';
import { useMerchantVisits } from './features/merchantVisits/hooks/useMerchantVisits';
import { toVisitItem } from './features/merchantVisits/mapper';
import { useMerchantNotifications, useMerchantUnreadCount } from './features/merchantNotifications/hooks/useMerchantNotifications';
import { toLegacyNotification } from './features/merchantNotifications/mapper';
import { AdminApp } from './components/admin/AdminApp';
import { isAdminRole, navigateToPrincipalDashboard } from './features/auth/routing';

export function MerchantApp() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

  // Auth & Onboarding State
  const logout = useLogout();

  // Main Merchant State
  const pgQuery = useMerchantPgs();
  const realPgs = pgQuery.data ?? [];
  const pgListings = useMemo(() => realPgs.map(toLegacyPg), [realPgs]);
  const submitPg = useSubmitMerchantPg();
  const pausePg = usePauseMerchantPg();
  const resumePg = useResumeMerchantPg();
  const enquiryQuery = useMerchantEnquiries();
  const enquiries = useMemo(() => (enquiryQuery.data ?? []).map(toEnquiryItem), [enquiryQuery.data]);
  const visitQuery = useMerchantVisits();
  const visits = useMemo(() => (visitQuery.data ?? []).map(toVisitItem), [visitQuery.data]);
  const [reviews, setReviews] = useState<MerchantReview[]>(INITIAL_REVIEWS);
  const notificationQuery = useMerchantNotifications({ page: 1, limit: 4 });
  const notifications = useMemo(() => (notificationQuery.data?.items ?? []).map(toLegacyNotification), [notificationQuery.data]);
  const unreadQuery = useMerchantUnreadCount();
  const [profile, setProfile] = useState(INITIAL_MERCHANT_PROFILE);

  // Modals
  const [selectedDetailPG, setSelectedDetailPG] = useState<MerchantPg | null>(null);
  const [editingPG, setEditingPG] = useState<MerchantPg | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppEnquiry, setWhatsAppEnquiry] = useState<EnquiryItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Badges calculations
  const unreadNotificationsCount = unreadQuery.data?.count ?? 0;

  const newEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === 'NEW').length;
  }, [enquiries]);

  const upcomingVisitsCount = useMemo(() => {
    return visits.filter((v) => v.category === 'Today' || v.category === 'Upcoming').length;
  }, [visits]);

  // Handlers for PG Listings

  // Reviews Actions
  const handleReplyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, merchantReply: replyText } : r))
    );
    showToast('Reply published');
  };

  const handleReportReview = (reviewId: string) => {
    showToast('Review reported to Admin moderation');
  };

  // Phone Call
  const handleCallTenant = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2F3A35] flex flex-col font-sans antialiased selection:bg-[#D8C29B] selection:text-[#2F3A35]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
        unreadNotificationsCount={unreadNotificationsCount}
        newEnquiriesCount={newEnquiriesCount}
        upcomingVisitsCount={upcomingVisitsCount}
        merchantName={profile.name}
        businessName={profile.businessName}
        profilePhoto={profile.profilePhoto}
        isLoggedIn
        onLogout={() => logout.mutate()}
        onRestartOnboarding={() => {
          setActiveTab('onboarding');
        }}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-5 py-3 rounded-2xl bg-[#7B9D8A] text-white shadow-soft-lg flex items-center gap-2.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-24 md:pb-6">
        {activeTab === 'onboarding' && (
          <ThreeStepOnboarding
            initialData={{
              fullName: profile.name,
              mobileNumber: profile.mobileNumber,
              email: profile.email,
              businessName: profile.businessName,
              profilePhoto: profile.profilePhoto,
              city: (profile as { city?: string }).city || 'Hyderabad'
            }}
            onCompleteOnboarding={(data, nextAction) => {
              setProfile((prev) => ({
                ...prev,
                name: data.fullName,
                mobileNumber: data.mobileNumber,
                email: data.email,
                businessName: data.businessName,
                profilePhoto: data.profilePhoto,
                businessAddress: data.businessAddress,
                gstNumber: data.gstNumber,
                panNumber: data.panNumber,
                businessType: data.businessType,
                paymentQrUrl: data.paymentQrUrl,
                upiId: data.upiId,
                city: data.city,
              } as typeof prev));
              showToast('Setup done! Your payment QR is saved.');
              if (nextAction === 'add-pg') {
                setActiveTab('add-pg');
              } else {
                setActiveTab('dashboard');
              }
            }}
          />
        )}

        {(activeTab === 'dashboard' || activeTab === 'home') && (
          <HomeDashboardView
            merchantName={profile.name}
            pgListings={pgListings}
            enquiries={enquiries}
            visits={visits}
            notifications={notifications}
            onSelectTab={(tab) => setActiveTab(tab)}
            onOpenScheduleVisitModal={() => setActiveTab('visits')}
            onOpenAddPG={() => setActiveTab('add-pg')}
          />
        )}

        {activeTab === 'my-pgs' && (
          <MyPGsView
            pgs={realPgs} loading={pgQuery.isPending}
            error={pgQuery.isError ? 'Check your connection and try again.' : undefined}
            onRetry={() => void pgQuery.refetch()} onAdd={() => { setEditingPG(null); setActiveTab('add-pg'); }}
            onView={setSelectedDetailPG} onEdit={(pg) => { setEditingPG(pg); setActiveTab('add-pg'); }}
            onSubmit={(id) => submitPg.mutate(id, { onSuccess: () => showToast('PG submitted for review') })}
            onPause={(id) => pausePg.mutate(id, { onSuccess: () => showToast('PG paused') })}
            onResume={(id) => resumePg.mutate(id, { onSuccess: () => showToast('PG resumed') })}
            busy={submitPg.isPending || pausePg.isPending || resumePg.isPending}
          />
        )}

        {activeTab === 'add-pg' && (
          <AddNewPGWizard
            initial={editingPG ?? undefined}
            onCancel={() => { setEditingPG(null); setActiveTab('my-pgs'); }}
            onDone={() => { setEditingPG(null); setActiveTab('my-pgs'); showToast('PG saved successfully'); }}
          />
        )}

        {activeTab === 'residents' && (
          <ResidentsView
            merchantQrReady={Boolean((profile as { paymentQrUrl?: string }).paymentQrUrl)}
            onOpenWhatsAppModal={(phone, name) => {
              setWhatsAppEnquiry({
                id: `ENQ-${Date.now()}`,
                tenantName: name,
                tenantPhone: phone,
                pgId: pgListings[0]?.id || '1',
                pgName: pgListings[0]?.name || 'Green Residency',
                roomType: 'General Enquiry',
                moveInDate: 'Immediate',
                status: 'NEW',
                createdDate: 'Today'
              });
              setIsWhatsAppOpen(true);
            }}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'earnings' && (
          <EarningsView
            paymentQrUrl={(profile as { paymentQrUrl?: string }).paymentQrUrl}
            upiId={(profile as { upiId?: string }).upiId}
            onSavePaymentQr={(data) => {
              setProfile((prev) => ({ ...prev, ...data }));
              showToast('Payment QR saved!');
            }}
            settlements={[
              { id: 'SET-101', amount: 3200, payoutDate: '24 Jul 2026', status: 'Completed', utrNumber: 'HDFCRN908123', bankAccount: 'HDFC •••• 9012' },
              { id: 'SET-102', amount: 4800, payoutDate: '17 Jul 2026', status: 'Completed', utrNumber: 'HDFCRN801944', bankAccount: 'HDFC •••• 9012' },
              { id: 'SET-103', amount: 2900, payoutDate: '10 Jul 2026', status: 'Completed', utrNumber: 'HDFCRN712398', bankAccount: 'HDFC •••• 9012' }
            ]}
          />
        )}

        {activeTab === 'enquiries' && (
          <EnquiriesView />
        )}

        {activeTab === 'visits' && <VisitsView />}

        {activeTab === 'availability' && (
          <AvailabilityView
            pgs={realPgs}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsView
            reviews={reviews}
            onReplyToReview={handleReplyToReview}
            onReportReview={handleReportReview}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView onNavigate={setActiveTab} />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={(up) => setProfile((prev) => ({ ...prev, ...up }))}
            onLogout={() => {
              logout.mutate();
            }}
          />
        )}
      </main>

      {/* Modals */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        enquiry={whatsAppEnquiry}
        onClose={() => {
          setIsWhatsAppOpen(false);
          setWhatsAppEnquiry(null);
        }}
        onSentMessage={() => showToast('WhatsApp message initiated')}
      />

      <PGDetailModal
        pg={selectedDetailPG}
        onClose={() => setSelectedDetailPG(null)}
      />
    </div>
  );
}

export default function App() {
  useInitializeAuth();
  const { status, principal, error } = useAuthStore();
  React.useEffect(() => {
    if (status === 'authenticated' && principal) {
      navigateToPrincipalDashboard(principal);
    }
  }, [status, principal]);

  if (status === 'initializing') return <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center text-[#6B7280]">Restoring secure session…</div>;
  if (status !== 'authenticated' || !principal) return <><LoginPage onGoToSignup={() => alert('Registration is not available yet. Please use a provisioned StayNest account.')} />{error ? <p className="fixed bottom-5 inset-x-4 text-center text-sm text-[#E56363]">{error}</p> : null}</>;
  if (principal.role === 'MERCHANT') return <MerchantApp />;
  if (isAdminRole(principal.role)) return <AdminApp role={principal.role} />;
  return <div role="alert">This account cannot access the StayNest dashboard.</div>;
}
