import { hc } from 'hono/client'

// ✅ ถูกต้อง: มีคำว่า type (เอามาแค่ลายแทง ไม่เอาโค้ดจริง)
import type { AppType } from '../../backend/src/index'

// ❌ ผิดมหันต์: ห้ามเอา app เข้ามา
// import { app, AppType } from '../../backend/src/index' 

export const client = hc<AppType>('http://localhost:8787')