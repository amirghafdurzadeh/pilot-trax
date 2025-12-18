"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FileInput from "@/components/ui/file-input";

export type DialogMode = "image" | "math-inline" | "math-block";

interface InsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DialogMode | null;
  initialValue: string;
  onApply: (value: string) => void;
}

export function InsertDialog({
  open,
  onOpenChange,
  mode,
  initialValue,
  onApply,
}: InsertDialogProps) {
  const [dialogValue, setDialogValue] = useState(initialValue);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setDialogValue(initialValue);
  }, [initialValue]);

  // revoke object URL when preview changes/cleanup
  useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [previewUrl]);

  const handleCleanup = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  async function handleDialogSubmit() {
    try {
      if (mode === "image") {
        if (!selectedFile) {
          toast.error("لطفا یک فایل تصویر انتخاب کنید");
          return;
        }

        setIsUploading(true);
        const form = new FormData();
        form.append("file", selectedFile);
        const res = await fetch("/api/uploads", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          onApply(data.url);
        } else {
          toast.error("خطا در آپلود تصویر");
          return;
        }
      } else {
        onApply(dialogValue);
      }
    } finally {
      setIsUploading(false);
      handleCleanup();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "image" ? "درج تصویر" : "فرمول LaTeX"}
          </DialogTitle>
          <DialogDescription>
            {mode === "image"
              ? "آدرس تصویر را وارد کنید"
              : "فرمول LaTeX را وارد کنید"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {mode === "image" ? (
            <div className="space-y-2">
              <div>
                <FileInput
                  accept="image/*"
                  onFileChange={(f) => {
                    setSelectedFile(f ?? null);
                    if (f) setPreviewUrl(URL.createObjectURL(f));
                    else setPreviewUrl(null);
                  }}
                  buttonLabel="انتخاب فایل"
                />
              </div>

              {previewUrl && (
                <div className="pt-2">
                  <img src={previewUrl} alt="preview" className="max-w-full h-auto rounded" />
                </div>
              )}
            </div>
          ) : (
            <Input
              value={dialogValue}
              onChange={(e) => setDialogValue(e.target.value)}
              placeholder={"x^2 + y^2 = z^2"}
            />
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={handleCleanup}
            >
              لغو
            </Button>
          </DialogClose>
          <Button disabled={isUploading} onClick={handleDialogSubmit}>
            {isUploading ? "در حال آپلود..." : "درج"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
