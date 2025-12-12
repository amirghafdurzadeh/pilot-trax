"use client";
import { EllipsisVerticalIcon } from "lucide-react";

import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { AppHeader } from "@/components/core/app-header";
import { AppContent } from "@/components/core/app-content";

let courses = new Array(20).fill({
  title: "Pilot",
  descriptsion:
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque dolor vel fugit nisi consequuntur quas modi soluta assumenda nam, quisquam laudantium asperiores. Quasi eveniet id vero nisi repellat error voluptatum?",
  questions: 1564,
});

export default function Page() {
  return (
    <>
      <AppHeader>
        <AppSearch />
      </AppHeader>
      <AppContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {courses.map((course, courseIndex) => (
              <Card key={courseIndex} className="relative">
                <Button
                  variant="ghost"
                  aria-label="Open menu"
                  size="icon-sm"
                  className="absolute top-1 end-1"
                >
                  <EllipsisVerticalIcon />
                </Button>
                <CardContent className="flex flex-col gap-2">
                  <CardTitle>{course.title}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <CardDescription>{course.descriptsion}</CardDescription>
                    <CardDescription className="text-card-foreground">
                      Questions: {course.questions}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppContent>
    </>
  );
}
