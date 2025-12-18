"use client";

import { useState, useEffect } from "react";
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
import FileInput from "@/components/ui/file-input";

interface InsertImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (value: string) => void;
}

export function InsertImageDialog({
  open,
  onOpenChange,
  onApply,
}: InsertImageDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    } finally {
      setIsUploading(false);
      handleCleanup();
      onOpenChange(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCleanup();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>درج تصویر</DialogTitle>
          <DialogDescription>یک فایل تصویر انتخاب کنید</DialogDescription>
        </DialogHeader>

        <div className="py-2">
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
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCleanup}>
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
