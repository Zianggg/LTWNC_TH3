// Băm mật khẩu cho data/users.json: node scripts/hash-password.mjs <mật khẩu>
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Cách dùng: node scripts/hash-password.mjs <mật khẩu>");
  process.exit(1);
}
console.log(bcrypt.hashSync(password, 10));
