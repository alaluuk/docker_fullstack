--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book; Type: TABLE; Schema: public; Owner: netuser
--

CREATE TABLE public.book (
    id integer NOT NULL,
    name character varying(255),
    author character varying(255),
    isbn character varying(255)
);


ALTER TABLE public.book OWNER TO netuser;

--
-- Name: book_id_seq; Type: SEQUENCE; Schema: public; Owner: netuser
--

CREATE SEQUENCE public.book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_id_seq OWNER TO netuser;

--
-- Name: book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: netuser
--

ALTER SEQUENCE public.book_id_seq OWNED BY public.book.id;


--
-- Name: book id; Type: DEFAULT; Schema: public; Owner: netuser
--

ALTER TABLE ONLY public.book ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);


--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: netuser
--

COPY public.book (id, name, author, isbn) FROM stdin;
9	Everything You Ever Wanted to Know	Upton	082305649x
10	Photography	Vilppu	205711499
11	Drawing Manual Vilppu	Zelanshi	1892053039
12	TBA	Zelanshi	0534613932
13	Shaping Space	Speight	0534613934
15	My new Book	Me	12345678
\.


--
-- Name: book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: netuser
--

SELECT pg_catalog.setval('public.book_id_seq', 15, true);


--
-- Name: book book_pkey; Type: CONSTRAINT; Schema: public; Owner: netuser
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

