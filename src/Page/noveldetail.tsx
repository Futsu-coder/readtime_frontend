import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom'
import { client } from "../client";

interface Novel{
    id: number;
    title: string;
    description: string;
    category: string;
    owner_id: number;
}
interface Chapter{
    id: number;
    title: string;
    created_at:string;
}
interface NoveldetailResponse{
    novel:Novel;
    chapters:Chapter[];
}

export function Noveldetailpage(){
    const { id } = useParams()
    const [novel, setNovel] = useState<Novel | null>(null)
    const [chapters, setChapters] = useState<Chapter[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await client.api.protected.novels[':id'].$get(
                    { param: { id:id! }},
                    { headers: { authorization:`Bearer ${token}`}}
                )
                const data = await res.json() as unknown as NoveldetailResponse
                if (res.ok){
                    setNovel(data.novel || {})
                    setChapters(data.chapters || [])
                }
            }catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [id])

    if (!novel) return <div>Loading....</div>
    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
        {/* ส่วนหัว: ข้อมูลนิยาย */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h1>{novel.title}</h1>
            <p style={{ color: '#666', marginTop: '10px' }}>{novel.description}</p>
            <div style={{ marginTop: '15px' }}>
                <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    หมวดหมู่: {novel.category}
                </span>
            </div>
        </div>

        {/* ส่วนสารบัญ: รายการตอน */}
        <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', display: 'inline-block' }}>
            สารบัญตอน ({chapters?.length || []})
        </h3>
        
        <div style={{ marginTop: '20px' }}>
            {chapters.length === 0 ? <p>ยังไม่มีตอน</p> : null}
            
            {chapters.map((chapter) => (
            <Link 
                key={chapter.id} 
                to={`/novels/${id}/chapters/${chapter.id}`} // ลิงก์ไปหน้าอ่าน
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <div style={{ 
                padding: '15px', 
                background: 'white', 
                borderBottom: '1px solid #eee', 
                display: 'flex', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: '0.2s',
                color:'red'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                <span style={{ fontWeight: 'bold' }}>📄 {chapter.title}</span>
                <span style={{ fontSize: '12px', color: '#ff0000' }}>
                    {new Date(chapter.created_at).toLocaleDateString('th-TH')}
                </span>
                </div>
            </Link>
            ))}
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link to={`/novels/${id}/chapters`}>
                <button style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    + เขียนตอนใหม่เพิ่ม
                </button>
            </Link>
        </div>
        </div>
    )
}