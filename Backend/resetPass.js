const bcrypt = require("bcrypt");
const User = require("../Backend/models/user");
const connectDb = require("../Backend/databaseConnect");

const resetPassword = async () => {
    connectDb();
  const email = "jitu6343@gmail.com";
  const newPassword = "1730804_Jitu";

  const hashed = await bcrypt.hash(newPassword, 10);
  console.log(hashed)

  await User.findOneAndUpdate(
    { email },
    { password: hashed }
  );

  
  console.log("Password reset done");
};

resetPassword();