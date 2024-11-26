const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const route = require('./routes')
const path = require('path')
const app = express();
const { connectDb } = require('./dbSetup');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

app.use(cookieParser());


(async function initialApp() {
    try {
        await connectDb();
        route(app);

    } catch (error) {
        console.log(error);
    }
})();

const port = 8000 || process.env.PORT;

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))
