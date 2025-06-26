"use client";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/lib/api";
import { FaUser, FaEdit, FaSave, FaTimes, FaPhone, FaCamera } from "react-icons/fa";
import { useProfile } from "@/contexts/ProfileContext";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { getNames, getCode } from 'country-list';

export default function PersonalDetails() {
  const { user, updateProfile, showNotification } = useProfile();
  const [details, setDetails] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bioWordCount, setBioWordCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate country options
  const countryOptions = getNames().map(name => ({
    value: name,
    label: name
  }));

  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      setDetails({
        firstName: nameParts[0] || '',
        middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '',
        lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        birthday: user.birthday || '',
        gender: user.gender || '',
        country: user.country || '',
        location: user.location || '',
        language: user.language || '',
        timezone: user.timezone || '',
        website: user.website || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
      
      // Calculate initial bio word count
      if (user.bio) {
        setBioWordCount(user.bio.trim().split(/\s+/).filter(word => word.length > 0).length);
      }
    }
  }, [user]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length <= 250) {
      setDetails({...details, bio: text});
      setBioWordCount(words.length);
    } else {
      showNotification("Bio cannot exceed 250 words", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification("Please select an image file", "error");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size should be less than 5MB", "error");
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local details
        setDetails({...details, avatar: data.avatarUrl});
        
        // Update profile context if user data is returned
        if (data.user) {
          await updateProfile(data.user);
        }
        
        showNotification("Profile picture updated successfully!", "success");
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!details.firstName.trim()) {
        showNotification("First name is required", "error");
        return;
      }
      
      if (!details.lastName.trim()) {
        showNotification("Last name is required", "error");
        return;
      }

      // Construct full name
      const fullName = [
        details.firstName.trim(),
        details.middleName?.trim(),
        details.lastName.trim()
      ].filter(Boolean).join(' ');

      await updateProfile({
        name: fullName,
        firstName: details.firstName,
        middleName: details.middleName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        username: details.username,
        birthday: details.birthday,
        gender: details.gender,
        country: details.country,
        location: details.location,
        language: details.language,
        timezone: details.timezone,
        website: details.website,
        twitter: details.twitter,
        linkedin: details.linkedin,
        github: details.github,
        bio: details.bio,
        avatar: details.avatar
      });
      
      setEditing(false);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update details:", error);
      showNotification("Failed to update profile", "error");
    }
  };

  const getDisplayName = () => {
    const parts = [details.firstName, details.middleName, details.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Not set';
  };

  const getUserAvatar = () => {
    return details.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=0ea5e9&color=ffffff&size=120`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Mobile-First Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <FaUser className="text-white text-xs sm:text-sm" />
          </div>
          <span className="text-base sm:text-lg">Personal Details</span>
        </h3>
        <div className="flex gap-2 justify-end">
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
            >
              <FaTimes className="text-xs" />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          )}
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2"
          >
            {editing ? <FaSave className="text-xs" /> : <FaEdit className="text-xs" />}
            <span className="hidden sm:inline">{editing ? 'Save Changes' : 'Edit Details'}</span>
            <span className="sm:hidden">{editing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {/* Mobile-Optimized Profile Picture Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative shrink-0">
            <img
              src={getUserAvatar()}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-3 sm:border-4 border-white dark:border-slate-700 shadow-lg"
            />
            {editing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCamera className="text-xs" />
                )}
              </button>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {getDisplayName()}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              @{details.username || 'username'}
            </p>
            {editing && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                <span className="sm:hidden">Tap camera to upload</span>
                <span className="hidden sm:inline">Click camera icon to upload a new profile picture</span>
              </p>
            )}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Mobile-First Form Layout */}
      <div className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <div className="space-y-4 sm:space-y-6">
          <h4 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center gap-2 text-base sm:text-lg">
            <FaUser className="text-blue-500 text-sm sm:text-base" />
            Basic Information
          </h4>
          
          {/* Name Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={details.firstName}
                    onChange={e => setDetails({...details, firstName: e.target.value})}
                    placeholder="First name"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                  />
                  <input
                    type="text"
                    value={details.middleName}
                    onChange={e => setDetails({...details, middleName: e.target.value})}
                    placeholder="Middle name (optional)"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                  />
                  <input
                    type="text"
                    value={details.lastName}
                    onChange={e => setDetails({...details, lastName: e.target.value})}
                    placeholder="Last name"
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                  />
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  {getDisplayName()}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
              {editing ? (
                <input
                  type="text"
                  value={details.username}
                  onChange={e => setDetails({...details, username: e.target.value})}
                  placeholder="Username"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  {details.username || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                <div className="break-all sm:break-normal">{details.email || 'Not set'}</div>
                <span className="text-xs text-blue-600 dark:text-blue-400 block mt-1">(Cannot be changed)</span>
              </div>
            </div>
          </div>

          {/* Contact & Location Section */}
          <div className="space-y-4">
            <h5 className="font-medium text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
              <FaPhone className="text-green-500 text-xs sm:text-sm" />
              Contact & Location
            </h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              {editing ? (
                <div className="phone-input-container">
                  <PhoneInput
                    country={'us'}
                    value={details.phone}
                    onChange={phone => setDetails({...details, phone})}
                    inputProps={{
                      name: 'phone',
                      required: false,
                      autoFocus: false
                    }}
                    containerStyle={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: 'inherit',
                      paddingLeft: '48px'
                    }}
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRight: 'none',
                      borderRadius: '8px 0 0 8px'
                    }}
                    dropdownStyle={{
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}
                  />
                </div>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  {details.phone || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
              {editing ? (
                <Select
                  value={countryOptions.find((option: any) => option.value === details.country)}
                  onChange={(selectedOption: any) => setDetails({...details, country: selectedOption?.value || ''})}
                  options={countryOptions}
                  placeholder="Select your country"
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (provided: any, state: any) => ({
                      ...provided,
                      minHeight: '48px',
                      backgroundColor: 'transparent',
                      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    menu: (provided: any) => ({
                      ...provided,
                      backgroundColor: 'white',
                      color: 'black',
                      zIndex: 9999
                    }),
                    option: (provided: any, state: any) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : 'black'
                    })
                  }}
                />
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  {details.country || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
              {editing ? (
                <input
                  type="text"
                  value={details.location}
                  onChange={e => setDetails({...details, location: e.target.value})}
                  placeholder="City, State"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                />
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  {details.location || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
            <span className="text-xs text-gray-500 ml-2">({bioWordCount}/250 words)</span>
          </label>
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={details.bio}
                onChange={handleBioChange}
                placeholder="Tell us about yourself... (Max 250 words)"
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all resize-none"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {bioWordCount}/250 words
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white min-h-[4rem]">
              {details.bio || 'Not set'}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-optimized CSS */}
      <style jsx global>{`
        .phone-input-container {
          --phone-bg: white;
          --phone-text: #111827;
          --phone-border: #d1d5db;
        }
        
        .dark .phone-input-container {
          --phone-bg: #374151;
          --phone-text: #f9fafb;
          --phone-border: #4b5563;
        }
        
        .phone-input-container .react-tel-input {
          width: 100%;
        }
        
        .phone-input-container .react-tel-input .form-control {
          width: 100%;
          height: 48px;
          font-size: 14px;
          background-color: var(--phone-bg);
          border: 1px solid var(--phone-border);
          border-radius: 8px;
          color: var(--phone-text);
          padding-left: 48px;
        }
        
        .phone-input-container .react-tel-input .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .phone-input-container .react-tel-input .flag-dropdown {
          background-color: var(--phone-bg);
          border: 1px solid var(--phone-border);
          border-right: none;
          border-radius: 8px 0 0 8px;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown:hover {
          background-color: var(--phone-bg);
        }
        
        .phone-input-container .react-tel-input .flag-dropdown .selected-flag {
          background-color: transparent;
          padding: 0 8px;
        }
        
        .phone-input-container .react-tel-input .flag-dropdown .country-list {
          background-color: white;
          border: 1px solid var(--phone-border);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
        }
        
        @media (max-width: 640px) {
          .phone-input-container .react-tel-input .form-control {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        .react-select-container .react-select__control {
          min-height: 48px;
          border-radius: 8px;
        }
        
        .react-select-container .react-select__value-container {
          padding: 8px 12px;
        }
        
        .react-select-container .react-select__placeholder {
          color: #6b7280;
          font-size: 14px;
        }
        
        .react-select-container .react-select__single-value {
          color: inherit;
          font-size: 14px;
        }
        
        .react-select-container .react-select__menu {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 640px) {
          .react-select-container .react-select__control {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
}
