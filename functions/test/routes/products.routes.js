const { Router }= require('express');
const {db} =require('../firebaseConfig');
const router=Router();

//obtener los productos
router.get('/api/products', async(req, res)=>{
    try {
        //obtiene los productos
        const query=db.collection('productos');
        const querySnapshot=await query.get();
        //guarda los productos en un array
        
        const response=querySnapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
        }))
        let toRecoletRate=response;
    
        const posts = []
        for (const producto of toRecoletRate) {
          const myRate = await getRate(producto.id);
          posts.push(myRate);
        }
        let i=0;
        toRecoletRate.map(product=>{
            product.rate=posts[i];
            i=i+1;
        })
    
        return res.json({ok:true, data:toRecoletRate});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false, message:"Algo salió mal al obtener los productos"});
    }
 })
 async function getRate(idProduct){
     //obtiene las calificaciones
     try {
        const calificationDoc=db.collection(`productos/${idProduct}/rate`);
         const querySnapshotRate=await calificationDoc.get();
         let calificationData=querySnapshotRate.docs;
         let rate=[];
         calificationData.map(doc=>{
             rate.push(
                 doc.data().calification
             )
         })
         return rate;
     } catch (error) {
        return error;
     }
     

}
//Obtener un producto
router.get('/api/products/:product_id', async(req,res)=>{
    try {
        //Obtiene el producto
        const doc=db.collection('productos').doc(req.params.product_id);
        const product=await doc.get();
        
        //obtiene los comentarios
        const commentsDoc=db.collection(`productos/${req.params.product_id}/comments`);
        const querySnapshot=await commentsDoc.get();
        let commentsData=querySnapshot.docs;
        let comments=[];
        commentsData.map(doc=>{
            comments.push({
                id:doc.id,
                ...doc.data()
            })
        })
        //obtiene las calificaciones
        const calificationDoc=db.collection(`productos/${req.params.product_id}/rate`);
        const querySnapshot2=await calificationDoc.get();
        let calificationData=querySnapshot2.docs;
        let rate=[];
        calificationData.map(doc=>{
            rate.push(
                doc.data().calification
            )
        })
        
        //obtiene los usuarios
        const usersDoc=db.collection(`productos/${req.params.product_id}/users`);
        const querySnapshot3=await usersDoc.get();
        let usersData=querySnapshot3.docs;
        let users=[];
        usersData.map(doc=>{
             users.push(
                doc.data().uid
             )
         })
         
         //obtiene la data de la categoría
        let response=product.data();
        const ref=response.category;
        const docCategory=db.collection('categorías').doc(ref);
        const categoryInf=await docCategory.get();
        const category=categoryInf.data();
        
        /********************Guarda la info obtenida en la respuesta final *********************** */
        //guarda las propiedades de la categoría en la respuesta (producto)
        response.category=category.categoryName;
        response.banner=category.banner;
    
        //guarda los comentarios en la response
        response.comments=comments;
        
        //guarda las calificaciones en la response
        response.rate=rate;
        
        //guarda los usuarios en la response
        response.users=users
        
        response.id=req.params.product_id
        //******************************************************************************************* */
        return res.status(200).json({ok:true, data: response});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false, message:"Algo salió mal al obtener el producto"});
    }
})

//hacer comentario
router.post('/api/products-comment/:product_id', async(req,res)=>{
    
    try {
        db.collection(`productos/${req.params.product_id}/comments`).doc().create({...req.body})
        //obteniendo los comentarios
        const query=db.collection(`productos/${req.params.product_id}/comments`);
        const querySnapshot=await query.get();
        const response=querySnapshot.docs;
        let comments=[];
        response.map(doc=>{
            comments.push({
                id:doc.id,
                ...doc.data()
            })
         })
        return res.status(200).json({ok:true, message:'Comentario guardado exitosamente', data: comments});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false, message:"Algo salió mal al guardar el comentario"});
    }
})
//calificar
router.post('/api/products-rate/:product_id', async(req,res)=>{
    try {
        db.collection(`productos/${req.params.product_id}/rate`).doc().create({...req.body});
         //obteniendo las calificaciones
         const query=db.collection(`productos/${req.params.product_id}/rate`);
         const querySnapshot=await query.get();
         const response=querySnapshot.docs;
         let rate=[];
        response.map(doc=>{
            rate.push(
                doc.data().calification
            )
        })
        return res.status(200).json({ok:true, message:'Calificación guardada exitosamente', data:rate});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false, message:"Algo salió mal al guardar la calificación"});
    }
})

router.post('/api/products-users/:product_id', async(req,res)=>{
    try {
        db.collection(`productos/${req.params.product_id}/users`).doc().create({...req.body})
         //obteniendo los comentarios
         const query=db.collection(`productos/${req.params.product_id}/users`);
         const querySnapshot=await query.get();
         const response=querySnapshot.docs;
         let users=[];
         response.map(doc=>{
              users.push(
                 doc.data().uid
              )
          })
        return res.status(200).json({ok:true, message:'usuario guardado exitosamente', data:users});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ok:false, message:"Algo salió mal al guardar el usuario"});
    }
})

//getCategories
 router.get('/api/categories', async(req, res)=>{
    try {
        const query=db.collection('categorías');
        const querySnapshot=await query.get();
        const response=querySnapshot.docs.map(doc=>({
            id:doc.id,
            category:doc.data()
        }))
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
 })
 

module.exports=router;