import axios from "axios";
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API

export async function fetchPhotos(query,page=1,per_page=20) {
   if (!UNSPLASH_KEY) {
      throw new Error('Unsplash API key is missing. Set VITE_UNSPLASH_API in your environment.')
   }

   const res =  await axios.get('https://api.unsplash.com/search/photos',{
    params:{query,page,per_page},
    headers:{Authorization:`Client-ID ${UNSPLASH_KEY }`}
   });
   return res.data;

}
