import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { client } from "../client"

// ประกาศ Type ให้ชัดเจน
interface Novel {
    id: number
    title: string
    category: string
    created_at: string
    description: string
}

export function MyNovelsPage() {
    const [novels, setNovels] = useState<Novel[]>([])
    const [loading, setLoading] = useState(true)

    // 1. ดึงข้อมูลนิยายทั้งหมด (เฉพาะของฉัน)
    useEffect(() => {
        const fetchMyNovels = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await client.api.protected.novels.$get(
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                
                if (res.ok) {
                    const data = await res.json()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setNovels((data as any).novels)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchMyNovels()
    }, [])

    // 2. ฟังก์ชันลบนิยาย
    const handleDelete = async (id: number, title: string) => {
        const confirmDelete = confirm(`⚠️ คุณแน่ใจไหมว่าจะลบเรื่อง "${title}" ?\n(ลบแล้วกู้คืนไม่ได้นะ!)`)
        if (!confirmDelete) return

        try {
            const token = localStorage.getItem('token')
            const res = await client.api.protected.novels[':id'].$delete(
                { param: { id: id.toString() } },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (res.ok) {
                // ลบออกจาก State ทันที (หน้าจอจะอัปเดตเองโดยไม่ต้อง Refresh)
                setNovels(prev => prev.filter(n => n.id !== id))
                alert("🗑️ ลบเรียบร้อย")
            } else {
                alert("ลบไม่สำเร็จ")
            }
        } catch (err) {
            console.error(err)
            alert("เชื่อมต่อ Server ไม่ได้")
        }
    }

    // --- Styles (ตกแต่งให้ดูดี) ---
    const pageStyle = { maxWidth: '800px', margin: '40px auto', padding: '20px' }
    const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }
    
    // การ์ดนิยาย
    const cardStyle = { 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
        marginBottom: '15px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        border: '1px solid #eee',
        transition: '0.2s'
    }

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>

    return (
        <div style={pageStyle}>
            {/* Header ส่วนบน */}
            <div style={headerStyle}>
                <div>
                    <h1 style={{ color: '#6a4c93', margin: 0 }}>Writing ✏️</h1>
                    <p style={{ color: '#666', margin: '5px 0 0 0' }}>จัดการงานเขียนของคุณ</p>
                </div>
                <div style={{ background: '#f0f0f0', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', color: '#666' }}>
                    ทั้งหมด <strong>{novels.length}</strong> เรื่อง
                </div>
            </div>

            {/* รายการนิยาย */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '16px', minHeight: '300px' }}>
                
                {novels.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <p>ยังไม่มีงานเขียนเลย...</p>
                        <p>เริ่มต้นสร้างจินตนาการของคุณได้ที่ปุ่มด้านล่าง 👇</p>
                    </div>
                ) : null}

                {novels.map((novel) => (
                    <div key={novel.id} style={cardStyle}>
                        {/* ส่วนข้อมูล (ซ้าย) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                            {/* รูปปกจำลอง */}
                            <div style={{ 
                                width: '60px', 
                                height: '80px', 
                                background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', 
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                📖
                            </div>
                            
                            <div>
                                <Link to={`/novels/${novel.id}`} style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333', textDecoration: 'none', display: 'block' }}>
                                    {novel.title}
                                </Link>
                                <span style={{ fontSize: '0.8rem', background: '#eee', padding: '2px 8px', borderRadius: '4px', color: '#666', marginTop: '5px', display: 'inline-block' }}>
                                    {novel.category}
                                </span>
                            </div>
                        </div>

                        {/* ส่วนปุ่มจัดการ (ขวา) */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* ปุ่มแก้ไข */}
                            <Link to={`/novels/${novel.id}/editnovel`}>
                                <button style={{ 
                                    padding: '8px 15px', 
                                    background: '#fff', 
                                    border: '1px solid #ddd', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    color: '#555',
                                    fontSize: '0.9rem'
                                }}>
                                    ✏️ แก้ไข
                                </button>
                            </Link>

                            {/* ปุ่มลบ */}
                            <button 
                                onClick={() => handleDelete(novel.id, novel.title)}
                                style={{ 
                                    padding: '8px 12px', 
                                    background: '#fff', 
                                    border: '1px solid #ffcccc', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    color: '#dc3545',
                                    fontSize: '0.9rem'
                                }}
                                title="ลบนิยาย"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ปุ่มเพิ่มงานเขียน (Floating Button แบบเท่ๆ) */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link to="/create">
                    <button style={{ 
                        background: 'linear-gradient(90deg, #d084ff 0%, #a066ff 100%)', 
                        color: 'white', 
                        padding: '12px 40px', 
                        fontSize: '1.1rem',
                        border: 'none', 
                        borderRadius: '30px', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(160, 102, 255, 0.4)',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s'
                    }}>
                        + เพิ่มงานเขียนใหม่
                    </button>
                </Link>
            </div>
        </div>
    )
}