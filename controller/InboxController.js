const { connectDb } = require("../dbSetup");

class InboxController {
  async readEmail(req, res) {
    const resultPerPage = parseInt(req.params.limit) || 5;
    const userId = req.cookies.userId;
    const USERNAME = req.cookies.username;
    const EMAIL = req.cookies.email;

    if (!userId) {
      return res.status(400).redirect("/");
    }

    let db;
    try {
      db = await connectDb();

      let sql = `SELECT COUNT(*) AS total FROM EMAILS WHERE RECIPIENT_ID = ? AND IS_DELETED_BY_RECIPIENT = FALSE`;
      let [countResult] = await db.query(sql, userId);
      const numOfResult = countResult[0].total;
      const numberOfPages = Math.ceil(numOfResult / resultPerPage);

      if (numOfResult === 0) {
        return res.status(200).render("inbox", {
          data: [],
          page: 1,
          iterator: 1,
          endingLink: 1,
          numberOfPages: 1,
          USERNAME,
          EMAIL,
          message: "No emails available.",
        });
      }

      let page = Math.max(
        1,
        Math.min(Number(req.query.page) || 1, numberOfPages)
      );
      if (page > numberOfPages) {
        return res.redirect("/?page=" + encodeURIComponent(numberOfPages));
      } else if (page < 1) {
        return res.redirect("/?page=" + encodeURIComponent(1));
      }

      const startingLimit = (page - 1) * resultPerPage;

      sql = `
            SELECT 
                E.ID, 
                U.USERNAME AS SENDER_NAME, 
                E.SUBJECT, 
               DATE_FORMAT(E.RECEIVED_AT, '%Y-%m-%d %H:%i') AS RECEIVED_AT
            FROM EMAILS E
            JOIN USER U ON E.SENDER_ID = U.ID
            WHERE E.RECIPIENT_ID = ? 
              AND E.IS_DELETED_BY_RECIPIENT = FALSE
            ORDER BY E.RECEIVED_AT DESC
            LIMIT ?, ?
        `;
      let [rows] = await db.query(sql, [userId, startingLimit, resultPerPage]);

      let iterator = Math.max(1, page - 5);
      const endingLink = Math.min(iterator + 5, numberOfPages);

      if (rows.length > 0) {
        return res.status(200).render("inbox", {
          data: rows,
          page,
          iterator,
          endingLink,
          numberOfPages,
          USERNAME,
          EMAIL,
        });
      }
      return res.status(400).json({ message: `Cannot fetch the data` });
    } catch (error) {
      return res.status(500).json({ message: `${error}` });
    }
  }

  async handleFormAction(req, res) {
    const { emailIds } = req.body;
    const userId = req.cookies.userId;

    if (!emailIds || emailIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No emails selected for deletion" });
    }

    const placeholders = emailIds.map(() => "?").join(", ");
    let db;
    try {
      db = await connectDb();

      let sql = `UPDATE emails 
                   SET is_deleted_by_recipient = TRUE 
                   WHERE recipient_id = ? AND id IN (${placeholders})`;
      let [rows] = await db.query(sql, [userId, ...emailIds]);

      if (rows.affectedRows > 0) {
        return res.status(200).json({ message: `Delete successful` });
      }
      return res.status(400).json({ message: "Fail delete" });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("userId");
      res.clearCookie("username");
      res.clearCookie("email");
      res.clearCookie("totalReceivedEmail");
      res.clearCookie("totalSendedEmail");
      return res.status(200).redirect("/");
    } catch (error) {
      return res.status(500).json({ message: `${error}` });
    }
  }
}

module.exports = InboxController;
