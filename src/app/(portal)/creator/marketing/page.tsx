"use client";

import { Download, Image as ImageIcon, Video, Layers, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { creatorService } from "@/features/creator/services/creator.service";
import { useAsyncData } from "@/lib/hooks/use-async-data";
import { creatorMarketingKitsMock } from "@/mocks/creator-full.mock";

export default function CreatorMarketingPage() {
  const { data: kits, isLoading } = useAsyncData(
    () => creatorService.getMarketingKits(),
    [],
    400
  );

  const dataList = kits || creatorMarketingKitsMock;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Creator Marketing & Branding Kit
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Download high-resolution Frenzone badges, OBS stream overlays, intro videos, and social graphics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dataList.map((kit) => (
          <Card key={kit.id} className="group overflow-hidden flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-surface-muted">
                <img
                  src={kit.previewUrl}
                  alt={kit.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  {kit.category}
                </span>
              </div>

              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-base">{kit.title}</CardTitle>
                <CardDescription className="text-xs">
                  Format: {kit.fileFormat} • Res: {kit.dimensions} • Size: {kit.fileSize}
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="pt-2">
              <Button variant="secondary" className="w-full" icon={<Download className="h-4 w-4" />}>
                Download Asset ({kit.fileSize})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
