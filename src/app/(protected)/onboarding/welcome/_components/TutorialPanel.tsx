"use client";

import type React from "react";

type TutorialPanelProps = {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
};

export function TutorialPanel({ icon: Icon, title, content }: TutorialPanelProps) {
  return (
    <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">
            Climodeの体験の流れを確認しましょう
          </p>
        </div>
      </div>
      {content}
    </div>
  );
}


