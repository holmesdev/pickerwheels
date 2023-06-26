-------------- wheels ---------------
create table if not exists wheels (
    id serial primary key,
    show_option_labels boolean not null,
    last_position float not null,
    short_url varchar(5) not null,
    created_at timestamp with time zone not null default clock_timestamp(),
    updated_at timestamp with time zone not null default clock_timestamp()
);

create or replace trigger wheels_insert_trigger before insert on wheels for each row 
execute procedure create_audit_timestamps();

create or replace trigger wheels_update_trigger before update on wheels for each row 
execute procedure update_audit_timestamp(); 

create index if not exists ix_wheels_short_url on wheels (short_url) include (id, show_option_labels, last_position);

-------------- wheel_options ---------------
create table if not exists wheel_options (
    id serial primary key,
    wheel_id int not null,
    label varchar(50) not null,
    enabled boolean not null default true,
    created_at timestamp with time zone not null default clock_timestamp(),
    updated_at timestamp with time zone not null default clock_timestamp(),
    FOREIGN KEY (wheel_id) REFERENCES wheels (id)
);

create or replace trigger wheel_options_insert_trigger before insert on wheel_options for each row 
execute procedure create_audit_timestamps();

create or replace trigger wheel_options_update_trigger before update on wheel_options for each row 
execute procedure update_audit_timestamp();

create index if not exists ix_wheel_options_wheel_id on wheel_options (wheel_id) include (label, enabled);

-------------- wheel_colors ---------------
create table if not exists wheel_colors (
    id serial primary key,
    wheel_id int not null,
    hex_code char(7) not null,
    FOREIGN KEY (wheel_id) REFERENCES wheels (id)
);

create index if not exists ix_wheel_colors_wheel_id on wheel_colors (wheel_id) include (hex_code);