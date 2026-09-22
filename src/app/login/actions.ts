'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=InvalidCredentials')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?error=SignupFailed')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function demoLogin() {
  const supabase = await createClient()
  
  const email = 'demo_v3@recon.com'
  const password = 'recon-demo-password-2026'

  let { error } = await supabase.auth.signInWithPassword({ email, password })
  
  if (error) {
    const { error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      console.error("Supabase SignUp Error:", signUpError);
      redirect('/login?error=DemoLoginFailed')
    }
    await supabase.auth.signInWithPassword({ email, password })
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
