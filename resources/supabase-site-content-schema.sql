CREATE TABLE IF NOT EXISTS site_content_documents (
  document_key VARCHAR(80) PRIMARY KEY,
  document_json TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_content_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.site_content_documents FROM anon, authenticated;
