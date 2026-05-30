"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
  dict: {
    page: string;
    of: string;
    per_page: string;
    previous?: string;
    next?: string;
  };
  className?: string;
}

export function AppPagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  dict,
  className,
}: AppPaginationProps) {
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onPageSizeChange(value);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-sm text-muted-foreground w-full xl:w-fit justify-center xl:justify-end bg-muted/30 p-1 px-3 rounded-lg border border-border", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-xs uppercase tracking-wider opacity-70">
            {dict.page}
          </span>
          <Input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-20 h-8 text-start p-0 ps-2 font-bold bg-background"
          />
          <span className="opacity-70">
            {dict.of} {totalPages}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 border-l border-border pl-4">
        <Label htmlFor="pageSize" className="whitespace-nowrap text-xs uppercase tracking-wider opacity-70">
          {dict.per_page}:
        </Label>
        <Input
          id="pageSize"
          type="number"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="w-20 h-8 text-start p-0 ps-2 font-bold bg-background"
        />
      </div>
    </div>
  );
}
