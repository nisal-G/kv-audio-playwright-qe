import { createClient } from '@supabase/supabase-js'

// Supabase connection details
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZnFmYmNkZHZ1cWpmbWp1aW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjY0MTAsImV4cCI6MjA4MzAwMjQxMH0.B2BOuTx-PdT2LCtdOndbF4EoY-KPE4XMYnNHz4ZQUOo'

const supabaseUrl = 'https://jvfqfbcddvuqjfmjuimi.supabase.co'

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