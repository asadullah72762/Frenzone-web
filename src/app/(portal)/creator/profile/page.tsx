"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/status-badge";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { FormSkeleton } from "@/components/ui/skeleton";
import type { CreatorProfile } from "@/types/creator";

export default function CreatorProfilePage() {
  const { data: profile, isLoading, error, refetch } = useAsyncData(
    () => creatorService.getProfile(),
    [],
    200
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    language: "English",
    bio: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        country: profile.country || "",
        language: profile.language || "English",
        bio: profile.bio || "",
        instagram: profile.socialLinks?.instagram || "",
        tiktok: profile.socialLinks?.tiktok || "",
        youtube: profile.socialLinks?.youtube || "",
      });
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full legal name is required.";
    } else if (formData.fullName.length > 100) {
      errors.fullName = "Full name must not exceed 100 characters.";
    }

    if (formData.phone) {
      if (formData.phone.length > 30) {
        errors.phone = "Phone number must not exceed 30 characters.";
      } else if (!/^[+0-9\s().-]{5,30}$/.test(formData.phone)) {
        errors.phone = "Invalid phone number format.";
      }
    }

    if (formData.bio && formData.bio.length > 1000) {
      errors.bio = "Channel bio must not exceed 1,000 characters.";
    }

    if (formData.country && formData.country.length > 100) {
      errors.country = "Country must not exceed 100 characters.";
    }

    const isValidSocial = (val: string) => {
      if (!val) return true;
      if (val.startsWith("http://") || val.startsWith("https://")) {
        try {
          const u = new URL(val);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return false;
        }
      }
      return /^@?[a-zA-Z0-9._-]+$/.test(val);
    };

    if (formData.instagram) {
      if (formData.instagram.length > 200) {
        errors.instagram = "Instagram handle or URL must not exceed 200 characters.";
      } else if (!isValidSocial(formData.instagram)) {
        errors.instagram = "Please enter a valid Instagram handle or URL.";
      }
    }

    if (formData.tiktok) {
      if (formData.tiktok.length > 200) {
        errors.tiktok = "TikTok handle or URL must not exceed 200 characters.";
      } else if (!isValidSocial(formData.tiktok)) {
        errors.tiktok = "Please enter a valid TikTok handle or URL.";
      }
    }

    if (formData.youtube) {
      if (formData.youtube.length > 200) {
        errors.youtube = "YouTube channel URL must not exceed 200 characters.";
      } else if (!isValidSocial(formData.youtube)) {
        errors.youtube = "Please enter a valid YouTube handle or URL.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setServerError("Please select an image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError("Image size must be 5MB or smaller.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setServerError("");
      const res = await creatorService.uploadAvatar(file);
      if (res?.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
        setSuccessMsg("Profile picture updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3500);
      }
    } catch (err: any) {
      setServerError(err?.message || "Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setServerError("");

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const updated = await creatorService.updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        language: formData.language.trim(),
        bio: formData.bio.trim(),
        socialLinks: {
          instagram: formData.instagram.trim(),
          tiktok: formData.tiktok.trim(),
          youtube: formData.youtube.trim(),
        },
      });

      if (updated) {
        setSuccessMsg("Profile settings saved successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err: any) {
      setServerError(err?.message || "Failed to save profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <FormSkeleton />;

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive-soft/10 p-8 text-center max-w-lg mx-auto mt-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">Unable to load Creator Profile</h3>
        <p className="text-sm text-text-muted mt-1 mb-6">
          {error.message || "An unexpected error occurred while fetching your creator profile."}
        </p>
        <Button variant="primary" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  const currentStatus = profile?.status || "INACTIVE";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Creator Profile & Account Settings
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Manage your verified creator identity, bio, social connections, and payout preferences.
          </p>
        </div>
        <StatusBadge status={currentStatus} />
      </div>

      {successMsg && (
        <div className="rounded-xl border border-success/30 bg-success-soft p-4 text-sm font-medium text-success flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {serverError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive-soft/20 p-4 text-sm font-medium text-destructive flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal & Channel Identity</CardTitle>
            <CardDescription>
              Your public handle and legal verified contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Row */}
            <div className="flex items-center space-x-4 pb-2">
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={formData.fullName || "Creator Avatar"}
                    className="h-16 w-16 rounded-full object-cover border-2 border-brand/20 shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center border-2 border-brand/20 shadow-sm text-white font-extrabold text-xl select-none">
                    {formData.fullName?.trim()?.charAt(0)?.toUpperCase() || profile?.username?.trim()?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 disabled:opacity-50"
                  title="Change Profile Picture"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-text-primary text-base">@{profile?.username || "creator"}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-brand h-6 px-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? "Uploading..." : "Change Photo"}
                  </Button>
                </div>
                <p className="text-xs text-text-muted">
                  Creator ID: {profile?.id || "N/A"} • Member since {profile?.agreementSignedDate || "2026"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Full Legal Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>
                {validationErrors.fullName && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Email Address (Read-only)</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full rounded-lg border border-border bg-surface-muted pl-9 pr-3 py-2 text-sm text-text-muted outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Phone Number</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">Country / Region</label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                    placeholder="e.g. United States"
                  />
                </div>
                {validationErrors.country && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.country}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary">Creator Channel Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand resize-none"
                placeholder="Share a brief overview of your streaming content, niche, and schedule..."
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.bio ? (
                  <p className="text-xs text-destructive">{validationErrors.bio}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-muted">{formData.bio.length} / 1000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Social Handles</CardTitle>
            <CardDescription>
              Verified platforms used for audience cross-promotion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  placeholder="https://instagram.com/yourhandle"
                />
                {validationErrors.instagram && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.instagram}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">TikTok</label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  placeholder="https://tiktok.com/@yourhandle"
                />
                {validationErrors.tiktok && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.tiktok}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary">YouTube Channel</label>
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) => handleChange("youtube", e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-brand"
                  placeholder="https://youtube.com/@yourchannel"
                />
                {validationErrors.youtube && (
                  <p className="text-xs text-destructive mt-1">{validationErrors.youtube}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Preferences</CardTitle>
            <CardDescription>
              Destination account for monthly earnings disbursements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-surface-muted/60 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {profile?.paymentMethod?.type || "PAYPAL"} Connected
                  </p>
                  <p className="text-xs text-text-muted">
                    {profile?.paymentMethod?.details || "Default payout method registered with your Frenzone account."}
                  </p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" customLabel="Verified" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={isSaving}
            disabled={isSaving || isUploadingAvatar}
            icon={<Save className="h-4 w-4" />}
          >
            {isSaving ? "Saving Settings..." : "Save Profile Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
