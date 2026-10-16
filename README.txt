E-COMMERCE SHOPPING WEB APPLICATION — EXPERIMENT 4
Authentication and Token Management

This version is based on the previous Experiment 3 project. The existing E-Shop styling, product pages, search/filter, cart, checkout, orders, and CRUD/admin page are retained.

Run:
1. Extract this ZIP.
2. Open the folder containing package.json in VS Code.
3. Run: npm install
4. Run: npm run dev
5. Open the localhost URL shown in the terminal.

Login flow:
1. Choose Sign Up and create an account using any username, email, and password.
2. Return to Login and sign in using that username/email and password.
3. A unique demo access token is generated on each successful login and saved in browser Local Storage under the key `token`.
4. To view it, open browser DevTools > Application > Local Storage > your localhost URL.
5. Logging out removes the token. Cart, Checkout, and Orders remain protected routes.

Token note: This is an educational client-side demo token, not a server-signed JWT. Accounts and passwords are stored in browser Local Storage for lab demonstration only. Do not use this authentication design for a real website. Product data is loaded from Fake Store API and requires internet access.

EXPERIMENT 1: TESTING E-COMMERCE COMPONENTS (JEST + REACT TESTING LIBRARY)

This updated project includes automated tests for ProductCard, the Home/product-list rendering and filtering controls, Cart, and Checkout.

Run the tests:
1. Open the folder containing package.json in VS Code.
2. Run: npm install
3. Run: npm test
4. Jest prints the passed/failed test cases in the terminal.

Optional watch mode: npm run test:watch

Test coverage includes:
- Product name, category and price rendering.
- Search and category filter input interactions.
- Add-to-cart button callback.
- Cart item rendering, remove operation, quantity increment/decrement and total display.
- Empty cart state.
- Checkout required-field validation, order placement and clearing the cart.

Testing note: The automated test suite has been added to the ZIP, but test execution requires installing the listed npm dependencies. No passing test result is claimed until `npm test` is run successfully on your machine.


EXPERIMENT 2: OPTIMIZE E-COMMERCE APPLICATION

Implemented features:
a) Lazy loading: ProductDetail, Checkout, and other route components are imported with React.lazy() and rendered through Suspense. Product images use loading="lazy" and decoding="async".
b) Code splitting: Vite creates separate chunks for lazy-loaded route components, reducing the initial JavaScript loaded for the first screen.
c) Rendering and image optimization: API calls use AbortController to cancel stale requests; product filtering uses useMemo; product images load lazily and use a local fallback image if they fail.
d) PWA: public/manifest.webmanifest, public/sw.js, and public/shop-icon.svg are included. The service worker is registered in production builds only. It caches the app shell and same-origin static resources; it deliberately does not cache API/auth responses.
e) Accessibility: skip-to-main-content link, visible keyboard focus indicators, semantic main region, existing accessible search/category labels, form labels, and reduced-motion support.
f) Security practices: API requests validate response status and shape, requests are abortable, React renders API strings as text (no dangerouslySetInnerHTML), external product image requests use referrerPolicy="no-referrer", and no credentials or authentication tokens are cached by the service worker.

PWA testing:
1. Run npm install.
2. Run npm run build.
3. Run npm run preview.
4. Open the preview URL (service worker is only registered in production/preview mode).
5. In Chrome DevTools > Application, inspect Manifest and Service Workers.
Note: The service worker provides a basic offline app shell, not full offline product/API functionality. The public Fake Store API still needs an internet connection. PWA installability requirements vary by browser and localhost/HTTPS deployment.

Security note: This is a student demo. Client-side checks are not a substitute for server-side authentication, validation, HTTPS, or secure token storage in a production system.

EXPERIMENT 3: DEPLOY E-COMMERCE APPLICATION
See DEPLOYMENT_EXPERIMENT3.txt for production build, GitHub Pages, Netlify, Vercel, post-deployment checks and comparison. Added netlify.toml, vercel.json, and a GitHub Pages Actions workflow.
