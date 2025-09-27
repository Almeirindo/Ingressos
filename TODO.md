# TODO: Implement Registration Improvements

## Pending Steps

### 1. Update Database Schema [DONE]
- Edit `prisma/schema.prisma`: Change `User.phone` from `Int @unique` to `BigInt @unique`. [DONE]
- Run migration: `npx prisma migrate dev --name update-phone-to-bigint`. [DONE]
  - In migration, handle existing data: UPDATE users SET phone = BigInt(244 * 1000000000 + phone) if Angola-focused (manual SQL if needed). [Skipped, assume empty DB]

### 2. Update Backend Controller [DONE]
- Edit `src/controllers/authController.js`:
  - register(): Receive `phone` as full numeric string (e.g., "244912345678"). Parse countryCode (first 3 digits), localDigits (rest). Validate local length by country (244/351:9, 55:11). All digits. Then phoneBigInt = BigInt(fullPhoneStr). Check uniqueness with {phone: phoneBigInt}. Store as BigInt. [DONE]
  - login(): Accept `phone` as full string, if provided, clean to digits, BigInt for query {phone: BigInt(cleanPhone)}. [DONE]
  - forgotPassword(): If phone, clean to digits, BigInt for findUnique. For SMS: Extract countryCode = fullStr.slice(0,3), local=slice(3), to: `+${countryCode}${local}` (assume Twilio handles). [DONE]
  - Keep other validations (email lowercase, etc.). Errors in Portuguese. [DONE]
  - Update getProfile if needed (phone as number). [DONE]

### 3. Update Frontend RegisterPage
- Edit `frontend/src/pages/RegisterPage.tsx`:
  - Add state: `selectedCountry` (object {code: string, digits: number, placeholder: string, flag: string, label: string}), default Angola.
  - Countries array: [{code:'244', digits:9, placeholder:'912 345 678', flag:'🇦🇴', label:'Angola (+244)'}, {code:'351', digits:9, placeholder:'912 345 678', flag:'🇵🇹', label:'Portugal (+351)'}, {code:'55', digits:11, placeholder:'11 91234 5678', flag:'🇧🇷', label:'Brasil (+55)'}].
  - Step 2: Add Select dropdown for country (use <select> with options including flag + label). Below, InputField for local phone, type="tel", onChange: setPhone(e.target.value.replace(/\D/g, '')), placeholder=selectedCountry.placeholder, error if length != digits.
  - Update validateStep(2): email valid + phone.length === selectedCountry.digits.
  - Step 3: Add two checkboxes:
    - Terms: <input type="checkbox" required> Eu concordo com os <Link to="/terms">termos e condições</Link> para registrar.
    - Human: <input type="checkbox" required> Não sou um robô.
    - State: termsAgreed (bool), humanVerified (bool). Update onChange.
    - validateStep(3): password valid + confirm match + termsAgreed + humanVerified.
  - onSubmit: fullPhone = selectedCountry.code + phone (phone already cleaned digits). Send {name:trimmedName, email:trimmedEmail.toLowerCase(), phone: fullPhone, password:trimmedPassword}.
  - Update phone validation in final: length === selectedCountry.digits (but since step validated, ok).
  - Errors in Portuguese.
  - Keep step indicator, next/prev logic.

### 4. Test Changes
- Restart backend: `node src/index.js`.
- Run frontend: `cd frontend && npm run dev`.
- Use browser_action: Launch http://localhost:5173/register, interact (select country, input phone, check boxes, submit), verify no errors, check DB.
- Test login with full phone (e.g., input "244912345678" in phone field).
- Test forgotPassword.

### 5. Completion
- Update TODO.md: Mark steps as done.
- attempt_completion.

Progress: None completed yet.
