Aurora is a full-stack fashion e-commerce web app that lets users browse products, add items to a cart, check out using Stripe, chat with an AI fashion stylist powered by Google Gemini and give users an opportunity to test the look and vibe on themselves before ordering a product.

# Main features 
•	User registration and secure login.
•	Product catalogue with images.
•	Shopping cart and checkout flow with order creation in a MySQL database.
•	Stripe Embedded Checkout for payments.
•	Floating AI stylist chat bot that suggests outfits and colour combinations.
•	AI – powered try-on.

# How to run the project 

Clone the repository
1.	git clone https://github.com/ks-randhawa0649/aurora.git
2.	cd aurora
3.	git checkout main
Install dependencies
4.	npm --force install or yarn
Start the development server
5.	npm run dev or yarn dev
Then open: http://localhost:3000


#Configuration (.env.local)
.env.local is to be placed at project root, this file will be shared over email as well as brightspave to ensure apis keys are not compromised and thus dont expire before backend can be tested.

# Using the system
1.	Go to http://localhost:3000.
2.	Register a new account and log in #to test the project you can also use these credentials: email : test1@aurora.com , password: test1 .
3.	Browse products, add items to the cart, and proceed to checkout.
4.	Enter test card details on the Stripe Embedded Checkout page (using Stripe’s test cards).
5.	After successful payment, you’ll be redirected back to the site, and an order will be stored in MySQL.
6.	Click the floating Aurora AI button to open the chat and ask the stylist for outfit ideas and style suggestions.

# Dependencies
All Node packages used by the project are installed automatically via npm install using package.json. 
All runtime dependencies (with versions) used in this project are listed below for reference.
•	@apollo/client - 3.4.16
•	@apollo/react-hooks - 4.0.0
•	@apollo/react-ssr - 4.0.0
•	@emotion/core - 11.0.0
•	@emotion/react - 11.4.1
•	@google/genai - 1.30.0
•	@google/generative-ai - 0.24.1
•	@stripe/react-stripe-js - 5.3.0
•	@stripe/stripe-js - 8.2.0
•	apollo-boost - 0.4.9
•	bcryptjs - 3.0.3
•	google-map-react - 2.1.10
•	graphql - 15.6.0
•	graphql-tag - 2.12.5
•	imagesloaded - 4.1.4
•	isotope-layout - 3.0.6
•	jquery - 3.7.1
•	js-cookie - 3.0.1
•	jsonwebtoken - 9.0.2
•	masonry-layout - 4.2.2
•	mysql2 - 3.15.3
•	next - 10.2.3
•	next-apollo - 5.0.4
•	next-auth - 3.29.10
•	next-redux-saga - 4.1.2
•	next-redux-wrapper - 7.0.5
•	node-fetch - 3.0.0
•	react - 16.8.0
•	react-awesome-reveal - 3.8.1
•	react-bootstrap - 1.6.4
•	react-countdown - 2.3.2
•	react-countup - 6.0.0
•	react-dom - 16.8.0
•	react-helmet - 6.1.0
•	react-image-lightbox - 5.1.4
•	react-image-magnifiers - 1.4.0
•	react-infinite-scroll-component - 6.1.0
•	react-input-range - 1.3.0
•	react-lazy-load-image-component - 1.5.1
•	react-modal - 3.14.3
•	react-owl-carousel2 - 0.3.0
•	react-redux - 7.2.5
•	react-slide-toggle - 0.3.5
•	react-sticky-box - 0.9.3
•	react-tabs - 3.2.2
•	react-toastify - 8.0.3
•	redux - 4.1.1
•	redux-persist - 6.0.0
•	redux-saga - 1.1.3
•	sass - 1.42.1
•	stripe - 19.2.0
•	supports-color - 9.0.2
