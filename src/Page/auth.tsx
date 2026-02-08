import { useState } from 'react'
// ลบ useNavigate ออก เพราะเราใช้ window.location.href แทนแล้ว
import { client } from '../client'

// 1. สร้าง "แม่พิมพ์" (Interface) เพื่อบอกว่า Server จะส่งอะไรมาบ้าง
// วิธีนี้ถูกต้องตามหลัก TypeScript 100% ไม่โดนด่าเรื่อง any แน่นอน
interface ApiResponse {
  message?: string
  token?: string
  error?: string
}

export function Auth() {
  // ลบ const navigate = useNavigate() ออก
  
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (!username.trim() || !password.trim()){
      setMessage('กรอกข้อมูลไม่ข้อมูลไม่ครบ')
      setLoading(false)
      return
    }
    try {
      if (isLoginMode) {
        // --- โหมด Login ---
        const res = await client.api.login.$post({
          json: { username, password }
        })
        // 2. แปลงร่างข้อมูลด้วยแม่พิมพ์ที่เราสร้างไว้ (as ApiResponse)
        const data = await res.json() as ApiResponse
        if (res.ok && data.token) {
          localStorage.setItem('token', data.token)
          alert('🎉 ยินดีต้อนรับกลับมาครับ!')
          window.location.href = '/' // ใช้ตัวนี้รีเฟรชหน้า ไม่ต้องใช้ navigate
        } else {
          // 3. ทีนี้เรียกใช้ .error ได้เลย แบบถูกกฎระเบียบ
          setMessage(`❌ ${data.error || 'รหัสผ่านผิด'}`)
        }
      } else {
        // --- โหมด Register ---
        const res = await client.api.register.$post({
          json: { username, password }
        })        
        // แปลงร่างเหมือนกัน
        const data = await res.json() as ApiResponse
        if (res.ok) {
          alert('✅ สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน')
          setIsLoginMode(true)
          setMessage('')
        } else {
          setMessage(`❌ ${data.error || 'เกิดข้อผิดพลาด'}`)
        }
      }
    } catch (err) {
      console.log(err)
      setMessage('❌ เชื่อมต่อ Server ไม่ได้')
    } finally {
      setLoading(false)
    }
  }

  // ... (ส่วน return HTML ด้านล่าง ใช้ของเดิมได้เลยครับ ไม่ต้องแก้) ...
  const containerStyle = { maxWidth: '400px', margin: '50px auto', padding: '30px', textAlign: 'center' as const, border: '1px solid #ddd', borderRadius: '8px' }
  const inputStyle = { width: '100%', padding: '10px', margin: '5px 0' }

  return (
    <div style={containerStyle}>
       <h2>{isLoginMode ? '🔐 เข้าสู่ระบบ' : '📝 สมัครสมาชิก'}</h2>
       <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
       <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
       
       <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 10, padding: 10, width: '100%' }}>
         {loading ? '...' : (isLoginMode ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')}
       </button>
       
       <p style={{ color: 'red' }}>{message}</p>
       
       <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsLoginMode(!isLoginMode)}>
         {isLoginMode ? 'ยังไม่มีบัญชี? สมัครที่นี่' : 'มีบัญชีแล้ว? ล็อกอิน'}
       </p>
    </div>
  )
}