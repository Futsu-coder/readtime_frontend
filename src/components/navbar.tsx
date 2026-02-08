// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token') // ลบกุญแจทิ้ง
    navigate('/login') // ดีดไปหน้า Login
    window.location.reload() // รีเฟรชหน้าจอ 1 ทีเพื่อให้ Navbar อัปเดตสถานะ
  }

  // ฟังก์ชันเช็คตัวตน (เอาไว้แก้บั๊ก Token ผี)
//   const handleCheckUser = async () => {
//     if (!token) return alert('ไม่มี Token (ยังไม่ได้ล็อกอิน)')

//     try {
//       // ยิงไปถาม Backend ว่า "ฉันคือใคร?"
//       // (ต้องแนบ headers: Authorization ไปด้วยนะ)
//       const res = await client.api.me.$get(
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
      
//       const data = await res.json()
      
//       if (res.ok) {
//         // ถ้าปกติ: จะโชว์ ID และชื่อ
//         // ใช้ (data as any) เพื่อข้ามการตรวจ Type ชั่วคราว
//         const user = (data as any).user
//         alert(`✅ สถานะปกติ!\nUser ID: ${user.id}\nUsername: ${user.username}`)
//         console.log('User Info:', user)
//       } else {
//         // ถ้าผิดปกติ: (เช่น 404 User not found)
//         const errorMsg = (data as any).error
//         alert(`❌ ผิดปกติ: ${errorMsg}\n\nสาเหตุ: Token อาจจะเก่าเกินไป หรือ Database ถูกล้าง\nแนะนำ: กด Logout แล้วสมัครใหม่`)
//       }
//     } catch (err) {
//       alert('❌ เชื่อมต่อ Server ไม่ได้ (Backend อาจจะยังไม่เปิด)')
//       console.error(err)
//     }
//   }

  // --- Styles (CSS ตกแต่งแถบเมนู) ---
  const navStyle = {
    padding: '15px 20px',
    background: '#333',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  }

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px'
  }

  const buttonStyle = {
    marginLeft: 'auto', // ดันปุ่มไปชิดขวาสุด
    display: 'flex',
    gap: '10px'
  }

  const actionBtnStyle = {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }

  return (
    <nav style={navStyle}>
      {/* โลโก้ / หน้าแรก */}
      <Link to="/" style={{ ...linkStyle, fontSize: '20px', color: '#ffd700' }}>
        🏠 NovelApp
      </Link>
      
      {token ? (
        // --- กรณีล็อกอินแล้ว (มี Token) ---
        <>
          <Link to="/my-novels" style={linkStyle}>📚 นิยายของฉัน</Link>
          <Link to="/create" style={{ ...linkStyle, color: '#90caf9' }}>✍️ เขียนเรื่องใหม่</Link>
          
          <div style={buttonStyle}>
            {/* ปุ่มเช็ค ID (Debug) */}
            {/* <button 
              onClick={handleCheckUser} 
              style={{ ...actionBtnStyle, background: '#6c757d', color: 'white' }}
              title="กดเพื่อเช็คว่า Token ยังใช้ได้ไหม"
            >
              🔍 เช็ค ID
            </button> */}

            {/* ปุ่ม Logout */}
            <button 
              onClick={handleLogout} 
              style={{ ...actionBtnStyle, background: '#dc3545', color: 'white' }}
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        // --- กรณีคนทั่วไป (ยังไม่ล็อกอิน) ---
        <Link to="/login" style={{ ...linkStyle, marginLeft: 'auto' }}>
          🔐 เข้าสู่ระบบ
        </Link>
      )}
    </nav>
  )
}