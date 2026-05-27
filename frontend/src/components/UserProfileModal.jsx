import { X, Edit, Mail, MapPin, GraduationCap, Calendar, BookOpen, Heart, Clock, Moon, Sun, Users } from "lucide-react";

export default function UserProfileModal({ user, onClose, onEditPreferences }) {
    if (!user) return null;

    // Function to get display text for lifestyle preferences
    const getPreferenceDisplay = (value, options) => {
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value;
    };

    // Lifestyle options mapping (same as in PreferenceForm)
    const lifestyleOptions = {
        cleanliness: [
            { value: "very-clean", label: "Very Clean" },
            { value: "clean", label: "Clean" },
            { value: "moderate", label: "Moderate" },
            { value: "relaxed", label: "Relaxed" }
        ],
        noiseLevel: [
            { value: "very-quiet", label: "Very Quiet" },
            { value: "quiet", label: "Quiet" },
            { value: "moderate", label: "Moderate" },
            { value: "loud", label: "Loud" }
        ],
        socialLevel: [
            { value: "introvert", label: "Introvert" },
            { value: "ambivert", label: "Ambivert" },
            { value: "extrovert", label: "Extrovert" }
        ],
        studyHabits: [
            { value: "intensive", label: "Intensive" },
            { value: "moderate", label: "Moderate" },
            { value: "light", label: "Light" }
        ],
        sleepSchedule: [
            { value: "early-bird", label: "Early Bird" },
            { value: "night-owl", label: "Night Owl" },
            { value: "flexible", label: "Flexible" }
        ]
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-600">Name</p>
                                <p className="font-medium text-slate-900">{user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-600">Email</p>
                                <p className="font-medium text-slate-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </p>
                            </div>
                            {user.university && (
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-600">University</p>
                                    <p className="font-medium text-slate-900 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        {user.university}
                                    </p>
                                </div>
                            )}
                            {user.year && (
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-600">Academic Year</p>
                                    <p className="font-medium text-slate-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {user.year}
                                    </p>
                                </div>
                            )}
                            {user.major && (
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-600">Major</p>
                                    <p className="font-medium text-slate-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        {user.major}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lifestyle Preferences */}
                    {user.preferences && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                Lifestyle Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {user.preferences.cleanliness && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600">Cleanliness</p>
                                        <p className="font-medium text-slate-900">
                                            {getPreferenceDisplay(user.preferences.cleanliness, lifestyleOptions.cleanliness)}
                                        </p>
                                    </div>
                                )}
                                {user.preferences.noiseLevel && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600">Noise Level</p>
                                        <p className="font-medium text-slate-900">
                                            {getPreferenceDisplay(user.preferences.noiseLevel, lifestyleOptions.noiseLevel)}
                                        </p>
                                    </div>
                                )}
                                {user.preferences.socialLevel && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600">Social Level</p>
                                        <p className="font-medium text-slate-900">
                                            {getPreferenceDisplay(user.preferences.socialLevel, lifestyleOptions.socialLevel)}
                                        </p>
                                    </div>
                                )}
                                {user.preferences.studyHabits && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600">Study Habits</p>
                                        <p className="font-medium text-slate-900">
                                            {getPreferenceDisplay(user.preferences.studyHabits, lifestyleOptions.studyHabits)}
                                        </p>
                                    </div>
                                )}
                                {user.preferences.sleepSchedule && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-600">Sleep Schedule</p>
                                        <p className="font-medium text-slate-900 flex items-center gap-2">
                                            {user.preferences.sleepSchedule === 'early-bird' ? (
                                                <>
                                                    <Sun className="w-4 h-4" />
                                                    Early Bird
                                                </>
                                            ) : user.preferences.sleepSchedule === 'night-owl' ? (
                                                <>
                                                    <Moon className="w-4 h-4" />
                                                    Night Owl
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4" />
                                                    Flexible
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Interests */}
                    {user.preferences?.interests && user.preferences.interests.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.preferences.interests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio */}
                    {user.preferences?.bio && (
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">About Me</h3>
                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg leading-relaxed">
                                {user.preferences.bio}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 flex justify-between">
                    <button
                        onClick={onEditPreferences}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Preferences
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                            View Full Profile
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}