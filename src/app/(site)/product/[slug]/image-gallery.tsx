"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: string[]
  productName: string
  hasDiscount: boolean
  discountPct: number
}

export function ImageGallery({ images, productName, hasDiscount, discountPct }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImage =
    images[selectedIndex] || `/placeholder.svg?height=800&width=800&query=${encodeURIComponent(productName)}`

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-3 top-3 rounded-lg bg-[#FF4F81] px-3 py-1 text-sm font-bold text-white shadow-lg">
            {discountPct}% OFF
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Zoom image"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative aspect-square w-full">
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={`${productName} - Zoomed view`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === selectedIndex
                  ? "border-[#F7941D] ring-2 ring-[#F7941D]/20"
                  : "border-muted hover:border-[#F7941D]/50"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={url || "/placeholder.svg"}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {index === selectedIndex && <div className="absolute inset-0 bg-[#F7941D]/10" />}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Swipe Indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === selectedIndex ? "bg-[#F7941D]" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
