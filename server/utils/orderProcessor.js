const Order = require('../models/Order');

/**
 * Creates and processes a new order with calculations for subtotal, tax, discount, and total amount
 * @param {Object} orderData - The order information
 * @param {string} orderData.name - Customer name
 * @param {string} orderData.email - Customer email
 * @param {string} orderData.phone - Customer phone
 * @param {string} orderData.item - Item name
 * @param {number} orderData.quantity - Quantity of items ordered
 * @param {number} orderData.price - Price per unit
 * @param {number} orderData.tax - Tax rate as percentage (e.g., 18 for 18%)
 * @param {number} [orderData.discountPercent] - Discount as percentage (e.g., 10 for 10%)
 * @param {number} [orderData.discountAmount] - Fixed discount amount
 * @returns {Promise<Object>} Created order object
 */
async function processOrder({ 
    name,
    email,
    phone,
    item,
    quantity, 
    price, 
    tax, 
    discountPercent = 0, 
    discountAmount = 0 
}) {
    try {
        // Input validation
        if (!name || !email || !phone || !item || !quantity || !price || !tax) {
            throw new Error('Missing required parameters: name, email, phone, item, quantity, price, and tax are required');
        }

        if (quantity <= 0 || price <= 0 || tax < 0) {
            throw new Error('Invalid values: quantity and price must be positive, tax must be non-negative');
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Basic phone validation (adjust regex according to your phone format requirements)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error('Invalid phone number format');
        }

        if (discountPercent < 0 || discountPercent > 100) {
            throw new Error('Invalid discount percentage: must be between 0 and 100');
        }

        if (discountAmount < 0) {
            throw new Error('Invalid discount amount: must be non-negative');
        }

        // Calculate order amounts
        const subtotal = quantity * price;
        
        // Calculate discounts
        const percentDiscount = (subtotal * discountPercent) / 100;
        const totalDiscount = percentDiscount + discountAmount;
        
        // Calculate amount after discount
        const amountAfterDiscount = subtotal - totalDiscount;
        
        // Calculate tax on discounted amount
        const taxAmount = (amountAfterDiscount * tax) / 100;
        const totalAmount = amountAfterDiscount + taxAmount;

        // Create order object with calculated values
        const orderDetails = {
            name,
            email,
            phone,
            item,
            quantity,
            amount: totalAmount, // This matches the Order model's required 'amount' field
            createdAt: new Date()
        };

        // Save to database
        const newOrder = new Order(orderDetails);
        await newOrder.save();

        // Log order details
        console.log('\n=== New Order Created ===');
        console.log('Order ID:', newOrder._id);
        console.log('Quantity:', quantity);
        console.log('Price per unit:', price.toFixed(2));
        console.log('Subtotal:', subtotal.toFixed(2));
        console.log('Discount %:', discountPercent + '%');
        console.log('Discount Amount:', discountAmount.toFixed(2));
        console.log('Total Discount:', totalDiscount.toFixed(2));
        console.log('Amount after Discount:', amountAfterDiscount.toFixed(2));
        console.log('Tax Rate:', tax + '%');
        console.log('Tax Amount:', taxAmount.toFixed(2));
        console.log('Total Amount:', totalAmount.toFixed(2));
        console.log('=====================\n');

        return newOrder;
    } catch (error) {
        console.error('Error processing order:', error.message);
        throw error;
    }
}

// Example usage:
/*
processOrder({
    quantity: 5,
    price: 100,
    tax: 18
}).then(order => {
    console.log('Order processed successfully');
}).catch(error => {
    console.error('Failed to process order:', error.message);
});
*/

module.exports = processOrder;
