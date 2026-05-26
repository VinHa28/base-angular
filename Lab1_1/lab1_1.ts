/* 
Lab 1.1 (TypeScript Type Guard & Utilities):
Đề bài: Tạo cấu trúc dữ liệu cho hệ thống phân quyền. 
- Định nghĩa interface Admin (có quyền manageUsers) và Staff (có quyền viewReports). 
- Viết một hàm nhận vào đối tượng hỗn hợp và sử dụng Custom Type Guard (isAdmin) để in ra danh sách các Admin. 
- Sử dụng Omit để tạo ra một type mới loại bỏ trường mật khẩu (password) khỏi thông tin hiển thị.

* Hướng dẫn cấu hình môi trường để phát triển
- Mở một thư mục trống bằng VS Code
- Chạy lệnh cài đặt nhanh: npm init -y && npm install -D typescript ts-node @types/node
- Tạo file lab1_1.ts và viết mã nguồn vào đó
- Chạy trực tiếp bằng lệnh: npx ts-node lab1_1.ts
*/

const usersMock: (Admin | Staff)[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@company.com",
    role: "admin",
    manageUsers: ["Staff 1", "Staff 2"],
    password: "abc",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@company.com",
    role: "staff",
    viewReports: true,
    password: "abc",
  },
];

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "staff";
  password?: string;
}

interface Admin extends User {
  role: "admin";
  manageUsers: string[];
}

interface Staff extends User {
  role: "staff";
  viewReports: true;
}

function isAdmin(user: User): user is Admin {
  return user.role === "admin";
}

// type AdminPublic = Omit<Admin, "password">;
// type StaffPublic = Omit<Staff, "password">;
type UserPublic = Omit<User, "password">

function getPublicInfo(user: User): UserPublic {
  const { password, ...publicData } = user;
  return publicData;
}

usersMock.forEach((u) => {
  if (isAdmin(u)) console.log(getPublicInfo(u));
});
