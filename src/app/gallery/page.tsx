"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { GalleryImage, getCombinedGalleryImages } from "../../lib/supabase";
import Navigation from "../components/Navigation";
import ModernBackground from "../components/ModernBackground";

export default function Gallery() {
    const [modalImg, setModalImg] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(true);

    useEffect(() => {
        fetchGalleryImages();
    }, []); const fetchGalleryImages = async () => {
        try {
            const combinedImages = await getCombinedGalleryImages(); // Get all images (no limit)
            setGalleryImages(combinedImages);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            setGalleryImages([]);
        } finally {
            setLoadingGallery(false);
        }
    };

    const handleImageLoad = (src: string) => {
        setImageLoading(prev => ({ ...prev, [src]: false }));
    };

    const handleImageLoadStart = (src: string) => {
        setImageLoading(prev => ({ ...prev, [src]: true }));
    }; return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Modern Animated Background */}
            <ModernBackground />

            {/* Content */}
            <div className="relative z-10">
                <Navigation />

                {/* Hero Header */}
                <section className="pt-24 pb-12 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="glass-enhanced rounded-3xl p-8 md:p-12 animate-scale-in">
                            <h1 className="text-hero text-white mb-4">
                                GIKI Gallery
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
                                Explore the beauty and essence of GIKI through our curated collection of images
                            </p>
                        </div>
                    </div>
                </section>

                {/* Breadcrumb */}
                <div className="px-6 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-white/60 hover:text-white transition-colors focus-visible">
                                Home
                            </Link>
                            <span className="text-white/40">/</span>
                            <span className="text-white font-medium">Gallery</span>
                        </nav>
                    </div>
                </div>                {/* Gallery Grid */}
                <section className="pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Loading State */}
                        {loadingGallery ? (
                            <div className="glass-card-modern rounded-3xl p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white/80">Loading gallery...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {galleryImages.map((img, idx) => (
                                    <div key={img.id}
                                        className="group relative overflow-hidden rounded-xl aspect-square bg-white/5 hover:bg-white/10 transition-all duration-300 animate-fade-in-up shadow-modern cursor-pointer"
                                        onClick={() => setModalImg(img.image_url)}
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >                                    {/* Loading skeleton */}
                                        {imageLoading[img.image_url] && (
                                            <div className="absolute inset-0 skeleton rounded-xl" />
                                        )}

                                        <Image
                                            src={img.image_url}
                                            alt={img.alt_text || img.title}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="group-hover:scale-110 transition-transform duration-500"
                                            onLoadStart={() => handleImageLoadStart(img.image_url)}
                                            onLoad={() => handleImageLoad(img.image_url)}
                                        />

                                        {/* Overlay with info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            {img.credit && (
                                                <>
                                                    <div className="text-xs text-blue-300 font-medium mb-1 uppercase tracking-wide">
                                                        📸 Credit
                                                    </div>
                                                    <p className="text-white text-sm font-medium leading-tight">
                                                        {img.credit}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        </div>

                                        {/* Image number */}
                                        <div className="absolute top-4 left-4">
                                            <div className="bg-black/40 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">{idx + 1}</span>
                                            </div>
                                        </div>

                                        {/* Source indicator */}
                                        <div className="absolute top-4 left-14">
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${img.source === 'local'
                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                                : 'bg-green-500/20 text-green-300 border border-green-400/30'
                                                }`}>
                                                {img.source === 'local' ? '📁' : '☁️'}
                                            </div>
                                        </div>

                                        {/* Hover indicator */}
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>))}
                            </div>
                        )}

                        {/* Stats and Legend */}
                        <div className="mt-16 text-center space-y-6">
                            <div className="glass-card-modern rounded-2xl p-6 inline-block">
                                <p className="text-white/80">
                                    <span className="text-2xl font-bold text-white">{galleryImages.length}</span> images showcasing GIKI&apos;s beauty
                                </p>
                            </div>

                            {/* Image Source Legend */}
                            <div className="glass-card-modern rounded-2xl p-4 inline-block">
                                <div className="flex items-center gap-6 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                            📁
                                        </div>
                                        <span>Official Images</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                                            ☁️
                                        </div>
                                        <span>Community Uploads</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>                {/* Enhanced Modal */}
                {modalImg && (
                    <div
                        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setModalImg(null)}
                    >
                        <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                            <div className="relative max-w-full max-h-full">
                                <Image
                                    src={modalImg}
                                    alt="Expanded GIKI"
                                    width={1400}
                                    height={900}
                                    className="rounded-2xl w-auto h-auto max-w-full max-h-[90vh] object-contain shadow-modern-lg"
                                />

                                {/* Image info overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-6">
                                    <div className="text-white">                                        {galleryImages.find(img => img.image_url === modalImg) && (
                                        <>
                                            {galleryImages.find(img => img.image_url === modalImg)?.credit && (
                                                <>
                                                    <div className="text-sm text-blue-300 font-medium mb-2 uppercase tracking-wide">
                                                        📸 Photo Credit
                                                    </div>
                                                    <h3 className="text-xl font-semibold">
                                                        {galleryImages.find(img => img.image_url === modalImg)?.credit}
                                                    </h3>
                                                </>
                                            )}
                                        </>
                                    )}
                                    </div>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white/20 transition-colors focus-visible"
                                onClick={() => setModalImg(null)}
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
