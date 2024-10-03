1. Run the project --- (npm run dev)
2. Data Sanitization & Schema Validations (Schema)
3. validator package (for validation like email, password, photoURL, etc)
4. bcrypt (for password incription)
5. cookie-parser (for reading cookie, no need of cookie-parser for saving cookie on browser)
6. JWT - JSON Web Token (contains header, payload and verify signature)
7. add userSchema.method (schema methods)

<!-- DevTinder API's -->
# authRouter
- Post /signup✅
- Post /login✅
- Post /logout✅

# profileRouter
- Get /profile/view✅
- Patch /profile/edit✅
- Patch /profile/password✅

# connectionRequestRouter
- Post /request/send/:status/:toUserId✅
- Post /request/review/:status/:requestId✅

# userRouter
- Get /user/request/received✅
- Get /user/requests✅
- Get /user/feed✅


status: ignored, interested, accepted, rejected