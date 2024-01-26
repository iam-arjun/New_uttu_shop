const express = require('express')

const port = process.env.PORT || 5000
const cors = require("cors");
const jwt = require('jsonwebtoken');
const sessions = require('express-session');

const cookieParser = require('cookie-parser');
require('./dbconn')

const SignupObj = require('./Model/SignupModel')
const LoginObj = require('./Model/LoginModel')
const CartObj = require('./Model/CartItem')
const ShippingObj = require('./Model/ShippingDetail')
const FinalOrderObj = require('./Model/FinalOrderSummary')


const reactApp = express()

reactApp.use(express.json());
reactApp.use(cookieParser());
//allowing json data to be received from client

// reactApp.use(cors())


// here we are setting up cors so that we can make requests from cross-origin resources


reactApp.use(cors({ credentials: true, origin: 'https://transcendent-donut-c18def.netlify.app' }));



// SIGNING UP THE USER

reactApp.post('/signup', async (req, res) => {

    try {
        let existingUser = await SignupObj.findOne({ email: req.body.EMAIL })
        if (existingUser) {
            res.status(401).json('This email is already registered!😑')

        }
        else {
            const signupDoc = new SignupObj({

                fullname: req.body.NAME,
                email: req.body.EMAIL,
                password: req.body.PASSWORD,
                cpassword: req.body.CPASSWORD

            })

            await signupDoc.save()
            res.send(signupDoc)




        }



    } catch (error) {
        console.log(error)
        res.send(error)

    }




})

reactApp.get('/signup', async (req, res) => {

    try {
        const myData = await SignupObj.find()
        res.json(myData)


    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

//LOGIN USER API


reactApp.post('/login', async (req, res) => {

    const email = req.body.EMAIL
    const password = req.body.PASSWORD

    try {



        const user = await SignupObj.findOne({ email });



        if (!user || user.password !== password) {
            return res.status(401).json('Email or password is not matched')
        }

        // You can generate a JWT token here and send it back to the client for session management
        else {
            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
                expiresIn: '24h', // Token expiration time
            });


            const userLoggedin = await LoginObj.findOne({ email })
            if (!userLoggedin) {
                const myuser = new LoginObj({
                    name: user.fullname,
                    email: email,
                    password: password,
                    token: token
                })



                await myuser.save()

                res.status(200).json({ message: 'Loggin successfully', token: token, myuser: myuser })




            }
            else {
                await LoginObj.deleteOne({ email })
                const myuser = new LoginObj({
                    name: user.fullname,
                    email: email,
                    password: password,
                    token: token
                })
                await myuser.save()
                res.status(200).json({ message: 'Loggin successfully', token: token, myuser: myuser })

            }


        }




    } catch (error) {
        res.status(500).json({ message: error.message });
    }



})

reactApp.get('/login', async (req, res) => {

    try {
        const myData = await LoginObj.find()
        res.json(myData)


    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

// Assuming you have a function to fetch user data by user ID

const getUserById = async (userId) => {

    const myuser = await SignupObj.findOne({ _id: userId })


    const verifiedUser = await LoginObj.findOne({ email: myuser.email })


    return verifiedUser


};



reactApp.get('/autologin', async (req, res) => {

    const token = req.headers['authorization'];// Get the token from the Authorization header



    try {

        const decoded = jwt.verify(token, 'your-secret-key');



        const user = await getUserById(decoded.userId);




        if (user) {

            res.json(user);
        } else {

            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });

    }


})



reactApp.delete('/logout/:id', async (req, res) => {
    const userId = req.params.id
    try {

        const mydata = await LoginObj.findByIdAndDelete(userId)

        res.json({ message: 'Successfully loggedout', data: mydata })


    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Unable to logout' });

    }


})




// ADDING THE ITEMS TO THE CART

reactApp.post('/addtocart', async (req, res) => {


    try {


        // Check if the item exists in the database
        const item = await CartObj.findOne({ id: req.body.id })
        if (item) {

            const updatedItem = await CartObj.findOneAndUpdate({ id: req.body.id }, { itemqty: req.body.item_qty }, { new: true });

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            return res.json(updatedItem);

        }
        else {
            const cartDoc = new CartObj({

                id: req.body.id,
                itemname: req.body.item_detail,
                itemimg: req.body.item_img,
                itemprice: req.body.item_price,
                itemqty: req.body.item_qty,
                featured: req.body.featured,
                email: req.body.email



            })
            await cartDoc.save()
            res.send(cartDoc)
        }




    } catch (error) {
        console.log(error)


    }




})


//Getting the cart items


reactApp.get('/addtocart', async (req, res) => {

    try {
        const myItems = await CartObj.find()
        const uniqueItems = myItems.filter((obj, index) => {
            return index === myItems.findIndex(o => obj.id === o.id);
        });
        res.send(uniqueItems)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

// PUT route to decrease the item qty 
reactApp.put('/decitemqty/:id', async (req, res) => {

    try {

        const itemid = req.params.id


        const product = await CartObj.findOne({ id: itemid })


        if (product.itemqty > 1) {
            product.itemqty = product.itemqty - 1


        }
        else {
            product.itemqty = 1
        }

        // Find the item by ID and update its description
        const updatedItem = await CartObj.findOneAndUpdate({ id: itemid }, { itemqty: product.itemqty }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json(updatedItem);

    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }





});


// PUT route to increase the item qty 
reactApp.put('/incitemqty/:id', async (req, res) => {

    try {


        const itemid = req.params.id

        const product = await CartObj.findOne({ id: itemid })
        if (product) {

            if (product.itemqty < 7) {
                product.itemqty = product.itemqty + 1


            }
            else {
                product.itemqty = 7
            }

            // Find the item by ID and update its description
            const updatedItem = await CartObj.findOneAndUpdate({ id: itemid }, { itemqty: product.itemqty }, { new: true });

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }


            return res.json(updatedItem);
        }
        else {
            res.json('Item not found')
        }



    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({ message: 'Internal server error' });

    }





});




// DELETE route to delete an item by ID
reactApp.delete('/delitem/:id', async (req, res) => {
    try {
        const itemId = req.params.id

        // Find the item by ID and delete it

        const deletedItem = await CartObj.findByIdAndDelete(itemId);



        if (deletedItem) {
            return res.json({ message: 'Item deleted successfully', data: deletedItem });


        }
        else {

            return res.json({ message: 'Item not found' });

        }

    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});





// shipping address post
reactApp.put('/shipping', async (req, res) => {

    try {

        const shippingDoc = new ShippingObj({

            email: req.body.EMAIL,
            fullname: req.body.FULLNAME,
            phone: req.body.PHONENUM,
            country: req.body.COUNTRYNAME,
            state: req.body.PROVINCE,
            city: req.body.CITYNAME,
            streetaddress: req.body.STREETADDRESS

        })

        let existingShipping = await ShippingObj.find()
        let eachShippingLength = existingShipping.filter((el) => { return el.email === req.body.EMAIL })
        if (eachShippingLength.length === 1) {
            // Find the item by ID and update its description
            const updatedItem = await ShippingObj.findOneAndUpdate({ email: req.body.EMAIL }, {
                email: req.body.EMAIL,
                fullname: req.body.FULLNAME,
                phone: req.body.PHONENUM,
                country: req.body.COUNTRYNAME,
                state: req.body.PROVINCE,
                city: req.body.CITYNAME,
                streetaddress: req.body.STREETADDRESS
            }, { new: true });
            console.log()

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            return res.json(updatedItem);


        }
        else {

            await shippingDoc.save()
            res.send(shippingDoc)
        }




    } catch (error) {
        console.log(error)
        res.send(error)

    }




})

// shipping address get
reactApp.get('/shipping', async (req, res) => {

    try {
        const myData = await ShippingObj.find()

        res.json(myData)


    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

// shipping delete
reactApp.delete('/delshipping/:id', async (req, res) => {
    try {
        const itemId = req.params.id

        // Find the item by ID and delete it

        const deletedItem = await ShippingObj.findByIdAndDelete(itemId);



        if (deletedItem) {
            return res.json({ message: 'Item deleted successfully', data: deletedItem });


        }
        else {

            return res.json({ message: 'Item not found' });

        }

    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// final OrDER post
reactApp.put('/finalorder', async (req, res) => {

    try {

        const finalOrderDoc = new FinalOrderObj({
            finalemail: req.body.EMAIL,
            shipping: req.body.SHIPPING_ADDRESS,
            cartitems: req.body.CART_ITEMS,
            ordersummary: req.body.ORDER_SUMMARY,
            paymentmethod: req.body.PAYMENT_GATEWAY


        })

        let existingFinalOrder = await FinalOrderObj.find()
        let eachFinalOrderLength = existingFinalOrder.filter((el) => { return el.finalemail === req.body.EMAIL })
        if (eachFinalOrderLength.length === 1) {
            // Find the item by ID and update its description
            const updatedItem = await FinalOrderObj.findOneAndUpdate({ finalemail: req.body.EMAIL }, {
                shipping: req.body.SHIPPING_ADDRESS,
                cartitems: req.body.CART_ITEMS,
                ordersummary: req.body.ORDER_SUMMARY,
                paymentmethod: req.body.PAYMENT_GATEWAY
            }, { new: true });
            console.log()

            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }

            return res.json(updatedItem);


        }
        else {

            await finalOrderDoc.save()
            res.send(finalOrderDoc)
        }




    } catch (error) {
        console.log(error)
        res.send(error)

    }




})





















reactApp.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`)
})

