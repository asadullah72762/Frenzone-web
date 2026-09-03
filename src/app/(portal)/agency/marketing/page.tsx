"use client";

import { Download, FileText, Presentation, Image as ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgencyMarketingPage() {
  const assets = [
    {
      id: "ag-m1",
      title: "Frenzone Agency Partner Pitch Deck 2026",
      type: "Presentation Deck",
      format: "PDF / PPTX",
      size: "14.2 MB",
    },
    {
      id: "ag-m2",
      title: "Creator Recruitment Banner Pack",
      type: "Social Banners",
      format: "PNG / PSD",
      size: "22.5 MB",
    },
    {
      id: "ag-m3",
      title: "20% Commission Model One-Pager",
      type: "PDF One-Pager",
      format: "PDF",
      size: "3.8 MB",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Agency Recruitment & Marketing Kit
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Download official presentation decks, recruitment one-pagers, and promotional banners.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand mb-2">
                <Presentation className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription className="text-xs">
                Format: {item.format} • Size: {item.size}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button variant="secondary" className="w-full" icon={<Download className="h-4 w-4" />}>
                Download Asset ({item.size})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
