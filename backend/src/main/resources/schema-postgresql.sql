create table if not exists accounts
(
    id      integer primary key generated by default as identity,
    name    text    not null,
    email   text,
    phone   text,
    card    text unique check ( card != ''),
    balance bigint  not null check ( balance >= 0 ),
    active  boolean not null
);
select setval('accounts_id_seq', greatest(100000, coalesce((select max(id) from accounts), 0) + 1));
create index if not exists accounts_name_index on accounts (name);

create table if not exists events
(
    id           integer primary key generated by default as identity,
    event        text   not null,
    timestamp    bigint not null,
    message      text   not null,
    performed_by text   not null
);
select setval('events_id_seq', greatest(100000, coalesce((select max(id) from events), 0) + 1));
create index if not exists events_timestamp_index on events (timestamp desc);

create table if not exists principals
(
    id                  integer primary key generated by default as identity,
    name                text    not null unique,
    secret              text    not null,
    role                text    not null check ( role in ('ADMIN', 'TERMINAL') ),
    active              boolean not null,
    can_upload          boolean not null,
    can_transfer        boolean not null,
    can_sell_items      boolean not null,
    can_redeem_vouchers boolean not null,
    can_assign_cards    boolean not null,
    created_at          bigint  not null,
    last_used           bigint  not null
);
select setval('principals_id_seq', greatest(100000, coalesce((select max(id) from principals), 0) + 1));
create index if not exists principals_name_index on principals (name);

create table if not exists items
(
    id      integer primary key generated by default as identity,
    name    text    not null,
    alias   text,
    cost    bigint  not null check ( cost >= 0 ),
    stock   integer not null check ( stock >= 0 ),
    enabled Boolean not null
);
select setval('items_id_seq', greatest(100000, coalesce((select max(id) from items), 0) + 1));
create index if not exists items_name_index on items (name);

create table if not exists vouchers
(
    id         integer primary key generated by default as identity,
    account_id integer references accounts (id) on delete set null,
    item_id    integer not null references items (id) on delete cascade,
    count      integer not null check ( count >= 0 ),
    unique (account_id, item_id)
);
select setval('vouchers_id_seq', greatest(100000, coalesce((select max(id) from vouchers), 0) + 1));

create table if not exists orders
(
    id         integer primary key generated by default as identity,
    account_id integer not null references accounts (id) on delete cascade,
    timestamp  bigint  not null
);
select setval('orders_id_seq', greatest(100000, coalesce((select max(id) from orders), 0) + 1));

create table if not exists order_lines
(
    id           integer primary key generated by default as identity,
    order_id     integer references orders (id) on delete set null,
    item_id      integer references items (id) on delete set null,
    item_count   integer not null check ( item_count > 0 ),
    message      text,
    used_voucher boolean not null,
    paid_amount  bigint  not null check ( paid_amount >= 0 )
);
select setval('order_lines_id_seq', greatest(100000, coalesce((select max(id) from order_lines), 0) + 1));

create table if not exists transactions
(
    id           integer primary key generated by default as identity,
    sender_id    integer references accounts (id) on delete set null,
    recipient_id integer references accounts (id) on delete set null,
    type         text    not null check ( type in ('TOP_UP', 'TRANSFER', 'CHARGE') ),
    amount       bigint  not null check ( amount > 0 ),
    message      text,
    timestamp    bigint  not null,

    check ( type != 'TOP_UP' or sender_id is null ),
    check ( type != 'CHARGE' or recipient_id is null ),
    check ( sender_id != recipient_id )
);
select setval('transactions_id_seq', greatest(100000, coalesce((select max(id) from transactions), 0) + 1));
create index if not exists transactions_timestamp_index on transactions (timestamp desc);
create index if not exists transactions_type_amount_covering_index on transactions (type) include (amount);
