import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { client } from "../client";

interface Novel{
    id:number
    title:string
    description: string
    category: string
    owner_id: number
}
interface NovelResponse{
    novel: Novel
}

export function EditNovelPage(){
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("General")
    const [isloading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNovel = async () => {
            if (!id) return
            try{
                const token = localStorage.getItem('token')
                const res = await client.api.protected.novels[':id'].$get(
                    { param: { id }},
                    { headers: { Authorization: `Bearer ${token}`}}
                )
                if (res.ok){
                    const data = await res.json() as unknown as NovelResponse
                    const novel = data.novel
                    
                    setTitle(novel.title)
                    setDescription(novel.description)
                    setCategory(novel.category || 'General')
                }else{
                    alert('ไม่พบนิยาย')
                    navigate('/my-novels')
                }
            }catch(err){
                console.error(err)
                alert('เชื่อมต่อ Server ไม่ได้')
            }finally{
                setIsLoading(false)
            }

        }
        fetchNovel()
    },[id, navigate])
    const handleSave = async () => {
        if (!title) return alert('กรุณกรอกชื่อเรื่อง')
        try {
            const token = localStorage.getItem('token')
            const res = await client.api.protected.novels[':id'].$put(
            {    
                param: { id: id! },
                json: { title,description,category}
            },
            {headers : { Authorization: `Bearer ${token}`}}
        )
        if(res.ok){
            alert("บันทึกการแก้ไขสำเร็จ")
            navigate('/my-novels')
        }else{
            alert("บันทึกไม่สำเร็จ")
        }
        }catch(err){
            console.error(err)
            alert("เกิดข้อผิดพลาด")
        }
    }
    
    const handleDelete = async () => {
        const confrimDelete = confirm("คุณต้องการลบนิยายเรื่องนี้ใช้ไหม?")
        if(!confrimDelete)return
    
    try{
        const token = localStorage.getItem('token')
        const res = await client.api.protected.novels[':id'].$delete(
            { param: { id:id! }},
            {headers: { Authorization: `Bearer ${token}`}}
        )
        if(res.ok){
            alert("ลบนิยายเรียบร้อย")
            navigate('/my-novels')
        }else{
            alert("ลบไม่สำเร็จ")
        }
    }catch(err){
        console.error(err)
    }
}
    const containerStyle = { maxWidth: '600px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
    const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }
    const inputStyle = { width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }
    const buttonBase = { padding: '10px 25px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }

    if (isloading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>✏️ แก้ไขนิยาย</h2>
                <Link to="/my-novels" style={{ textDecoration: 'none', color: '#666' }}>❌ ยกเลิก</Link>
            </div>

            <div>
                <label style={labelStyle}>ชื่อเรื่อง</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    style={inputStyle} 
                />

                <label style={labelStyle}>หมวดหมู่</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)} 
                    style={inputStyle}
                >
                    <option value="General">ทั่วไป (General)</option>
                    <option value="Fantasy">แฟนตาซี (Fantasy)</option>
                    <option value="Romance">รักโรแมนติก (Romance)</option>
                    <option value="Horror">สยองขวัญ (Horror)</option>
                    <option value="Action">แอ็กชัน (Action)</option>
                </select>

                <label style={labelStyle}>เรื่องย่อ / คำโปรย</label>
                <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    style={{ ...inputStyle, height: '120px', resize: 'vertical', fontFamily: 'sans-serif' }} 
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <button 
                    onClick={handleDelete}
                    style={{ ...buttonBase, background: '#fff0f0', color: '#dc3545', border: '1px solid #ffcccc' }}
                >
                    🗑️ ลบนิยาย
                </button>

                <button 
                    onClick={handleSave}
                    style={{ ...buttonBase, background: '#007bff', color: 'white' }}
                >
                    💾 บันทึกการเปลี่ยนแปลง
                </button>
            </div>
        </div>
    )
}