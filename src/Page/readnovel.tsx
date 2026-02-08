import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { client } from "../client";

interface ChapterContent{
    id:number
    title:string
    content:string
}

interface ReadChapterResponse{
    chapter:ChapterContent
    error?:string
}

export function Readchapterpage(){
    const {id,chapterId} = useParams()
    const [chapter, setChapters] = useState<ChapterContent | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchChapter = async () => {
            if (!id || !chapterId) return
            try {
                const token = localStorage.getItem('token')
                const res = await client.api.protected.novels[':id'].chapters[':chapterID'].$get(
                    { param: {id:id,chapterID:chapterId}},
                    {headers: {Authorization: `Bearer ${token}`}}
                )
                const data = await res.json() as unknown as ReadChapterResponse
                
                if (res.ok){
                    setChapters(data.chapter)
                }
                else{
                    if (res.status === 401) {
                        alert("หมดเวลาใช้งาน กรุณาล็อกอินใหม่")
                        localStorage.removeItem('token') 
                        window.location.href = '/login'
                    return
                    }
                setError('เกิดข้อผิดพลาดอื่น')
                }
            }catch(err){
                console.error('Connection Error: ',err)
                setError('เชื่อมต่อ Server ไม่ได้')
            }
        }
        fetchChapter()
    },[id, chapterId])
    if (error) return <div className="error-message">{error}</div>
    if (!chapter) return <div className="loading">กำลังโหลดเนื้อหา...</div>
    return (
        <div className="read-chapter-page">
        {/* ส่วนนำทาง (Navigation) */}
        <nav className="chapter-nav">
            <Link to={`/novels/${id}`}>&larr; กลับไปสารบัญ</Link>
        </nav>

        {/* ส่วนเนื้อหาหลัก (Article) */}
        <article className="chapter-content-area">
            <header className="chapter-header">
            <h1>{chapter.title}</h1>
            </header>
            
            {/* สำคัญ! ใช้ pre-wrap เพื่อให้การเว้นบรรทัดเหมือนที่พิมพ์มา */}
            <div className="chapter-body" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {chapter.content}
            </div>
        </article>

        {/* ส่วนท้าย (Footer) */}
        <footer className="chapter-footer">
            <Link to={`/novels/${id}`}>กลับหน้ารวม</Link>
        </footer>
        </div>
    )
}