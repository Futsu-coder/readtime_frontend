import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { client } from "../client"

export function AddChapterPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    // 1. แก้ useState (ตัวพิมพ์ใหญ่) ให้ถูกต้อง
    const [novelTitle, setNovelTitle] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [status, setStatus] = useState('')

    // 2. useEffect แบบสะอาด (ดึงชื่อนิยายมาโชว์)
    useEffect(() => {
        const fetchNovelInfo = async () => {
            if (!id) return
            try {
                const token = localStorage.getItem('token')
                // ยิง API ดึงข้อมูลนิยาย
                const res = await client.api.protected.novels[':id'].$get(
                    { param: { id } },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = await res.json()
                
                if (res.ok) {
                    // ใช้ as any เพื่อข้ามการตรวจ Type ชั่วคราว
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setNovelTitle((data as any).novel.title)
                }
            } catch (err) {
                console.error('โหลดข้อมูลนิยายไม่สำเร็จ', err)
            }
        }
        fetchNovelInfo()
    }, [id])

    // 3. ฟังก์ชันบันทึก (แก้เรื่อง as any และ eslint ให้แล้ว)
    const handleSave = async () => {
        if (!title || !content) return alert('กรุณากรอกข้อมูลให้ครบ')
        
        setStatus('กำลังบันทึก...')
        try {
            const token = localStorage.getItem('token')

            // สร้างตัวแปรข้อมูลที่จะส่ง
            const payload = {
                param: { id: id! },
                json: { title, content }
            }

            // ส่งข้อมูลไป Backend (ใส่ comment ปิด error สีแดงให้แล้ว)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const res = await client.api.protected.novels[':id'].chapters.$post(payload as any, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                alert('✅ เพิ่มตอนใหม่สำเร็จ!')
                navigate(`/novels/${id}`)
            } else {
                const data = await res.json()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setStatus(`❌ ${(data as any).error}`)
            }
        } catch (err) {
            console.error(err)
            setStatus('❌ เชื่อมต่อ Server ไม่ได้')
        }
    }

    // --- ส่วนแสดงผล (UI) ---
    const containerStyle = { maxWidth: '800px', margin: '20px auto', padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }
    const textareaStyle = { ...inputStyle, height: '400px', resize: 'vertical' as const, fontFamily: 'Sarabun, sans-serif' }

    return (
        <div style={containerStyle}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                ✍️ เขียนตอนใหม่ <span style={{ fontSize: '0.6em', color: '#666' }}>({novelTitle || 'กำลังโหลด...'})</span>
            </h2>

            <label style={{ fontWeight: 'bold' }}>ชื่อตอน:</label>
            <input
                placeholder="เช่น ตอนที่ 1: การเริ่มต้น (Chapter 1)"
                value={title} onChange={e => setTitle(e.target.value)}
                style={inputStyle}
            />

            <label style={{ fontWeight: 'bold' }}>เนื้อหา:</label>
            <textarea
                placeholder="พิมพ์นิยายของคุณลงที่นี่..."
                value={content} onChange={e => setContent(e.target.value)}
                style={textareaStyle}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: status.includes('❌') ? 'red' : 'green' }}>{status}</span>

                <div>
                    <button onClick={() => navigate('/my-novels')} style={{ padding: '10px 20px', marginRight: '10px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ยกเลิก</button>
                    <button onClick={handleSave} style={{ padding: '10px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>บันทึกตอน</button>
                </div>
            </div>
        </div>
    )
}