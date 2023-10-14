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
const OrderSummary = require('./Model/OrderSummary');






const reactApp = express()

reactApp.use(express.json());
reactApp.use(cookieParser());    //allowing json data to be received from client


// here we are setting up cors so that we can make requests from cross-origin resources
reactApp.use(
    cors()
);




const oneDay = 60 * 60 * 1000





// SIGNING UP THE USER

reactApp.post('/signup', async (req, res) => {

    try {

        const signupDoc = new SignupObj({

            fullname: req.body.NAME,
            email: req.body.EMAIL,
            password: req.body.PASSWORD,
            cpassword: req.body.CPASSWORD

        })

        await signupDoc.save()
        res.send(signupDoc)


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
            return res.status(401).json({ message: 'Invalid credentials' });
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
        const repeatedItems = await CartObj.findOne({ id: req.body.id })
        console.log(repeatedItems)


        if (repeatedItems) {
            res.send('Already have this items on the cart')
            return;
        }
        else {
            const cartDoc = new CartObj({

                id: req.body.id,
                itemname: req.body.item_detail,
                itemimg: req.body.item_img,
                itemprice: req.body.item_price,
                itemqty: req.body.item_qty,
                featured: req.body.featured



            })

            await cartDoc.save()
            res.send(cartDoc)

        }




    } catch (error) {
        console.log(error)
        res.send(error)

    }




})


//Getting the cart items


reactApp.get('/addtocart', async (req, res) => {

    try {
        const myItems = await CartObj.find()

        // checking for duplicasy



        const unique2 = myItems.filter((obj, index) => {
            return index === myItems.findIndex(o => obj.id === o.id);
        });


        res.json(unique2)


    } catch (error) {
        res.status(500).json({ message: error.message });
    }


})

// PUT route to decrease the item qty 
reactApp.put('/decitemqty/:id', async (req, res) => {

    try {

        const itemid = req.params.id

        const product = await CartObj.findOne({ _id: itemid })

        if (product.itemqty > 1) {
            product.itemqty = product.itemqty - 1

        }
        else {
            product.itemqty = 1
        }

        // Find the item by ID and update its description
        const updatedItem = await CartObj.findByIdAndUpdate(itemid, { itemqty: product.itemqty }, { new: true });

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

        const product = await CartObj.findOne({ _id: itemid })

        if (product.itemqty < 7) {
            product.itemqty = product.itemqty + 1

        }
        else {
            product.itemqty = 7
        }

        // Find the item by ID and update its description
        const updatedItem = await CartObj.findByIdAndUpdate(itemid, { itemqty: product.itemqty }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json(updatedItem);

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

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// ORDER SUMMARY GET API 

reactApp.get('/ordersummary', async (req, res) => {

    try {

        const cartItems = await CartObj.find()

        const unique2 = cartItems.filter((obj, index) => {
            return index === cartItems.findIndex(o => obj.id === o.id);
        });


        let total_cart_items = 0
        let total_payable_amt = 0

        for (let i = 0; i < unique2.length; i++) {


            total_cart_items = unique2[i].itemqty + total_cart_items
            total_payable_amt = unique2[i].itemqty * unique2[i].itemprice + total_payable_amt


        }

        const myObj = new OrderSummary({
            total_items: total_cart_items,
            total_payable: total_payable_amt

        })
        if (myObj) {
            myObj.save()
            res.json(myObj)
        }
        else {
            console.log('Error in getting the order summary!!')
        }

    } catch (error) {
        console.log(error)

    }




})






reactApp.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`)
})

