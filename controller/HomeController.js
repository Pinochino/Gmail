const { decryptText } = require("../config/crypto");
const { connectDb } = require("../dbSetup");
const keyCrypto = "myPassword123456";

class HomeController {
  index(req, res) {
    const userId = req.cookies.userId;
    const USERNAME = req.cookies.username;
    const EMAIL = req.cookies.email;
    res.render("signin", { userId, USERNAME, EMAIL });
  }


  async login(req, res) {
    const notification = [
      {
        type: "success",
        message: "Login successful",
      },
      {
        type: "failure",
        message: "Login failed",
      },
      {
        type: "failure",
        message: "Email and Password are required",
      },
    ];
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .render("signin", {
            notification: true,
            type: notification[2].type,
            message: notification[2].message,
          });
      }

      const db = await connectDb();
      const sql =
        "SELECT ID, USERNAME, PASSWORD, EMAIL FROM user WHERE EMAIL=?";
      const [rows] = await db.query(sql, [email]);  // Changed 'username' to 'email'

      if (
        rows.length > 0 &&
        rows[0].EMAIL === email &&
        decryptText(rows[0].PASSWORD, keyCrypto) === password
      ) {
        res.cookie("userId", rows[0].ID);
        res.cookie("username", rows[0].USERNAME);
        res.cookie("email", rows[0].EMAIL);
        return res.status(200).redirect("/inbox");
      }

      return res
        .status(400)
        .render("signin", {
          notification: true,
          type: notification[1].type,
          message: notification[1].message,
        });
    } catch (error) {
      return res.status(500).json({ message: `${error}` });
    }
  }

}

module.exports = HomeController;
