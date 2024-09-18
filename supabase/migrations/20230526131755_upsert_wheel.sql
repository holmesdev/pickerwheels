create or replace function generate_wheel_short_url()
returns varchar(5)
language plpgsql
as $$
declare
  base62 varchar(62) := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  generated_url varchar(5) := '';
  found boolean := false;
begin
    while (select count(*) from wheels where short_url = generated_url) > 0 or generated_url = '' loop
        for i in 1..5 loop
            generated_url := generated_url || SUBSTRING(base62, cast(floor(random() * 62 + 1) as int), 1);
        end loop;
    end loop;
    return generated_url;
end;
$$;

create or replace function upsert_wheel(short_url varchar(5), last_position float, show_option_labels boolean, option_labels varchar(50)[], options_enabled boolean[], colors varchar(7)[])
returns varchar(5)
language plpgsql
as $$
declare
  id_wheel int;
  generated_url varchar;
begin
  if upsert_wheel.short_url is null then
    generated_url := generate_wheel_short_url();

    insert into wheels(last_position, show_option_labels, short_url)
    values (upsert_wheel.last_position, upsert_wheel.show_option_labels, generated_url)
    returning wheels.id into id_wheel;
  else
    generated_url := upsert_wheel.short_url;
    select id into id_wheel from wheels where wheels.short_url = generated_url;

    update wheels
    set last_position = upsert_wheel.last_position, show_option_labels = upsert_wheel.show_option_labels
    where wheels.id = id_wheel;

    delete from wheel_options
    where wheel_id = id_wheel;

    delete from wheel_colors
    where wheel_id = id_wheel;
  end if;

  for i in array_lower(option_labels, 1)..array_upper(option_labels, 1) loop
    insert into wheel_options (wheel_id, label, enabled)
    values (id_wheel, upsert_wheel.option_labels[i], upsert_wheel.options_enabled[i]);
  end loop;

  for i in array_lower(colors, 1)..array_upper(colors, 1) loop
    insert into wheel_colors (wheel_id, hex_code)
    values (id_wheel, upsert_wheel.colors[i]);
  end loop;

  return generated_url;
end;
$$;