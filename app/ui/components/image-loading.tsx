"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { skeletonShimmerClass } from "@/app/ui/skeleton";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad"> {
  skeletonClassName?: string;
  imageContainerClassName?: string;
}

/**
 * Componente Image con skeleton loading mientras se carga la imagen
 *
 * Características:
 * - Muestra skeleton placeholder mientras carga
 * - Transición suave al cargar la imagen
 * - Alt text para accesibilidad
 * - Clases personalizables para skeleton
 */
export default function ImageLoading({
  skeletonClassName = "",
  imageContainerClassName = "",
  width,
  height,
  fill,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const isFill = fill === true;
  const containerClass = isFill ? "w-full h-full" : "inline-block";

  return (
    <div className={`relative ${containerClass} ${imageContainerClassName}`}>
      {/* Skeleton - Visible mientras carga */}
      {!isLoaded && (
        <div
          className={`
            absolute inset-0
            ${skeletonShimmerClass}
            bg-slate-200
            ${skeletonClassName}
          `}
          aria-hidden="true"
        />
      )}

      {/* Imagen - Se muestra cuando termina de cargar */}
      <Image
        {...props}
        {...(isFill ? { fill: true } : { width, height })}
        onLoad={() => setIsLoaded(true)}
        className={`
          transition-opacity duration-300
          ${isLoaded ? "opacity-100" : "opacity-0"}
          ${props.className ?? ""}
        `}
      />
    </div>
  );
}
