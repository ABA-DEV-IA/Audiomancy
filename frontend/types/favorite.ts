import { Track } from './track';

export interface Favorite {
  id: string;
  user_id: string;
  name: string;
  track_list: Track[];
  saved_at: string;
}