# Requirement Document: AD Sync, SharePoint Online, Web SSO

## วัตถุประสงค์ (Objective)

เอกสารนี้สรุป Requirement และแนวทางการดำเนินงาน (Implementation Approach) สำหรับ 3 งานหลัก โดยแบ่งความรับผิดชอบระหว่างทีม **Infra** และทีม **Developer**:

1. เชื่อมต่อ Active Directory (On-Premise) Sync กับ Entra ID (Microsoft 365)
2. เชื่อมต่อกับ SharePoint Online
3. Web Application Login ด้วย SSO (Single Sign-On)

---

## ภาพรวมความรับผิดชอบ (Ownership Overview)

| งาน | ทีม Infra | ทีม Developer |
|---|---|---|
| 1. AD On-Prem Sync → Entra ID | เจ้าของหลัก (Owner) | ไม่เกี่ยวข้องโดยตรง / รับผลลัพธ์ไปใช้ |
| 2. SharePoint Online Integration | เตรียม Tenant/Permission | เจ้าของหลัก (Owner) — พัฒนาการเชื่อมต่อ |
| 3. Web Application SSO | เตรียม Identity Provider (Entra ID App Registration) | เจ้าของหลัก (Owner) — Implement Auth Flow |

---

## 1. เชื่อมต่อ AD On-Premise Sync กับ Entra ID (M365)

### เป้าหมาย
ให้ผู้ใช้งานใน Active Directory (On-Premise) สามารถ Sync บัญชีผู้ใช้ไปยัง Entra ID เพื่อใช้งานร่วมกับบริการ Microsoft 365 และเป็นฐาน Identity กลางสำหรับระบบอื่น ๆ

### แนวทางการดำเนินงาน
- ใช้ **Microsoft Entra Connect Sync** (เดิมชื่อ Azure AD Connect) ติดตั้งบน Server ภายในองค์กรที่สามารถเชื่อมต่อกับ Domain Controller ได้
- กำหนดรูปแบบ Sync: Password Hash Synchronization (PHS) หรือ Pass-through Authentication (PTA) ตามนโยบายความปลอดภัยขององค์กร
- กำหนด OU (Organizational Unit) ที่ต้องการ Sync เพื่อจำกัดขอบเขตบัญชีที่ถูกส่งขึ้น Entra ID
- ตั้งค่า Attribute Mapping (เช่น UPN, email, department) ให้ตรงกับความต้องการของระบบปลายทาง

### หน้าที่ทีม Infra
- จัดเตรียม Server/VM สำหรับติดตั้ง Entra Connect Sync
- ตรวจสอบ Network/Firewall ให้เชื่อมต่อ Entra ID ได้ (outbound HTTPS 443)
- ติดตั้งและตั้งค่า Entra Connect Sync (Sync Rules, Filtering, Scheduler)
- ตั้งค่า UPN Suffix ให้ตรงกับ Domain ที่ Verify บน Microsoft 365
- ทดสอบ Sync Cycle และตรวจสอบ Sync Errors ผ่าน Entra Connect Health
- กำหนดสิทธิ์ Admin Role ที่เกี่ยวข้อง (Hybrid Identity Administrator)
- วางแผน Disaster Recovery / Staging Server สำหรับ Entra Connect

### หน้าที่ทีม Developer
- ไม่ได้เป็นผู้ดำเนินการหลัก แต่ต้องทราบ Attribute ที่จะได้จาก Entra ID (เช่น `userPrincipalName`, `objectId`, `mail`) เพื่อใช้ในการ Map ผู้ใช้กับระบบ Application
- ตรวจสอบร่วมกับทีม Infra ว่า Attribute ที่ Sync มาเพียงพอสำหรับ Business Logic ของแอปพลิเคชัน (เช่น Role, Department)

### Dependencies / Prerequisites
- Domain ต้อง Verify บน Microsoft 365 Admin Center แล้ว
- มีสิทธิ์ Global Administrator / Hybrid Identity Administrator บน Entra ID

---

## 2. เชื่อมต่อกับ SharePoint Online

### เป้าหมาย
ให้ Web Application สามารถอ่าน/เขียนข้อมูลกับ SharePoint Online (เช่น Document Library, List) ได้อย่างปลอดภัย

### แนวทางการดำเนินงาน
- ลงทะเบียน **App Registration** บน Microsoft Entra ID สำหรับใช้เรียก SharePoint Online ผ่าน Microsoft Graph API หรือ SharePoint REST API
- เลือกรูปแบบ Authentication:
  - **App-Only Authentication** (Client Credentials + Certificate/Secret) สำหรับงาน Background/Service-to-Service
  - **Delegated Permission** (On-Behalf-Of user) สำหรับงานที่ต้องอิงสิทธิ์ของผู้ใช้ที่ Login
- กำหนด API Permission ที่จำเป็น เช่น `Sites.Read.All`, `Sites.ReadWrite.All` (Application หรือ Delegated ตามความเหมาะสม)
- ทีม Developer เรียกใช้งานผ่าน Microsoft Graph SDK หรือ PnP Core SDK

### หน้าที่ทีม Infra
- สร้าง App Registration บน Entra ID และมอบสิทธิ์ (Admin Consent) สำหรับ API Permission ที่ทีม Developer ร้องขอ
- จัดเตรียม Site Collection / Document Library บน SharePoint Online และกำหนดสิทธิ์การเข้าถึง (Site Permission)
- จัดการ Client Secret / Certificate rotation และ Key Vault สำหรับเก็บ Credential
- Monitor การใช้งาน API Throttling (Microsoft Graph/SharePoint throttling limits)

### หน้าที่ทีม Developer
- พัฒนาโมดูลเชื่อมต่อ SharePoint Online ผ่าน Microsoft Graph API/PnP SDK
- Implement การอ่าน/เขียนไฟล์หรือ List Item ตาม Business Requirement
- จัดการ Token Caching และ Error Handling (เช่น 429 Throttling, Token Expiry)
- เก็บ Client Secret/Certificate ไว้ใน Configuration ที่ปลอดภัย (เช่น Azure Key Vault, User Secrets) ห้าม Hard-code ในซอร์สโค้ด

### Dependencies / Prerequisites
- App Registration พร้อม Client ID / Tenant ID / Secret หรือ Certificate
- Admin Consent สำหรับ API Permission ที่ร้องขอ

---

## 3. Web Application Login SSO

### เป้าหมาย
ให้ผู้ใช้งาน Login เข้าสู่ Web Application ด้วยบัญชี Entra ID เดียวกับที่ใช้งาน Microsoft 365 (Single Sign-On) โดยไม่ต้องสร้างบัญชีแยก

### แนวทางการดำเนินงาน
- ลงทะเบียน **App Registration** แยกสำหรับ Web Application บน Entra ID (Redirect URI, Logout URL)
- ใช้ Protocol มาตรฐาน: **OpenID Connect (OIDC) / OAuth 2.0 Authorization Code Flow (PKCE)**
- Frontend (React/Vite) ใช้ไลบรารีเช่น `@azure/msal-browser` หรือ `@azure/msal-react`
- Backend (ASP.NET Core) ใช้ `Microsoft.Identity.Web` สำหรับ Validate Token และป้องกัน API ด้วย `[Authorize]`
- กำหนด Scope/Role การเข้าถึงตามสิทธิ์ผู้ใช้ (RBAC ผ่าน App Roles หรือ Entra ID Groups)

### หน้าที่ทีม Infra
- สร้าง App Registration สำหรับ Web Application บน Entra ID
- กำหนด Redirect URI / Logout URL ให้ตรงกับ Environment (Dev/Staging/Prod)
- ตั้งค่า App Roles หรือ Security Groups สำหรับควบคุมสิทธิ์การเข้าใช้งาน
- จัดการ Conditional Access Policy (เช่น MFA, Location-based) ตามนโยบายความปลอดภัยองค์กร
- ตรวจสอบ Certificate/Secret Expiry ของ App Registration

### หน้าที่ทีม Developer
- Implement Authentication Flow ฝั่ง Frontend (MSAL) สำหรับ Login/Logout/Token Acquisition
- Implement Token Validation ฝั่ง Backend (JWT Bearer / Microsoft.Identity.Web)
- Map Claims จาก Token (เช่น `oid`, `roles`, `groups`) เข้ากับ User Profile ภายในระบบ
- จัดการ Session/Token Refresh และ Error Handling (เช่น Token หมดอายุ, Consent ไม่ครบ)
- เขียน Middleware/Guard สำหรับป้องกัน Route/API ตาม Role ที่กำหนด

### Dependencies / Prerequisites
- App Registration พร้อม Client ID / Tenant ID / Redirect URI
- Admin Consent (ถ้ามีการขอ Permission เพิ่มเติมนอกเหนือจาก `openid`, `profile`, `email`)

---

## สรุป Checklist ก่อนเริ่มงาน

- [ ] Domain Verify บน Microsoft 365 Admin Center
- [ ] Entra Connect Sync ติดตั้งและ Sync สำเร็จ (ทีม Infra)
- [ ] App Registration สำหรับ SharePoint Online พร้อม Permission (ทีม Infra + Developer ตกลง Scope ร่วมกัน)
- [ ] App Registration สำหรับ Web Application SSO พร้อม Redirect URI (ทีม Infra)
- [ ] Secret/Certificate จัดเก็บใน Key Vault หรือ Secret Manager ที่ปลอดภัย
- [ ] ทดสอบ End-to-End: Login SSO → เรียก API → เข้าถึง SharePoint Online

## หมายเหตุด้านความปลอดภัย

- ห้ามฝัง Client Secret ในซอร์สโค้ดหรือ Repository
- ใช้ Certificate แทน Client Secret เมื่อเป็นไปได้ (อายุการใช้งานยาวกว่าและปลอดภัยกว่า)
- เปิดใช้งาน MFA และ Conditional Access สำหรับบัญชีที่มีสิทธิ์ Admin
- จำกัด API Permission ตามหลัก Least Privilege
