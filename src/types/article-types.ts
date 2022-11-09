export interface ArticleFilterParams {
  tag?: string;
  page?: number;
}

export interface ArticleDetailParams {
  id: number;
}

export interface UploadFileParams {
  file: File;
  provider: 'cloudinary' | 'imagekit' | 'cloudflare-r2';
}

export interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: string;
  locale?: string;
}

export interface FavoriteItem
  extends Pick<Article, 'id' | 'title' | 'description' | 'tags' | 'cover_image' | 'slug' | 'published_at'> {
  visited_at: string;
  favorite_at?: string;
  author: string;
  author_avatar: string;
  tags?: string[];
  tag_list: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  readable_publish_date: string;
  social_image: string;
  tag_list: string[] | string;
  slug: string;
  url: string;
  canonical_url: string;
  comments_count: number;
  positive_reactions_count: number;
  public_reactions_count: number;
  collection_id: null;
  created_at: string;
  edited_at: string;
  body_html?: string;
  tags?: string[];
  published_at: string;
  last_comment_at: string;
  published_timestamp: string;
  reading_time_minutes: number;
  user: {
    name: string;
    username: string;
    twitter_username: string;
    github_username: string;
    website_url: string;
    profile_image: string;
    profile_image_90: string;
  };
}

export interface ChildrenProps {
  children:React.ReactNode;
}

export interface Profile {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  uploadProvider: UploadFileParams['provider'];
  isFemale: boolean;
  ageRange: number;
  favoriteMaterialUI: boolean;
  favoriteChakraUI: boolean;
  favoriteSemanticUI: boolean;
  favoriteAntDesign: boolean;
  starRating: number;
  yearsUsingReact: number;
}

export interface AvatarResponse {
  avatarUrl: string;
}

// redux slice types
export interface UserSliceType {
  identityToken: string;
  visitedTimes: number;
  recentItems: FavoriteItem[];
  favoriteItems: FavoriteItem[];
  profile: Profile;
  status: 'loading' | 'loaded' | 'error' | '';
}

export interface ArticleSliceType {
  lists: Article[];
  detail: Article | null;
  status: UserSliceType['status'];
  message?: string;
  searchTag: string;
}
