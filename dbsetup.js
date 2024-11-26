const mysql2 = require("mysql2/promise");
const { encryptText } = require("./config/crypto");
const keyCrypto = "myPassword123456";

async function connectDb() {
    const studentId = "2201040080";
    const dbName = `wpr${studentId}`;
    try {
        const dbConfig = {
            host: "localhost",
            user: "wpr",
            password: "fit2024",
            port: 3306,
        };
        const db = await mysql2.createConnection(dbConfig);
        await db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);


        await db.end();
        dbConfig.database = dbName;
        return await mysql2.createConnection(dbConfig);
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

async function setupDatabase() {
    try {
        let db;
        db = await connectDb();

        const sql1 = `CREATE TABLE IF NOT EXISTS user  (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        await db.query(sql1);


        const sql2 = `CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT,
        recipient_id INT,
        subject VARCHAR(255),
        message TEXT,
        file VARCHAR(255),
        file_name VARCHAR(255),
        send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        is_deleted_by_recipient BOOLEAN DEFAULT FALSE,
        is_deleted_by_sender BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (sender_id) REFERENCES user(id),
        FOREIGN KEY (recipient_id) REFERENCES user(id)
      );`;
        await db.query(sql2);


        const [isCheckInsert] = await db.query(
            "SELECT COUNT(*) AS count FROM user"
        );
        if (isCheckInsert[0].count === 0) {
            const users = [
                {
                    username: "Pele",
                    email: "a@a.com",
                    password: "123",
                },
                {
                    username: "Messi",
                    email: "messi@example.com",
                    password: "123456",
                },
                {
                    username: "Ronaldo",
                    email: "ronaldo@gmail.com",
                    password: "22112004",
                },
            ];

            for (const user of users) {
                const encryptedPassword = encryptText(user.password, keyCrypto);
                await db.query(
                    `INSERT INTO user (username, email, password) VALUES (?, ?, ?)`,
                    [user.username, user.email, encryptedPassword]
                );
            }

            await db.query(`
                INSERT INTO emails (sender_id, recipient_id, subject, message, file, send_at, received_at) VALUES
                (1, 2, "Facebook", "Hello my name is Trần Đình Hùng", NULL, NOW(), NOW()),
                (1, 3, "Zalo", "Mã sinh viên của tớ là 2201040080", NULL, NOW(), NOW()),
                (2, 1, "Messenger", "Tớ học lớp 7C22", NULL, NOW(), NOW()),
                (2, 1, "Twitter", "Message for email 4", NULL, NOW(), NOW()),
                (3, 1, "KFC Chicken", "Message for email 5", NULL, NOW(), NOW()),
                (3, 1, "WWE", "Message for email 6", NULL, NOW(), NOW()),
                (1, 2, "Youtube", "Message for email 7", NULL, NOW(), NOW()),
                (1, 2, "FaceIds", "Message for email 9", NULL, NOW(), NOW()),
                (1, 3, "Printers", "Message for email 9", NULL, NOW(), NOW()),
                (2, 1, "Hello", "Hello my name is Nguyễn Phùng Phương Linh", NULL, NOW(), NOW()),
                (1, 3, "Zalo", "Mã sinh viên của tớ là 2201040080", NULL, NOW(), NOW()),
                (1, 3, "Zalo", "Mã sinh viên của tớ là 2201040080", NULL, NOW(), NOW()),
                (1, 3, "Zalo", "Mã sinh viên của tớ là 2201040080", NULL, NOW(), NOW())
            `);
        }

        await db.end();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

setupDatabase();

module.exports = { connectDb };
