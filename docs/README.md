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