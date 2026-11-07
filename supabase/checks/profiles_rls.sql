-- Repeatable access check for public.profiles.
-- Run it in the Supabase SQL Editor once at least two accounts exist.
-- Everything runs inside a transaction that is rolled back: no data is changed.

begin;

do $$
begin
  if (select count(*) from public.profiles) < 2 then
    raise exception 'Create at least two accounts in the app before running this check.';
  end if;
end $$;

-- Act as the first registered user.
select set_config(
  'request.jwt.claims',
  json_build_object('sub', id, 'role', 'authenticated')::text,
  true
)
from public.profiles
order by created_at
limit 1;

set local role authenticated;

do $$
declare
  visible_count integer;
  updated_count integer;
begin
  select count(*) into visible_count from public.profiles;
  if visible_count <> 1 then
    raise exception 'FAILED: a signed-in user sees % profiles instead of 1.', visible_count;
  end if;

  update public.profiles set full_name = full_name where id <> auth.uid();
  get diagnostics updated_count = row_count;
  if updated_count <> 0 then
    raise exception 'FAILED: a signed-in user changed % other profiles.', updated_count;
  end if;

  begin
    update public.profiles set role = 'admin' where id = auth.uid();
    raise exception 'FAILED: a signed-in user changed their own role.';
  exception
    when insufficient_privilege then
      null;
  end;
end $$;

-- Act as a visitor who is not signed in.
reset role;
set local role anon;

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count from public.profiles;
  if visible_count <> 0 then
    raise exception 'FAILED: an anonymous visitor sees % profiles.', visible_count;
  end if;
end $$;

rollback;

select 'All profiles access checks passed' as result;
