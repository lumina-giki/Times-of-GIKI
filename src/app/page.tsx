"use client";

// Version: Updated June 23, 2025 - Environment Variables Fix
import Image from "next/image";
import { useRef, useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import { supabase, GalleryImage, getCombinedGalleryImages } from "../lib/supabase";
import Navigation from "./components/Navigation";
import ModernBackground from "./components/ModernBackground";
import BackgroundAudio from "./components/BackgroundAudio";

// Memoized components for better performance
const MemoizedNavigation = memo(Navigation);
const MemoizedModernBackground = memo(ModernBackground);
const MemoizedBackgroundAudio = memo(BackgroundAudio);

// Simplified article type for homepage
interface HomepageArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  created_at: string;
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [articles, setArticles] = useState<HomepageArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (heroRef.current) {
        const parallaxValue = currentScrollY * 0.5;
        const scale = 1 + currentScrollY * 0.0002;
        heroRef.current.style.transform = `translateY(${parallaxValue}px) scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);  // Fetch gallery images from both database and local storage
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const combinedImages = await getCombinedGalleryImages(6); // Show only 6 latest images on homepage
        setGalleryImages(combinedImages);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setGalleryImages([]);
      } finally {
        setLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, []);
  // Fetch recent articles from Supabase
  const fetchArticles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, category, author, created_at') // Only select needed fields
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3); // Show only 3 most recent articles on homepage

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Animated Background */}
      <MemoizedModernBackground />

      {/* Content */}
      <div className="relative z-10">
        <MemoizedNavigation />

        {/* Hero Section */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <div
            ref={heroRef}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="/media/first picture.jpg"
              alt="Times Of GIKI Hero"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
              className="brightness-50"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>          <div className="relative z-10 text-center px-6">
            <div
              className="glass-enhanced rounded-3xl p-8 md:p-12 max-w-4xl mx-auto animate-scale-in card-hover-safe"
              style={{
                transform: `translateY(${scrollY * -0.2}px)`,
                opacity: Math.max(0.3, 1 - scrollY * 0.002),
                animationDelay: '0.5s'
              }}
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="mx-4 w-3 h-3 rounded-full bg-white/20 border border-white/30"></div>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-white/40 to-transparent"></div>
              </div>

              <h1 className="text-hero text-white mb-6 gradient-text">
                Times Of GIKI
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed mb-6">
                A vibrant look at GIKI through images & stories
              </p>
              <div className="status-dot mx-auto"></div>

              <div className="mt-8 flex items-center justify-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Gallery</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-sm">Stories</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="text-sm">Poetry</span>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Poem Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card-modern rounded-3xl p-10 md:p-12 animate-slide-in-left card-hover-safe" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-blue-400"></div>
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h2 className="text-section-title text-white">
                    Poetry
                  </h2>
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-blue-400"></div>
                </div>
              </div>            <div className="relative">              <div className="absolute -top-4 -left-4 text-6xl text-blue-400/20 font-serif">&ldquo;</div>
                <div className="absolute -bottom-4 -right-4 text-6xl text-blue-400/20 font-serif rotate-180">&rdquo;</div>
                <div className="relative z-10 max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl text-white/90 italic leading-relaxed font-light">
                    In halls where knowledge finds its home,<br />
                    Where minds converge and spirits roam,<br />
                    GIKI stands tall with pride and grace,<br />
                    A beacon bright in learning&apos;s space.<br /><br />

                    Through corridors of wisdom deep,<br />
                    Where dreams and aspirations leap,<br />
                    Each student writes their story here,<br />
                    With hope and passion crystal clear.
                  </p>
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400/60"></div>
                    <div className="w-1 h-1 rounded-full bg-blue-400/40"></div>
                    <div className="w-1 h-1 rounded-full bg-blue-400/40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Gallery Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-blue-400"></div>
                <div className="mx-4 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/30">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-blue-400"></div>
              </div>
              <h2 className="text-section-title text-white animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                Gallery
              </h2>
              <p className="text-white/60 mt-4 text-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
                Capturing the essence and beauty of GIKI campus life
              </p>
            </div>            {/* Loading State */}
            {loadingGallery && (
              <div className="glass-card-modern rounded-3xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white/80">Loading gallery...</p>
              </div>
            )}

            {/* No Images */}
            {!loadingGallery && galleryImages.length === 0 && (
              <div className="glass-card-modern rounded-3xl p-12 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Images Found</h3>
                <p className="text-white/60 mb-6">The gallery is empty. Images will appear here once they are uploaded by administrators.</p>
              </div>
            )}

            {/* Gallery Grid */}
            {!loadingGallery && galleryImages.length > 0 && (
              <div className="grid-modern">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    className="group relative overflow-hidden rounded-xl aspect-video bg-white/10 hover:bg-white/20 transition-all duration-300 animate-scale-in shadow-modern hover:shadow-modern-lg"
                    onClick={() => setModalImg(img.image_url)}
                    style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || img.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        {img.credit && (
                          <p className="text-white text-sm font-medium">📸 {img.credit}</p>
                        )}
                      </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>                    {/* Image number indicator */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-black/40 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{idx + 1}</span>
                      </div>
                    </div>

                    {/* Source indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${img.source === 'local'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        : 'bg-green-500/20 text-green-300 border border-green-400/30'
                        }`}>
                        {img.source === 'local' ? '📁 Local' : '☁️ Uploaded'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}            {!loadingGallery && galleryImages.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href="/gallery"
                  className="btn-primary inline-flex items-center gap-2 focus-visible animate-fade-in"
                  style={{ animationDelay: '1.2s' }}
                >
                  Explore Gallery
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>        {/* Articles Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-green-400"></div>
                <div className="mx-4 px-4 py-2 bg-green-500/10 rounded-full border border-green-400/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-green-400"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white animate-fade-in">
                Latest Articles
              </h2>
              <p className="text-white/60 mt-4 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Stories and insights from the GIKI community
              </p>          </div>

            {/* Loading State */}
            {loadingArticles && (
              <div className="glass-card-modern rounded-3xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-white/80">Loading articles...</p>
              </div>
            )}

            {/* No Articles */}
            {!loadingArticles && articles.length === 0 && (
              <div className="glass-card-modern rounded-3xl p-12 text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Articles Yet</h3>
                <p className="text-white/60 mb-6">Articles will appear here once they are published by administrators.</p>
                <div className="inline-flex items-center gap-2 text-white/60 mt-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Articles are managed by authorized administrators</span>
                </div>
              </div>
            )}

            {/* Articles List */}
            {!loadingArticles && articles.length > 0 && (
              <div className="space-y-8">
                {articles.map((article, index) => (
                  <div key={article.id} className="block group animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.2}s` }}>
                    <article className="glass-card-modern rounded-3xl p-8 md:p-10 hover:bg-white/10 transition-all duration-300 card-hover-safe">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                          {article.category}
                        </span>
                        <div className="status-dot"></div>
                        <span className="text-white/40 text-sm">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-white/80 mb-6 leading-relaxed text-lg line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">                        <Link
                        href={`/articles/${article.id}`}
                        className="text-green-400 font-medium hover:text-green-300 transition-colors flex items-center gap-2"
                        prefetch={true}
                      >
                        Read Full Article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                        <span className="text-white/40 text-sm flex items-center gap-2">
                          By {article.author}
                        </span>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}

            {/* View All Articles Button */}
            {!loadingArticles && articles.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href="/articles"
                  className="btn-primary inline-flex items-center gap-2 micro-bounce focus-visible animate-fade-in"
                  style={{ animationDelay: '0.6s' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View All Articles
                </Link>
              </div>
            )}
          </div>
        </section>      {/* Enhanced Modal */}
        {modalImg && (
          <div
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setModalImg(null)}
          >
            <div className="relative w-full h-full max-w-7xl max-h-full animate-scale-in flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <div className="modal-content rounded-2xl overflow-hidden max-w-full max-h-full">
                <Image
                  src={modalImg}
                  alt="Expanded GIKI"
                  width={1400}
                  height={900}
                  className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                />
              </div>
              <button
                className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-white/20 transition-colors focus-visible micro-bounce"
                onClick={() => setModalImg(null)}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>)}
      </div>      {/* Background Audio */}
      <MemoizedBackgroundAudio autoPlay={false} volume={0.2} />
    </div>
  );
}
