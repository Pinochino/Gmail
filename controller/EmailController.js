const { connectDb } = require("../dbSetup");
const path = require("path");
const fs = require("fs");

class EmailController {
  index(req, res) {
    const pageNumber = req.params.id;
    return res.render("emailDetail", { page: { pageNumber } });
  }

  async read(req, res) {
    const pageNumber = req.params.id;
    const USERNAME = req.cookies.username;
    const EMAIL = req.cookies.email;
    const totalReceivedEmail = req.cookies.totalReceivedEmail;
    const totalSendedEmail = req.cookies.totalSendedEmail;
    let db;
    try {
      db = await connectDb();
      const sql = `SELECT ID, SUBJECT, MESSAGE, FILE FROM EMAILS WHERE ID = ?`;
      const [rows] = await db.query(sql, pageNumber);
      if (rows.length > 0) {
        return res
          .status(200)
          .render("emailDetail", {
            data: rows[0],
            EMAIL,
            totalReceivedEmail,
            totalSendedEmail,
            USERNAME,
          });
      }
      return res
        .status(400)
        .json({ message: `Cannot find detail email ${pageNumber}}` });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }

  async downloadFile(req, res, next) {
    let db;
    try {
      const userId = req.params.id;
      db = await connectDb();
      const sql = `SELECT FILE, FILE_NAME FROM EMAILS WHERE IS_DELETED_BY_RECIPIENT=FALSE AND ID=? `;
      const [rows] = await db.query(sql, userId);

      if (rows.length === 0 || !rows[0].FILE) {
        return res.status(404).json({ message: "File not found!" });
      }

      const filePath = rows[0].FILE;
      const fileName = rows[0].FILE_NAME;

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found!" });
      }

      res.download(filePath, fileName, (err) => {
        if (err) {
          res.status(500).json({ message: "Error while downloading file" });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = EmailController;
