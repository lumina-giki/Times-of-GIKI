"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Article } from '../../../lib/supabase';
import Navigation from '../../components/Navigation';
import ModernBackground from '../../components/ModernBackground';
import Link from 'next/link';
import Image from 'next/image';

// Memoized components for better performance
const MemoizedNavigation = memo(Navigation);
const MemoizedModernBackground = memo(ModernBackground);

// Type for related articles (only the fields we need)
interface RelatedArticle {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    created_at: string;
}

export default function ArticlePage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const fetchArticle = useCallback(async (articleId: string) => {
        try {
            // Optimized: Fetch article first for faster initial render
            const { data: articleData, error: articleError } = await supabase
                .from('articles')
                .select('*')
                .eq('id', articleId)
                .eq('published', true)
                .single();

            if (articleError) {
                console.error('Error fetching article:', articleError);
                router.push('/articles');
                return;
            }

            setArticle(articleData);
            setLoading(false); // Set loading false immediately after main article loads

            // Fetch related articles in background
            setRelatedLoading(true);
            const { data: relatedData, error: relatedError } = await supabase
                .from('articles')
                .select('id, title, excerpt, category, author, created_at') // Only select needed fields
                .eq('published', true)
                .eq('category', articleData.category)
                .neq('id', articleId)
                .order('created_at', { ascending: false })
                .limit(3);

            if (relatedError) {
                console.error('Error fetching related articles:', relatedError);
            } else {
                setRelatedArticles(relatedData || []);
            }
        } catch (error) {
            console.error('Error:', error);
            router.push('/articles');
        } finally {
            setRelatedLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (params.id) {
            fetchArticle(params.id as string);
        }
    }, [params.id, fetchArticle]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        // Split content into paragraphs and format them
        return content.split('\n').map((paragraph, index) => {
            if (paragraph.trim() === '') return null;
            return (
                <p key={index} className="text-white/90 leading-relaxed mb-6">
                    {paragraph}
                </p>
            );
        }).filter(Boolean);
    }; if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <MemoizedModernBackground />
                <div className="relative z-10">
                    <MemoizedNavigation />
                    <div className="pt-24 pb-12 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="glass-card-modern rounded-3xl p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white/80">Loading article...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <MemoizedModernBackground />
                <div className="relative z-10">
                    <MemoizedNavigation />
                    <div className="pt-24 pb-12 px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="glass-card-modern rounded-3xl p-12 text-center">
                                <div className="text-6xl mb-6">📄</div>
                                <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>                                <p className="text-white/60 mb-8">
                                    The article you&apos;re looking for doesn&apos;t exist or has been removed.
                                </p>
                                <Link
                                    href="/articles"
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Articles
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <MemoizedModernBackground />

            <div className="relative z-10">
                <MemoizedNavigation />

                <div className="pt-24 pb-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-8">
                            <Link
                                href="/articles"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Articles
                            </Link>
                        </div>

                        {/* Article Content */}
                        <article className="glass-card-modern rounded-3xl p-8 md:p-12">
                            {/* Article Header */}
                            <header className="mb-8">
                                {/* Category and Date */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full font-medium uppercase tracking-wide">
                                        {article.category}
                                    </span>
                                    <span className="text-white/50 text-sm">
                                        {formatDate(article.created_at)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                    {article.title}
                                </h1>

                                {/* Excerpt */}
                                {article.excerpt && (
                                    <p className="text-xl text-white/80 leading-relaxed mb-8 font-light">
                                        {article.excerpt}
                                    </p>
                                )}

                                {/* Author Info */}
                                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">
                                            {article.author.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{article.author}</p>
                                        <p className="text-white/60 text-sm">
                                            Published on {formatDate(article.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </header>                            {/* Featured Image */}
                            {article.featured_image && (
                                <div className="mb-8 relative h-64 md:h-80">
                                    <Image
                                        src={article.featured_image}
                                        alt={article.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className="rounded-2xl"
                                    />
                                </div>
                            )}

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                {formatContent(article.content)}
                            </div>

                            {/* Article Footer */}
                            <footer className="mt-12 pt-8 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="text-white/60 text-sm">
                                        Last updated: {formatDate(article.updated_at)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/60 text-sm">Share:</span>
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: article.title,
                                                        text: article.excerpt,
                                                        url: window.location.href,
                                                    });
                                                } else {
                                                    navigator.clipboard.writeText(window.location.href);
                                                    alert('Link copied to clipboard!');
                                                }
                                            }}
                                            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                                        >
                                            📤 Share
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </article>                        {/* Related Articles */}
                        {(relatedArticles.length > 0 || relatedLoading) && (
                            <section className="mt-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                                    Related Articles
                                </h2>
                                {relatedLoading ? (
                                    <div className="glass-card-modern rounded-2xl p-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                        <p className="text-white/60">Loading related articles...</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {relatedArticles.map((relatedArticle, index) => (
                                            <Link
                                                key={relatedArticle.id}
                                                href={`/articles/${relatedArticle.id}`}
                                                className="glass-card-modern rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 card-hover-safe animate-fade-in block"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                                prefetch={true}
                                            >
                                                <div className="mb-3">
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                                                        {relatedArticle.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                                    {relatedArticle.title}
                                                </h3>
                                                <p className="text-white/70 text-sm line-clamp-2 mb-3">
                                                    {relatedArticle.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-white/50">
                                                    <span>{relatedArticle.author}</span>                                                <span>{formatDate(relatedArticle.created_at)}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Navigation */}
                        <div className="text-center mt-12">
                            <Link
                                href="/articles"
                                className="btn-secondary inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                View All Articles
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
