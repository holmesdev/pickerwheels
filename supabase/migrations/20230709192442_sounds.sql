create table if not exists sound_categories (
    id serial primary key,
    label varchar(50) not null
);

create table if not exists sounds (
    id serial primary key,
    sound_category_id int not null,
    label varchar(50) not null,
    url varchar(255) not null,
    FOREIGN KEY (sound_category_id) REFERENCES sound_categories (id)
);

create index if not exists ix_sounds_sound_category_id on sounds (sound_category_id) include (id, url);

create table if not exists wheel_sounds (
    wheel_id int not null,
    sound_category_id int not null,
    sound_id int not null,
    FOREIGN KEY (wheel_id) REFERENCES wheels (id),
    FOREIGN KEY (sound_category_id) REFERENCES sound_categories (id),
    FOREIGN KEY (sound_id) REFERENCES sounds (id)
);

create unique index if not exists ix_wheel_sounds_wheel_id_sound_category_id on wheel_sounds (wheel_id, sound_category_id) include (sound_id);