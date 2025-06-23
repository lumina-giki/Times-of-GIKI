"use client";

import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../../lib/supabase';
import Navigation from '../components/Navigation';
import ModernBackground from '../components/ModernBackground';
import Link from 'next/link';

// Memoized components for better performance
const MemoizedNavigation = memo(Navigation);
const MemoizedModernBackground = memo(ModernBackground);

// Simplified article type for listing (only fields we need)
interface ArticleListItem {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    created_at: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<ArticleListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const fetchArticles = useCallback(async () => {
        try {
            const query = supabase
                .from('articles')
                .select('id, title, excerpt, category, author, created_at') // Only select needed fields for better performance
                .eq('published', true)
                .order('created_at', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const categories = ['all', ...Array.from(new Set(articles.map(article => article.category)))];

    const filteredArticles = selectedCategory === 'all'
        ? articles
        : articles.filter(article => article.category === selectedCategory);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }; return (
        <div className="min-h-screen relative overflow-hidden">
            <MemoizedModernBackground />

            <div className="relative z-10">
                <MemoizedNavigation />

                <div className="pt-24 pb-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 gradient-text">
                                All Articles
                            </h1>
                            <p className="text-white/80 text-lg max-w-2xl mx-auto">
                                Explore stories, insights, and updates from the GIKI community
                            </p>
                        </div>

                        {/* Category Filter */}
                        {categories.length > 1 && (
                            <div className="glass-card-modern rounded-2xl p-6 mb-8">
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === category
                                                ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                                }`}
                                        >
                                            {category === 'all' ? 'All Categories' : category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {loading && (
                            <div className="glass-card-modern rounded-3xl p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white/80">Loading articles...</p>
                            </div>
                        )}

                        {/* No Articles */}
                        {!loading && filteredArticles.length === 0 && (
                            <div className="glass-card-modern rounded-3xl p-12 text-center">
                                <div className="text-6xl mb-6">📝</div>
                                <h3 className="text-2xl font-bold text-white mb-4">No Articles Found</h3>
                                <p className="text-white/60 mb-6">
                                    {selectedCategory === 'all'
                                        ? 'No articles have been published yet.'
                                        : `No articles found in "${selectedCategory}" category.`}
                                </p>
                                <Link
                                    href="/"
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    Back to Home
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {/* Articles Grid */}
                        {!loading && filteredArticles.length > 0 && (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredArticles.map((article, index) => (
                                    <article
                                        key={article.id}
                                        className="glass-card-modern rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 card-hover-safe animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Category Badge */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                                                {article.category}
                                            </span>
                                            <span className="text-white/40 text-sm">
                                                {formatDate(article.created_at)}
                                            </span>
                                        </div>

                                        {/* Article Content */}
                                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                                            {article.title}
                                        </h2>

                                        <p className="text-white/80 mb-4 leading-relaxed line-clamp-3">
                                            {article.excerpt}
                                        </p>

                                        {/* Author & Read More */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">
                                                        {article.author.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-white/60 text-sm">
                                                    {article.author}
                                                </span>
                                            </div>                                            <Link
                                                href={`/articles/${article.id}`}
                                                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-medium"
                                                prefetch={true}
                                            >
                                                Read Full Article
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Back to Home */}
                        <div className="text-center mt-12">
                            <Link
                                href="/"
                                className="btn-secondary inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
