'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFollow(targetUserId: string, isCurrentlyFollowing: boolean) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Giriş yapmanız gerekiyor.' };
    if (user.id === targetUserId) return { error: 'Kendinizi takip edemezsiniz.' };

    if (isCurrentlyFollowing) {
      // Unfollow
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      
      if (error) throw error;
    } else {
      // Follow
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });
        
      if (error) throw error;
    }

    revalidatePath(`/users/[username]`, 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Follow error:', error);
    return { error: error.message };
  }
}
