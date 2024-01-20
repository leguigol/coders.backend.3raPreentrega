const fs=require('fs').promises;

class ProductManager {
    constructor(path){
        this.pathDB=path;
    }

    async createProduct(product){
        try{
            const allProducts=await this.getProducts();
            const lastId=
            allProducts.length===0 ? 1 
            : 
            allProducts.productos[allProducts.productos.length-1].id+1;
    
            const newProduct=({id: lastId,...product});
    
            allProducts.productos.push(newProduct);
            await fs.writeFile(this.pathDB,JSON.stringify(allProducts));
            return newProduct;
    
        }catch(error){
            console.log(error);
        }
    }

    async getProducts(){
        try{
            const allProducts=await fs.readFile(this.pathDB);
            return JSON.parse(allProducts);
        }catch(error){
            console.log(error);
        }
    }

    async getProductById(productId) {
        try {
            const allProducts = await this.getProducts();
            
            const product = allProducts.productos.find(product => product.id === productId);
            
            return product || null; 
        } catch (error) {
            console.error(error);
            throw new Error('Error al obtener el producto por ID.');
        }
    }

    async updateProduct(productId, updatedFields) {
        try {
            const allProducts = await this.getProducts();
            
            const index = allProducts.productos.findIndex(product => product.id === productId);
            
            if (index !== -1) {
                allProducts.productos[index] = { ...allProducts.productos[index], ...updatedFields };

                await fs.writeFile(this.pathDB, JSON.stringify(allProducts));

                return allProducts.productos[index];
            } else {
                throw new Error(`No se encontró ningún producto con el ID ${productId}.`);
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el producto.');
        }
    }

    async deleteProduct(productId) {
        try {
            const allProducts = await this.getProducts();
            
            const index = allProducts.productos.findIndex(product => product.id === productId);
            
            if (index !== -1) {
                const deletedProduct = allProducts.productos.splice(index, 1)[0];

                await fs.writeFile(this.pathDB, JSON.stringify({ productos: allProducts.productos }));

                return deletedProduct;
            } else {
                throw new Error(`No se encontró ningún producto con el ID ${productId}.`);
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar el producto.');
        }
    }
}

module.exports = ProductManager;

