import { useState } from "react";

export default function ImageSlider(props) {

    const images = props.images;
    const [selectedImage, setSelectedImage] = useState(images[0]);
        
    return (
        <div className="w-full h-full flex flex-col gap-6 p-4">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100">
                <img 
                    className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105" 
                    src={selectedImage} 
                    alt="Product Image" 
                />
            </div>
            <div className="w-full flex justify-center gap-3 pb-4">
                {
                    images.map((image, index) => (
                        <div 
                            key={index} 
                            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-110 ${
                                image === selectedImage 
                                    ? "ring-4 ring-accent shadow-lg scale-105" 
                                    : "opacity-70 hover:opacity-100 shadow-md"
                            }`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img 
                                className="w-[120px] h-[120px] object-cover" 
                                src={image} 
                                alt={`Thumbnail ${index + 1}`}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
