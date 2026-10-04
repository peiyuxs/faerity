ALTER TABLE plants
    ADD COLUMN IF NOT EXISTS click_count INTEGER NOT NULL DEFAULT 0
        CHECK (click_count >= 0),
    ADD COLUMN IF NOT EXISTS last_clicked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS plants_popularity_idx
    ON plants (click_count DESC, last_clicked_at DESC NULLS LAST);
