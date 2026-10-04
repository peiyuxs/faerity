export interface Plant {
  id: number;
  scientific_name: string;
  common_names: string | null;
  family: string | null;
  edible_portion: string | null;
  edible_uses: string | null;
  description: string | null;
  found_in: string | null;
  thumbnail: string | null;
  image_attribution: string | null;
  image_license: string | null;
  click_count: number;
  last_clicked_at: string | null;
}