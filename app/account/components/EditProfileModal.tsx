"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Upload, Loader2, Camera } from "lucide-react";
import { userService, UpdateProfileInput } from "@/lib/user";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentSchool: string | null;
    currentAvatarUrl: string | null;
    onUpdateSuccess: () => void;
}

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
    school: z.string().optional(),
});

type FormInputs = z.infer<typeof profileSchema>;

export default function EditProfileModal({
    isOpen,
    onClose,
    currentName,
    currentSchool,
    currentAvatarUrl,
    onUpdateSuccess,
}: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormInputs>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: currentName.split(" ")[0] || "",
            lastName: currentName.split(" ").slice(1).join(" ") || "",
            school: currentSchool || "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            setValue("firstName", currentName.split(" ")[0] || "");
            setValue("lastName", currentName.split(" ").slice(1).join(" ") || "");
            setValue("school", currentSchool || "");
            setPreviewUrl(currentAvatarUrl);
            setSelectedFile(null);
        }
    }, [isOpen, currentName, currentSchool, currentAvatarUrl, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: FormInputs) => {
        setIsLoading(true);
        try {
            const updateInput: UpdateProfileInput = {
                firstName: data.firstName,
                lastName: data.lastName,
                school: data.school || undefined,
            };

            if (selectedFile) {
                updateInput.file = selectedFile;
            }

            await userService.updateProfile(updateInput);
            onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
            // Handle error (toast or alert can be added later)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-[#0B0E12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-xl font-medium text-white">Edit Profile</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#878D96] hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#007AFF] transition-colors">
                                                <img
                                                    src={previewUrl || "https://via.placeholder.com/150"}
                                                    alt="Profile Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <p className="text-sm text-[#878D96]">Change Profile Picture</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wider text-[#878D96]">First Name</label>
                                            <input
                                                {...register("firstName")}
                                                className={`w-full bg-[#161B22] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#007AFF]'
                                                    }`}
                                                placeholder="John"
                                            />
                                            {errors.firstName && (
                                                <p className="text-xs text-red-500">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase tracking-wider text-[#878D96]">Last Name</label>
                                            <input
                                                {...register("lastName")}
                                                className={`w-full bg-[#161B22] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-[#007AFF]'
                                                    }`}
                                                placeholder="Doe"
                                            />
                                            {errors.lastName && (
                                                <p className="text-xs text-red-500">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-[#878D96]">School / Organization</label>
                                        <input
                                            {...register("school")}
                                            className="w-full bg-[#161B22] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#007AFF] transition-colors"
                                            placeholder="Enter your school name"
                                        />
                                        {errors.school && (
                                            <p className="text-xs text-red-500">{errors.school.message}</p>
                                        )}
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-3 px-4 rounded-lg border border-white/10 text-[#878D96] hover:bg-white/5 hover:text-white transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 py-3 px-4 rounded-lg bg-[#007AFF] hover:bg-[#007AFF]/90 text-white transition-colors font-medium flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
