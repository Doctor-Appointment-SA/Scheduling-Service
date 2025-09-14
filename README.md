# 📌 Appointment Service

บริการ **Appointment Service** ทำหน้าที่จัดการเกี่ยวกับการนัดหมายในระบบ เช่น  
- การนัดหมอของคนไข้  
- การยกเลิกหรือแก้ไขการนัดหมาย  
- การตรวจสอบสถานะของการนัด  

พัฒนาโดยใช้ **NestJS**, **Prisma ORM**, และ **PostgreSQL** เพื่อความเสถียรและขยายต่อได้ง่าย  

---

## ✨ Features  

- 📅 **คนไข้นัดหมอ**: สร้างการนัดหมายใหม่ (เลือกหมอ, วัน-เวลา, สถานะ)  COMPLETE
- 🔄 **จัดการนัดหมาย**: แก้ไข/ยกเลิกการนัดที่มีอยู่แล้ว  
- 📊 **ตรวจสอบสถานะนัด**: ดูรายละเอียดการนัด เช่น Pending, Confirmed, Cancelled  

---

## ⚙️ Project Setup  

Clone โปรเจกต์และติดตั้ง dependencies  

```bash
git clone https://github.com/Doctor-Appointment-SA/Scheduling-Service.git
cd Scheduling-Service

npm install
npx prisma generate
```

---

## ▶️ Running the Project  

### Development  
```bash
npm run start
```

### Watch mode (Auto-reload)  
```bash
npm run start:dev
```

### Production  
```bash
npm run build
npm run start:prod
```

---

## 📡 Example API Endpoints  

### Create Appointment  
```http
POST /appointment
Content-Type: application/json

{
  "patient_id": "uuid",
  "doctor_id": "uuid",
  "appoint_date": "2025-09-11T15:00:00.000Z",
  "status": "Pending"
}
```

### Get Appointments  
```http
GET /appointment
```

---

## 🛠️ Tech Stack  

- **Backend Framework**: NestJS  
- **ORM**: Prisma  
- **Database**: PostgreSQL  
- **Runtime**: Node.js  
