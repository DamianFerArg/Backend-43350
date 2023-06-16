import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routers/products.routes.js'
import cartRouter from './routers/carts.routes.js'
import multer from 'multer'
import __dirname, { PORT } from "./utils.js";
import viewsProductsRoutes from "./routers/views.routes.js";

const app = express()

app.use(express.json());

const serverHttp = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
);
const io = new Server(serverHttp);

app.set("socketio", io);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.get("/", (req, res) => res.render("index", { name: "Dami" }))
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/home", viewsProductsRoutes);

io.on("connection", socket => {
    console.log("Successful Connection");
    socket.on("productList", data => {
        io.emit("updatedProducts", data);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploader = multer({ storage })

app.post('/', uploader.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', error: 'No se pudo cargar el archivo' })
    }
    res.json({ status: 'success', message: 'Archivo cargado correctamente' })
})

app.get('/', (req, res) => {
    res.json({ message: 'Server Ok' })
})

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)

