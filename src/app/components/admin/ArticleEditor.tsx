"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, Article } from '../../../lib/supabase';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'editor' | 'contributor';
}

interface ArticleEditorProps {
    userProfile: UserProfile;
}

function ArticleEditor({ userProfile }: ArticleEditorProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false); // Separate loading state for form submission
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [showForm, setShowForm] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'Campus Life',
        published: false,
        featured_image: ''
    });

    // Cleanup function to cancel ongoing requests
    const cleanup = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    const fetchArticles = useCallback(async () => {
        try {
            let query = supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            // If not admin, only show user's own articles
            if (userProfile.role !== 'admin') {
                query = query.eq('author_id', userProfile.id);
            }

            const { data, error } = await query;

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    }, [userProfile.id, userProfile.role]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]); const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent double submission
        if (submitting) {
            console.log('Submission already in progress, ignoring...');
            return;
        }

        setSubmitting(true);
        console.log('Starting article submission...');

        try {
            const articleData = {
                ...formData,
                author: userProfile.full_name || userProfile.email,
                author_id: userProfile.id,
                updated_at: new Date().toISOString()
            };

            console.log('Article data prepared:', { ...articleData, content: '[CONTENT_TRUNCATED]' });

            let result;
            if (editingArticle) {
                console.log('Updating existing article:', editingArticle.id);
                result = await supabase
                    .from('articles')
                    .update(articleData)
                    .eq('id', editingArticle.id);
            } else {
                console.log('Creating new article...');
                result = await supabase
                    .from('articles')
                    .insert([articleData]);
            }

            if (result.error) {
                console.error('Supabase error:', result.error);
                throw result.error;
            }

            console.log('Article saved successfully');

            // Reset form and refresh articles
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                category: 'Campus Life',
                published: false,
                featured_image: ''
            });
            setEditingArticle(null);
            setShowForm(false);

            console.log('Refreshing articles list...');
            await fetchArticles();

            // Show success message
            console.log('Showing success message');
            alert('Article saved successfully!');
        } catch (error) {
            console.error('Error saving article:', error);
            const errorMessage = error instanceof Error ? error.message : 'Please try again.';

            // Special handling for timeout errors
            if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
                alert('Upload timed out. Please try again and keep this tab active during upload.');
            } else {
                alert(`Error saving article: ${errorMessage}`);
            }
        } finally {
            console.log('Resetting submitting state');
            setSubmitting(false);
        }
    };

    const handleEdit = (article: Article) => {
        setFormData({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            category: article.category,
            published: article.published,
            featured_image: article.featured_image || ''
        });
        setEditingArticle(article);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Error deleting article. Please try again.');
        }
    };

    const categories = [
        'Campus Life',
        'Academic',
        'Events',
        'Student Stories',
        'Faculty',
        'Research',
        'Alumni',
        'Sports',
        'Culture',
        'Technology'
    ];

    return (
        <div className="space-y-8">
            {/* Article Form */}
            {showForm && (
                <div className="glass-card-modern rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">
                            {editingArticle ? 'Edit Article' : 'Create New Article'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingArticle(null);
                                setFormData({
                                    title: '',
                                    content: '',
                                    excerpt: '',
                                    category: 'Campus Life',
                                    published: false,
                                    featured_image: ''
                                });
                            }}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors"
                                    placeholder="Enter article title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-colors"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-gray-800">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                                placeholder="Brief description of the article"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Featured Image URL (optional)
                            </label>
                            <input
                                type="url"
                                value={formData.featured_image}
                                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                                Content
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={15}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                                placeholder="Write your article content here..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400 focus:ring-2"
                                />
                                <span className="text-white/80">Publish immediately</span>
                            </label>                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                )}
                                {submitting ? 'Saving... (Stay on this tab)' : editingArticle ? 'Update Article' : 'Create Article'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Articles List */}
            <div className="glass-card-modern rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Articles</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Article
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p className="text-white/60">Loading articles...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-white/60">No articles yet. Create your first article!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-white">{article.title}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.published
                                                ? 'bg-green-500/20 text-green-300'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {article.published ? 'Published' : 'Draft'}
                                            </span>
                                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                {article.category}
                                            </span>
                                        </div>
                                        <p className="text-white/70 mb-3">{article.excerpt}</p>
                                        <div className="text-white/50 text-sm">
                                            By {article.author} • {new Date(article.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        {(userProfile.role === 'admin' || article.author_id === userProfile.id) && (
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}
            </div>
        </div>
    );
}

export default ArticleEditor;
