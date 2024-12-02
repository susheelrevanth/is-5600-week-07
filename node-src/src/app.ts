import express from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import api from './api';
import * as middleware from './middleware';
import bodyParser from 'body-parser';
import * as Products from './products';

const productsFile = path.join(__dirname, 'data/full-products.json');

// Set the port
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3080;

// Boot the app
const app: express.Application = express();

// Register the public directory
app.use(express.static(__dirname + '/public'));

// register the routes
app.use(bodyParser.json());
app.use(middleware.cors);

// Register root route
app.get('/', api.handleRoot);

// Register Products routes
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.put('/products/:id', api.editProduct);
app.delete('/products/:id', api.deleteProduct);
app.post('/products', api.createProduct);

Products.list().then((products) => {
    if (products.length === 0) {
        console.log('No products found, loading from file');
        fs.readFile(productsFile, 'utf-8').then((data) => {
            const products = JSON.parse(data);
            products.forEach((product) => {
                console.log('Creating product', product);
                Products.create(product);
            });
        });
    }
});

// Register Order Routes
app.get('/orders', api.listOrders);
app.post('/orders', api.createOrder);
// edit and delete routes

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
