'use client';
import {useEffect,useState} from 'react';
export default function ProductImageInput(){
 const [preview,setPreview]=useState('');
 const [error,setError]=useState('');
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 function change(e:React.ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];setError('');setPreview('');if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){e.target.value='';setError('Choose a JPG, PNG or WebP image.');return}if(file.size>5*1024*1024){e.target.value='';setError('Image must be 5 MB or smaller.');return}setPreview(URL.createObjectURL(file))}
 return <div><input className="field" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={change}/>{error&&<p className="error">{error}</p>}{preview&&<div className="image-preview"><img src={preview} alt="Selected product preview"/><span>Image preview — this is what will be uploaded</span></div>}</div>;
}
