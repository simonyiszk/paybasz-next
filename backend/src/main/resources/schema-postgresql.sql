create table if not exists accounts
(
    id      serial primary key,
    name    text    not null,
    email   text,
    phone   text,
    card    text unique,
    balance bigint  not null check ( balance >= 0 ),
    active  boolean not null
);

create table if not exists events
(
    id        serial primary key,
    type      text   not null check ( type in ('SUCCESS', 'INFO', 'ERROR') ),
    timestamp bigint not null,
    message   text   not null
);

create table if not exists gateways
(
    id                  serial primary key,
    name                text    not null,
    secret              text    not null,
    enabled             boolean not null,
    can_upload          boolean not null,
    can_transfer        boolean not null,
    can_sell_items      boolean not null,
    can_redeem_vouchers boolean not null,
    created_at          bigint  not null,
    last_used           bigint  not null,
    unique (name, secret)
);

create table if not exists items
(
    id      serial primary key,
    name    text    not null,
    alias   text,
    cost    bigint  not null check ( cost >= 0 ),
    stock   integer not null check ( stock >= 0 ),
    enabled Boolean not null
);

create table if not exists vouchers
(
    id         serial primary key,
    account_id integer references accounts (id) on delete set null,
    item_id    integer not null references items (id) on delete cascade,
    count      integer not null check ( count >= 0 ),
    unique (account_id, item_id)
);

create table if not exists orders
(
    id         serial primary key,
    account_id integer not null references accounts (id) on delete cascade,
    timestamp  bigint  not null
);

create table if not exists order_lines
(
    id           serial primary key,
    order_id     integer references orders (id) on delete set null,
    item_id      integer references items (id) on delete set null,
    item_count   integer not null check ( item_count > 0 ),
    used_voucher boolean not null,
    paid_amount  bigint  not null check ( paid_amount >= 0 )
);

create table if not exists transactions
(
    id           serial primary key,
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
