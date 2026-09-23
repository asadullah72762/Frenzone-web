"use client";

import { useState } from "react";
import { FileUp, ShieldCheck, Trash2, Loader2, CheckCircle2, FileText } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export interface UploadedDoc {
  name: string;
  url: string;
}

interface SupportingDocumentUploadProps {
  documents?: UploadedDoc[];
  onChange?: (documents: UploadedDoc[]) => void;
}

export function SupportingDocumentUpload({
  documents = [],
  onChange,
}: SupportingDocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await apiClient.postFormData<{
        success: boolean;
        document: { name: string; url: string };
      }>("/agency/upload-document", formData);

      if (res?.document) {
        const next = [...documents, { name: res.document.name, url: res.document.url }];
        onChange?.(next);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input value so user can re-upload if needed
      event.target.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const next = documents.filter((_, i) => i !== index);
    onChange?.(next);
  };

  return (
    <section className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <FileUp className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">Supporting Business Documents</h2>
          <p className="text-text-secondary mt-1 text-sm leading-relaxed">
            Attach official business registration, tax certificates, or authorization letters (PDF, PNG, JPG).
          </p>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-2 pt-1">
          {documents.map((doc, idx) => (
            <div
              key={`${doc.name}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <FileText className="h-4 w-4 shrink-0 text-brand" />
                <span className="truncate font-medium text-text-primary text-xs sm:text-sm">
                  {doc.name}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="ml-2 text-text-muted hover:text-red-500 transition-colors p-1"
                title="Remove file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {uploadError ? (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2.5 border border-red-200">
          {uploadError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <label
          className={`inline-flex items-center space-x-2 cursor-pointer rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-text-primary hover:bg-surface-muted transition-all shadow-xs ${
            isUploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-brand" />
              <span>Uploading document…</span>
            </>
          ) : (
            <>
              <FileUp className="h-4 w-4 text-brand" />
              <span>Upload document</span>
            </>
          )}
          <input
            className="sr-only"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            disabled={isUploading}
            onChange={handleFileChange}
          />
        </label>
        <span className="text-xs text-text-muted">Max file size 10MB (PDF, PNG, JPG)</span>
      </div>

      <p className="text-text-muted text-xs flex items-center pt-1 border-t border-border/50">
        <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-600 shrink-0" />
        All uploaded verification documents are stored securely and only accessible by authorized compliance reviewers.
      </p>
    </section>
  );
}
