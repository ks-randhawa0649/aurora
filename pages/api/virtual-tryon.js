import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse form data with proper options
        const form = formidable({ 
            multiples: false,
            keepExtensions: true,
        });
        
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        // Handle both old and new formidable versions
        const userImageFile = files.userImage?.[0] || files.userImage;
        let productImageUrl = Array.isArray(fields.productImage) 
            ? fields.productImage[0] 
            : fields.productImage;

        console.log('Files received:', files);
        console.log('User image file:', userImageFile);
        console.log('Product URL (original):', productImageUrl);

        if (!userImageFile || !productImageUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required images' 
            });
        }

        // Convert relative URL to absolute URL
        if (productImageUrl.startsWith('/')) {
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const host = req.headers.host;
            productImageUrl = `${protocol}://${host}${productImageUrl}`;
            console.log('Product URL (converted to absolute):', productImageUrl);
        }

        // Get the correct file path
        const filePath = userImageFile.filepath || userImageFile.path;
        
        if (!filePath) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid file upload' 
            });
        }

        // Verify file exists
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Uploaded file not found' 
            });
        }

        // Read the user image and convert to base64
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = imageBuffer.toString('base64');
        const userImageBase64 = `data:${userImageFile.mimetype || 'image/jpeg'};base64,${base64Image}`;

        console.log('User image converted to base64');

        // Download and convert product image to base64
        console.log('Downloading product image from:', productImageUrl);
        const productImageResponse = await fetch(productImageUrl);
        
        if (!productImageResponse.ok) {
            throw new Error(`Failed to download product image: ${productImageResponse.status} ${productImageResponse.statusText}`);
        }

        const productImageBuffer = await productImageResponse.buffer();
        const productContentType = productImageResponse.headers.get('content-type') || 'image/jpeg';
        const productImageBase64 = `data:${productContentType};base64,${productImageBuffer.toString('base64')}`;
        console.log('Product image converted to base64');

        console.log('Calling FASHN API...');

        // Check API key
        if (!process.env.FASHN_API_KEY) {
            return res.status(401).json({ 
                success: false, 
                error: 'FASHN_API_KEY not configured' 
            });
        }

        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
        };

        // Prepare JSON payload for FASHN API
        const payload = {
            model_name: "tryon-v1.6",
            inputs: {
                model_image: userImageBase64,
                garment_image: productImageBase64,
                mode: "quality", // "quality" or "balanced"
                category: "auto", // Changed to "bottoms" since it's pants
            },
        };

        // Call FASHN API
        const fashnResponse = await fetch('https://api.fashn.ai/v1/run', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        if (!fashnResponse.ok) {
            const errorText = await fashnResponse.text();
            console.error('FASHN API error:', errorText);
            throw new Error(errorText || 'FASHN API error');
        }

        const fashnData = await fashnResponse.json();
        console.log('FASHN API response status:', fashnResponse.status);
        console.log('FASHN API response:', JSON.stringify(fashnData, null, 2));

        // Clean up temporary file
        try {
            fs.unlinkSync(filePath);
        } catch (cleanupError) {
            console.error('File cleanup error:', cleanupError);
        }

        const jobId = fashnData.id;
        if (!jobId) {
            throw new Error('No job ID returned from FASHN API');
        }

        console.log('Job queued with ID:', jobId);

        // Poll for result
        const resultImage = await pollForResult(jobId, headers);
        
        return res.status(200).json({
            success: true,
            resultImage: resultImage,
        });

    } catch (error) {
        console.error('Virtual try-on error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process try-on',
        });
    }
}

// Helper function to poll for async results
async function pollForResult(jobId, headers, maxAttempts = 30) {
    const t0 = Date.now();
    const timeoutMs = 90_000; // 90 seconds
    
    let attempt = 0;
    while (Date.now() - t0 < timeoutMs) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        
        try {
            const response = await fetch(`https://api.fashn.ai/v1/status/${jobId}`, {
                headers,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Polling request failed with status: ${response.status}`);
                console.error('Error response:', errorText);
                continue;
            }

            const data = await response.json();
            console.log(`Polling attempt ${attempt} (${Math.round((Date.now() - t0) / 1000)}s):`, JSON.stringify(data, null, 2));
            
            // Check for completed status
            if (data.status === 'completed') {
                // data.output can be an array of URLs or a single URL
                const resultUrl = Array.isArray(data.output) ? data.output[0] : data.output;
                console.log('Job completed! Result URL:', resultUrl);
                return resultUrl;
            }
            
            // Check for failed status
            if (data.status === 'failed') {
                const errorMessage = data.error?.message || JSON.stringify(data.error || data);
                console.error('FASHN job failed with error:', errorMessage);
                throw new Error(`FASHN processing failed: ${errorMessage}`);
            }
            
            // Continue polling if status is 'processing', 'queued', or 'starting'
            console.log(`Status: ${data.status}, continuing to poll...`);
            
        } catch (err) {
            console.error(`Polling error on attempt ${attempt}:`, err.message);
            console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
            
            // If it's the last iteration or timeout, throw the error
            if (Date.now() - t0 >= timeoutMs) {
                throw new Error('Timeout waiting for FASHN result after 90 seconds');
            }
            // Otherwise continue polling
        }
    }
    
    throw new Error('Timeout waiting for FASHN result after 90 seconds');
}