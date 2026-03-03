import { useState } from "react";
import mediaUpload from "../utils/mediaUpload";

export default function Testing() {

  const [file, setFile] = useState(null);

  function uploadFile() {
    console.log(file);
    mediaUpload(file).then((url) => {
      console.log("File uploaded to URL:", url);
    }).catch((error) => {
      console.error("Upload failed:", error);
    });
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <input type="file" onChange={(e) => {setFile(e.target.files[0])}} ></input>
      
      <button className="w-[200px] h-[50px] bg-blue-500 text-white py-2 " onClick={uploadFile}> Upload </button>
    </div>
  );
}

