"use client";
import { useEffect, useState } from "react";
import { FaMedal, FaStar, FaTrophy, FaCrown, FaAward, FaGem, FaRocket, FaFire, FaHeart, FaBook, FaUserGraduate } from "react-icons/fa";
import { fetchBadges } from "../../lib/profileApi";

const badgeIconMap: Record<string, any> = {
  FaMedal,
  FaStar,
  FaTrophy,
  FaCrown,
  FaAward,
  FaGem,
  FaRocket,
  FaFire,
  FaHeart,
  FaBook,
  FaUserGraduate
};

const mockBadges = [
  { id: 1, icon: FaMedal, label: "Top Contributor", earned: true },
  { id: 2, icon: FaStar, label: "100+ Likes", earned: true },
  { id: 3, icon: FaTrophy, label: "5 Articles Published", earned: false },
];

export default function Badges() {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    fetchBadges().then(setBadges);
  }, []);

  if (!badges.length) return null;

  return (
    <div className="my-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Badges</h2>
      <div className="flex flex-wrap gap-4">
        {badges.map(badge => {
          const Icon = badgeIconMap[badge.icon] || FaAward;
          return (
            <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl shadow ${badge.earned ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-gray-100 dark:bg-gray-800 border-gray-400'} border-2 min-w-[90px] sm:min-w-[120px] md:min-w-[140px]`}>
              <Icon className={`text-2xl sm:text-3xl mb-1 ${badge.earned ? 'text-yellow-500' : 'text-gray-400'}`} />
              <span className={`font-semibold text-xs sm:text-sm md:text-base ${badge.earned ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-400'}`}>{badge.label}</span>
              {badge.earned ? <span className="text-xs text-green-600 mt-1">Earned</span> : <span className="text-xs text-gray-400 mt-1">Locked</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
