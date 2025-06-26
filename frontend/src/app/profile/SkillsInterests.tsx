"use client";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaStar, FaHeart, FaCode, FaPaintBrush } from "react-icons/fa";
import { useProfile } from "@/contexts/ProfileContext";

// Predefined options for skills and interests
const SKILLS_OPTIONS = [
  "Writing",
  "Creative Writing",
  "Editing",
  "Proofreading",
  "Research",
  "Fact-checking",
  "Interviewing",
  "Storytelling",
  "Comedy Writing",
  "Satire/Parody",
  "Scriptwriting",
  "Screenwriting",
  "Headline Writing",
  "Copywriting",
  "Content Strategy",
  "Social Media Management",
  "SEO Optimization",
  "Graphic Design",
  "Photojournalism",
  "Video Editing",
  "Motion Graphics",
  "Audio Editing (Podcasting)",
  "Public Speaking",
  "Voice-over / Narration",
  "HTML/CSS",
  "Translation",
  "Data Journalism",
  "Analytics & Metrics",
  "Storyboarding",
  "Meme Creation",
  "Branding & Messaging",
  "Humor Engineering",
  "Engagement Strategy"
];


const INTERESTS_OPTIONS = [
  "Technology", "Science", "Health & Fitness", "Travel", "Photography", "Music", "Movies",
  "Books", "Gaming", "Sports", "Cooking", "Art", "Fashion", "Nature", "Environment",
  "History", "Politics", "Economics", "Philosophy", "Psychology", "Education", "Languages",
  "Culture", "Food", "Wine", "Coffee", "Entrepreneurship", "Innovation", "Startups",
  "Finance", "Investment", "Real Estate", "Cryptocurrency", "Blockchain", "AI & Machine Learning",
  "Space", "Astronomy", "Medicine", "Biology", "Chemistry", "Physics", "Mathematics",
  "Architecture", "Design", "Interior Design", "Gardening", "DIY", "Crafts", "Collectibles",
  "Volunteering", "Social Causes", "Sustainability", "Meditation", "Yoga", "Martial Arts"
];

export default function SkillsInterests() {
  const { user, updateProfile, showNotification } = useProfile();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState(false);
  const [interestsDropdownOpen, setInterestsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const interestsDropdownRef = useRef<HTMLDivElement>(null);

  const MAX_ITEMS = 5;  useEffect(() => {
    if (user) {
      setSkills(user.skills || []);
      setInterests(user.interests || []);
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setSkillsDropdownOpen(false);
      }
      if (interestsDropdownRef.current && !interestsDropdownRef.current.contains(event.target as Node)) {
        setInterestsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const updateSkillsInterests = async (updatedSkills: string[], updatedInterests: string[]) => {
    try {
      await updateProfile({ skills: updatedSkills, interests: updatedInterests });
    } catch (error) {
      console.error("Failed to update skills/interests:", error);
      showNotification("Failed to update skills/interests", "error");
    }
  };

  const addSkill = async (skillToAdd: string) => {
    if (skills.length >= MAX_ITEMS) {
      showNotification(`Maximum ${MAX_ITEMS} skills allowed`, "error");
      return;
    }
    if (!skills.includes(skillToAdd)) {
      const updatedSkills = [...skills, skillToAdd];
      setSkills(updatedSkills);
      await updateSkillsInterests(updatedSkills, interests);
    }
    setSkillsDropdownOpen(false);
  };

  const removeSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    await updateSkillsInterests(updatedSkills, interests);
  };

  const addInterest = async (interestToAdd: string) => {
    if (interests.length >= MAX_ITEMS) {
      showNotification(`Maximum ${MAX_ITEMS} interests allowed`, "error");
      return;
    }
    if (!interests.includes(interestToAdd)) {
      const updatedInterests = [...interests, interestToAdd];
      setInterests(updatedInterests);
      await updateSkillsInterests(skills, updatedInterests);
    }
    setInterestsDropdownOpen(false);
  };

  const removeInterest = async (interestToRemove: string) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    setInterests(updatedInterests);
    await updateSkillsInterests(skills, updatedInterests);
  };
  const availableSkills = SKILLS_OPTIONS.filter(skill => !skills.includes(skill));
  const availableInterests = INTERESTS_OPTIONS.filter(interest => !interests.includes(interest));

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="my-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">Skills & Interests</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-2 font-semibold text-base sm:text-lg">Skills</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs sm:text-sm md:text-base flex items-center gap-1">
                <FaStar className="inline" /> {skill}
                <button onClick={() => removeSkill(skill)} className="ml-1 text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </span>
            ))}
            <button onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)} className="bg-primary text-white px-2 py-1 rounded-full text-xs sm:text-sm md:text-base flex items-center gap-1">
              <FaPlus /> Add
            </button>
          </div>
          {skillsDropdownOpen && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-3 mt-2 max-h-40 overflow-y-auto w-full sm:w-64">
              {availableSkills.length > 0 ? (
                availableSkills.map((skill) => (
                  <div
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800 px-2 py-1 rounded text-sm sm:text-base"
                  >
                    {skill}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No more skills available
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-2 font-semibold text-base sm:text-lg">Interests</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {interests.map((interest, idx) => (
              <span key={idx} className="bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-xs sm:text-sm md:text-base flex items-center gap-1">
                <FaHeart className="inline" /> {interest}
                <button onClick={() => removeInterest(interest)} className="ml-1 text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </span>
            ))}
            <button onClick={() => setInterestsDropdownOpen(!interestsDropdownOpen)} className="bg-primary text-white px-2 py-1 rounded-full text-xs sm:text-sm md:text-base flex items-center gap-1">
              <FaPlus /> Add
            </button>
          </div>
          {interestsDropdownOpen && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-3 mt-2 max-h-40 overflow-y-auto w-full sm:w-64">
              {availableInterests.length > 0 ? (
                availableInterests.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-800 px-2 py-1 rounded text-sm sm:text-base"
                  >
                    {interest}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No more interests available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
