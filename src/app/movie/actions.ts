'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleMovieInteraction(movieId: number, type: 'watched' | 'favourite' | 'watchlist') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Oturum açmanız gerekiyor.' };
  }

  // Profil kontrolü
  const { data: profileCheck } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profileCheck) {
    await supabase.from('profiles').insert({
      id: user.id,
      username: user.email ? user.email.split('@')[0] : `user_${user.id.substring(0, 6)}`
    });
  }

  // Önce mevcut kaydı kontrol et
  const { data: existing } = await supabase
    .from('movie_interactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('tmdb_movie_id', movieId)
    .single();

  if (existing) {
    // Varsa güncelle
    const updates: any = {};
    if (type === 'watched') updates.is_watched = !existing.is_watched;
    if (type === 'favourite') updates.is_favourite = !existing.is_favourite;
    if (type === 'watchlist') updates.in_watchlist = !existing.in_watchlist;

    await supabase
      .from('movie_interactions')
      .update(updates)
      .eq('id', existing.id);
  } else {
    // Yoksa yeni oluştur
    const insertData: any = {
      user_id: user.id,
      tmdb_movie_id: movieId,
      is_watched: type === 'watched',
      is_favourite: type === 'favourite',
      in_watchlist: type === 'watchlist'
    };

    await supabase
      .from('movie_interactions')
      .insert(insertData);
  }

  revalidatePath(`/movie/${movieId}`);
  revalidatePath(`/users/[username]`, 'page');
  return { success: true };
}

export async function updateMovieRating(movieId: number, rating: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Oturum açmanız gerekiyor.' };

    const { data: existing } = await supabase
      .from('movie_interactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('tmdb_movie_id', movieId)
      .single();

    if (existing) {
      await supabase.from('movie_interactions').update({ rating }).eq('id', existing.id);
    } else {
      await supabase.from('movie_interactions').insert({
        user_id: user.id,
        tmdb_movie_id: movieId,
        rating
      });
    }

    revalidatePath(`/movie/${movieId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating rating:', error);
    return { success: false, error };
  }
}

export async function submitReview(movieId: number, content: string, hasSpoilers: boolean) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Foreign Key hatasını (Profil eksikliğini) zorla çözelim:
    const { data: profileCheck } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (!profileCheck) {
      await supabase.from('profiles').insert({
        id: user.id,
        username: user.email ? user.email.split('@')[0] : `user_${user.id.substring(0, 6)}`
      });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        tmdb_movie_id: movieId,
        content: content,
        has_spoilers: hasSpoilers
      })
      .select('*, profiles(username, id)')
      .single();

    if (error) throw error;

    revalidatePath(`/movie/${movieId}`);
    revalidatePath('/community');
    
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, error };
  }
}
