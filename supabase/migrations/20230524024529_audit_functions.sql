
create or replace function create_audit_timestamps()
returns trigger
as
$$
begin
    NEW.created_at = clock_timestamp(); 
    NEW.updated_at = clock_timestamp();
    return NEW;
end;
$$ 
language 'plpgsql';

create or replace function update_audit_timestamp()
returns trigger
as
$$
begin
    NEW.updated_at = clock_timestamp();
    return NEW;
end;
$$ 
language 'plpgsql';

