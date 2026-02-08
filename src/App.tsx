// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Auth } from './Page/auth'
import { CreateNovel } from './Page/createNovel'
import { MyNovelsPage } from './Page/novelpage'
import { AddChapterPage } from './Page/addchapter'
import { Noveldetailpage } from './Page/noveldetail'
import { Readchapterpage } from './Page/readnovel'
import { EditNovelPage } from './Page/editnovel'

function App() {
  // เช็คว่ามี Token ไหม (แบบง่ายๆ)
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      {/* Navbar จะอยู่ทุกหน้า */}
      <Navbar />
      
      <div style={{ padding: 20 }}>
        <Routes>
          {/* หน้าแรก: ถ้าล็อกอินแล้วไปหน้าเขียน ถ้ายังให้ไป Login */}
          <Route path="/" element={token ? <Navigate to="/my-novels" /> : <Navigate to="/login" />} />
          
          {/* หน้า Login */}
          <Route path="/login" element={<Auth />} />
          
          {/* หน้าเขียนนิยาย (ส่ง token ไปให้ด้วย ถ้าไม่มีให้ string ว่าง) */}
          <Route path="/create" element={token ? <CreateNovel token={token} /> : <Navigate to="/login" />} />

          <Route path="/my-novels" element={token ? <MyNovelsPage /> : <Navigate to="/login" />} />

          <Route path="/novels/:id/chapters" element={token ? <AddChapterPage /> : <Navigate to="/login" />} />

          <Route path="/novels/:id" element={<Noveldetailpage/>}></Route>

          <Route path="/novels/:id/chapters/:chapterId" element={<Readchapterpage />} /> 

          <Route path="/novels/:id/editnovel/" element={token ? <EditNovelPage/> : <Navigate to="/login"/>} /> 
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App