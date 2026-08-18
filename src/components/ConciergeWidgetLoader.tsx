"use client";

import dynamic from "next/dynamic";

const ConciergeWidget = dynamic(
  () => import("@/components/ConciergeWidget"),
  { ssr: false },
);

export default function ConciergeWidgetLoader() {
  return <ConciergeWidget />;
}
