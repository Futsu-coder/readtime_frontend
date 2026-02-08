import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import { client } from "../client";

export function CreateNovel({ token }: {token:string}){
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState('Fantasy')
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [status, setStatus] = useState('')

    const navigate = useNavigate()

    const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(file){
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }
    const handlecreate = async() =>{
        setStatus('กำลังเตรียมร่างนิยาย')
        try{
            const res = await client.api.protected.novels.$post(
                {
                    json:{
                        title,
                        description: desc + `[หมวดหมู่: ${category}]`
                    }
                },
                { headers: {Authorization: `Bearer ${token}`}}
            )
            if (res.ok){
                setStatus('สร้างนิยายสำเร็จ')
                setTitle('')
                setDesc('')
                setImagePreview(null)
                alert('สร้างนิยายสำเร็จ')
                navigate('/my-novels')
            }
            else{
              if (res.status === 401) {
                alert("หมดเวลาใช้งาน กรุณาล็อกอินใหม่")
                localStorage.removeItem('token') 
                window.location.href = '/login'
              return
              }
              setStatus('เกิดข้อผิดพลาดอื่น')
            }
        }catch (err) {
            console.error('Error:'+err)
            setStatus('เชื่อมต่อ Server ไม่ได้')
        }
    }
    
    const containerStyle = {
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        maxWidth: '1000px',
        margin: '20px auto',
        fontFamily: "'Sarabun', sans-serif" 
    }

    const gridLayout = {
        display: 'grid',
        gridTemplateColumns: '250px 1fr', 
        gap: '30px',
        marginBottom: '30px'
    }

    const uploadBoxStyle = {
        border: '2px dashed #ddd',
        borderRadius: '10px',
        height: '350px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        position: 'relative' as const,
        overflow: 'hidden'
    }

    const inputGroupStyle = {
        marginBottom: '15px'
    }

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#333'
    }

    const inputStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px'
    }

    const rowStyle = {
        display: 'flex',
        gap: '15px'
    }
  return(
    <div style={containerStyle}>
      <h2 style={{borderBottom: '1px solid #eee' , paddingBottom:'10px',marginBottom:'20px'}}>
        เพิ่มการ์ตูนใหม่
      </h2>
      <div style={gridLayout}>
        <div>
          <label style={uploadBoxStyle}>
            {imagePreview ? (
              <img src={imagePreview} alt="Cover" style={{ width:'100%',height:'100%',objectFit:'cover'}} />
            ) : (
              <div style={{textAlign: 'center', color:'#888'}}>
                <p>อัปโหลดรูปภาพหน้าปก</p>
                <small style={{fontSize: '12px'}}>.jpg หรือ .png ขนาดไม่เกิน 2MB </small>
              </div>
            )}
            <input type="file" hidden onChange={handleimagechange} accept="image/*"/>
          </label>
        </div>
        <div>
          <div style={rowStyle}>
            <div style={{...inputGroupStyle, flex:1}}>
              <label style={labelStyle}>ชื่อเรื่อง</label>
              <input
                style={inputStyle}
                placeholder="ชื่อเรื่อง"
                value={title} onChange={e=>setTitle(e.target.value)}
              />
            </div>
            <div style={{...inputGroupStyle, flex:1}}>
              <label style={labelStyle}>ชื่อเรื่องต้นฉบับ</label>
              <input style={inputStyle} placeholder="ชื่อเรื่องภาษาอังกฤษ/ญี่ปุ่น..."disabled/>
            </div>
          </div>
            <div style={rowStyle}>
              <div style={{...inputGroupStyle,flex:1}}>
                <label style={labelStyle}>หมวดหมู่</label>
                <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Fantasy">แฟนตาซี</option>
                  <option value="Romance">โรแมนติก</option>
                  <option value="Action">แอคชั่น</option>
                  <option value="Horror">สยองขวัญ</option>
                </select>
              </div>
              <div style={{...inputGroupStyle, flex:1}}>
                <label style={labelStyle}>ระดับเนื้อหา</label>
                <select style={inputStyle}>
                  <option>ทั่วไป</option>
                  <option>13+</option>
                  <option>18+</option>
                </select>
              </div>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>เรื่องย่อ</label>
              <textarea
                style={{...inputStyle, height:'80px',resize:'none'}}
                placeholder="เรื่องย่อ"
                value={desc} onChange={e => setDesc(e.target.value)}
              />

            </div>
          </div>
        </div>
        <div style={{ marginTop:'20px'}}>
          <label style={labelStyle}>ข้อมูลเบื้องต้น</label>
        <div style={{ border: '1px solid #ddd', borderBottom: 'none', padding: '10px', background: '#f5f5f5', borderRadius: '4px 4px 0 0', display: 'flex', gap: '10px' }}>
           <button style={{ fontWeight: 'bold' }}>B</button>
           <button style={{ fontStyle: 'italic' }}>I</button>
           <button style={{ textDecoration: 'underline' }}>U</button>
           <span style={{ borderLeft: '1px solid #ccc', margin: '0 5px' }}></span>
           <button>แทรกรูปภาพ</button>
        </div>
        <textarea
          style={{ 
            width: '100%', 
            height: '200px', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '0 0 4px 4px',
            fontSize: '16px',
            lineHeight: '1.5'
          }}
          placeholder="เขียนเนื้อหานิยาย"
        />
      </div>
      <div style={{ marginTop: '30px', textAlign:'right'}}>
        <span style={{ marginRight: '15px', color: status.includes('สร้างสำเร็จ')? 'green':'red'}}>{status}</span>
        <button
          onClick={handlecreate}
          style={{
            padding:'12px 30px',
            background: '#007bff',
            color: 'white',
            border:'none',
            borderRadius:'5px',
            fontSize:'16px',
            cursor:'pointer'
          }}
        >
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  )
}