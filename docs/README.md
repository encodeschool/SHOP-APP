# 🌍 Localization (I18N) to multi language

## 1. Frontend (React) Localization
### Step 1: Choose a library

Recommended: react-i18next

```bash
npm install i18next react-i18next i18next-browser-languagedetector --legacy-peer-deps
```

### Step 2: Create translation files

Example folder structure:

```psql
/frontend/src/i18n/
  en.json
  ru.json
  uz.json
```

en.json:

```json
{
  "welcome": "Welcome",
  "login": "Login",
  "register": "Register",
  "cart": "Cart",
  "favorites": "Favorites"
}
```

ru.json:
```json
{
  "welcome": "Добро пожаловать",
  "login": "Вход",
  "register": "Регистрация",
  "cart": "Корзина",
  "favorites": "Избранное"
}
```
### Step 3: Initialize i18n

src/i18n.js:

```javascript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./i18n/en.json";
import ru from "./i18n/ru.json";
import uz from "./i18n/uz.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ru: { translation: ru }, uz: { translation: uz } },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
```
### Step 4: Use translations

```javascript
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav>
      <span>{t("welcome")}</span>
      <button>{t("login")}</button>
      <button>{t("register")}</button>
    </nav>
  );
}
```

### Step 5: Language switcher
```html
<button onClick={() => i18n.changeLanguage("en")}>EN</button>
<button onClick={() => i18n.changeLanguage("ru")}>RU</button>
<button onClick={() => i18n.changeLanguage("uz")}>UZ</button>
```

## 2. Backend (Spring Boot) Localization
### Step 1: Enable message source

src/main/resources/messages.properties (default)

```properties
welcome=Welcome
login=Login
register=Register
cart=Cart
favorites=Favorites
```

messages_ru.properties:
```properties
welcome=Добро пожаловать
login=Вход
register=Регистрация
cart=Корзина
favorites=Избранное
```

messages_uz.properties:
```properties
welcome=Xush kelibsiz
login=Kirish
register=Ro'yxatdan o'tish
cart=Savatcha
favorites=Sevimlilar
```

### Step 2: Configure Spring Boot

```java
@Bean
public MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
    messageSource.setBasename("classpath:messages");
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
}

@Bean
public LocaleResolver localeResolver() {
    SessionLocaleResolver slr = new SessionLocaleResolver();
    slr.setDefaultLocale(Locale.ENGLISH);
    return slr;
}

@Bean
public LocaleChangeInterceptor localeChangeInterceptor() {
    LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
    lci.setParamName("lang");
    return lci;
}

@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(localeChangeInterceptor());
}
```

Now you can call:

```java
@Autowired
private MessageSource messageSource;

messageSource.getMessage("welcome", null, Locale.forLanguageTag("ru"));
```

Or use ?lang=ru in API calls to return localized messages.

## 3. Dynamic Product & Category Names

Store translations in the database for products, categories, and brands:

```psql
ProductTranslation
├── product_id
├── language_code (en, ru, uz)
├── name
├── description
```

Return the appropriate language from backend based on Accept-Language header or query param.

## 4. Additional Recommendations

- Use i18next for frontend for all UI labels, messages, tooltips.
- Keep backend translations for API error messages and validation messages.
- Detect user language via browser or account settings.
- For multi-language content (products, categories), create separate translation tables in DB.

# 🚀 Future Implementation

## 🔹 When your ecommerce app is small (MVP / Early Stage)

- Spring Boot + React + PostgreSQL/MySQL is enough.
- Keep it simple, focus on features (products, categories, checkout, payments, auth).
- Use caching (e.g., Spring Cache + Redis) for faster product/category retrieval.

## 🔹 When you want to scale (More users, bigger dataset, high traffic)
Here are common production-level technologies ecommerce apps adopt:

### 1. Message Broker (RabbitMQ / Kafka)

- ✅ Use when you need asynchronous communication between services.
- Example in ecommerce:
  - Send order confirmation emails without blocking checkout.
  - Sync inventory updates across warehouses.
  - Process payment success events asynchronously.
- RabbitMQ → lightweight, easier for queue-based workloads.
- Kafka → better for event streaming, real-time analytics, logs, large-scale pipelines.
#### 👉 For your case:
- Start with RabbitMQ (order events, email notifications).
- Switch to Kafka if you need high throughput event-driven architecture later.

### 2. Redis (Caching & Session Management)
- Cache popular products, categories, search results.
- Store shopping carts & user sessions (faster than DB).
- Great performance boost with minimal effort.

### 3. Elasticsearch (Search & Filtering)
- Full-text search for product names/descriptions.
- Advanced filters (price range, attributes, categories) at scale.
- Recommended once your product catalog grows large.

### 4. Microservices / Modularization
- Split monolith into smaller services (if app grows big):
  - Auth Service
  - Product Service
  - Order Service
  - Payment Service
  - Inventory Service
#### 👉 Use Spring Cloud + Eureka or Kubernetes when scaling out.

### 5. CDN & Image Storage
- Store product images in AWS S3 / Google Cloud Storage.
- Use a CDN (Cloudflare, AWS CloudFront) for fast delivery worldwide.

### 6. Monitoring & Logging
- Add Prometheus + Grafana for metrics (API response time, errors, orders/sec).
- Use ELK stack (Elasticsearch + Logstash + Kibana) for log analysis.

### 🛠 Recommended Next Steps for You
1. Add Redis caching → immediate performance gain.
2. Add RabbitMQ → offload email/notification/async tasks.
3. Add Elasticsearch once search becomes more complex.
4. Later, consider splitting into microservices if you expect millions of users.

### ⚡ My advice:
Don’t add tech just to “be big.” Add it when you feel pain (slow queries, blocking checkout, lots of traffic).

But it’s smart to design your architecture with extension points (event queue, cache layer, search) so you can plug them in when needed.