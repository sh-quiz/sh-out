import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, User, School, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { UpdateProfileData } from "@/lib/user";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UpdateProfileData, file: File | null) => Promise<void>;
    initialData: {
        name: string;
        school: string | null;
        profilePicture: string | null;
    };
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
    // Split name into first and last for the form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [school, setSchool] = useState("");

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset form when opening
    useEffect(() => {
        if (isOpen) {
            const nameParts = initialData.name.split(' ');
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(' ') || "");
            setSchool(initialData.school || "");
            setPreviewUrl(initialData.profilePicture);
            setSelectedFile(null);
        }
    }, [isOpen, initialData]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave({ firstName, lastName, school }, selectedFile);
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <h3 className="text-lg font-medium text-white">Edit Profile</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/5 transition-colors text-[#878D96] hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-[#161B22]">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[#878D96]">
                                                    <User className="w-10 h-10" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                                        >
                                            <Camera className="w-8 h-8 text-white" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-sm text-[#007AFF] hover:text-[#0056b3] font-medium transition-colors"
                                    >
                                        Change Profile Picture
                                    </button>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#878D96]">First Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full h-11 bg-[#161B22] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-[#007AFF] transition-colors"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#878D96]">Last Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full h-11 bg-[#161B22] border border-white/10 rounded-lg px-4 text-white focus:outline-none focus:border-[#007AFF] transition-colors"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#878D96]">School / Organization</label>
                                    <div className="relative">
                                        <School className="absolute left-3 top-3 w-5 h-5 text-[#878D96]" />
                                        <input
                                            type="text"
                                            value={school}
                                            onChange={(e) => setSchool(e.target.value)}
                                            className="w-full h-11 bg-[#161B22] border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-[#007AFF] transition-colors"
                                            placeholder="Harvard University"
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="h-11 px-6 rounded-lg text-[#878D96] hover:text-white hover:bg-white/5 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-11 px-6 rounded-lg bg-[#007AFF] hover:bg-[#0062cc] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
