 export interface UserContentResponse {
  posts: UserContent[];
  sessionId: string;
}

export interface UserContent {
  userId: string;
  userContentId: string;
  fullName: string;
  avtar: string;
  postTitle: string;
  gameTitle: string;
  gamerTag: string;
  publishedDate: string;
  contentStatus: string;
  content_URI: string;
  thumbnailURI_Small: string;
  thumbnailURI_Large: string;
  tags: string[];
  description: string;
  views: number;
  likes: number;
  disLikes: number;
  likeStatus: number;
  feedType: string;
  isFollower: boolean;
  isTopCategoryContent: boolean;
  isContentEncoded: boolean;
  encodedHLSUrl: string;
  encodedDASHUrl: string;
  commentsCount: number;
  userContentComments: UserContentComment[];
}

export interface UserContentComment {
  commentId: string;
  userId: string;
  fullName: string;
  gamerTag: string;
  avtar: string;
  commentTime: string;
  commentText: string;
  parentCommentId: string;
  likes: number;
  dislikes: number;
  likeStatus: number;
  commentTagDetails: CommentTagDetail[];
  childComments: UserContentComment[];
}

export interface CommentTagDetail {
  userContentCommentId: string;
  userId: string;
  tagText: string;
  fullName: string;
  gamerTag: string;
  avtar: string;
}
