"use client";

import { FileUpIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { importQuestionsFromExcel } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/locales";

export function ExcelImportButton({
  lang,
  dict,
  onSuccess,
}: {
  lang: Locale;
  dict: any;
  onSuccess: () => void;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    try {
      const result = await importQuestionsFromExcel(lang, formData);
      if (result.success) {
        toast.success(dict.import_success_toast);
        onSuccess();
      } else {
        toast.error(dict.import_error_toast + (result.error || ""));
      }
    } catch (error) {
      console.error("Excel import error", error);
      toast.error(dict.import_error_toast);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={handleButtonClick}
        disabled={isImporting}
        className="w-full md:w-fit gap-2"
      >
        {isImporting ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          <FileUpIcon className="w-4 h-4" />
        )}
        {dict.import_excel_button}
      </Button>
    </>
  );
}
