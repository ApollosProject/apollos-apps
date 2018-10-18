import cloudinary from 'cloudinary';

cloudinary.config({
  private_cdn: false,
  secure: true,
});

export default function withCloudinary(url = '', options) {
  // If we call this function twice, only the first transform will be applied
  if (url.startsWith('https://res.cloudinary.com')) {
    return url;
  }
  if (process.env.CLOUDINARY_URL) {
    return cloudinary.url(url, {
      type: 'fetch',
      ...options,
    });
  }
  // if we don't have an API key for cloudinary, default to the url.
  return url;
}
