"use client";

import { useState } from "react";
import { FileUp, ShieldCheck } from "lucide-react";

export function SupportingDocumentUpload() {
  const [fileName, setFileName] = useState<string>();
  return <section className="rounded-xl border border-dashed p-5"><div className="flex gap-3"><FileUp className="text-brand size-5" /><div><h2 className="font-semibold">Supporting documents</h2><p className="text-text-secondary mt-1 text-sm">Attach business documentation for review. Files are not uploaded in this static mode.</p></div></div><label className="mt-4 inline-flex cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold"><input className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFileName(event.target.files?.[0]?.name)} />Choose document</label>{fileName ? <p className="text-success mt-3 text-sm">Selected: {fileName}</p> : null}<p className="text-text-muted mt-3 text-xs"><ShieldCheck className="mr-1 inline size-3"/>Production files will use a backend-issued secure upload URL.</p></section>;
}
