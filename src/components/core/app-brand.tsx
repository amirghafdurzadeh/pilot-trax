"use client";
import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

type Props = Readonly<{
  title: string;
  description?: string;
  className?: string;
  imageProps: ImageProps;
  titleProps: React.HTMLAttributes<HTMLHeadingElement>;
}>;

export function AppBrand(props: Props) {
  return (
    <Link href="/" className={cn("flex items-center gap-4", props.className)}>
      <Image
        alt={props.imageProps.alt}
        src={props.imageProps.src}
        width={props.imageProps.width}
        height={props.imageProps.height}
        className={cn(
          "drop-shadow-xl drop-shadow-blue-600/30",
          props.imageProps.className
        )}
      />
      <div>
        <h1 {...props.titleProps}>{props.title}</h1>
        {props.description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {props.description}
          </p>
        )}
      </div>
    </Link>
  );
}
