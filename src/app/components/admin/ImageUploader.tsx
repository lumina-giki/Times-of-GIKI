"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, GalleryImage, getDatabaseImages } from '../../../lib/supabase';
import Image from 'next/image';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'editor' | 'contributor';
}

interface ImageUploaderProps {
    userProfile: UserProfile | null;
}

function ImageUploader({ userProfile }: ImageUploaderProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [showForm, setShowForm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Stable ref to avoid useEffect dependency issues
    const refreshImagesRef = useRef<(() => Promise<void>) | null>(null);
    const initializingRef = useRef(false);

    // Form state
    const [formData, setFormData] = useState({
        credit: '',
        image_url: ''
    });

    const fetchImages = useCallback(async () => {
        if (!userProfile) {
            console.log('⏭️ fetchImages: No userProfile, skipping...');
            return;
        }

        try {
            console.log('Fetching images for user:', userProfile.id);
            const databaseImages = await getDatabaseImages();
            console.log('All database images:', databaseImages);

            // If not admin, only show user's own images
            if (userProfile.role !== 'admin') {
                const userImages = databaseImages.filter(img => img.author_id === userProfile.id);
                console.log('User images:', userImages);
                setImages(userImages);
            } else {
                setImages(databaseImages);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    }, [userProfile?.id, userProfile?.role]);

    // Stable function that doesn't depend on fetchImages to avoid re-render loops
    const refreshImages = useCallback(async () => {
        if (!userProfile) {
            console.log('⏭️ refreshImages: No userProfile, skipping...');
            return;
        }

        try {
            const databaseImages = await getDatabaseImages();
            // If not admin, only show user's own images
            if (userProfile.role !== 'admin') {
                const userImages = databaseImages.filter(img => img.author_id === userProfile.id);
                setImages(userImages);
            } else {
                setImages(databaseImages);
            }
        } catch (error) {
            console.error('Error refreshing images:', error);
            throw error;
        }
    }, [userProfile?.id, userProfile?.role, getDatabaseImages]);

    // Update the ref whenever refreshImages changes
    useEffect(() => {
        refreshImagesRef.current = refreshImages;
    }, [refreshImages]);

    // Component mount/unmount logging with more details
    useEffect(() => {
        console.log('🟢 ImageUploader: COMPONENT MOUNTED', {
            userProfile: userProfile?.id,
            timestamp: new Date().toISOString()
        });
        return () => {
            console.log('🔴 ImageUploader: COMPONENT UNMOUNTED', {
                userProfile: userProfile?.id,
                timestamp: new Date().toISOString(),
                stackTrace: new Error().stack
            });
        };
    }, [userProfile?.id]);

    useEffect(() => {
        const initialize = async () => {
            if (!userProfile) {
                console.log('⏭️ ImageUploader: No userProfile, skipping initialization...');
                return;
            }

            if (initializingRef.current) {
                console.log('⏭️ ImageUploader: Already initializing, skipping...');
                return;
            }

            initializingRef.current = true;
            console.log('ImageUploader: Initializing...');

            try {
                await testDatabaseConnection();
                await testStorageBucket();
                await fetchImages();
            } finally {
                initializingRef.current = false;
            }
        };
        initialize();
    }, [fetchImages, userProfile]);

    // Add visibility change handler - simplified since component stays mounted
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden && refreshImagesRef.current) {
                console.log('🔄 Tab became visible, refreshing images...');
                try {
                    setRefreshing(true);
                    await refreshImagesRef.current();
                    console.log('✅ Images refreshed successfully');
                } catch (error) {
                    console.error('❌ Error refreshing images:', error);
                } finally {
                    setRefreshing(false);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []); // Empty dependency array - stable handler

    const handleManualRefresh = async () => {
        console.log('Manual refresh requested...');
        setRefreshing(true);
        try {
            // Simple approach: just try to refresh images
            await refreshImages();
            console.log('Manual refresh completed successfully');
        } catch (error) {
            console.error('Error during manual refresh:', error);
            alert(`Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}. Try the Force Refresh button if this persists.`);
        } finally {
            setRefreshing(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        console.log('Uploading file:', file.name, 'to path:', filePath);

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        console.log('Generated public URL:', data.publicUrl);
        return data.publicUrl;
    }; const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        console.log('File selected:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        setUploading(true);
        try {
            console.log('Starting upload process...');
            const imageUrl = await uploadImage(file);
            console.log('Upload completed, setting form data...');
            setFormData(prev => ({ ...prev, image_url: imageUrl }));
            setShowForm(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }; const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Debug: Check current user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('Current authenticated user:', user);
            console.log('UserProfile passed to component:', userProfile);

            if (authError) {
                console.error('Authentication error:', authError);
                throw new Error(`Authentication error: ${authError.message}`);
            }

            if (!user) {
                throw new Error('No authenticated user found');
            }

            const imageData = {
                title: editingImage ? editingImage.title : 'Untitled Image',
                description: editingImage ? editingImage.description : 'Image from GIKI',
                alt_text: editingImage ? editingImage.alt_text : 'GIKI Image',
                featured: editingImage ? editingImage.featured : false,
                image_url: formData.image_url,
                credit: formData.credit,
                uploaded_by: userProfile?.full_name || userProfile?.email || 'Unknown User',
                author_id: user.id // Use authenticated user's ID instead of userProfile.id
            };

            console.log('Image data to be saved:', imageData);

            if (editingImage) {
                // Update existing image
                const { data, error } = await supabase
                    .from('gallery_images')
                    .update(imageData)
                    .eq('id', editingImage.id)
                    .select();

                if (error) {
                    console.error('Update error details:', error);
                    throw new Error(`Update failed: ${error.message} (Code: ${error.code})`);
                }
                console.log('Image updated successfully:', data);
            } else {
                // Create new image record
                const { data, error } = await supabase
                    .from('gallery_images')
                    .insert([imageData])
                    .select();

                if (error) {
                    console.error('Insert error details:', error);
                    console.error('Error code:', error.code);
                    console.error('Error hint:', error.hint);
                    console.error('Error details:', error.details);
                    throw new Error(`Insert failed: ${error.message} (Code: ${error.code})`);
                }
                console.log('Image inserted successfully:', data);
            }

            // Reset form and refresh images
            setFormData({
                credit: '',
                image_url: ''
            });
            setEditingImage(null);
            setShowForm(false);

            // Force refresh images
            console.log('Refreshing images...');
            setRefreshing(true);
            await fetchImages();
            setRefreshing(false);

            // Show success message
            alert('Image saved successfully!');
        } catch (error) {
            console.error('Error saving image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`Error saving image: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }; const handleEdit = (image: GalleryImage) => {
        setFormData({
            credit: image.credit || '',
            image_url: image.image_url
        });
        setEditingImage(image);
        setShowForm(true);
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setRefreshing(true);
        try {
            // Delete from database
            const { error: dbError } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // Try to delete from storage (if it's a Supabase URL)
            if (imageUrl.includes('supabase')) {
                const filePath = imageUrl.split('/').pop();
                if (filePath) {
                    await supabase.storage
                        .from('images')
                        .remove([`gallery/${filePath}`]);
                }
            }

            await fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Error deleting image. Please try again.');
        } finally {
            setRefreshing(false);
        }
    };

    // Test storage bucket connectivity
    const testStorageBucket = async () => {
        try {
            console.log('Testing storage bucket connectivity...');
            const { data, error } = await supabase.storage
                .from('images')
                .list('', { limit: 1 });

            if (error) {
                console.error('Storage bucket error:', error);
                return false;
            }

            console.log('Storage bucket is accessible:', data);
            return true;
        } catch (error) {
            console.error('Storage bucket test failed:', error);
            return false;
        }
    };

    // Debug function to test database connectivity
    const testDatabaseConnection = async () => {
        try {
            console.log('Testing database connection...');

            // Test 1: Check if user is authenticated
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('Current user:', user);
            console.log('Auth error:', authError);

            // Test 2: Try to read from gallery_images table
            const { data: testRead, error: readError } = await supabase
                .from('gallery_images')
                .select('*')
                .limit(1);
            console.log('Test read result:', testRead);
            console.log('Read error:', readError);

            return { user, authError, readError };
        } catch (error) {
            console.error('Database connection test failed:', error);
            return { error };
        }
    };

    return (
        <>
            {!userProfile ? (
                <div className="glass-card-modern rounded-3xl p-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p className="text-white/60">Loading user profile...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Image Form */}
                    {showForm && (
                        <div className="glass-card-modern rounded-3xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingImage ? 'Edit Image' : 'Add Image Details'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingImage(null); setFormData({
                                            credit: '',
                                            image_url: ''
                                        });
                                    }}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {formData.image_url && (
                                <div className="mb-6">
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                        <Image
                                            src={formData.image_url}
                                            alt="Preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}                    <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Photo Credit
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.credit}
                                        onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-blue-400 focus:outline-none transition-colors"
                                        placeholder="e.g., Photo by John Doe, Camera Club GIKI"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingImage(null);
                                            setFormData({
                                                credit: '',
                                                image_url: ''
                                            });
                                        }}
                                        className="flex-1 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : editingImage ? 'Update Image' : 'Add Image'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Upload Section */}
                    <div className="glass-card-modern rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-white">Gallery Images</h2>
                                {refreshing && (
                                    <div className="flex items-center text-blue-400 text-sm">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                                        Refreshing...
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={refreshing || loading}
                                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Refresh images"
                                >
                                    <svg
                                        className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Upload Image
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-white/60">Loading images...</p>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🖼️</div>
                                <p className="text-white/60">No images yet. Upload your first image!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {images.map((image) => (
                                    <div key={image.id} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors">
                                        <div className="relative h-48">
                                            <Image
                                                src={image.image_url}
                                                alt={image.alt_text}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            {image.featured && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-yellow-500/80 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(image)}
                                                    className="p-2 bg-blue-500/80 text-white rounded-full hover:bg-blue-600/80 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {(userProfile.role === 'admin' || image.author_id === userProfile.id) && (
                                                    <button
                                                        onClick={() => handleDelete(image.id, image.image_url)}
                                                        className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600/80 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold mb-2">{image.title}</h3>
                                            <p className="text-white/70 text-sm mb-3">{image.description}</p>
                                            <div className="text-white/50 text-xs">
                                                By {image.uploaded_by} • {new Date(image.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}                    </div>
                        )}
                    </div>            {/* Debug Section - Remove after testing */}
                    <div className="glass-card-modern rounded-3xl p-6 mb-6 border border-yellow-500/30">
                        <h3 className="text-yellow-300 text-lg font-semibold mb-4">🛠️ Debug Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                onClick={async () => {
                                    try {
                                        // First check session
                                        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                                        console.log('Debug - Session check:', { session: !!session, error: sessionError });

                                        // Then check user
                                        const { data: { user }, error: userError } = await supabase.auth.getUser();
                                        console.log('Debug - User check:', { user: !!user, error: userError });

                                        alert(`Session: ${session ? 'Active' : 'None'}\nSession Error: ${sessionError?.message || 'None'}\nUser: ${user?.email || 'Not logged in'}\nUser Error: ${userError?.message || 'None'}`);
                                    } catch (err) {
                                        alert(`Auth check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-colors text-sm"
                            >
                                Check Auth Status
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        console.log('Checking current session...');
                                        // Use getSession() instead of refreshSession() to avoid triggering auth state changes
                                        const { data: { session }, error } = await supabase.auth.getSession();
                                        console.log('Current session check:', { session: !!session, error });

                                        if (error) {
                                            alert(`Session check failed: ${error.message}`);
                                        } else if (session) {
                                            alert(`Session is active! User: ${session.user?.email || 'Unknown'}\nExpires: ${new Date(session.expires_at! * 1000).toLocaleString()}`);
                                        } else {
                                            alert('No active session found. Please log in again.');
                                        }
                                    } catch (err) {
                                        alert(`Session check error: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                    }
                                }}
                                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded border border-purple-400/30 hover:bg-purple-500/30 transition-colors text-sm"
                            >
                                Check Session
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        console.log('Force refresh - reinitializing everything...');
                                        setRefreshing(true);

                                        // Step 1: Check session without refreshing
                                        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                                        if (sessionError || !session) {
                                            throw new Error('No valid session found');
                                        }

                                        // Step 2: Re-run all connection tests
                                        await testDatabaseConnection();
                                        await testStorageBucket();

                                        // Step 3: Fetch images
                                        await fetchImages();

                                        alert('Force refresh completed successfully!');
                                    } catch (err) {
                                        console.error('Force refresh failed:', err);
                                        alert(`Force refresh failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                    } finally {
                                        setRefreshing(false);
                                    }
                                }}
                                className="px-4 py-2 bg-red-500/20 text-red-300 rounded border border-red-400/30 hover:bg-red-500/30 transition-colors text-sm"
                            >
                                Force Refresh
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        // Test storage upload with a small test file
                                        const testBlob = new Blob(['test'], { type: 'text/plain' });
                                        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });

                                        const testPath = `test/test-${Date.now()}.txt`;
                                        const { error } = await supabase.storage
                                            .from('images')
                                            .upload(testPath, testFile);

                                        if (error) {
                                            alert(`Storage Upload Error: ${error.message}`);
                                        } else {
                                            // Clean up test file
                                            await supabase.storage.from('images').remove([testPath]);
                                            alert('Storage upload works perfectly!');
                                        }
                                    } catch (err) {
                                        alert(`Storage test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                    }
                                }}
                                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded border border-purple-400/30 hover:bg-purple-500/30 transition-colors text-sm"
                            >
                                Test Storage Upload
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        // Test direct database insert without file upload
                                        const testImageData = {
                                            title: 'Test Image',
                                            description: 'Test image for debugging',
                                            alt_text: 'Test',
                                            featured: false,
                                            image_url: 'https://via.placeholder.com/300x200.jpg?text=Test+Image',
                                            credit: 'Debug Test',
                                            uploaded_by: userProfile?.full_name || userProfile?.email || 'Unknown User',
                                            author_id: userProfile?.id || 'unknown-id'
                                        };

                                        const { error } = await supabase
                                            .from('gallery_images')
                                            .insert([testImageData])
                                            .select();

                                        if (error) {
                                            alert(`Database Insert Error: ${error.message}\nCode: ${error.code}`);
                                        } else {
                                            alert('Database insert works! The issue is with file upload.');
                                            await fetchImages(); // Refresh to show the test image
                                        }
                                    } catch (err) {
                                        alert(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                    }
                                }}
                                className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded border border-orange-400/30 hover:bg-orange-500/30 transition-colors text-sm"
                            >
                                Test DB Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ImageUploader;
