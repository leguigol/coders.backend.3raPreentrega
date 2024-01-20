const express=require('express');
const path = require('path');
const ProductManager=require('./productManager');

const app=express();
const PORT=5000;
const pathBase=path.join(__dirname,'../db.json');

app.get('/products',async(req,res)=>{
    try {
        const pM=new ProductManager(pathBase);

        let products=await pM.getProducts();
        
        const limit=parseInt(req.query.limit);

        if(limit){
            res.json(products.productos.slice(0,limit));
        }else{
            res.json(products);
        }

    }catch(error){
        res.status(500).json({error: error.message});
    }    
})

app.get('/products/:pid', async (req, res) => {
    try {
        const pM=new ProductManager(pathBase);
        const productId = parseInt(req.params.pid);

        if (isNaN(productId)) {
            return res.status(400).json({ error: 'El ID del producto debe ser un número válido.' });
        }

        const product = await pM.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `No se encontró ningún producto con el ID ${productId}.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((req,res)=>{
    res.status(404).json({error: 'Ruta no encontrada'});
})

app.listen(PORT,()=>{
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
})
