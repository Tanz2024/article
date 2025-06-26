"use client";
import { useRouter } from "next/navigation";
import { FaPen, FaShare, FaChartLine, FaCog, FaPlus, FaUpload } from "react-icons/fa";
import { useProfile } from "@/contexts/ProfileContext";

export default function QuickActions() {
  const router = useRouter();
  const { showNotification } = useProfile();

  const handleWriteArticle = () => {
    router.push('/write');
    showNotification("Redirecting to article editor...", "info");
  };

  const handleShareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my profile',
        text: 'Visit my profile to see my latest articles and updates!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showNotification("Profile link copied to clipboard!", "success");
    }
  };

  const handleViewAnalytics = () => {
    router.push('/dashboard');
    showNotification("Opening analytics dashboard...", "info");
  };

  const handleSettings = () => {
    router.push('/dashboard');
    showNotification("Opening settings...", "info");
  };

  const handleUploadContent = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,.pdf,.doc,.docx';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showNotification(`Selected file: ${file.name}`, "info");
        // Here you would typically upload the file
        // For now, we'll just show a notification
        setTimeout(() => {
          showNotification("File upload feature coming soon!", "info");
        }, 1000);
      }
    };
    fileInput.click();
  };

  const handleCreatePost = () => {
    router.push('/write?type=post');
    showNotification("Creating a new post...", "info");
  };

  return (
    <div className="my-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <button onClick={handleWriteArticle} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-primary text-white font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-primary-dark transition-all">
          <FaPen /> Write Article
        </button>
        <button onClick={handleShareContent} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-blue-600 transition-all">
          <FaShare /> Share Profile
        </button>
        <button onClick={handleViewAnalytics} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-purple-500 text-white font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-purple-600 transition-all">
          <FaChartLine /> Analytics
        </button>
        <button onClick={handleSettings} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
          <FaCog /> Settings
        </button>
        <button onClick={handleUploadContent} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-green-500 text-white font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-green-600 transition-all">
          <FaUpload /> Upload
        </button>
        <button onClick={handleCreatePost} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-pink-500 text-white font-semibold text-sm sm:text-base md:text-lg shadow hover:bg-pink-600 transition-all">
          <FaPlus /> New Post
        </button>
      </div>
    </div>
  );
}
