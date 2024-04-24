export function s3UrlRewriter(url: string) {
    if (process.env.NODE_ENV === "production") {
        return url.replace("https://r2.starlightlabs.co/", "/r2/");
    }
    return url;
}