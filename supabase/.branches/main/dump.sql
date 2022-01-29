--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1 (Debian 14.1-1.pgdg110+1)
-- Dumped by pg_dump version 14.1 (Debian 14.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO postgres;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		current_setting('request.jwt.claim.email', true),
		(current_setting('request.jwt.claims', true)::jsonb ->> 'email')
	)::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		current_setting('request.jwt.claim.role', true),
		(current_setting('request.jwt.claims', true)::jsonb ->> 'role')
	)::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select
  nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    ),
    ''
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  schema_is_cron bool;
BEGIN
  schema_is_cron = (
    SELECT n.nspname = 'cron'
    FROM pg_event_trigger_ddl_commands() AS ev
    LEFT JOIN pg_catalog.pg_namespace AS n
      ON ev.objid = n.oid
  );

  IF schema_is_cron
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;

  END IF;

END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_collect_response(request_id bigint, async boolean) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_collect_response(request_id bigint, async boolean) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_collect_response(request_id bigint, async boolean) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_collect_response(request_id bigint, async boolean) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: notify_api_restart(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.notify_api_restart() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NOTIFY ddl_command_end;
END;
$$;


ALTER FUNCTION extensions.notify_api_restart() OWNER TO postgres;

--
-- Name: FUNCTION notify_api_restart(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.notify_api_restart() IS 'Sends a notification to the API to restart. If your database schema has changed, this is required so that Supabase can rebuild the relationships.';


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return split_part(_filename, '.', 2);
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
	return query 
		with files_folders as (
			select path_tokens[levels] as folder
			from storage.objects
			where objects.name ilike prefix || '%'
			and bucket_id = bucketname
			GROUP by folder
			limit limits
			offset offsets
		) 
		select files_folders.folder as name, objects.id, objects.updated_at, objects.created_at, objects.last_accessed_at, objects.metadata from files_folders 
		left join storage.objects
		on prefix || files_folders.folder = objects.name and objects.bucket_id=bucketname;
END
$$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(15) DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(15) DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: Attendee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attendee" (
    id text NOT NULL,
    "fullName" text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Attendee" OWNER TO postgres;

--
-- Name: Preso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Preso" (
    id text NOT NULL,
    "eventName" text NOT NULL,
    "eventLocation" text,
    title text NOT NULL,
    url text,
    "shortCode" text,
    "userId" uuid NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "publishedContentUrl" text
);


ALTER TABLE public."Preso" OWNER TO postgres;

--
-- Name: Survey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Survey" (
    id text NOT NULL,
    "presoId" text NOT NULL,
    "attendeeId" text NOT NULL,
    "notifyWhenVideoPublished" boolean NOT NULL,
    "sendPresoFeedback" boolean NOT NULL,
    "notifyOfOtherTalks" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Survey" OWNER TO postgres;

--
-- Name: attendees_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.attendees_view AS
 SELECT p."userId" AS presenter,
    p.id AS preso,
    a.id AS attendee,
    a.email,
    a."fullName" AS name,
    a."createdAt" AS created_at,
    s."notifyOfOtherTalks",
    s."notifyWhenVideoPublished",
    s."sendPresoFeedback"
   FROM ((public."Preso" p
     JOIN public."Survey" s ON ((p.id = s."presoId")))
     JOIN public."Attendee" a ON ((s."attendeeId" = a.id)));


ALTER TABLE public.attendees_view OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    username text,
    avatar_url text,
    website text,
    CONSTRAINT profiles_username_check CHECK ((char_length(username) >= 3))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at) FROM stdin;
00000000-0000-0000-0000-000000000000	d6452e01-7d50-41e1-a895-19eaafd07d80	{"action":"user_confirmation_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-03T01:18:07Z"}	2022-01-03 01:18:07.762646+00
00000000-0000-0000-0000-000000000000	bc249cb4-dacf-4dcc-889f-f9bc4ab98ee9	{"action":"user_signedup","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"team","timestamp":"2022-01-03T01:18:18Z"}	2022-01-03 01:18:18.485889+00
00000000-0000-0000-0000-000000000000	5e12371b-65f7-4d40-a559-a6f3cd4b3d33	{"action":"logout","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"account","timestamp":"2022-01-03T02:15:23Z"}	2022-01-03 02:15:23.370685+00
00000000-0000-0000-0000-000000000000	7e199d59-2c46-4d34-8cbb-aab177b87363	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-03T02:15:51Z"}	2022-01-03 02:15:51.488919+00
00000000-0000-0000-0000-000000000000	c8fe0169-7d18-42de-a057-41cf85e51179	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-05T21:45:12Z"}	2022-01-05 21:45:12.312875+00
00000000-0000-0000-0000-000000000000	d9c3693e-3feb-49fd-a9ff-3da87735d2a2	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-05T22:11:24Z"}	2022-01-05 22:11:24.383868+00
00000000-0000-0000-0000-000000000000	0eb33857-6c11-4284-a4b4-94c08671d9a8	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-05T23:10:44Z"}	2022-01-05 23:10:44.907821+00
00000000-0000-0000-0000-000000000000	686ebd4e-707d-4788-ace3-4986372a4c7d	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-05T23:10:44Z"}	2022-01-05 23:10:44.910748+00
00000000-0000-0000-0000-000000000000	dd2fc7d7-1378-4cc3-aec1-3e425f1fdc17	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T00:09:45Z"}	2022-01-06 00:09:45.895677+00
00000000-0000-0000-0000-000000000000	af4420b9-d19e-454a-bd82-46e4b0fe07ee	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T00:09:45Z"}	2022-01-06 00:09:45.899422+00
00000000-0000-0000-0000-000000000000	b57e5167-8778-4f24-9a09-816a5823296d	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T01:08:44Z"}	2022-01-06 01:08:44.074297+00
00000000-0000-0000-0000-000000000000	3b0b18b9-2d10-4a63-90cc-7dea0fdd279e	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T01:08:44Z"}	2022-01-06 01:08:44.077853+00
00000000-0000-0000-0000-000000000000	8f5b6b1e-f9e4-4479-9800-d55b66711735	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T02:07:46Z"}	2022-01-06 02:07:46.605946+00
00000000-0000-0000-0000-000000000000	1d31e5a8-a204-4311-8d7c-4c4bb43858be	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T02:07:46Z"}	2022-01-06 02:07:46.609066+00
00000000-0000-0000-0000-000000000000	89c3dd44-4d5d-41ec-a957-971ecd3f818d	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T03:06:47Z"}	2022-01-06 03:06:47.102739+00
00000000-0000-0000-0000-000000000000	9d1e7c44-065f-4214-81ab-599a21b1b388	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T03:06:47Z"}	2022-01-06 03:06:47.106925+00
00000000-0000-0000-0000-000000000000	8f294982-e505-4170-a702-85f971cb294b	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T04:05:47Z"}	2022-01-06 04:05:47.752086+00
00000000-0000-0000-0000-000000000000	0a812b82-2edd-4f8a-8838-38f4c3df2227	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T04:05:47Z"}	2022-01-06 04:05:47.756787+00
00000000-0000-0000-0000-000000000000	e105f99e-2756-4bfd-a482-ec80d47c0350	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T05:04:48Z"}	2022-01-06 05:04:48.353343+00
00000000-0000-0000-0000-000000000000	7ac43d94-085a-4a0f-8382-0ba9bdd1c63e	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T05:04:48Z"}	2022-01-06 05:04:48.357711+00
00000000-0000-0000-0000-000000000000	d466ceec-ea09-4772-88ec-bdae7b1befed	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T06:03:49Z"}	2022-01-06 06:03:49.046335+00
00000000-0000-0000-0000-000000000000	403a9ecc-468a-4309-8ce5-5e74cc808e44	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T06:03:49Z"}	2022-01-06 06:03:49.05011+00
00000000-0000-0000-0000-000000000000	3ea2d048-f5f3-4683-b2a6-1869b784068e	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T07:02:49Z"}	2022-01-06 07:02:49.277207+00
00000000-0000-0000-0000-000000000000	95819f49-5d9b-46b2-b4f0-845b3edc8ae2	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T07:02:49Z"}	2022-01-06 07:02:49.281777+00
00000000-0000-0000-0000-000000000000	62258690-2faf-440e-832e-27997bed29c8	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T08:01:49Z"}	2022-01-06 08:01:49.598817+00
00000000-0000-0000-0000-000000000000	8b9a2ced-2203-4504-9581-a3c3fb8179db	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T08:01:49Z"}	2022-01-06 08:01:49.60152+00
00000000-0000-0000-0000-000000000000	90140562-2611-49a8-84f3-3b5fcd2a2775	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T09:00:50Z"}	2022-01-06 09:00:50.125309+00
00000000-0000-0000-0000-000000000000	db2b876e-c15f-4711-9414-5eea9f0331a8	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T09:00:50Z"}	2022-01-06 09:00:50.130116+00
00000000-0000-0000-0000-000000000000	23b6ed9e-d9ba-47d6-8dee-736ce6918702	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T09:59:50Z"}	2022-01-06 09:59:50.76347+00
00000000-0000-0000-0000-000000000000	c22de8df-246e-4adf-ab2b-fb2b6833d561	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T09:59:50Z"}	2022-01-06 09:59:50.768562+00
00000000-0000-0000-0000-000000000000	ada4ea95-0f6d-491f-b214-776683a703eb	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T10:58:48Z"}	2022-01-06 10:58:48.914898+00
00000000-0000-0000-0000-000000000000	ae1abb40-6197-4ba8-b1bf-24700b90e7e8	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T10:58:48Z"}	2022-01-06 10:58:48.92013+00
00000000-0000-0000-0000-000000000000	8400782d-e3af-433b-b984-ca7a43d95bac	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T11:57:49Z"}	2022-01-06 11:57:49.634344+00
00000000-0000-0000-0000-000000000000	2e52d330-7794-486d-a698-4ce321cb8159	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T11:57:49Z"}	2022-01-06 11:57:49.641183+00
00000000-0000-0000-0000-000000000000	7ad2ec5c-a4d8-4a14-8c8d-d276ab32c71c	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T12:56:50Z"}	2022-01-06 12:56:50.171086+00
00000000-0000-0000-0000-000000000000	26932afe-a22c-4d1b-a37b-3006f08b1ad3	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T12:56:50Z"}	2022-01-06 12:56:50.176274+00
00000000-0000-0000-0000-000000000000	a26df981-e8c5-4acc-8f1a-350dc7bb8e38	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T13:55:50Z"}	2022-01-06 13:55:50.801872+00
00000000-0000-0000-0000-000000000000	5f997019-1591-44ec-b0ae-bdf604c4aeef	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T13:55:50Z"}	2022-01-06 13:55:50.806567+00
00000000-0000-0000-0000-000000000000	b292022a-e763-4945-b304-4c7a5bb895a3	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T14:54:53Z"}	2022-01-06 14:54:53.640939+00
00000000-0000-0000-0000-000000000000	2b84f64f-a07d-43b7-b587-54468d5cc293	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T14:54:53Z"}	2022-01-06 14:54:53.645727+00
00000000-0000-0000-0000-000000000000	f017317c-38d6-4918-9501-3c72d0df121a	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T15:53:53Z"}	2022-01-06 15:53:53.802673+00
00000000-0000-0000-0000-000000000000	7dcfb309-5689-4176-be87-070cf86497b1	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T15:53:53Z"}	2022-01-06 15:53:53.807306+00
00000000-0000-0000-0000-000000000000	9a46a8bb-327e-4f27-90e3-e9852be81535	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T16:52:53Z"}	2022-01-06 16:52:53.886169+00
00000000-0000-0000-0000-000000000000	d4e87d65-c73a-44e5-9c0d-1d7f3c560b62	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T16:52:53Z"}	2022-01-06 16:52:53.89106+00
00000000-0000-0000-0000-000000000000	c697ff26-c022-40be-bcb0-b4cb659d2465	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T17:51:54Z"}	2022-01-06 17:51:54.447764+00
00000000-0000-0000-0000-000000000000	2835e094-7d4a-4f16-a2ac-a42102f0bd5d	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T17:51:54Z"}	2022-01-06 17:51:54.452268+00
00000000-0000-0000-0000-000000000000	025300c3-7f1c-4ee4-bd7b-2ddd35482214	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T18:50:55Z"}	2022-01-06 18:50:55.2884+00
00000000-0000-0000-0000-000000000000	c046dce5-c94e-46bc-8273-edabe77ac694	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T18:50:55Z"}	2022-01-06 18:50:55.290775+00
00000000-0000-0000-0000-000000000000	db130bae-e82f-40c4-8b95-062e675f8164	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T19:49:56Z"}	2022-01-06 19:49:56.154493+00
00000000-0000-0000-0000-000000000000	9bcf5ddd-d89c-4d93-b6cb-0d7c6cde43c0	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T19:49:56Z"}	2022-01-06 19:49:56.158993+00
00000000-0000-0000-0000-000000000000	92f81db6-e37a-4847-aba7-c3373ce45fdc	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T20:48:56Z"}	2022-01-06 20:48:56.600793+00
00000000-0000-0000-0000-000000000000	5e89c61a-842d-43f2-9446-7338ecca0cd7	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T20:48:56Z"}	2022-01-06 20:48:56.605171+00
00000000-0000-0000-0000-000000000000	7a43addb-4185-4be3-9365-a43e90e12148	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T21:47:57Z"}	2022-01-06 21:47:57.09728+00
00000000-0000-0000-0000-000000000000	96f06a26-6ead-422c-94de-dc345895e3e1	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T21:47:57Z"}	2022-01-06 21:47:57.101883+00
00000000-0000-0000-0000-000000000000	7e253b6a-a35b-460a-b0bf-182d89377938	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T22:47:05Z"}	2022-01-06 22:47:05.75343+00
00000000-0000-0000-0000-000000000000	2dfdfda6-ccd3-41d6-b755-d64df4c184c4	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T22:47:05Z"}	2022-01-06 22:47:05.760984+00
00000000-0000-0000-0000-000000000000	ec47c567-327e-4418-adde-2d2672a68cd7	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T23:46:13Z"}	2022-01-06 23:46:13.984359+00
00000000-0000-0000-0000-000000000000	3b373a8b-9824-4ec2-8cac-01a2512b04cc	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-06T23:46:13Z"}	2022-01-06 23:46:13.988163+00
00000000-0000-0000-0000-000000000000	166a652d-67bc-4de9-a55d-e96eb8a41b76	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T00:45:33Z"}	2022-01-07 00:45:33.296445+00
00000000-0000-0000-0000-000000000000	41fe77d3-54d9-4ca7-8208-4f763fc05a08	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T00:45:33Z"}	2022-01-07 00:45:33.301357+00
00000000-0000-0000-0000-000000000000	c619a86d-e1c7-4a86-8d40-84ab845b876f	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T01:44:46Z"}	2022-01-07 01:44:46.112792+00
00000000-0000-0000-0000-000000000000	3540398b-00fe-48a3-bf3b-b87b9e3b6737	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T01:44:46Z"}	2022-01-07 01:44:46.118447+00
00000000-0000-0000-0000-000000000000	90259b20-8ec2-4ddd-8055-985290514474	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T02:44:10Z"}	2022-01-07 02:44:10.785301+00
00000000-0000-0000-0000-000000000000	57e0dfbe-ac79-4d04-ae1b-b6187491497e	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T02:44:10Z"}	2022-01-07 02:44:10.791631+00
00000000-0000-0000-0000-000000000000	a754dda9-8e2b-4b4d-a582-4f9a49d2403d	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T03:43:29Z"}	2022-01-07 03:43:29.199265+00
00000000-0000-0000-0000-000000000000	4f13487b-140c-4a04-ac87-9c02ddf9cb92	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T03:43:29Z"}	2022-01-07 03:43:29.20461+00
00000000-0000-0000-0000-000000000000	2eec9d97-b951-4de1-8fa2-f7c78f5502be	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T04:42:30Z"}	2022-01-07 04:42:30.205141+00
00000000-0000-0000-0000-000000000000	675a698f-541e-4dc2-a005-720dddce0068	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T04:42:30Z"}	2022-01-07 04:42:30.210088+00
00000000-0000-0000-0000-000000000000	cf7cb686-2ef9-4f67-98ff-5c96378efa91	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T05:41:37Z"}	2022-01-07 05:41:37.399966+00
00000000-0000-0000-0000-000000000000	75ca9047-60f0-4d73-bfd0-1ee6e2f3812a	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T05:41:37Z"}	2022-01-07 05:41:37.405429+00
00000000-0000-0000-0000-000000000000	ee8ef4ca-35af-47b7-9ce8-09d034b017dd	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T06:41:03Z"}	2022-01-07 06:41:03.921816+00
00000000-0000-0000-0000-000000000000	3122715d-f9f1-4402-ab66-c80a759f0abd	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T06:41:03Z"}	2022-01-07 06:41:03.925802+00
00000000-0000-0000-0000-000000000000	775ab6c3-5a1f-4d89-8b10-4e00885ea71f	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T07:40:10Z"}	2022-01-07 07:40:10.823426+00
00000000-0000-0000-0000-000000000000	5b79bf07-be8b-41ef-b15c-dfa91ce7ba72	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T07:40:10Z"}	2022-01-07 07:40:10.828381+00
00000000-0000-0000-0000-000000000000	3835b559-b176-4899-9afe-45e7ae0ad287	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T08:39:24Z"}	2022-01-07 08:39:24.307486+00
00000000-0000-0000-0000-000000000000	7c8e3701-1757-4eee-af2a-7c0b0a4f0842	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T08:39:24Z"}	2022-01-07 08:39:24.312319+00
00000000-0000-0000-0000-000000000000	235140e0-a0c3-4f70-b6e0-00a7a8fae8b0	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T09:38:45Z"}	2022-01-07 09:38:45.293173+00
00000000-0000-0000-0000-000000000000	e5249411-d97f-4cd0-9082-d45b3ddb7a0b	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T09:38:45Z"}	2022-01-07 09:38:45.297898+00
00000000-0000-0000-0000-000000000000	fa7909f0-9d77-4bf7-8267-531ccb24190a	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T10:37:57Z"}	2022-01-07 10:37:57.479374+00
00000000-0000-0000-0000-000000000000	85c5fd19-3fd4-4a8f-a953-3a1be3fef8c6	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T10:37:57Z"}	2022-01-07 10:37:57.485512+00
00000000-0000-0000-0000-000000000000	ec15f6f0-3b1b-4db1-94fc-e9dbad783209	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T11:37:13Z"}	2022-01-07 11:37:13.615156+00
00000000-0000-0000-0000-000000000000	736367c2-a679-469e-9ebd-5151f070deb6	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T11:37:13Z"}	2022-01-07 11:37:13.619019+00
00000000-0000-0000-0000-000000000000	865864bf-b608-41af-8849-87450bc01917	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T12:36:25Z"}	2022-01-07 12:36:25.676849+00
00000000-0000-0000-0000-000000000000	448d4bb3-4f6c-4fe3-93fe-8c6fd181a1a9	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T12:36:25Z"}	2022-01-07 12:36:25.682813+00
00000000-0000-0000-0000-000000000000	3ea79912-1ac3-4997-8eb1-ba4ae224ec3b	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T13:35:35Z"}	2022-01-07 13:35:35.051518+00
00000000-0000-0000-0000-000000000000	0677e19e-3361-4894-ab21-bdb65426efc8	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T13:35:35Z"}	2022-01-07 13:35:35.056726+00
00000000-0000-0000-0000-000000000000	03faced7-3c02-4f06-833a-0dc7bb052fdd	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T14:34:41Z"}	2022-01-07 14:34:41.901388+00
00000000-0000-0000-0000-000000000000	fe493d91-205f-4843-a952-7e7587672074	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T14:34:41Z"}	2022-01-07 14:34:41.904422+00
00000000-0000-0000-0000-000000000000	bebb2a09-e93d-49de-a27f-b26a37e1e8bb	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T15:33:57Z"}	2022-01-07 15:33:57.613173+00
00000000-0000-0000-0000-000000000000	71254469-3b97-4930-a24b-044385874a8a	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T15:33:57Z"}	2022-01-07 15:33:57.61846+00
00000000-0000-0000-0000-000000000000	a402a82a-9b68-4b4e-bed5-29f85cd0953e	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T16:33:15Z"}	2022-01-07 16:33:15.692584+00
00000000-0000-0000-0000-000000000000	7c71c33b-2479-4d1f-9f6e-75d87632dcc5	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T16:33:15Z"}	2022-01-07 16:33:15.697877+00
00000000-0000-0000-0000-000000000000	561d3d02-ae02-4940-8ad2-b2ec15240f39	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T17:32:34Z"}	2022-01-07 17:32:34.987444+00
00000000-0000-0000-0000-000000000000	7db232c6-7768-467e-8cb5-39ae5da5cbb1	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-07T17:32:34Z"}	2022-01-07 17:32:34.992604+00
00000000-0000-0000-0000-000000000000	8f67ecb9-ab6e-48fe-bff1-2dc2172e00ff	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-26T21:08:42Z"}	2022-01-26 21:08:42.387314+00
00000000-0000-0000-0000-000000000000	b8192da1-26e7-4726-b5eb-f5db7e371ec8	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-26T22:08:00Z"}	2022-01-26 22:08:00.268836+00
00000000-0000-0000-0000-000000000000	3bdcda8d-af66-47c0-b24b-43e208d49aea	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-26T22:08:00Z"}	2022-01-26 22:08:00.297899+00
00000000-0000-0000-0000-000000000000	8e16b420-a92d-498a-882c-a3223f63beb8	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-26T22:09:22Z"}	2022-01-26 22:09:22.460942+00
00000000-0000-0000-0000-000000000000	47554df5-ce27-4418-b762-831623949e80	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-26T23:08:34Z"}	2022-01-26 23:08:34.130513+00
00000000-0000-0000-0000-000000000000	6621cbf8-4374-47ca-b593-d36525dc9b52	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-26T23:08:34Z"}	2022-01-26 23:08:34.135018+00
00000000-0000-0000-0000-000000000000	5e7cbf75-e36e-4ea0-a3e3-3d4665cf8bff	{"action":"user_confirmation_requested","actor_id":"af8f2289-674d-4d0b-81d4-d25bf0f53bbb","actor_username":"will@onesignal.com","log_type":"user","timestamp":"2022-01-27T00:15:33Z"}	2022-01-27 00:15:33.21547+00
00000000-0000-0000-0000-000000000000	7a2cd3d7-6c05-4498-86ad-b15e29483fcb	{"action":"user_signedup","actor_id":"af8f2289-674d-4d0b-81d4-d25bf0f53bbb","actor_username":"will@onesignal.com","log_type":"team","timestamp":"2022-01-27T00:15:42Z"}	2022-01-27 00:15:42.953481+00
00000000-0000-0000-0000-000000000000	95c0b6ac-61c7-4f9e-9808-a96d948013c4	{"action":"logout","actor_id":"af8f2289-674d-4d0b-81d4-d25bf0f53bbb","actor_username":"will@onesignal.com","log_type":"account","timestamp":"2022-01-27T00:16:20Z"}	2022-01-27 00:16:20.38906+00
00000000-0000-0000-0000-000000000000	f579a312-bab7-4b07-a4d2-943586d29c72	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-27T00:16:30Z"}	2022-01-27 00:16:30.679381+00
00000000-0000-0000-0000-000000000000	a7e37e18-0b14-4230-af9b-9ad34301dd71	{"action":"user_recovery_requested","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"user","timestamp":"2022-01-28T22:32:57Z"}	2022-01-28 22:32:57.980894+00
00000000-0000-0000-0000-000000000000	33da3722-c67e-471e-8cd0-b1976239cb80	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-28T23:32:17Z"}	2022-01-28 23:32:17.943788+00
00000000-0000-0000-0000-000000000000	d10e01c8-a63c-4fd0-91d0-c7b416050e8f	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-28T23:32:17Z"}	2022-01-28 23:32:17.946984+00
00000000-0000-0000-0000-000000000000	a9d692f4-d3b6-4a8e-8254-e668a2b80275	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-29T00:31:18Z"}	2022-01-29 00:31:18.016971+00
00000000-0000-0000-0000-000000000000	45f04491-b9b7-4a57-b7ff-d7e47a9d6c49	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-29T00:31:18Z"}	2022-01-29 00:31:18.019371+00
00000000-0000-0000-0000-000000000000	765fdb12-7d7c-4937-8989-f24bd8e43366	{"action":"token_refreshed","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-29T01:30:18Z"}	2022-01-29 01:30:18.082069+00
00000000-0000-0000-0000-000000000000	ca683803-7edc-47de-a1a4-ce72ef3b61de	{"action":"token_revoked","actor_id":"ce32f57d-c350-4464-8837-c3aad7178064","actor_username":"william@onesignal.com","log_type":"token","timestamp":"2022-01-29T01:30:18Z"}	2022-01-29 01:30:18.085689+00
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) FROM stdin;
ce32f57d-c350-4464-8837-c3aad7178064	ce32f57d-c350-4464-8837-c3aad7178064	{"sub": "ce32f57d-c350-4464-8837-c3aad7178064"}	email	2022-01-03 01:18:07.750606+00	2022-01-03 01:18:07.750934+00	2022-01-03 01:18:07.750934+00
af8f2289-674d-4d0b-81d4-d25bf0f53bbb	af8f2289-674d-4d0b-81d4-d25bf0f53bbb	{"sub": "af8f2289-674d-4d0b-81d4-d25bf0f53bbb"}	email	2022-01-27 00:15:33.209691+00	2022-01-27 00:15:33.209996+00	2022-01-27 00:15:33.209996+00
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent) FROM stdin;
00000000-0000-0000-0000-000000000000	2	irkoMbkmB9ASabCscy0fsQ	ce32f57d-c350-4464-8837-c3aad7178064	f	2022-01-03 02:15:59.518075+00	2022-01-03 02:15:59.518075+00	\N
00000000-0000-0000-0000-000000000000	3	K3taKx7of4jpWflApQ_j7g	ce32f57d-c350-4464-8837-c3aad7178064	f	2022-01-05 21:45:39.246123+00	2022-01-05 21:45:39.246123+00	\N
00000000-0000-0000-0000-000000000000	4	GI6Kz1xVv2znWHkSF7mksQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-05 22:11:44.227141+00	2022-01-05 22:11:44.227141+00	\N
00000000-0000-0000-0000-000000000000	5	l8oSk_EEpO5YWmZLzsqedQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-05 23:10:44.915948+00	2022-01-05 23:10:44.915948+00	GI6Kz1xVv2znWHkSF7mksQ
00000000-0000-0000-0000-000000000000	6	amN_6I7PWW2kUYvNxYxVBQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 00:09:45.903893+00	2022-01-06 00:09:45.903893+00	l8oSk_EEpO5YWmZLzsqedQ
00000000-0000-0000-0000-000000000000	7	UaKG2jjfQy0tA_4i2s6ZbQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 01:08:44.081807+00	2022-01-06 01:08:44.081807+00	amN_6I7PWW2kUYvNxYxVBQ
00000000-0000-0000-0000-000000000000	8	AE_A3ezJFhs9_dwbFMzi7A	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 02:07:46.613454+00	2022-01-06 02:07:46.613454+00	UaKG2jjfQy0tA_4i2s6ZbQ
00000000-0000-0000-0000-000000000000	9	zNXPhcF57S8zdUd2T4GY4w	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 03:06:47.112316+00	2022-01-06 03:06:47.112316+00	AE_A3ezJFhs9_dwbFMzi7A
00000000-0000-0000-0000-000000000000	10	SDoeQ3-t-BpR3Fpx8ljDug	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 04:05:47.762717+00	2022-01-06 04:05:47.762717+00	zNXPhcF57S8zdUd2T4GY4w
00000000-0000-0000-0000-000000000000	11	8vCkrfziDeahSgkceGjY8A	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 05:04:48.362675+00	2022-01-06 05:04:48.362675+00	SDoeQ3-t-BpR3Fpx8ljDug
00000000-0000-0000-0000-000000000000	12	1GWCvcMVj3Uzsb6kJu3sCA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 06:03:49.055213+00	2022-01-06 06:03:49.055213+00	8vCkrfziDeahSgkceGjY8A
00000000-0000-0000-0000-000000000000	13	hC4Fqri3O7rh4wTEmN3Gzg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 07:02:49.28764+00	2022-01-06 07:02:49.28764+00	1GWCvcMVj3Uzsb6kJu3sCA
00000000-0000-0000-0000-000000000000	14	2aTuABzsUhhACw2v0s5tKQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 08:01:49.604814+00	2022-01-06 08:01:49.604814+00	hC4Fqri3O7rh4wTEmN3Gzg
00000000-0000-0000-0000-000000000000	15	FQKuaTiq5YAxmMTEtqmEzg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 09:00:50.135432+00	2022-01-06 09:00:50.135432+00	2aTuABzsUhhACw2v0s5tKQ
00000000-0000-0000-0000-000000000000	16	vhMkesuFsC_EUvu5xX_23w	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 09:59:50.774082+00	2022-01-06 09:59:50.774082+00	FQKuaTiq5YAxmMTEtqmEzg
00000000-0000-0000-0000-000000000000	17	u-7A8Gv-gpyf5Bc4iYWs5g	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 10:58:48.926131+00	2022-01-06 10:58:48.926131+00	vhMkesuFsC_EUvu5xX_23w
00000000-0000-0000-0000-000000000000	18	yxq7b1aJb-3QfWPFbUJSWw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 11:57:49.646726+00	2022-01-06 11:57:49.646726+00	u-7A8Gv-gpyf5Bc4iYWs5g
00000000-0000-0000-0000-000000000000	19	1TtwQJfq34jnomuzLfke0g	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 12:56:50.182241+00	2022-01-06 12:56:50.182241+00	yxq7b1aJb-3QfWPFbUJSWw
00000000-0000-0000-0000-000000000000	20	gTLn3cCKe8NveF7S5fmvTg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 13:55:50.81235+00	2022-01-06 13:55:50.81235+00	1TtwQJfq34jnomuzLfke0g
00000000-0000-0000-0000-000000000000	21	Weg9dg87uEe-UZXuGVEUKA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 14:54:53.651558+00	2022-01-06 14:54:53.651558+00	gTLn3cCKe8NveF7S5fmvTg
00000000-0000-0000-0000-000000000000	22	MeI-p1ujiri0_O160LcB8g	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 15:53:53.813415+00	2022-01-06 15:53:53.813415+00	Weg9dg87uEe-UZXuGVEUKA
00000000-0000-0000-0000-000000000000	23	w4uvhTsZHagqBoZnQg9vZA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 16:52:53.896734+00	2022-01-06 16:52:53.896734+00	MeI-p1ujiri0_O160LcB8g
00000000-0000-0000-0000-000000000000	24	bzlgy0O5DfAvrgVYMHEgzg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 17:51:54.458199+00	2022-01-06 17:51:54.458199+00	w4uvhTsZHagqBoZnQg9vZA
00000000-0000-0000-0000-000000000000	25	tD2fl1799UVCTFVHNeI0mw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 18:50:55.293638+00	2022-01-06 18:50:55.293638+00	bzlgy0O5DfAvrgVYMHEgzg
00000000-0000-0000-0000-000000000000	26	sG3TRo0Hwla_01Ody_E6Dw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 19:49:56.164463+00	2022-01-06 19:49:56.164463+00	tD2fl1799UVCTFVHNeI0mw
00000000-0000-0000-0000-000000000000	27	eL2Zc0HlXKkQl5ZPaA2O2A	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 20:48:56.610355+00	2022-01-06 20:48:56.610355+00	sG3TRo0Hwla_01Ody_E6Dw
00000000-0000-0000-0000-000000000000	28	EFfe_DRBnu61DIFaQCXBvw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 21:47:57.108371+00	2022-01-06 21:47:57.108371+00	eL2Zc0HlXKkQl5ZPaA2O2A
00000000-0000-0000-0000-000000000000	29	iRkX-2ehF9o1DYzGm-y7lw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 22:47:05.767066+00	2022-01-06 22:47:05.767066+00	EFfe_DRBnu61DIFaQCXBvw
00000000-0000-0000-0000-000000000000	30	R4leAIP_xV-tARZWRZGOYw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-06 23:46:13.99317+00	2022-01-06 23:46:13.99317+00	iRkX-2ehF9o1DYzGm-y7lw
00000000-0000-0000-0000-000000000000	31	rIXsSuggel-kbo3f5EPjgg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 00:45:33.306105+00	2022-01-07 00:45:33.306105+00	R4leAIP_xV-tARZWRZGOYw
00000000-0000-0000-0000-000000000000	32	Xe-RUs2dTW52zReKGl-ItQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 01:44:46.123949+00	2022-01-07 01:44:46.123949+00	rIXsSuggel-kbo3f5EPjgg
00000000-0000-0000-0000-000000000000	33	Afe8kxiOd8fg_E4E0xSowA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 02:44:10.79905+00	2022-01-07 02:44:10.79905+00	Xe-RUs2dTW52zReKGl-ItQ
00000000-0000-0000-0000-000000000000	34	1SYEzvzASllfvhwz9GEq6Q	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 03:43:29.210153+00	2022-01-07 03:43:29.210153+00	Afe8kxiOd8fg_E4E0xSowA
00000000-0000-0000-0000-000000000000	35	8D8OjR1TmAc_YlvyAd1CNQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 04:42:30.215678+00	2022-01-07 04:42:30.215678+00	1SYEzvzASllfvhwz9GEq6Q
00000000-0000-0000-0000-000000000000	36	kTFi3Q3d4ySpRmTCnfZHLg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 05:41:37.411279+00	2022-01-07 05:41:37.411279+00	8D8OjR1TmAc_YlvyAd1CNQ
00000000-0000-0000-0000-000000000000	37	sk7ktofevV2zZgSpVB-sng	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 06:41:03.930892+00	2022-01-07 06:41:03.930892+00	kTFi3Q3d4ySpRmTCnfZHLg
00000000-0000-0000-0000-000000000000	38	DxepXwiuxFhIs5NkcC8UDw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 07:40:10.833461+00	2022-01-07 07:40:10.833461+00	sk7ktofevV2zZgSpVB-sng
00000000-0000-0000-0000-000000000000	39	PNSLtDHVSW6HaLglRM7Tpg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 08:39:24.31699+00	2022-01-07 08:39:24.31699+00	DxepXwiuxFhIs5NkcC8UDw
00000000-0000-0000-0000-000000000000	40	_VRirpnCVglaOjup898iow	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 09:38:45.302771+00	2022-01-07 09:38:45.302771+00	PNSLtDHVSW6HaLglRM7Tpg
00000000-0000-0000-0000-000000000000	41	L4cSY_2hSfhAhn9j9uNv4w	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 10:37:57.491858+00	2022-01-07 10:37:57.491858+00	_VRirpnCVglaOjup898iow
00000000-0000-0000-0000-000000000000	42	bFQOjhi0K4eptcUdNwfR-A	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 11:37:13.623619+00	2022-01-07 11:37:13.623619+00	L4cSY_2hSfhAhn9j9uNv4w
00000000-0000-0000-0000-000000000000	43	PVmdQJ3KDUXKawLnsLnIng	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 12:36:25.687708+00	2022-01-07 12:36:25.687708+00	bFQOjhi0K4eptcUdNwfR-A
00000000-0000-0000-0000-000000000000	44	gLKKfARpQ0u5rgagqjqbdA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 13:35:35.062286+00	2022-01-07 13:35:35.062286+00	PVmdQJ3KDUXKawLnsLnIng
00000000-0000-0000-0000-000000000000	45	h-QNZM6mVigS0woxraOoVQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 14:34:41.908737+00	2022-01-07 14:34:41.908737+00	gLKKfARpQ0u5rgagqjqbdA
00000000-0000-0000-0000-000000000000	46	4zUFncZosZXBbW0G6EA-6Q	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 15:33:57.623771+00	2022-01-07 15:33:57.623771+00	h-QNZM6mVigS0woxraOoVQ
00000000-0000-0000-0000-000000000000	47	y46628dEbIHVcvoBo3hTsg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-07 16:33:15.702879+00	2022-01-07 16:33:15.702879+00	4zUFncZosZXBbW0G6EA-6Q
00000000-0000-0000-0000-000000000000	48	_vpCAdgbEhrXNCSmUmu9NQ	ce32f57d-c350-4464-8837-c3aad7178064	f	2022-01-07 17:32:34.997598+00	2022-01-07 17:32:34.997598+00	y46628dEbIHVcvoBo3hTsg
00000000-0000-0000-0000-000000000000	49	Vs-N5wm77ogSqdZEXKgKWA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-26 21:08:59.679585+00	2022-01-26 21:08:59.679585+00	\N
00000000-0000-0000-0000-000000000000	50	Mia9-1U7ybDHGVOAS2M8cg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-26 22:08:00.3201+00	2022-01-26 22:08:00.3201+00	Vs-N5wm77ogSqdZEXKgKWA
00000000-0000-0000-0000-000000000000	51	hhMwaj3jK0mhbJ-PYO11Gg	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-26 22:09:33.483773+00	2022-01-26 22:09:33.483773+00	\N
00000000-0000-0000-0000-000000000000	52	w2N1gKgAuKpDacf5YWUzmw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-26 23:08:34.140666+00	2022-01-26 23:08:34.140666+00	hhMwaj3jK0mhbJ-PYO11Gg
00000000-0000-0000-0000-000000000000	54	9cUbt051rvo_zdx1d0kufg	ce32f57d-c350-4464-8837-c3aad7178064	f	2022-01-27 00:16:44.480675+00	2022-01-27 00:16:44.480675+00	\N
00000000-0000-0000-0000-000000000000	55	qaQS0I190L5u3I6TfgcuwA	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-28 22:33:16.352645+00	2022-01-28 22:33:16.352645+00	\N
00000000-0000-0000-0000-000000000000	56	wKk18cQ7FmsWBKe-WQpWZw	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-28 23:32:17.95486+00	2022-01-28 23:32:17.95486+00	qaQS0I190L5u3I6TfgcuwA
00000000-0000-0000-0000-000000000000	57	FtPM7f9ZfEFsVa0_RNiMPQ	ce32f57d-c350-4464-8837-c3aad7178064	t	2022-01-29 00:31:18.022944+00	2022-01-29 00:31:18.022944+00	wKk18cQ7FmsWBKe-WQpWZw
00000000-0000-0000-0000-000000000000	58	w3dz9G4Aao8oGY-uhgTseg	ce32f57d-c350-4464-8837-c3aad7178064	f	2022-01-29 01:30:18.091662+00	2022-01-29 01:30:18.091662+00	FtPM7f9ZfEFsVa0_RNiMPQ
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status) FROM stdin;
00000000-0000-0000-0000-000000000000	af8f2289-674d-4d0b-81d4-d25bf0f53bbb		authenticated	will@onesignal.com	$2a$10$soyvZzXon6X.WyGH/9/yjuMhRGkjLf9cPEHCz7h2nVXwhEvjJ4geG	2022-01-27 00:15:42.957285+00	\N		2022-01-27 00:15:33.219024+00		\N			\N	2022-01-27 00:15:42.961655+00	{"provider": "email", "providers": ["email"]}	{}	f	2022-01-27 00:15:33.192302+00	2022-01-27 00:15:33.192302+00	\N	\N			\N		0
00000000-0000-0000-0000-000000000000	ce32f57d-c350-4464-8837-c3aad7178064		authenticated	william@onesignal.com	$2a$10$LnQipLax41/z6QiUNs.v5u5WHOflsrbuNsar.PGnI4z2Vt4HfWyve	2022-01-03 01:18:18.490065+00	\N		2022-01-03 01:18:07.769704+00		2022-01-28 22:32:58.002178+00			\N	2022-01-28 22:33:16.352229+00	{"provider": "email", "providers": ["email"]}	{}	f	2022-01-03 01:18:07.712765+00	2022-01-03 01:18:07.712765+00	\N	\N			\N		0
\.


--
-- Data for Name: Attendee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attendee" (id, "fullName", email, "createdAt", "updatedAt") FROM stdin;
ckyw2gul20000yjbg2lmq5ml7	William	will@codeincolor.io	2022-01-26 21:35:44.345	2022-01-26 21:35:44.345
ckyw2hblg0002yjbgc3p09i07	Will	william@onesignal.com	2022-01-26 21:36:06.406	2022-01-26 21:36:06.406
\.


--
-- Data for Name: Preso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Preso" (id, "eventName", "eventLocation", title, url, "shortCode", "userId", "createdAt", "updatedAt", "publishedContentUrl") FROM stdin;
cky22l5on0000vqtq0vvm2uq7	DevRel Conf	San Francisco, SF	Ngosi	https://ngosi.io	3Cs1gNc	ce32f57d-c350-4464-8837-c3aad7178064	2022-01-05 21:46:00.108	2022-01-05 21:46:00.108	https://www.twitch.tv/codeincolor
ckyw1n92900003sbg86hsdru5	Google		Google	https://google.com	xNEipMe	ce32f57d-c350-4464-8837-c3aad7178064	2022-01-26 21:12:43.459	2022-01-26 21:12:43.459	https://youtubes.com
\.


--
-- Data for Name: Survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Survey" (id, "presoId", "attendeeId", "notifyWhenVideoPublished", "sendPresoFeedback", "notifyOfOtherTalks", "createdAt") FROM stdin;
ckyw2hbmc0003yjbg9o594qil	ckyw1n92900003sbg86hsdru5	ckyw2hblg0002yjbgc3p09i07	t	t	t	2022-01-26 21:36:06.441
ckyw2gum70001yjbgajckhosq	ckyw1n92900003sbg86hsdru5	ckyw2gul20000yjbg2lmq5ml7	f	t	t	2022-01-26 21:35:44.397
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, updated_at, username, avatar_url, website) FROM stdin;
ce32f57d-c350-4464-8837-c3aad7178064	2022-01-03 02:16:23.931368+00	William		https://google.com
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2021-12-29 02:16:12.135161
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2021-12-29 02:16:12.178085
2	pathtoken-column	49756be03be4c17bb85fe70d4a861f27de7e49ad	2021-12-29 02:16:12.190448
3	add-migrations-rls	bb5d124c53d68635a883e399426c6a5a25fc893d	2021-12-29 02:16:12.27427
4	add-size-functions	6d79007d04f5acd288c9c250c42d2d5fd286c54d	2021-12-29 02:16:12.283682
5	change-column-name-in-get-size	fd65688505d2ffa9fbdc58a944348dd8604d688c	2021-12-29 02:16:12.294129
6	add-rls-to-buckets	63e2bab75a2040fee8e3fb3f15a0d26f3380e9b6	2021-12-29 02:16:12.30676
7	add-public-to-buckets	82568934f8a4d9e0a85f126f6fb483ad8214c418	2021-12-29 02:16:12.31643
8	fix-search-function	1a43a40eddb525f2e2f26efd709e6c06e58e059c	2021-12-29 02:16:12.326764
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 58, true);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (provider, id);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Attendee Attendee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendee"
    ADD CONSTRAINT "Attendee_pkey" PRIMARY KEY (id);


--
-- Name: Preso Preso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Preso"
    ADD CONSTRAINT "Preso_pkey" PRIMARY KEY (id);


--
-- Name: Survey Survey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Survey"
    ADD CONSTRAINT "Survey_pkey" PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, email);


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: Attendee_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Attendee_email_key" ON public."Attendee" USING btree (email);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_parent_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_parent_fkey FOREIGN KEY (parent) REFERENCES auth.refresh_tokens(token);


--
-- Name: Preso Preso_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Preso"
    ADD CONSTRAINT "Preso_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Survey Survey_attendeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Survey"
    ADD CONSTRAINT "Survey_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES public."Attendee"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Survey Survey_presoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Survey"
    ADD CONSTRAINT "Survey_presoId_fkey" FOREIGN KEY ("presoId") REFERENCES public."Preso"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: profiles profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: buckets buckets_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: objects objects_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'update');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime Preso; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Preso";


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION notify_api_restart(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.notify_api_restart() TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO anon;
GRANT ALL ON FUNCTION storage.extension(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.extension(name text) TO service_role;
GRANT ALL ON FUNCTION storage.extension(name text) TO dashboard_user;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO anon;
GRANT ALL ON FUNCTION storage.filename(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.filename(name text) TO service_role;
GRANT ALL ON FUNCTION storage.filename(name text) TO dashboard_user;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO anon;
GRANT ALL ON FUNCTION storage.foldername(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.foldername(name text) TO service_role;
GRANT ALL ON FUNCTION storage.foldername(name text) TO dashboard_user;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO anon;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO authenticated;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO service_role;
GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer) TO dashboard_user;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT ALL ON TABLE auth.audit_log_entries TO postgres;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.identities TO postgres;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT ALL ON TABLE auth.instances TO postgres;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT ALL ON TABLE auth.refresh_tokens TO postgres;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT ALL ON TABLE auth.schema_migrations TO postgres;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT ALL ON TABLE auth.users TO postgres;


--
-- Name: TABLE "Attendee"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."Attendee" TO anon;
GRANT ALL ON TABLE public."Attendee" TO authenticated;
GRANT ALL ON TABLE public."Attendee" TO service_role;


--
-- Name: TABLE "Preso"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."Preso" TO anon;
GRANT ALL ON TABLE public."Preso" TO authenticated;
GRANT ALL ON TABLE public."Preso" TO service_role;


--
-- Name: TABLE "Survey"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."Survey" TO anon;
GRANT ALL ON TABLE public."Survey" TO authenticated;
GRANT ALL ON TABLE public."Survey" TO service_role;


--
-- Name: TABLE attendees_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendees_view TO anon;
GRANT ALL ON TABLE public.attendees_view TO authenticated;
GRANT ALL ON TABLE public.attendees_view TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: api_restart; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER api_restart ON ddl_command_end
   EXECUTE FUNCTION extensions.notify_api_restart();


ALTER EVENT TRIGGER api_restart OWNER TO postgres;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE SCHEMA')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO postgres;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

