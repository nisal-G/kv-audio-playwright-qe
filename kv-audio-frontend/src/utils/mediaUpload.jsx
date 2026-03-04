import { createClient } from '@supabase/supabase-js'

// Supabase connection details from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const anon_key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Connect to Supabase
const supabase = createClient(supabaseUrl, anon_key)

// Function to upload media file to Supabase storage
export default function mediaUpload(file) {

    return new Promise((resolve, reject) => {
        
        // Check if file exists
        if (file == null) {
            reject("No file provided");
            return;
        }
        
        // Generate unique filename using timestamp
        const timeStamp = new Date().getTime();
        const fileName = timeStamp + '-' + file.name;

        // Upload file to 'images' bucket in Supabase
        supabase.storage.from('images').upload(fileName, file, {
            cacheControl: '3600',  // Cache for 1 hour
            upsert: false,         // Don't replace existing files
        }).then((response) => {
            
            // Check for upload errors
            if (response.error) {
                console.error('Upload error:', response.error);
                reject(response.error.message);
                return;
            }

            // Get public URL of uploaded file
            const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;

            // Return the URL
            resolve(publicUrl);
            
        }).catch((error) => {
            // Handle any unexpected errors
            reject(error.message);
        });
    });
}