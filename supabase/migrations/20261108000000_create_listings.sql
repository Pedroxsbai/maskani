create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,

  title text not null check (char_length(title) between 5 and 120),
  description text not null,
  property_type text not null
    check (property_type in ('apartment', 'house', 'studio')),

  city text not null,
  neighbourhood text not null,

  monthly_rent numeric(12,2) not null check (monthly_rent > 0),
  monthly_charges numeric(12,2) not null default 0 check (monthly_charges >= 0),
  deposit numeric(12,2) not null default 0 check (deposit >= 0),

  surface_area numeric(10,2) not null check (surface_area > 0),
  bedrooms integer not null default 1 check (bedrooms >= 0),
  bathrooms integer not null default 1 check (bathrooms >= 0),
  floor integer,

  is_furnished boolean not null default false,

  status text not null default 'draft'
    check (status in ('draft', 'published', 'rented')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Private address: never exposed through public listings queries.
create table public.listing_private_details (
  listing_id uuid primary key
    references public.listings(id) on delete cascade,
  exact_address text not null default ''
);

alter table public.listings enable row level security;
alter table public.listing_private_details enable row level security;

-- Public visitors see published listings.
-- Owners can also see all their own listings.
create policy "Listings are visible to public or owner"
  on public.listings for select
  to anon, authenticated
  using (
    status = 'published'
    or owner_id = (select auth.uid())
  );

-- Only active users with owner mode enabled can create listings.
create policy "Owners can create their listings"
  on public.listings for insert
  to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.status = 'active'
        and p.owner_mode_enabled = true
    )
  );

create policy "Owners can update their listings"
  on public.listings for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners can delete their listings"
  on public.listings for delete
  to authenticated
  using (owner_id = (select auth.uid()));

-- Private address policies: owner only.
create policy "Owners can read private listing details"
  on public.listing_private_details for select
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

create policy "Owners can insert private listing details"
  on public.listing_private_details for insert
  to authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

create policy "Owners can update private listing details"
  on public.listing_private_details for update
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

create policy "Owners can delete private listing details"
  on public.listing_private_details for delete
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete
  on public.listing_private_details to authenticated;

drop trigger if exists listings_set_updated_at on public.listings;

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- Storage bucket for property photos.
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do update set public = true;

create policy "Public can view listing photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'listing-photos');

create policy "Owners can upload listing photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2]
        and l.owner_id = (select auth.uid())
    )
  );

create policy "Owners can update listing photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2]
        and l.owner_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2]
        and l.owner_id = (select auth.uid())
    )
  );

create policy "Owners can delete listing photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2]
        and l.owner_id = (select auth.uid())
    )
  );


-- Listing photos metadata: one row per uploaded photo.
create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null
    references public.listings(id) on delete cascade,
  storage_path text not null unique,
  display_order integer not null default 0
    check (display_order between 0 and 7),
  created_at timestamptz not null default now(),

  unique (listing_id, display_order)
);

create index listing_photos_listing_id_idx
  on public.listing_photos(listing_id);

alter table public.listing_photos enable row level security;

-- Public can see photos of published listings.
-- Owners can see photos of all their own listings.
create policy "Listing photos are visible to public or owner"
  on public.listing_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (
          l.status = 'published'
          or l.owner_id = (select auth.uid())
        )
    )
  );

-- Only the listing owner can register uploaded photos.
create policy "Owners can insert listing photo records"
  on public.listing_photos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
    and storage_path like
      (select auth.uid())::text || '/' || listing_id::text || '/%'
  );

-- Only the listing owner can reorder photos.
create policy "Owners can update listing photo order"
  on public.listing_photos for update
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

-- Only the listing owner can remove photo records.
create policy "Owners can delete listing photo records"
  on public.listing_photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and l.owner_id = (select auth.uid())
    )
  );

grant select on public.listing_photos to anon, authenticated;
grant insert, delete on public.listing_photos to authenticated;
grant update (display_order) on public.listing_photos to authenticated;
