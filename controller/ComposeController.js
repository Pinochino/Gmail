const { connectDb } = require("../dbSetup");

class ComposeController {
  index(req, res) {
    const userId = req.cookies.userId;
    const USERNAME = req.cookies.username;
    const EMAIL = req.cookies.email;
    const totalReceivedEmail = req.cookies.totalReceivedEmail;
    const totalSendedEmail = req.cookies.totalSendedEmail;
    res.render("compose", {
      data: userId,
      USERNAME,
      EMAIL,
      totalReceivedEmail,
      totalSendedEmail,
    });
  }

  async create(req, res) {
    const userId = req.cookies.userId;
    const USERNAME = req.cookies.username;
    const EMAIL = req.cookies.email;
    const totalReceivedEmail = req.cookies.totalReceivedEmail;
    const totalSendedEmail = req.cookies.totalSendedEmail;
    const notification = [
      {
        type: "success",
        message: "Email sent successfully",
      },
      {
        type: "failure",
        message: "Email sending failed",
      },
    ];

    let db;
    const sender_id = req.cookies.userId;
    const { recipient, subject, message, myFile } = req.body;
    const file = req.file;
    const filePath = file ? file.path : null;
    const fileName = file ? file.originalname : null;

    const emailSubject = subject || 'no subject';
    const emailMessage = message || 'no message content';

    if (!recipient) {
      return res.render("compose", {
        notification: true,
        type: "failure",
        message: "Please choose the recipient",
        USERNAME,
      });
    }



    try {
      db = await connectDb();
      const sql1 = `SELECT ID FROM USER WHERE USERNAME= ?`;
      const [rows] = await db.query(sql1, recipient);
      if (!rows.length) {
        return res
          .status(400)
          .json({ message: `Cannot find username ${recipient}` });
      }

      const values = [
        sender_id,
        rows[0].ID,
        emailSubject,
        emailMessage,
        filePath,
        fileName,
      ];

      const sql2 = `INSERT INTO EMAILS (SENDER_ID, RECIPIENT_ID, SUBJECT, MESSAGE, FILE, FILE_NAME) VALUES (?, ?, ?, ?, ?, ?)`;
      const [data] = await db.query(sql2, values);
      if (data.affectedRows > 0) {
        return res
          .status(200)
          .render("compose", {
            notification: true,
            type: notification[0].type,
            message: notification[0].message,
            data: userId,
            USERNAME,
            EMAIL,
            totalReceivedEmail,
            totalSendedEmail,
          });
      }
      return res
        .status(400)
        .render("compose", {
          notification: true,
          type: notification[1].type,
          message: notification[1].message,
          data: userId,
          USERNAME,
          EMAIL,
          totalReceivedEmail,
          totalSendedEmail,
        });
    } catch (error) {
      return res.status(500).json({ message: `${error}` });
    } finally {
      if (db) await db.end();
    }
  }

  async getRecipient(req, res) {
    const current_username = req.cookies.username;
    let db;
    try {
      db = await connectDb();
      const sql = `SELECT USERNAME FROM USER WHERE USERNAME != ?`;
      const [rows] = await db.query(sql, [current_username]);
      if (rows) {
        return res.status(200).json([rows]);
      }
      return res.status(400).json({ message: `Cannot get the data` });
    } catch (error) {
      return res.status(500).json({ error: `${error}` });
    }
  }
}

module.exports = ComposeController;
