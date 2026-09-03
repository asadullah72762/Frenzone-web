"use client";
import { useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function ReferralPanel({ code, link }: { code: string; link: string }) { const [copied, setCopied] = useState(false); return <Card><div className="flex items-center gap-2"><Link2 className="text-brand size-5"/><h2 className="font-semibold">Referral link</h2></div><p className="text-text-secondary mt-3 break-all text-sm">{link}</p><p className="text-text-muted mt-2 text-xs">Code: {code}</p><Button className="mt-4" variant="secondary" onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); }}>{copied ? "Copied" : <><Copy className="mr-2 size-4"/>Copy link</>}</Button></Card>; }
