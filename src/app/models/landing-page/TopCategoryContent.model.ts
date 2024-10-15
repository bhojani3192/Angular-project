export interface TopCategoryContentResponse 
{ 
    content_URI: string; 
    contentType: string;
    ratings: number; 
    encodedHLSUrl:string;
    encodedDASHUrl:string;
    isContentEncoded:boolean;
    thumbnailURI_Small:string;
}