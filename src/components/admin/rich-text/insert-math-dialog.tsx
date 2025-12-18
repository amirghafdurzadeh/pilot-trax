"use client";

import { useState, useEffect } from "react";
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

interface InsertMathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
  onApply: (value: string) => void;
}

export function InsertMathDialog({
  open,
  onOpenChange,
  initialValue,
  onApply,
}: InsertMathDialogProps) {
  const [dialogValue, setDialogValue] = useState(initialValue);

  useEffect(() => {
    setDialogValue(initialValue);
  }, [initialValue]);

  function handleDialogSubmit() {
    onApply(dialogValue);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>فرمول LaTeX</DialogTitle>
          <DialogDescription>فرمول LaTeX را وارد کنید</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Input
            value={dialogValue}
            onChange={(e) => setDialogValue(e.target.value)}
            placeholder={"x^2 + y^2 = z^2"}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">لغو</Button>
          </DialogClose>
          <Button onClick={handleDialogSubmit}>درج</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
