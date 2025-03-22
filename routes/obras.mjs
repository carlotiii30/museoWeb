import express from "express"
const router = express.Router();
				
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
				
router.get('/buscar', async (req, res)=>{ /obras/buscar
  const búsqueda = req.query.búsqueda 
  console.log(búsqueda)
  try {
    ...
    res.render('resultados.njk', {...})    // ../views/resultados.njk
  } catch (err) {
	 console.error(err)                      
    res.status(500).send({err}) // o usar una página de error personalizada
  }
})
export default router