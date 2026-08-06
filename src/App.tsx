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
import { SignupPage } from './components/auth/SignupPage';
import { ScheduleVisitModal } from './components/merchant/ScheduleVisitModal';
import { WhatsAppModal } from './components/merchant/WhatsAppModal';
import { PGDetailModal } from './components/merchant/PGDetailModal';

import { 
  INITIAL_PG_LISTINGS, 
  INITIAL_ENQUIRIES, 
  INITIAL_VISITS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MERCHANT_PROFILE 
} from './data/merchantDashboardData';

import { 
  PGListing, 
  EnquiryItem, 
  VisitItem, 
  MerchantReview, 
  MerchantNotification, 
  PGRoomAvailability,
  DashboardTab,
  EnquiryStatus,
  VisitStatus,
  VisitCategory
} from './types/merchant';

import { Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<DashboardTab>('login');

  // Auth & Onboarding State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Main Merchant State
  const [pgListings, setPgListings] = useState<PGListing[]>(INITIAL_PG_LISTINGS);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES);
  const [visits, setVisits] = useState<VisitItem[]>(INITIAL_VISITS);
  const [reviews, setReviews] = useState<MerchantReview[]>(INITIAL_REVIEWS);
  const [notifications, setNotifications] = useState<MerchantNotification[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState(INITIAL_MERCHANT_PROFILE);

  // Modals
  const [selectedDetailPG, setSelectedDetailPG] = useState<PGListing | null>(null);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [scheduleVisitEnquiry, setScheduleVisitEnquiry] = useState<EnquiryItem | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppEnquiry, setWhatsAppEnquiry] = useState<EnquiryItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Badges calculations
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const newEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === 'NEW').length;
  }, [enquiries]);

  const upcomingVisitsCount = useMemo(() => {
    return visits.filter((v) => v.category === 'Today' || v.category === 'Upcoming').length;
  }, [visits]);

  // Handlers for PG Listings
  const handleAddPGListing = (newPG: PGListing) => {
    setPgListings((prev) => [newPG, ...prev]);
    showToast(`PG Listing "${newPG.name}" added successfully!`);
  };

  const handleTogglePausePG = (pgId: string) => {
    setPgListings((prev) =>
      prev.map((p) => {
        if (p.id === pgId) {
          const newStatus = p.status === 'Paused' ? 'Live' : 'Paused';
          showToast(`Listing status updated to ${newStatus}`);
          return { ...p, status: newStatus as any };
        }
        return p;
      })
    );
  };

  const handleDeletePG = (pgId: string) => {
    if (confirm('Are you sure you want to delete this PG listing?')) {
      setPgListings((prev) => prev.filter((p) => p.id !== pgId));
      showToast('PG Listing deleted');
    }
  };

  const handleSaveDetailPG = (updatedPG: PGListing) => {
    setPgListings((prev) => prev.map((p) => (p.id === updatedPG.id ? updatedPG : p)));
    setSelectedDetailPG(null);
    showToast('PG Listing details updated');
  };

  // Handlers for Enquiries
  const handleUpdateEnquiryStatus = (id: string, newStatus: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    showToast(`Enquiry status set to ${newStatus}`);
  };

  // Handlers for Visits
  const handleUpdateVisitStatus = (id: string, newStatus: VisitStatus, category?: VisitCategory) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: newStatus,
            category: category || v.category
          };
        }
        return v;
      })
    );
    showToast(`Visit status updated to ${newStatus}`);
  };

  const handleScheduleVisit = (newVisit: VisitItem) => {
    setVisits((prev) => [newVisit, ...prev]);
    showToast(`Visit scheduled for ${newVisit.visitorName}`);
  };

  // Availability Update
  const handleUpdateAvailability = (pgId: string, updatedAvailability: PGRoomAvailability[]) => {
    setPgListings((prev) =>
      prev.map((p) => {
        if (p.id === pgId) {
          const totalAvail = updatedAvailability.reduce((acc, curr) => acc + curr.availableBeds, 0);
          return {
            ...p,
            availableBeds: totalAvail,
            roomAvailability: updatedAvailability
          };
        }
        return p;
      })
    );
    showToast('Bed availability updated');
  };

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

  // Notifications Actions
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleMarkSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  // Phone Call
  const handleCallTenant = (phone: string) => {
    window.location.href = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  if (!isLoggedIn) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onGoToLogin={() => setAuthView('login')}
          onSignupSuccess={(data) => {
            setProfile((prev) => ({
              ...prev,
              name: data.fullName,
              businessName: data.businessName,
              mobileNumber: data.phone,
              email: data.email || prev.email,
            }));
            setIsLoggedIn(true);
            setActiveTab('onboarding');
            showToast(`Welcome, ${data.fullName}! Let's finish onboarding.`);
          }}
        />
      );
    }

    return (
      <LoginPage
        onGoToSignup={() => setAuthView('signup')}
        onLoginSuccess={(name, phone) => {
          setIsLoggedIn(true);
          setProfile((prev) => ({
            ...prev,
            name,
            mobileNumber: phone || prev.mobileNumber,
          }));
          setActiveTab('dashboard');
          showToast(`Welcome back, ${name}!`);
        }}
      />
    );
  }

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
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setAuthView('login');
          setActiveTab('login');
        }}
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
            onOpenScheduleVisitModal={() => {
              setScheduleVisitEnquiry(null);
              setIsScheduleVisitOpen(true);
            }}
            onOpenAddPG={() => setActiveTab('add-pg')}
          />
        )}

        {activeTab === 'my-pgs' && (
          <MyPGsView
            pgListings={pgListings}
            onSelectTab={(tab) => setActiveTab(tab)}
            onViewPG={(pg) => setSelectedDetailPG(pg)}
            onEditPG={(pg) => setSelectedDetailPG(pg)}
            onManageRooms={(pg) => setSelectedDetailPG(pg)}
            onUpdateAvailabilityPG={(pg) => setActiveTab('availability')}
            onTogglePausePG={handleTogglePausePG}
            onDeletePG={handleDeletePG}
          />
        )}

        {activeTab === 'add-pg' && (
          <AddNewPGWizard
            onSelectTab={(tab) => setActiveTab(tab)}
            onAddPGListing={handleAddPGListing}
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
          <EnquiriesView
            enquiries={enquiries}
            onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            onOpenScheduleVisit={(enq) => {
              setScheduleVisitEnquiry(enq);
              setIsScheduleVisitOpen(true);
            }}
            onOpenWhatsApp={(enq) => {
              setWhatsAppEnquiry(enq);
              setIsWhatsAppOpen(true);
            }}
            onCallTenant={handleCallTenant}
          />
        )}

        {activeTab === 'visits' && (
          <VisitsView
            visits={visits}
            onUpdateVisitStatus={handleUpdateVisitStatus}
            onRescheduleVisit={(v) => {
              setScheduleVisitEnquiry({
                id: `ENQ-${Date.now()}`,
                tenantName: v.visitorName,
                tenantPhone: v.visitorPhone,
                pgId: v.pgId,
                pgName: v.pgName,
                roomType: 'Walkthrough',
                moveInDate: v.visitDate,
                status: 'VISIT SCHEDULED',
                createdDate: 'Today'
              });
              setIsScheduleVisitOpen(true);
            }}
          />
        )}

        {activeTab === 'availability' && (
          <AvailabilityView
            pgListings={pgListings}
            onUpdateAvailability={handleUpdateAvailability}
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
          <NotificationsView
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onMarkSingleAsRead={handleMarkSingleAsRead}
            onClearNotifications={handleClearNotifications}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={(up) => setProfile((prev) => ({ ...prev, ...up }))}
            onLogout={() => {
              setIsLoggedIn(false);
              setActiveTab('login');
              setAuthView('login');
            }}
          />
        )}
      </main>

      {/* Modals */}
      <ScheduleVisitModal
        isOpen={isScheduleVisitOpen}
        enquiry={scheduleVisitEnquiry}
        onClose={() => {
          setIsScheduleVisitOpen(false);
          setScheduleVisitEnquiry(null);
        }}
        onScheduleVisit={handleScheduleVisit}
      />

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
        onSavePG={handleSaveDetailPG}
      />
    </div>
  );
}
