'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createList(title: string, description: string, isPublic: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

    // Foreign Key hatasını (Profil eksikliğini) kod üzerinden zorla çözelim:
    const { data: profileCheck } = await supabase.from('profiles').select('id').eq('id', user.id).single();
    if (!profileCheck) {
      await supabase.from('profiles').insert({
        id: user.id,
        username: user.email ? user.email.split('@')[0] : `user_${user.id.substring(0, 6)}`
      });
    }

    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: user.id,
        title,
        description,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/profile/lists');
    revalidatePath('/community');
    revalidatePath(`/users/[username]`, 'page');
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addMovieToList(listId: string, movieId: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

    const { error } = await supabase
      .from('list_movies')
      .insert({
        list_id: listId,
        tmdb_movie_id: movieId
      });

    if (error) throw error;
    
    revalidatePath(`/lists/${listId}`);
    revalidatePath('/profile/lists');
    revalidatePath('/community');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function removeMovieFromList(listId: string, movieId: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş yapmanız gerekiyor.' };

    const { error } = await supabase
      .from('list_movies')
      .delete()
      .eq('list_id', listId)
      .eq('tmdb_movie_id', movieId);

    if (error) throw error;
    
    revalidatePath(`/lists/${listId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
