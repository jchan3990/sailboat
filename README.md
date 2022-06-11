# MERN sailboat
A MERN stack e-commerce web application complete with user sign up, user authentication, item filtering, and checkout via paypal API.

# Description
Fullstack MERN e-commerce web application
1. Allows users to sign up for an account
    - User password encrypted using bcryptjs
2. User authentication on sign up
    - Users provided with valid Bearer token using jsonwebtoken
    - userInfo stored in localStorage until logout / timeout
    - Users can manage profile once logged in
3. Add / remove items from cart
    - Items can be added to cart based on inventory availability
    - Items can be removed and updated from cart
    - On checkout, users can review orders and make changes accordingly
    - Options to pay using Paypal or Stripe
    - Orders saved to MongoDB database with payment/delivery statuses updated
    - Users can see order history and update statuses
4. Searching / Filtering items
    - Users can search for specific items via search bar
    - Filter based on price (high to low), featured items, rating, or latest
5. Admin users
    - Dashboard of user / order metrics
    - Add/remove/update product inventory

# Run Locally
## 1. Clone Repo
```
$ git clone https://github.com/jchan3990/sailboat.git
$ cd sailboat
```
