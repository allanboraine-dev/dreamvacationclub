import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, Share2, Download, Calendar, Trash2, AlertTriangle, X, BedDouble } from 'lucide-react';
import { MemberProfile, AppView, NotificationFunc } from '../types';
import { jsPDF } from "jspdf";

interface ItineraryProps {
  user: MemberProfile;
  bookingId: string | null;
  onNavigate: (view: AppView) => void;
  showNotification: NotificationFunc;
  onCancelBooking: (id: string) => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ user, bookingId, onNavigate, showNotification, onCancelBooking }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Use the specific booking if ID provided, else fallback to first one, else null
  const booking = bookingId 
    ? user.bookings.find(b => b.id === bookingId) 
    : (user.bookings && user.bookings.length > 0 ? user.bookings[0] : null);

  if (!booking) {
    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 items-center justify-center p-6 text-center">
            <p className="text-slate-500 mb-4">No upcoming bookings found.</p>
            <button onClick={() => onNavigate(AppView.DASHBOARD)} className="text-blue-500 font-medium">Go Back</button>
        </div>
    )
  }

  const handleDownload = () => {
    showNotification("Generating Confirmation PDF...", "info");
    
    try {
        const doc = new jsPDF();
        
        // --- Header Background ---
        doc.setFillColor(15, 23, 42); // Navy 900 hex #0f172a
        doc.rect(0, 0, 210, 40, 'F');
        
        // --- Header Text ---
        doc.setTextColor(245, 158, 11); // Amber 500
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Dream Vacation Club", 20, 20);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Official Booking Confirmation", 20, 30);

        // --- Booking Details ---
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Hi ${user.firstName},`, 20, 60);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Your holiday is confirmed. Here are your trip details:", 20, 70);

        let y = 90;
        const lineSpacing = 12;
        const col1X = 20;
        const col2X = 80;

        // Draw a light background box for details
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.rect(15, 80, 180, 110, 'F');
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.rect(15, 80, 180, 110, 'S');

        // Row 1: Resort
        doc.setFont("helvetica", "bold");
        doc.text("Resort:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(booking.resortName, col2X, y);
        y += lineSpacing;

        // Row 2: Location
        doc.setFont("helvetica", "bold");
        doc.text("Location:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(booking.location, col2X, y);
        y += lineSpacing;

        // Row 3: Unit Type (New)
        if (booking.roomType) {
            doc.setFont("helvetica", "bold");
            doc.text("Unit Type:", col1X, y);
            doc.setFont("helvetica", "normal");
            doc.text(booking.roomType, col2X, y);
            y += lineSpacing;
        }

        // Row 4: Check In
        doc.setFont("helvetica", "bold");
        doc.text("Check-in:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(booking.checkIn + " (14:00 PM)", col2X, y);
        y += lineSpacing;

        // Row 5: Check Out
        doc.setFont("helvetica", "bold");
        doc.text("Check-out:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(booking.checkOut + " (10:00 AM)", col2X, y);
        y += lineSpacing;

         // Row 6: Reference
        doc.setFont("helvetica", "bold");
        doc.text("Confirmation #:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(booking.confirmationCode, col2X, y);
        y += lineSpacing;

        // Row 7: Guests
        doc.setFont("helvetica", "bold");
        doc.text("Guests:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${booking.guests} Adults`, col2X, y);
        y += lineSpacing;
        
        // Row 8: Points
        doc.setFont("helvetica", "bold");
        doc.text("Points Used:", col1X, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${booking.pointsUsed} pts`, col2X, y);

        // --- Footer ---
        y = 200;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;
        
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Please present this document or your digital membership card upon check-in.", 20, y);
        y += 5;
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, y);
        
        doc.save(`DVC_Booking_${booking.confirmationCode}.pdf`);
        showNotification("PDF saved to your device", "success");
    } catch (e) {
        console.error(e);
        showNotification("Could not generate PDF", "error");
    }
  };

  const handleShare = async () => {
    const shareText = `I'm confirmed for a trip to ${booking.resortName} (${booking.roomType || 'Standard'}) in ${booking.location} from ${booking.checkIn} to ${booking.checkOut}!`;
    const shareUrl = window.location.href; 
    
    // Construct data for Web Share API
    const shareData = {
        title: `Trip to ${booking.resortName}`,
        text: shareText,
        url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
            await navigator.share(shareData);
            // Native share successful
        } catch (error) {
            // User cancelled or not supported for this context
            if ((error as Error).name !== 'AbortError') {
                 // Try clipboard as fallback
                 copyToClipboard(`${shareText} ${shareUrl}`);
            }
        }
    } else {
        // Fallback for desktop/browsers without Web Share API
        copyToClipboard(`${shareText} ${shareUrl}`);
    }
  };

  const copyToClipboard = async (text: string) => {
      // 1. Try Modern Clipboard API
      try {
          // Focus window first to help with permission issues in some browsers
          window.focus();
          if (navigator.clipboard && navigator.clipboard.writeText) {
              await navigator.clipboard.writeText(text);
              showNotification("Trip details copied to clipboard!", "success");
              return;
          }
      } catch (err) {
          console.warn("Clipboard API failed, attempting fallback...", err);
      }

      // 2. Fallback: Legacy execCommand
      try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          
          // Styling to ensure it works on iOS/Mobile but is visually hidden
          // Do NOT use display:none or visibility:hidden as it breaks copy in some browsers
          textArea.style.position = "fixed";
          textArea.style.left = "0";
          textArea.style.top = "0";
          textArea.style.opacity = "0";
          textArea.style.pointerEvents = "none";
          textArea.style.zIndex = "-1";
          textArea.setAttribute('readonly', ''); // Prevent keyboard on mobile
          
          document.body.appendChild(textArea);
          
          // Selection strategy
          const isIOS = navigator.userAgent.match(/ipad|iphone/i);
          
          if (isIOS) {
              const range = document.createRange();
              range.selectNodeContents(textArea);
              const selection = window.getSelection();
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
              }
              textArea.setSelectionRange(0, 999999);
          } else {
              textArea.select();
          }
          
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
              showNotification("Trip details copied to clipboard!", "success");
          } else {
              // If even execCommand fails (rare but possible in very restricted iframes)
              console.error("execCommand returned false");
              showNotification("Could not auto-copy. Please copy manually.", "error");
          }
      } catch (fallbackErr) {
           console.error("Copy fallback failed:", fallbackErr);
           showNotification("Could not share. Clipboard access denied.", "error");
      }
  };

  const confirmCancellation = () => {
      setShowCancelModal(false);
      onCancelBooking(booking.id);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 overflow-y-auto no-scrollbar pb-32 transition-colors duration-300 relative">
      {/* Hero Image & Header */}
      <div className="relative h-72 shrink-0">
        <img src={booking.imageUrl} className="w-full h-full object-cover" alt={booking.resortName} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent"></div>
        
        {/* Back button with dynamic safe-area top offset */}
        <button 
            onClick={() => onNavigate(AppView.DASHBOARD)}
            className="absolute top-safe mt-6 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors z-20"
        >
            <ArrowLeft size={24} />
        </button>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-xl p-6 border border-slate-100 dark:border-navy-800 transition-colors duration-300">
            <div className="flex justify-between items-start mb-2">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    Confirmed
                </span>
                <span className="text-xs font-mono text-slate-400">#{booking.confirmationCode}</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy-900 dark:text-white mb-6">{booking.resortName}</h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-navy-950 p-4 rounded-2xl border border-slate-100 dark:border-navy-800">
                    <div className="flex items-center text-slate-400 mb-1">
                        <Calendar size={12} className="mr-1" />
                        <span className="text-xs uppercase tracking-wider font-bold">Check In</span>
                    </div>
                    <p className="text-navy-900 dark:text-white font-bold text-lg">{booking.checkIn}</p>
                    <p className="text-slate-400 text-xs mt-1">14:00 PM</p>
                </div>
                <div className="bg-slate-50 dark:bg-navy-950 p-4 rounded-2xl border border-slate-100 dark:border-navy-800">
                    <div className="flex items-center text-slate-400 mb-1">
                        <Calendar size={12} className="mr-1" />
                        <span className="text-xs uppercase tracking-wider font-bold">Check Out</span>
                    </div>
                    <p className="text-navy-900 dark:text-white font-bold text-lg">{booking.checkOut}</p>
                    <p className="text-slate-400 text-xs mt-1">10:00 AM</p>
                </div>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-navy-800">
                <div className="flex items-center text-slate-600 dark:text-slate-300 pt-2">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mr-4 shrink-0">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-navy-900 dark:text-white">Guest List</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{booking.guests} Adults • Main Member</p>
                    </div>
                </div>
                
                 <div className="flex items-center text-slate-600 dark:text-slate-300 pt-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 dark:text-amber-400 mr-4 shrink-0">
                        <BedDouble size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-navy-900 dark:text-white">Unit Type</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{booking.roomType || 'Standard Unit'}</p>
                    </div>
                </div>

                 <div className="flex items-center text-slate-600 dark:text-slate-300 pt-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mr-4 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-navy-900 dark:text-white">Resort Address</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{booking.location || 'Resort Location'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 space-y-3 pb-8">
            <button 
                onClick={handleDownload}
                className="w-full bg-navy-900 dark:bg-navy-800 text-white py-4 rounded-2xl font-semibold flex items-center justify-center hover:bg-navy-800 dark:hover:bg-navy-700 transition-colors shadow-lg shadow-navy-900/20 active:scale-95 duration-150"
            >
                <Download size={20} className="mr-2" />
                Save Confirmation PDF
            </button>
            <button 
                onClick={handleShare}
                className="w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-navy-900 dark:text-white py-4 rounded-2xl font-semibold flex items-center justify-center hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors active:scale-95 duration-150"
            >
                <Share2 size={20} className="mr-2" />
                Share Trip Details
            </button>

            {/* Cancel Button */}
            <button 
                onClick={() => setShowCancelModal(true)}
                className="w-full mt-4 text-red-500 hover:text-red-600 dark:hover:text-red-400 py-4 font-semibold text-sm flex items-center justify-center transition-colors active:scale-95"
            >
                <Trash2 size={16} className="mr-2" />
                Cancel Booking
            </button>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4 mx-auto">
                    <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white text-center mb-2">Cancel Booking?</h3>
                <p className="text-center text-slate-500 text-sm mb-6">
                    Are you sure you want to cancel your trip to <span className="font-bold">{booking.resortName}</span>? 
                    <br/><br/>
                    <span className="text-xs bg-slate-100 dark:bg-navy-800 p-2 rounded-lg block">
                        You will be refunded <span className="font-bold text-navy-900 dark:text-white">{Math.floor(booking.pointsUsed * 0.8)} points</span> (80% of booking value).
                    </span>
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setShowCancelModal(false)}
                        className="py-3 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
                    >
                        Keep It
                    </button>
                    <button 
                        onClick={confirmCancellation}
                        className="py-3 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Itinerary;