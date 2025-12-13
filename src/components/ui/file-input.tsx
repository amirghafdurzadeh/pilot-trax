"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function FileInput({
  id,
  accept,
  onFileChange,
  className,
  buttonLabel = "Choose file",
}: {
  id?: string;
  accept?: string;
  onFileChange: (file: File | null) => void;
  className?: string;
  buttonLabel?: string;
}) {
  const inputId = id ?? `file-input-${Math.random().toString(36).slice(2, 8)}`;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    onFileChange(f ?? null);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={inputId} className="m-0">
        <Button asChild size="sm">
          <span>{buttonLabel}</span>
        </Button>
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}

export default FileInput;
