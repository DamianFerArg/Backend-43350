import { Router } from 'express'

const router = Router()

const users = [
    { id: 1, name: 'Damian', role: 'Alumno' },
    { id: 2, name: 'Damaris', role: 'Esposa' },
    { id: 3, name: 'Luke', role: 'Tutor' },
]

const foods = [
    { id: 1, name: 'Burguer' },
    { id: 2, name: 'Icecream' },
    { id: 3, name: 'Water' },
]

import { productManager } from "../controllers/ProductManager.js";

const allProducts = await productManager.getProducts();

router.get("/", async (req, res) => {
  try {
    const allProducts = await productManager.getProducts();
    res.render("home", { allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    res.render("realTimeProducts", { allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});


router.get('/', (req, res) => {
    // res.json({ users })
    res.render('showUsers', {styles: 'blue.css', users})
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    const user = users.find(item => item.id == id)
    res.render('showUser', {
        user,
        isTeacher: user.role == 'teacher' ? true : false,
        foods
    })
})

export default router