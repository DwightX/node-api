const errors = require('restify-errors')
const Customer = require('../models/Customer')

module.exports = server => {

    // server.get('/customers', (req, res, next) => {
    //     res.send({msg:'test'})
    //     next()
    // });


    // Get all customers
    server.get('/customers', async (req, res) => {
        try {
            const customers = await Customer.find({})
            res.send(customers)
            next()
        } catch (err) {
            return next(new errors.InvalidContentError(err))
        }
    });

    server.get('/customers/:id', async (req, res) => {
        try {
            const customer = await Customer.findById(req.params.id)
            res.send(customer)
            next()
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No customer with the id of ${req.params.id    }`))
        }
    });

     // Add Customer
    server.post('/customers', async (req, res) => {
        // Check for JSON - fixed typo in content-type check
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const customer = new Customer({
                name: req.body.name,
                email: req.body.email,
                balance: req.body.balance
            })
            const newCustomer = await customer.save()
            res.send(201, newCustomer)  // Send back the created customer
            return next()
        } catch (err) {
            return next(new errors.InternalError(err.message))
        }
    });

    server.put('/customers/:id', async (req, res) => {
        // Check for JSON - fixed typo in content-type check
        if (!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"))
        }

        try {
            const customer = await Customer.findOneAndUpdate({_id:req.params.id}, req.body)
            res.send(201)  // Send back the created customer
            next()
        } catch (err) {
            return next(new errors.ResourceNotFoundError(`No customer with the id of ${req.params.id    }`))
        }
    });

    //Delete Customer
    server.del('/customers/:id', async (req, res) => {
        try { 
            const customer = await Customer.findOneAndDelete({ _id: req.params.id });
            
            // Check if customer was found and deleted
            if (!customer) {
                res.send(404, new errors.ResourceNotFoundError(`No customer with the id of ${req.params.id}`));
                return;
            }
            
            res.send(204); // No content response
        } catch (err) {
            res.send(500, new errors.InternalError(err.message));
        }
    });
    
}