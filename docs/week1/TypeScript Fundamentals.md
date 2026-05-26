# TypeScript Fundamentals

# TypeScript

## Fundamentals:

- JavaScript: Dynamically Typed
- TypeScript: Statically Typed
-> Kiểu dữ liệu của biến phải rõ ràng, kiểm tra ngay từ lúc compile
- Code JS hiện tại cũng là code TypeScript

## Types:

- Primitive Types, Object, Array, Function
- any|unknown:
- any: tắt hoàn toàn kiểm tra dữ liệu của TS -> hạn chế sử dụng
- unknown: an toàn hơn, cho phép gán bất kỳ giá trị nào cho biến, nhưng bắt buộc phải kiểm tra xem là kiểu gì trước khi thực hiện hành động khác.

```jsx
// Ví dụ về any
let dataFromAPI: any = "Hello";
dataFromAPI.length; // Hợp lệ
dataFromAPI.toUpperCase(); // Hợp lệ

// Ví dụ về unknown
let secureData: unknown = "Hello Angular";
// secureData.toUpperCase(); // ❌ LỖI NGAY: TypeScript không cho phép vì chưa biết chắc nó là string.

// Cách xử lý đúng với unknown (Type Guard cơ bản):
if (typeof secureData === "string") {
    console.log(secureData.toUpperCase()); //  Hợp lệ, vì TS đã biết chắc chắn đây là string.
}
```

## Union, Intersection, Tuples

### Union:

```tsx
let userId: string | number;

// Ứng dụng định nghĩa trạng thái của API trong Angular Component
type RequestStatus = "idle" | "loading" | "success" | "error";
```

### Intersection

```tsx
interface Person {
	name: string;
	email: string;
}

interface Employee {
	employeeId: number;
	department: string;
}

type StaffMember = Person && Employee;

const newStaff: StaffMember = {
	name: "VinhHV",
	email: "vinhhv28@gmail.com",
	employeeId: 2026,
	department: "Team anh Chinh"
}
```

### Tuples

Thực chất là 1 array, nhưng có tính nghiệm ngặt hơn:
- Chiều dài cố định
- Kiểu dữ liệu ở mỗi index phải chính xác theo thứ tự đã define

```tsx
let apiResponse: [number, string];

apiResponse = [200, "success"];
apiResponse = [404, "not found"];
```

## Interface & Type

### 1. Interface:

- **Mục đích:** Dùng để định nghĩa cấu trúc Obj hoặc Class
- **Declaration Merging:** Nếu khai báo 2 interface cùng 1 tên → TS tự động merge
- Trong Angular: để định nghĩa các Modal, Data đại diện cho dữ liệu từ API hoặc cấu trúc trong Data Service

### 2. Type (Type Alias)

- **Mục đích:** Linh hoạt hơn, có thể có PRimirive, Union Types, Intersection Types hoặc Tuples
- Không thể gộp

→ Ưu tiên dùng Interface cho đến khi bắt buộc phải dùng Type

```jsx
// --- Ví dụ về Interface ---
interface User {
    id: number;
    name: string;
}

// Tính năng Declaration Merging (Gộp)
interface User {
    role: string; // Tự động gộp vào interface User ở trên
}

const angularDeveloper: User = {
    id: 1,
    name: "DuongNV",
    role: "Admin"
};

// --- Ví dụ về Type ---
type ID = string | number; // Định nghĩa một Union Type linh hoạt
type Point = { x: number; y: number; };
```

## Access Modifier

- **public** (mặc định): Có thể truy cập từ bất cư đâu (trong class, class con hoặc bên ngoài instance);
- **private**: Chỉ có thể truy cập bên trong chính class đó
- **protected**: Giống như **private**, nhưng cho phép class con được phép truy cập
- **readonly**: Chỉ cho phép đọc giữ liệu

```tsx
class ProductService {
	public apiEndpoint: string = "htts://api....";
	private secretKey: string = "SUPPER_KEY";
	protected version: string = "v1";
	readonly timeout: number = 5000;
	
	constructor () {
		this.timeout = 10000;//Hợp lệ nếu gán trong constructor
	}
	
	changeKey() {
		this.secretKey = "NEW_KEY";
		//this.timeout = 2000; => Lỗi không thể gán lại cho thuộc tính readonly
	}
}
```

## Optional Chaining (?.) và Nullish Coalescing (??)

### 1. Optional Chaining - ?.

Nếu đối tượng đứng trước dấu `?.` là `null` hoặc `undefined`, chương trình sẽ lập tức dừng lại và trả về `undefined` thay vì bắn lỗi làm crash ứng dụng.

### 2. Nullish Coalescing - ??

Toán tử này sẽ trả về giá trị phía bên phải **chỉ khi** giá trị phía bên trái là `null` hoặc `undefined`.

```tsx
interface Company {
	name: string;
	address?: {
		street: string;
		city?: string;// Có thể có hoặc không
	}
}

let staff: Company = {name: "Evotek"};

//Thay vì bị crash lỗi -> biến city sẽ nhận undefined
let cỉty = staff.address?.city;
console.log(city);// Output: undefined

let displayCity = staff.address?.city ?? "Hanoi";
console.log(displayCity); //Output: "Hanoi" do vế trái là undefined

let standardScore = 0;
console.log(standardScore || 5); // Output: 5 vì 0 là falsy
console.log(standardScore ?? 5); // Output: 0 vì 0 không phải null/undefined
```

## Utility Types

Là các công cụ Built-in giúp tái cấu trúc lại các `interface`/`type` có sẵn thành kiểu dữ liệu mới mà không cần viết lại từ đầu.
Dưới đây là 4 Utility Types cốt lõi : `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, và `Readonly<T>`.

Mẫu User gốc:

```tsx
interface User {
	id: number;
	username: string;
	password?: string //Có thể có hoặc không
	role: "Admin" | "Staff";
}
```

### 1. `Partial<T>` (Biến tất cả thành Optional)

`Partial<T>` tạo ra một kiểu dữ liệu mới dựa trên `T`, nhưng biến **tất cả các thuộc tính trở thành không bắt buộc (Optional - có dấu `?`)**.

```tsx
// Tất cả các fields của User lúc này đều cố ?
type UpdateUserDto = Partial<User>;

function updateProfile(userId: number, newData: Partial<User> {
	//Logic cập nhật
})

updateProfile(1, {email: "newemail@gmail.com"})
```

### 2. `Pick<T, K>` (Chỉ nhặt ra các trường cần thiết)

```tsx
// Chỉ lấy ra trường 'id' và 'username' từ User
type UserSummary = Pick<User, 'id' | 'username'>

const basicInfo: UserSummary = {
	id: 10,
	username: "vinhhv",
	// email: "vinhhv@gmail.com" Lỗi: Field này không được chọn
}
```

### 3. `Omit<T, K>` (Loại bỏ các trường không mong muốn)

```tsx
// Tạo một type mới giống hệ User nhưng không có password
type UserPublicProfile = Omit<User, 'password'>;

const clientUserData: UserPublicProfile = {
	id: 1,
	username: "vinhhv_admin",
	email: "vinhhv28@gmail.com",
	role: "Admin",
	//password: "123" Lỗi: Field này đã bị Omit
}
```

### 4. `Readonly<T>` (Biến tất cả thành Chỉ Đọc)

```tsx
//Biến tất cả các fiels của User thành readonly
type ImmutableUser = Readonly<User>;

const fixedUser: ImmutableUser = {
	id: 2,
	username: "system_bot"
	email: "bot@system.com",
	role: "Staff",
}

// fixedUser.username = "new_bot" Lỗi 
```

### 5. `Record<K, T>`

```tsx
// Record<Kiểu_của_key, Kiểu_của_value>
type DNANucleotide = 'G' | 'C' | 'T' | 'A';
type RNANucleotide = 'C' | 'G' | 'A' | 'U';

const DNA_TO_RNA_MAP: Record<DNANucleotide, RNANucleotide> = {
	G: 'C',
	C: 'G',
	T: 'A',
	A: 'U',
}
```

## Type Guards

### 1. `typeof` (Primitive Types)

Là toán tử có sẵn của JavaScript. Trong TypeScript, nó được dùng làm Type Guard để kiểm tra các kiểu dữ liệu nguyên thủy cơ bản như: `string`, `number`, `boolean`, `symbol`, `undefined`, `object`, hoặc `function`.

```tsx
function processInput(value: string | number) {
	//Chưa dùng được value.toUpperCase() vì có thể value là number
	if (typeof value === "string") {
		console.log(value.toUpperCase());
	} else {
		console.log(value.toFiexed(2));
	}
}
```

### 2. `instanceof` (Dùng cho Class/Object khởi tạo từ New)

`instanceof` được dùng để kiểm tra xem một đối tượng (instance) có được khởi tạo từ một **Class** cụ thể nào đó hay không. (Không dùng được cho Interface vì Interface sẽ biến mất hoàn toàn khi compile sang JS)

```tsx
//Khi API trả về, muốn phân biệt lỗi AuthError hay lỗi hệ thống ValidationError
class AuthError {
	constructor(public message: string){};
	logoutUser() {console.log("REdireacting to login...")};
}

class ValidationError {
	constructor(public message: string){};
	showValidationFields(){console.log("Highlighting Error Field")}
}

function hasError(error: AuthError | ValidationError){
	if (error instanceof AuthError) {
		// Xác định ở đây là AuthError
		error.logoutUser();
	} else {
		error.showValidationField();
	}
}
```

### 3. Toán tử `is` (Custom Type Guard / Type Predicate)

```tsx
interface Admin {
	name: string;
	messageUsers: () => void;
}

interface Staff {
	name: string;
	viewReports: () => void;
}

// Viêt Custome Type Guard bằng toán tử 'is'
function isAdmin(user: Admin | Staff): user is Admin {
	return (user as Admin).manageUsers !== undefined;
}

function handleUserSession(user: Admin | Staff) {
	if (isAdmin(user)) {
		user.messageUsers();
	} else {
		user.viewReports();
	}
}
```

#