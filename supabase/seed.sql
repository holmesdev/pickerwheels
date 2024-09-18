DO $$
    declare wheel_id wheels.id%TYPE;
begin
    insert into wheels (show_option_labels, last_position, short_url) values (true, 1.2, 'tests') returning id into wheel_id;

    insert into wheel_options (wheel_id, label) values (wheel_id, 'January');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'February');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'March');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'April');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'May');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'June');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'July');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'August');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'September');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'October');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'November');
    insert into wheel_options (wheel_id, label) values (wheel_id, 'December');

    insert into wheel_colors (wheel_id, hex_code) values (wheel_id, '#264653');
    insert into wheel_colors (wheel_id, hex_code) values (wheel_id, '#2a9d8f');
    insert into wheel_colors (wheel_id, hex_code) values (wheel_id, '#e9c46a');
    insert into wheel_colors (wheel_id, hex_code) values (wheel_id, '#f4a261');
    insert into wheel_colors (wheel_id, hex_code) values (wheel_id, '#e76f51');
end $$
