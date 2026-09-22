-- 1. Profiller Tablosu (auth.users referanslı)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. Kullanıcı Film Etkileşimleri (Watched, Favourite, Watchlist, Rating)
create table public.movie_interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tmdb_movie_id integer not null,
  is_watched boolean default false,
  is_favourite boolean default false,
  in_watchlist boolean default false,
  rating numeric(3,1) check (rating >= 0 and rating <= 10),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, tmdb_movie_id)
);

-- RLS for movie_interactions
alter table public.movie_interactions enable row level security;
create policy "Interactions are viewable by everyone." on public.movie_interactions for select using (true);
create policy "Users can manage their own interactions." on public.movie_interactions for all using (auth.uid() = user_id);

-- 3. Film İncelemeleri (Reviews & Sosyal Tartışma)
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tmdb_movie_id integer not null,
  content text not null,
  has_spoilers boolean default false,
  likes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for reviews
alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone." on public.reviews for select using (true);
create policy "Users can insert their own reviews." on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews." on public.reviews for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews." on public.reviews for delete using (auth.uid() = user_id);

-- 4. Kullan�c� Takip Sistemi (Follows)
create table public.follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

alter table public.follows enable row level security;
create policy "Follows are viewable by everyone." on public.follows for select using (true);
create policy "Users can follow others." on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow." on public.follows for delete using (auth.uid() = follower_id);

