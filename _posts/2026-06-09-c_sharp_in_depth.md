---
title: C# in Depth
description: A Comprehensive Guide to the C# Programming Language
image: /assets/images/c_sharp_in_depth.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
---

## توضیحات
کتاب *C# in Depth* نوشته‌ی **Jon Skeet** یکی از معتبرترین و عمیق‌ترین منابع برای یادگیری زبان C# محسوب می‌شود. این کتاب با فرض آشنایی اولیه خواننده با C# 1، تمرکز خود را روی تکامل زبان از نسخه‌ی 2 به بعد می‌گذارد و به‌جای پوشش مقدماتی، وارد جزئیات واقعی زبان می‌شود.  
ویرایش چهارم (2019) شامل پوشش کامل C# 5، 6 و 7 است و فصلی هم به C# 8 و آینده‌ی زبان اختصاص دارد. موضوعاتی مانند `async/await`، Generics، Nullable value types، Expression-bodied members، Pattern matching، Tuples، و بهینه‌سازی با `ref`/`in` به‌صورت دقیق و با مثال‌های واقعی پوشش داده شده‌اند.  
Jon Skeet در این کتاب نه‌تنها توضیح می‌دهد که C# چطور کار می‌کند، بلکه نشان می‌دهد چرا طراحی زبان به این شکل است — چه جاهایی منسجم است و چه جاهایی کمبود یا ضعف دارد. این رویکرد کتاب را از یک مرجع صرف خارج می‌کند و به یک راهنمای فکری تبدیل می‌کند.

## نظر
- `امتیاز` : 08/10
- `به دیگران توصیه می‌کنم` : بله
- `دوباره می‌خوانم` : بله
- `ایده برجسته` : C# یک زبان در حال تکامل است، نه یک ابزار ثابت — فهمیدن دلیل اضافه شدن هر feature، درک عمیق‌تری از طراحی زبان به توسعه‌دهنده می‌دهد
- `تاثیر در من` : دید من نسبت به کدنویسی C# از سطح «استفاده از feature» به سطح «درک چرایی feature» ارتقا پیدا کرد. به‌خصوص فصل‌های async/await و Generics نحوه‌ی دیباگ و معماری کدم را تغییر داد
- `نکات مثبت` : عمق فنی استثنایی، توضیح منطق طراحی زبان نه فقط syntax، مثال‌های واقعی و کاربردی، پوشش تاریخی تکامل زبان که context ایجاد می‌کند، نوشته شده توسط کسی که عمیقاً در جامعه C# تاثیرگذار است
- `نکات منفی` : کتاب تا C# 7 را پوشش می‌دهد و C# 8 به بعد (record types، init-only setters، C# 9/10/11/12) در آن نیست؛ برای توسعه‌دهندگان .NET 6/8 باید با منابع مکمل تکمیل شود. برای کسانی که با C# 1 آشنایی ندارند، ورود سریع است

## مشخصات
- `نویسنده` : Jon Skeet
- `انتشارات` : Manning Publications
- `صفحه مشخصات` : 

## بخش‌هایی از کتاب

محتوای کتاب با موفقیت خوانده شد. حالا اولین بخش را به صورت ساختارمند تدریس می‌کنم:

## 📘 فصل ۱ — Survival of the Sharpest

### بخش اول: C# چگونه تکامل یافت؟

**جان اسکیت** در ابتدای فصل یک سوال مهم مطرح می‌کند: وقتی یک زبان برنامه‌نویسی در طول سال‌ها تغییر می‌کند، آیا این تغییرات هدفمند هستند یا تصادفی؟ 

پاسخ برای C# کاملاً هدفمند است. اسکیت می‌گوید به جای نشان دادن یک مثال واحد از تمام نسخه‌ها، بهتر است **محورهای تکامل** را بشناسیم. 

### محور اول: سیستم تایپ (Type System)

C# از همان ابتدا یک زبان **Statically Typed** بود؛ یعنی نوع متغیرها، پارامترها و مقادیر بازگشتی توابع در زمان کامپایل مشخص می‌شود. 

اسکیت یک مقایسه کلیدی ارائه می‌دهد:

**C# 1 — قبل از Generics:**
```csharp
public class Bookshelf
{
    public IEnumerable Books { get { ... } }
}
```
سوال: نوع هر عنصر در `Books` چیست؟ کامپایلر نمی‌داند. 

**C# 2 — با Generics:**
```csharp
public class Bookshelf
{
    public IEnumerable<Book> Books { get { ... } }
}
```
حالا کامپایلر می‌داند هر عنصر از نوع `Book` است و اگر جای دیگری این را نقض کنی، **خطای کامپایل** می‌دهد، نه runtime exception. 

> **نکته کلیدی:** هر چه قرارداد کد شما **دقیق‌تر** باشد، کامپایلر **بیشتر** می‌تواند اشتباهات شما را پیدا کند. این اصل در تمام C# in Depth تکرار می‌شود.

### محور دوم: کد مختصرتر (Concise Code)

اسکیت یک مثال تدریجی از تکامل Delegates می‌آورد که نشان می‌دهد C# چقدر Ceremony (تشریفات اضافه) را حذف کرده: 

| نسخه | کد | مشکل |
|------|----|------|
| **C# 1** | `button.Click += new EventHandler(HandleButtonClick);` | پرحجم، نیاز به متد جداگانه |
| **C# 2** | `button.Click += HandleButtonClick;` | ساده‌تر با Method Group Conversion |
| **C# 2** | `button.Click += delegate { MessageBox.Show("Clicked!"); };` | Anonymous Method، نیازی به متد جداگانه نیست |
| **C# 3** | `button.Click += (sender, args) => MessageBox.Show("Clicked!");` | Lambda Expression، خواناترین شکل |

### محور سوم: LINQ

اسکیت این قطعه کد را به عنوان یک «شوک» معرفی می‌کند: 

```csharp
var offers =
    from product in db.Products
    where product.SalePrice <= product.Price / 2
    orderby product.SalePrice
    select new {
        product.Id, product.Description,
        product.SalePrice, product.Price
    };
```

این کد در سال ۲۰۰۷ برای یک توسعه‌دهنده C# 2 **غیرقابل تصور** بود. نه تنها سینتکس شبیه SQL نیست (بلکه داخل کد C# است)، بلکه **IntelliSense** دارد، **compile-time checking** دارد و می‌تواند **هم روی database و هم روی in-memory collections** اجرا شود. 

### محور چهارم: Async/Await

اسکیت این ویژگی C# 5 را یک **تغییر بنیادین** می‌داند، نه صرفاً یک feature جدید: 

```csharp
private async Task UpdateStatus()
{
    Task<Weather> weatherTask = GetWeatherAsync();
    Task<EmailStatus> emailTask = GetEmailStatusAsync(); // هر دو همزمان شروع می‌شوند

    Weather weather = await weatherTask;       // انتظار async
    EmailStatus email = await emailTask;

    weatherLabel.Text = weather.Description;   // UI thread امن است
    inboxLabel.Text = email.InboxCount.ToString();
}
```

نکته مهم: این کد دو عملیات را **همزمان (concurrent)** شروع می‌کند و سپس نتایج هر دو را منتظر می‌ماند، در حالی که **UI thread بلوک نمی‌شود**. قبل از async/await این کار پیچیده و مستعد خطا بود. 

### محور پنجم: Performance و Efficiency (C# 7)

اسکیت اینجا یک اعتراف صادقانه دارد: برخی از ویژگی‌های C# 7 مثل `ref returns`، `in parameters` و `ref-like structs` عمداً **پیچیدگی** را برای **performance** قربانی می‌کنند. 

> **هشدار اسکیت:** این ویژگی‌ها را فقط وقتی **واقعاً** نیاز داری استفاده کن. بهتر است اول کد تمیز بنویسی، بعد اگر profiling نشان داد مشکل performance داری، سراغ این ابزارها بروی.

---

## بخش دوم: تکامل Platform و Community

### ۱.۲ — یک Platform در حال تکامل

اسکیت در این بخش نکته‌ای را مطرح می‌کند که بسیاری از توسعه‌دهندگان نادیده می‌گیرند: **زبان C# و Platform آن دو چیز جداگانه‌اند.** 

وقتی می‌گویی «C# برنامه می‌نویسم»، در واقع روی یکی از این Platformها کار می‌کنی:

| Platform | توضیح |
|----------|--------|
| **.NET Framework** | نسخه اصلی و اولیه، فقط Windows |
| **.NET Core** | نسخه Cross-Platform و Open Source، آینده .NET |
| **Xamarin** | توسعه موبایل (iOS / Android) با C# |
| **Unity** | بازی‌سازی با C# |

نکته مهم اینجاست: **نسخه C# ای که استفاده می‌کنی، با Platform ای که رویش هستی گره خورده است.** به عنوان مثال، برخی ویژگی‌های C# 7 فقط روی .NET Core به درستی کار می‌کنند، چون به CLR جدیدتری نیاز دارند. 

اسکیت یک خط زمانی مهم را یادآوری می‌کند:
- **2006** — Amazon EC2 راه‌اندازی شد (تولد Cloud Computing)
- **2008** — Google App Engine معرفی شد
- **2011** — Xamarin توسط تیم Mono ساخته شد
- **2013** — Docker ظهور کرد
- **2016** — .NET Core 1.0 منتشر شد و همه چیز عوض شد

> **نکته کلیدی اسکیت:** ظهور .NET Core یک اتفاق کوچک نبود. این اولین باری بود که Microsoft، .NET را به صورت **Open Source** و **Cross-Platform** منتشر کرد و آن را به عنوان **اولویت اصلی سرمایه‌گذاری** در .NET اعلام کرد — چیزی که در ۲۰۰۸ کاملاً غیرقابل تصور به نظر می‌رسید. 

### ۱.۳ — یک Community در حال تکامل

این بخش کوتاه اما مهم است. اسکیت می‌گوید C# دیگر فقط یک زبان «Microsoft برای Windows» نیست. 

**چند تغییر بنیادی در Community:**

- **GitHub و Open Source:** کد کامپایلر C# (Roslyn) روی GitHub است. هر کسی می‌تواند باگ گزارش دهد، PR بفرستد یا حتی برای ویژگی‌های جدید **رای** بدهد
- **Language Design در فضای عمومی:** مخزن `dotnet/csharplang` روی GitHub، محل بحث درباره تمام تصمیمات طراحی زبان است. تصمیماتی که قبلاً پشت درهای بسته Microsoft گرفته می‌شد
- **Stack Overflow:** خود اسکیت (با بیشترین reputation تاریخ Stack Overflow) بخشی از این Community است و می‌گوید تعامل با توسعه‌دهندگان دیگر، **بهترین روش یادگیری** اوست

### ۱.۴ — یک کتاب در حال تکامل

اسکیت در اینجا صادقانه توضیح می‌دهد که **چرا این کتاب به گونه خاصی نوشته شده** و چه چیزی آن را از کتاب‌های معمول C# متمایز می‌کند. 

**سه اصل ساختاری کتاب:**

**اول — Mixed-Level Coverage (پوشش چندسطحی):**
کتاب فرض نمی‌کند همه ویژگی‌ها برایت جدید هستند. اگر C# کار می‌کنی، احتمالاً با برخی مفاهیم آشنا هستی. اسکیت عمداً گاهی سریع از مفاهیم رد می‌شود و گاهی عمیق فرو می‌رود — بسته به اینکه آن مفهوم **چقدر درک غلط رایجی** دارد. 

**دوم — Noda Time به عنوان مثال واقعی:**
اکثر مثال‌های کتاب از **Noda Time** گرفته شده‌اند؛ کتابخانه‌ای که خود اسکیت نوشته برای کار با تاریخ و زمان در .NET. دلیل این انتخاب: 

- یک codebase واقعی است، نه مثال‌های ساختگی
- مشکلات واقعی Performance و Design Pattern در آن حل شده
- وقتی اسکیت یک ویژگی زبان را توضیح می‌دهد، می‌توانی ببینی **چرا** و **کجا** واقعاً استفاده می‌شود

**سوم — انتخاب واژه‌ها با دقت:**
اسکیت درباره واژه‌هایی مثل «type» و «class» هشدار می‌دهد. خیلی از توسعه‌دهندگان این دو را مترادف می‌دانند، اما در C#:
- **Type** (نوع) مفهوم گسترده‌تری است — شامل `class`، `struct`، `interface`، `enum` و `delegate`
- **Class** فقط یکی از انواع Type است

> این دقت در واژه‌گزینی در طول کتاب اهمیت زیادی دارد، چون وقتی اسکیت می‌گوید «type» دقیقاً همین مفهوم گسترده را اراده می‌کند.

---

## فصل ۲ — C# 2 | بخش اول: Generics

### مشکل قبل از Generics

اسکیت فصل ۲ را با یک سوال ساده شروع می‌کند: **قبل از C# 2، چطور یک Collection از اشیاء مدیریت می‌کردیم؟**

جواب: با `ArrayList` — و این یعنی دردسر. 

```csharp
// C# 1 — بدون Generics
ArrayList list = new ArrayList();
list.Add(new Product { Name = "کیبورد", Price = 200 });
list.Add(new Product { Name = "ماوس",   Price = 100 });
list.Add(42); // کامپایلر هیچ اعتراضی نمی‌کند!

// موقع خواندن، مجبور به Cast هستی
foreach (var item in list)
{
    var product = (Product)item; // اگر 42 باشد → InvalidCastException در Runtime!
}
```

**سه مشکل اساسی این رویکرد:** 

- **Type Safety ندارد:** می‌توانی هر چیزی — حتی `int` — داخل لیست محصولات بگذاری و کامپایلر چیزی نمی‌گوید
- **Boxing/Unboxing برای Value Types:** هر بار که یک `int` یا `struct` وارد `ArrayList` می‌شود، **Boxing** اتفاق می‌افتد؛ یعنی یک object جدید روی Heap ساخته می‌شود — این مستقیماً روی Performance تاثیر منفی دارد
- **کد ناخوانا:** Cast های پراکنده در سرتاسر کد، خوانایی و نگهداری را سخت می‌کند

### Generics وارد می‌شوند

```csharp
// C# 2 — با Generics
var list = new List<Product>();
list.Add(new Product { Name = "کیبورد", Price = 200 });
list.Add(new Product { Name = "ماوس",   Price = 100 });
list.Add(42); // ❌ خطای کامپایل — دیگر ممکن نیست

foreach (var product in list)
{
    // نیازی به Cast نیست، کامپایلر می‌داند product از نوع Product است
    Console.WriteLine(product.Name);
}
```

اسکیت تاکید می‌کند که Generics یک **syntactic sugar** ساده نیستند — در سطح CLR پیاده‌سازی شده‌اند. یعنی `List<int>` در واقع با `List<string>` **دو نوع کاملاً متفاوت** در Runtime هستند. 

### چه چیزی می‌تواند Generic باشد؟

اسکیت این سوال را مطرح می‌کند که اغلب توسعه‌دهندگان پاسخ کاملش را نمی‌دانند. 

| نوع | مثال |
|-----|------|
| **Class** | `List<T>`, `Dictionary<TKey, TValue>` |
| **Struct** | `Nullable<T>`, `KeyValuePair<TK, TV>` |
| **Interface** | `IEnumerable<T>`, `IComparer<T>` |
| **Delegate** | `Action<T>`, `Func<T, TResult>` |
| **Method** | `public T Parse<T>(string input)` |

> **نکته:** در C# 2، **Property** و **Field** نمی‌توانند مستقل Generic باشند. می‌توانند از Type Parameter کلاس استفاده کنند، اما نمی‌توانند Type Parameter مستقل داشته باشند.

### Type Inference برای متدها

```csharp
// بدون Type Inference — پرحجم
var pair = Tuple.Create<string, int>("محمدحسین", 28);

// با Type Inference — کامپایلر نوع را از آرگومان‌ها می‌فهمد
var pair = Tuple.Create("محمدحسین", 28);
```

اسکیت یک قانون مهم بیان می‌کند: **Type Inference فقط برای متدهای Generic کار می‌کند، نه برای کلاس‌های Generic.** 

یعنی این کد کار نمی‌کند:
```csharp
// ❌ خطا — نمی‌توانی Type کلاس را Infer کنی
var list = new List("hello", "world");

// ✅ درست
var list = new List<string> { "hello", "world" };
```

### Type Constraints — محدود کردن T

گاهی می‌خواهی T فقط انواع خاصی باشد. اسکیت پنج نوع Constraint را معرفی می‌کند: 

```csharp
// ۱. T باید یک class (Reference Type) باشد
public class Repository<T> where T : class { }

// ۲. T باید یک struct (Value Type) باشد
public class ValueWrapper<T> where T : struct { }

// ۳. T باید از IEntity ارث برده باشد
public class Service<T> where T : IEntity { }

// ۴. T باید Constructor بدون پارامتر داشته باشد
public class Factory<T> where T : new() { }

// ۵. ترکیب چند Constraint
public class AdvancedRepo<T> where T : class, IEntity, new() { }
```

**یک مثال واقعی از کاربرد Constraint:** 

```csharp
// می‌خواهیم دو مقدار را با هم مقایسه کنیم
// بدون Constraint، نمی‌توانیم از CompareTo استفاده کنیم
public static T Max<T>(T first, T second) where T : IComparable<T>
{
    return first.CompareTo(second) >= 0 ? first : second;
}

var result = Max(42, 17);       // → 42
var result2 = Max("B", "A");    // → "B"
```

### عملگرهای `default` و `typeof`

اسکیت این دو عملگر را در کنار Generics معرفی می‌کند چون اغلب در کنار هم استفاده می‌شوند: 

```csharp
// default — مقدار پیش‌فرض هر نوع را برمی‌گرداند
public T GetDefaultValue<T>()
{
    return default(T);
    // اگر T یک Reference Type باشد → null
    // اگر T یک int باشد → 0
    // اگر T یک bool باشد → false
}

// typeof — Type object مربوط به T را برمی‌گرداند
public void PrintTypeName<T>()
{
    Console.WriteLine(typeof(T).Name);
}

PrintTypeName<int>();    // → "Int32"
PrintTypeName<string>(); // → "String"
```

### Generic Type Initialization و State

یک نکته ظریف که اسکیت روی آن تاکید می‌کند: **هر ترکیب منحصربه‌فرد از Type Arguments، یک کلاس کاملاً مجزا در Runtime است.** 

```csharp
public class Counter<T>
{
    // این فیلد برای Counter<int> و Counter<string> کاملاً جداگانه است
    private static int _instanceCount = 0;

    public Counter()
    {
        _instanceCount++;
    }

    public static int InstanceCount => _instanceCount;
}

var a = new Counter<int>();
var b = new Counter<int>();
var c = new Counter<string>();

Console.WriteLine(Counter<int>.InstanceCount);    // → 2
Console.WriteLine(Counter<string>.InstanceCount); // → 1
```

این رفتار می‌تواند غافلگیرکننده باشد — مخصوصاً اگر انتظار داری یک Static Field بین تمام نمونه‌ها مشترک باشد.

---

## فصل ۲ — بخش دوم: Nullable Value Types

### مشکل اصلی — وقتی «نبود مقدار» معنا دارد

اسکیت این بخش را با یک سوال فلسفی شروع می‌کند: **چطور غیبت یک مقدار را نمایش دهیم؟**

برای Reference Types مشکلی نیست — می‌توانی `null` برگردانی. اما برای Value Types مثل `int`، `bool` یا `DateTime` این امکان در C# 1 وجود نداشت. 

**مثال واقعی:** تصور کن یک فرم ثبت‌نام داری که فیلد «تاریخ تولد» اختیاری است:

```csharp
// C# 1 — راه‌حل‌های ناخوشایند

// راه‌حل اول: استفاده از یک مقدار جادویی (Magic Value)
int birthYear = -1; // آیا -1 یعنی "وارد نشده" یا واقعاً -1 است؟

// راه‌حل دوم: یک bool جداگانه نگه داشتن
bool hasBirthYear = false;
int birthYear = 0; // این دو فیلد باید همیشه باهم مدیریت شوند — مستعد باگ!

// راه‌حل سوم: Boxed کردن به object
object birthYear = null; // Boxing overhead + از دست دادن Type Safety
```

هر سه راه‌حل بد هستند. اسکیت می‌گوید هدف C# 2 این بود که **«نبود مقدار»** را به عنوان یک مفهوم درجه‌یک در زبان معرفی کند. 

### ساختار CLR — `Nullable<T>`

در سطح CLR، Nullable Value Types با یک `struct` جنریک پیاده‌سازی شده‌اند: 

```csharp
public struct Nullable<T> where T : struct
{
    private readonly bool _hasValue;
    private readonly T _value;

    public Nullable(T value)
    {
        _hasValue = true;
        _value = value;
    }

    public bool HasValue => _hasValue;

    public T Value
    {
        get
        {
            if (!_hasValue)
                throw new InvalidOperationException("Nullable object must have a value.");
            return _value;
        }
    }

    public T GetValueOrDefault() => _value;
    public T GetValueOrDefault(T defaultValue) => _hasValue ? _value : defaultValue;
}
```

**نکته مهم:** چون `Nullable<T>` خودش یک `struct` است، هیچ‌وقت Boxing اتفاق نمی‌افتد — مگر در یک حالت خاص که اسکیت بعداً توضیح می‌دهد. 

### Syntactic Sugar — زبان C# چه کمکی می‌کند؟

کامپایلر C# 2 یک سینتکس مختصر برای `Nullable<T>` معرفی کرد:

```csharp
// این دو خط کاملاً معادل هستند:
Nullable<int> a = new Nullable<int>(42);
int? a = 42;

// مقداردهی null
int? b = null;        // همان: new Nullable<int>()

// بررسی مقدار
if (b.HasValue)
    Console.WriteLine(b.Value);

// یا با Pattern Matching مدرن‌تر (C# 7+)
if (b is int value)
    Console.WriteLine(value);
```

### عملگرهای کلیدی Nullable

**اول — Null Coalescing Operator (`??`):**

```csharp
int? userAge = null;

// بدون ??
var age = userAge.HasValue ? userAge.Value : 18;

// با ?? — خواناتر و مختصرتر
var age = userAge ?? 18;

// زنجیره‌ای
int? a = null;
int? b = null;
int c = 25;
var result = a ?? b ?? c; // → 25
```

**دوم — Lifted Operators:**

اسکیت این مفهوم را خیلی دقیق توضیح می‌دهد. وقتی روی `int?` عملیات ریاضی انجام می‌دهی، کامپایلر به صورت خودکار عملگرها را «بالا می‌برد»: 

```csharp
int? x = 10;
int? y = null;

var sum = x + y;   // → null  (نه خطا!)
var mul = x * 5;   // → 55   (int? × int → int?)
var cmp = x > 5;   // → true  (bool، نه bool?)
```

**قانون Lifted Operators:**
- اگر هر یک از operandها `null` باشد، نتیجه `null` است
- **استثنا:** عملگرهای مقایسه‌ای (`>`, `<`, `==`) نتیجه `bool` (نه `bool?`) برمی‌گردانند — و اگر یک طرف `null` باشد، نتیجه `false` است

```csharp
int? a = null;
int? b = null;

Console.WriteLine(a == b);  // → true  (هر دو null هستند)
Console.WriteLine(a > b);   // → false (نه null!)
Console.WriteLine(a < b);   // → false
```

### یک تله مهم — Boxing و Nullable

اسکیت یک رفتار ظریف را توضیح می‌دهد که می‌تواند منبع باگ باشد: 

```csharp
int? a = 42;
int? b = null;

object boxedA = a; // Boxing → یک object از نوع int (نه Nullable<int>!)
object boxedB = b; // Boxing → null (نه یک Nullable<int> خالی!)

// یعنی:
Console.WriteLine(boxedA.GetType()); // → System.Int32  (نه Nullable<int>)
Console.WriteLine(boxedB == null);   // → true
```

**نتیجه عملی:** وقتی یک `int?` با مقدار را Boxing می‌کنی، مقدار داخلش `int` خالص می‌شود — اطلاعات Nullable بودنش از بین می‌رود. این مهم است اگر با Reflection یا API هایی کار کنی که با `object` سروکار دارند.

### مقایسه `null` در Nullable

```csharp
int? x = null;
int? y = null;
int? z = 5;

// مقایسه با null
Console.WriteLine(x == null);  // → true
Console.WriteLine(z == null);  // → false

// مقایسه دو Nullable
Console.WriteLine(x == y);     // → true
Console.WriteLine(x == z);     // → false
```

> **توصیه اسکیت:** برای بررسی اینکه آیا یک `Nullable` مقدار دارد یا نه، از `HasValue` یا مقایسه با `null` استفاده کن — **نه** از `.Value` مستقیم، چون اگر `HasValue` برابر `false` باشد، `InvalidOperationException` پرتاب می‌شود.

---

## فصل ۲ — بخش سوم: Simplified Delegate Creation

### Delegate چیست؟ — مرور سریع

قبل از اینکه ببینیم C# 2 چه بهبودی آورد، باید بدانیم Delegate در C# 1 چقدر پرحجم بود.

**Delegate** در واقع یک «اشاره‌گر به متد» است — با این تفاوت که Type-Safe است. می‌توانی یک متد را مثل یک مقدار پاس بدهی، ذخیره کنی یا صدا بزنی.

### C# 1 — روش اصیل اما پرزحمت

```csharp
// تعریف Delegate
public delegate void LogHandler(string message);

// یک متد معمولی
public static void WriteToConsole(string message)
{
    Console.WriteLine(message);
}

// C# 1 — مجبوری صریحاً instance بسازی
LogHandler logger = new LogHandler(WriteToConsole);
logger("خطا رخ داد");
```

برای Event Handling هم همین وضع بود:

```csharp
// C# 1
button.Click += new EventHandler(HandleClick);
button.Click -= new EventHandler(HandleClick);

private void HandleClick(object sender, EventArgs e)
{
    MessageBox.Show("کلیک شد");
}
```

مشکل اینجاست که **هر بار** باید یک متد جداگانه تعریف کنی — حتی اگر آن متد فقط یک خط باشد و هیچ‌جای دیگری استفاده نشود. 

### C# 2 — بهبود اول: Method Group Conversion

اسکیت این را ساده‌ترین بهبود می‌داند. کامپایلر دیگر نیازی به `new EventHandler(...)` صریح ندارد: 

```csharp
// C# 1 — پرحجم
button.Click += new EventHandler(HandleClick);

// C# 2 — Method Group Conversion
button.Click += HandleClick; // کامپایلر خودش نوع را می‌فهمد
button.Click -= HandleClick;
```

در پشت صحنه، کامپایلر همان کد C# 1 را تولید می‌کند — این صرفاً Syntactic Sugar است. اما کد را خواناتر می‌کند. 

### C# 2 — بهبود دوم: Anonymous Methods

این قابلیت مهم‌تر است. برای اولین بار می‌توانی **متد را درجا بنویسی** بدون اینکه اسم جداگانه‌ای برایش بگذاری: 

```csharp
// C# 1 — نیاز به متد جداگانه
button.Click += new EventHandler(HandleClick);

private void HandleClick(object sender, EventArgs e)
{
    MessageBox.Show("کلیک شد");
}

// C# 2 — Anonymous Method، متد درجا
button.Click += delegate(object sender, EventArgs e)
{
    MessageBox.Show("کلیک شد");
};
```

### Variable Capture — مهم‌ترین قابلیت Anonymous Methods

اسکیت روی این بخش بسیار تاکید می‌کند چون اغلب درک نادرستی از آن وجود دارد.

Anonymous Methods می‌توانند به متغیرهای محدوده بیرونی‌شان **دسترسی مستقیم** داشته باشند:

```csharp
var button = new Button();
var clickCount = 0; // متغیر محلی در scope بیرونی

button.Click += delegate(object sender, EventArgs e)
{
    clickCount++; // دسترسی مستقیم به متغیر بیرونی
    Console.WriteLine($"تعداد کلیک: {clickCount}");
};
```

**این Variable Capture چطور کار می‌کند؟**

کامپایلر پشت صحنه یک کلاس مخفی می‌سازد:

```csharp
// کدی که کامپایلر تولید می‌کند (تقریبی)
private sealed class DisplayClass
{
    public int clickCount;

    public void AnonymousMethod(object sender, EventArgs e)
    {
        clickCount++;
        Console.WriteLine($"تعداد کلیک: {clickCount}");
    }
}

// و در کد اصلی:
var helper = new DisplayClass();
helper.clickCount = 0;
button.Click += helper.AnonymousMethod;
```

**نتیجه مهم:** متغیر `clickCount` دیگر روی Stack نیست — روی **Heap** زندگی می‌کند. پس حتی بعد از اینکه متد اصلی تمام شود، Anonymous Method همچنان به آن دسترسی دارد. 

### یک تله رایج — Capture در حلقه

اسکیت یک باگ کلاسیک را نشان می‌دهد که بسیاری از توسعه‌دهندگان با آن روبرو می‌شوند:

```csharp
var actions = new List<Action>();

for (var i = 0; i < 5; i++)
{
    actions.Add(delegate
    {
        Console.WriteLine(i); // کدام i را Capture می‌کند؟
    });
}

foreach (var action in actions)
    action();
```

**انتظار:** `0, 1, 2, 3, 4`

**واقعیت:** `5, 5, 5, 5, 5`

**چرا؟** تمام Anonymous Methods به **همان متغیر `i`** اشاره می‌کنند — نه به مقدار آن در لحظه ساخت. وقتی حلقه تمام می‌شود، `i` برابر ۵ است و همه آن‌ها ۵ را چاپ می‌کنند. 

**راه‌حل — ساخت یک کپی محلی:**

```csharp
for (var i = 0; i < 5; i++)
{
    var localCopy = i; // هر بار یک متغیر جدید ساخته می‌شود
    actions.Add(delegate
    {
        Console.WriteLine(localCopy); // هر Delegate به کپی خودش اشاره می‌کند
    });
}
// خروجی: 0, 1, 2, 3, 4
```

> **نکته جالب اسکیت:** در C# 5 این رفتار برای `foreach` اصلاح شد — در `foreach` هر iteration یک متغیر جدید دارد. اما در `for` هنوز همین رفتار وجود دارد و باید مراقب باشی.

### Delegate Compatibility — انعطاف در انواع

اسکیت یک قابلیت ظریف C# 2 را معرفی می‌کند: **سازگاری بین انواع Delegate**: 

```csharp
// فرض کن این دو Delegate داریم
public delegate void Printer(string message);
public delegate void Logger(string text);

// متدی که با هر دو سازگار است
public static void Print(string s) => Console.WriteLine(s);

Printer p = Print;
Logger  l = Print;

// اما این کار نمی‌کند!
// Printer p2 = l; ❌ حتی اگر signature کاملاً یکسان باشد
```

دو نوع Delegate که ساختار یکسانی دارند، به هم قابل تبدیل **نیستند** — چون در C# نوع Delegate بر اساس **نام** تعریف می‌شود، نه بر اساس **ساختار**. 

---

## فصل ۲ — بخش چهارم: Iterators و Lazy Execution

### مشکل قبل از Iterators

در C# 1، اگر می‌خواستی یک Collection سفارشی بسازی که قابل پیمایش باشد (با `foreach`)، مجبور بودی **دستی** اینترفیس `IEnumerator` را پیاده‌سازی کنی: 

```csharp
// C# 1 — پیاده‌سازی دستی IEnumerator
public class CountingEnumerator : IEnumerator<int>
{
    private readonly int _max;
    private int _current = -1;

    public CountingEnumerator(int max) => _max = max;

    public int Current => _current;
    object IEnumerator.Current => _current;

    public bool MoveNext()
    {
        _current++;
        return _current < _max;
    }

    public void Reset() => _current = -1;
    public void Dispose() { }
}

public class CountingEnumerable : IEnumerable<int>
{
    private readonly int _max;
    public CountingEnumerable(int max) => _max = max;

    public IEnumerator<int> GetEnumerator() => new CountingEnumerator(_max);
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```

این کد فقط اعداد ۰ تا N را تولید می‌کند — و ۳۰ خط طول کشید. 

### C# 2 — Iterator Blocks با `yield return`

اسکیت می‌گوید Iterator Blocks یکی از **هوشمندانه‌ترین** ویژگی‌های C# 2 هستند:

```csharp
// C# 2 — همان کار، ۵ خط
public IEnumerable<int> CountTo(int max)
{
    for (var i = 0; i < max; i++)
    {
        yield return i; // هر بار یک مقدار تحویل بده و صبر کن
    }
}

// استفاده
foreach (var number in CountTo(5))
    Console.WriteLine(number); // 0, 1, 2, 3, 4
```

**چه اتفاقی افتاد؟** کامپایلر همان کلاس پیچیده C# 1 را **خودش** تولید می‌کند. تو فقط منطق را می‌نویسی. 

### Lazy Execution — مهم‌ترین مفهوم Iterators

اسکیت روی این مفهوم بسیار تاکید می‌کند چون اغلب درک نادرستی از آن وجود دارد.

وقتی یک Iterator Method صدا می‌زنی، **هیچ کدی اجرا نمی‌شود** — تا وقتی که واقعاً شروع به پیمایش کنی:

```csharp
public IEnumerable<int> GetNumbers()
{
    Console.WriteLine("شروع شد");
    yield return 1;
    Console.WriteLine("بعد از ۱");
    yield return 2;
    Console.WriteLine("بعد از ۲");
    yield return 3;
    Console.WriteLine("تمام شد");
}

var numbers = GetNumbers(); // هیچ چیزی چاپ نمی‌شود!

foreach (var n in numbers) // حالا اجرا شروع می‌شود
{
    Console.WriteLine($"دریافت: {n}");
    if (n == 2) break; // می‌توانیم وسط کار متوقف شویم
}
```

**خروجی:**
```
شروع شد
دریافت: 1
بعد از ۱
دریافت: 2
```

متد بعد از `n == 2` متوقف شد و **«تمام شد»** هرگز چاپ نشد. 

### چرا Lazy Execution مهم است؟

اسکیت یک مثال قدرتمند می‌آورد:

```csharp
// یک Sequence بی‌نهایت — بدون حافظه بی‌نهایت!
public IEnumerable<int> AllPositiveIntegers()
{
    var i = 0;
    while (true)
    {
        yield return i++;
    }
}

// فقط ۱۰ تای اول را می‌گیریم
var firstTen = AllPositiveIntegers().Take(10);

foreach (var n in firstTen)
    Console.WriteLine(n); // 0 تا 9
```

این کد کار می‌کند چون هیچ‌وقت همه اعداد در حافظه نیستند — هر بار **یک عدد** تولید و مصرف می‌شود. 

### ارزیابی `yield` — گام به گام

اسکیت توضیح می‌دهد که کامپایلر یک **State Machine** می‌سازد تا وضعیت Iterator را نگه دارد:

```csharp
public IEnumerable<string> GetSteps()
{
    yield return "گام اول";   // State 1
    yield return "گام دوم";   // State 2
    yield return "گام سوم";  // State 3
}
```

پشت صحنه یک کلاس تولید می‌شود که **موقعیت فعلی** را ذخیره می‌کند. هر بار که `MoveNext()` صدا می‌شود، از همان جایی که متوقف شده بود ادامه می‌دهد. 

### بلوک `finally` در Iterators — یک تله مهم

اسکیت یک نکته حیاتی مطرح می‌کند که اغلب نادیده گرفته می‌شود:

```csharp
public IEnumerable<string> ReadLines(string filePath)
{
    using var reader = new StreamReader(filePath);
    while (!reader.EndOfStream)
    {
        yield return reader.ReadLine();
    }
    // بلوک finally در using — کِی اجرا می‌شود؟
}

var lines = ReadLines("data.txt");

// اگر پیمایش را نیمه‌کاره رها کنیم:
foreach (var line in lines)
{
    if (line.Contains("خطا")) break; // اینجا از حلقه خارج می‌شویم
}
// آیا فایل بسته می‌شود؟
```

**جواب:** بله — بسته می‌شود. وقتی `foreach` با `break` یا Exception خاتمه پیدا می‌کند، کامپایلر مطمئن می‌شود که `Dispose()` روی Enumerator صدا زده شود، که باعث اجرای `finally` می‌شود. 

اما اگر **دستی** `GetEnumerator()` صدا بزنی و `Dispose()` نکنی، فایل باز می‌ماند:

```csharp
// خطرناک — اگر Dispose فراموش شود
var enumerator = ReadLines("data.txt").GetEnumerator();
enumerator.MoveNext();
Console.WriteLine(enumerator.Current);
// enumerator.Dispose() فراموش شد → فایل باز ماند!

// درست — using تضمین می‌کند Dispose صدا زده شود
using var enumerator = ReadLines("data.txt").GetEnumerator();
enumerator.MoveNext();
Console.WriteLine(enumerator.Current);
```

### `yield break` — پایان دادن زودهنگام

```csharp
public IEnumerable<int> GetPositive(IEnumerable<int> source)
{
    foreach (var item in source)
    {
        if (item < 0)
            yield break; // Iterator را کاملاً متوقف کن

        yield return item;
    }
}

var result = GetPositive(new;
// خروجی: 1, 2  (بعد از -1 متوقف می‌شود)
```

تفاوت `yield break` با `return` در متدهای معمولی: `yield break` به Iterator می‌گوید دیگر هیچ مقداری نخواهد داشت — `HasNext` از این به بعد `false` برمی‌گردد. 

### خلاصه Implementation — State Machine

اسکیت یک طرح کلی از کلاسی که کامپایلر می‌سازد نشان می‌دهد: 

```csharp
// Iterator اصلی که می‌نویسی
public IEnumerable<int> SimpleIterator()
{
    yield return 1;
    yield return 2;
    yield return 3;
}

// تقریب از کدی که کامپایلر تولید می‌کند
private sealed class SimpleIteratorStateMachine : IEnumerator<int>, IEnumerable<int>
{
    private int _state;
    private int _current;

    public int Current => _current;
    object IEnumerator.Current => _current;

    public bool MoveNext()
    {
        switch (_state)
        {
            case 0:
                _current = 1;
                _state = 1;
                return true;
            case 1:
                _current = 2;
                _state = 2;
                return true;
            case 2:
                _current = 3;
                _state = 3;
                return true;
            default:
                return false;
        }
    }

    public void Dispose() { }
    public void Reset() => throw new NotSupportedException();
    public IEnumerator<int> GetEnumerator() => this;
    IEnumerator IEnumerable.GetEnumerator() => this;
}
```

> **توصیه اسکیت:** نیازی نیست این State Machine را حفظ باشی — اما دانستن اینکه وجود دارد، کمک می‌کند رفتار Iterator را در موقعیت‌های پیچیده (مثل Exception یا `break`) درست پیش‌بینی کنی.

---

## فصل ۲ — بخش پنجم: Minor Features

### ۲.۵ — ویژگی‌های کوچک اما مهم C# 2

اسکیت این بخش را «ویژگی‌های کوچک» می‌نامد، اما تاکید می‌کند که «کوچک بودن» به معنای «بی‌اهمیت بودن» نیست — برخی از اینها در کد روزانه بسیار پرکاربرد هستند. 

### اول — Partial Types

قبل از C# 2، تعریف یک کلاس باید **در یک فایل واحد** باشد. این محدودیت در پروژه‌های بزرگ دردسرساز بود — مخصوصاً وقتی Code Generator بخشی از کلاس را می‌نوشت و توسعه‌دهنده بخش دیگری را. 

```csharp
// فایل: Order.cs — کد تولیدشده توسط Designer
public partial class Order
{
    private int _id;
    private DateTime _createdAt;

    public int Id => _id;
    public DateTime CreatedAt => _createdAt;
}

// فایل: Order.Logic.cs — کد نوشته‌شده توسط توسعه‌دهنده
public partial class Order
{
    public bool IsExpired =>
        DateTime.UtcNow - _createdAt > TimeSpan.FromDays(30);

    public void Cancel()
    {
        // منطق کسب‌وکار اینجاست
    }
}
```

**قوانین مهم Partial Types:** 

- تمام بخش‌ها باید در **یک Assembly** باشند
- تمام بخش‌ها باید **همان Access Modifier** را داشته باشند
- اگر یک بخش `abstract` یا `sealed` باشد، **کل کلاس** آن ویژگی را می‌گیرد
- **Partial Methods** هم در C# 3 اضافه شدند — اما آن بحث جداگانه‌ای است

> **کجا واقعاً استفاده می‌شود؟** در Windows Forms، WPF و Entity Framework — هر جا که یک ابزار بخشی از کلاس را تولید می‌کند و تو بخش دیگری را می‌نویسی.

### دوم — Static Classes

در C# 1، اگر می‌خواستی کلاسی داشته باشی که فقط متدهای static داشته باشد (مثل یک utility class)، باید دستی از instantiate شدنش جلوگیری می‌کردی: 

```csharp
// C# 1 — راه‌حل ناقص
public class MathHelper
{
    private MathHelper() { } // Constructor خصوصی

    public static double Square(double x) => x * x;
    public static double Cube(double x) => x * x * x;
}

// اما این هنوز ممکن بود:
// var helper = MathHelper; // ❌ خطا — اما پیغام خطا گنگ است
// همچنین می‌شد از آن ارث برد!
```

**C# 2 — Static Class:**

```csharp
// C# 2 — کامپایلر همه چیز را enforce می‌کند
public static class MathHelper
{
    public static double Square(double x) => x * x;
    public static double Cube(double x)   => x * x * x;
}

// حالا کامپایلر اجازه نمی‌دهد:
// var h = new MathHelper();    // ❌ خطای کامپایل
// class MyHelper : MathHelper  // ❌ خطای کامپایل — نمی‌توان ارث برد
// همچنین تمام اعضا باید static باشند وگرنه خطا می‌دهد
```

### سوم — Separate Getter/Setter Access

در C# 1، سطح دسترسی getter و setter یک Property باید یکسان بود. این مشکل طراحی رایجی ایجاد می‌کرد: 

```csharp
// C# 1 — مجبور بودی یکی را انتخاب کنی
public class User
{
    private string _name;

    public string Name
    {
        get { return _name; }
        set { _name = value; } // اگر public باشد، همه می‌توانند تغییر دهند
    }
}

// C# 2 — سطح دسترسی مستقل برای getter و setter
public class User
{
    public string Name    { get; private set; }  // همه می‌خوانند، فقط کلاس می‌نویسد
    public int    Age     { get; internal set; }  // همه می‌خوانند، فقط Assembly می‌نویسد
    public string Email   { get; protected set; } // همه می‌خوانند، فقط فرزندان می‌نویسند
}
```

**قانون مهم:** سطح دسترسی setter باید **محدودتر** از getter باشد. نمی‌توانی getter را `private` و setter را `public` کنی. 

### چهارم — Namespace Aliases

وقتی دو namespace داری که کلاس‌هایی با **نام یکسان** دارند، مشکل تداخل نام پیش می‌آید:

```csharp
// تداخل نام — کامپایلر نمی‌داند کدام Button را می‌خواهی
using System.Windows.Forms;
using System.Web.UI.WebControls;

public class MyPage
{
    private Button _button; // ❌ ابهام — کدام Button؟
}
```

**C# 2 — Namespace Alias:** 

```csharp
using WinForms  = System.Windows.Forms;
using WebForms  = System.Web.UI.WebControls;
using SysText   = System.Text;

public class MyPage
{
    private WinForms.Button  _winButton;
    private WebForms.Button  _webButton;

    public void Process()
    {
        var sb = new SysText.StringBuilder();
    }
}
```

**Extern Alias — برای تداخل بین Assembly‌ها:**

اگر دو Assembly مختلف داری که هر دو `Company.Models.User` دارند، حتی `using` هم کمک نمی‌کند. در این حالت از `extern alias` استفاده می‌شود — که اسکیت می‌گوید در عمل بسیار نادر است. 

### پنجم — Pragma Directives

این ویژگی به توسعه‌دهنده اجازه می‌دهد **هشدارهای کامپایلر** را در بخش‌های خاصی از کد خاموش کند: 

```csharp
// خاموش کردن یک هشدار خاص
#pragma warning disable CS0618 // CS0618 = استفاده از عضو Obsolete
var result = OldMethod(); // بدون هشدار
#pragma warning restore CS0618 // برگرداندن هشدار

// یا خاموش کردن چند هشدار
#pragma warning disable CS0618, CS0612
// کد با هشدار
#pragma warning restore CS0618, CS0612
```

> **هشدار اسکیت:** `#pragma warning disable` باید با دلیل مستند باشد. اگر بدون توضیح هشدار را خاموش کنی، آینده تیم کدت را کور می‌کنی. همیشه کنارش Comment بگذار که **چرا** این هشدار در این مکان خاص قابل چشم‌پوشی است.

### ششم — Fixed-Size Buffers

این ویژگی برای کد `unsafe` است و در کار با struct‌هایی که باید با کد native (مثل C یا Windows API) تعامل داشته باشند استفاده می‌شود: 

```csharp
public unsafe struct NativeHeader
{
    public fixed byte MagicBytes[4];  // دقیقاً ۴ بایت — مثل array در C
    public int Version;
    public fixed char Name[32];       // دقیقاً ۳۲ کاراکتر
}
```

> اسکیت صریح می‌گوید: اگر در کار روزانه با این ویژگی روبرو نشدی، نگران نباش — حوزه استفاده آن بسیار محدود و تخصصی است.

### هفتم — InternalsVisibleTo

این ویژگی در پروژه‌های بزرگ و **Test-Driven Development** بسیار مهم است: 

```csharp
// در فایل AssemblyInfo.cs پروژه اصلی
]
]
```

**چرا مهم است؟** بدون این ویژگی، برای تست کردن کلاس‌های `internal` مجبور بودی آنها را `public` کنی — که اصل **Encapsulation** را نقض می‌کرد. حالا می‌توانی کلاس‌ها را `internal` نگه داری و فقط به Assembly تست دسترسی بدهی. 

```csharp
// در پروژه MyProject — کلاس internal
internal class OrderValidator
{
    internal bool Validate(Order order) { ... }
}

// در پروژه MyProject.Tests — می‌تواند کلاس internal را تست کند
[Test]
public void Validate_WithExpiredOrder_ReturnsFalse()
{
    var validator = new OrderValidator(); // ✅ ممکن است چون InternalsVisibleTo تعریف شده
    var result = validator.Validate(expiredOrder);
    Assert.IsFalse(result);
}
```

### جمع‌بندی فصل ۲

اسکیت فصل ۲ را با این پیام پایان می‌دهد: C# 2 یک **جهش بزرگ** بود. Generics، Nullable Value Types، Anonymous Methods و Iterators هر کدام به تنهایی می‌توانستند یک نسخه مجزا را توجیه کنند. اما مهم‌تر از اینها، فلسفه‌ای بود که پایه‌گذاری شد: 

> **C# باید هم ایمن باشد هم مختصر — و این دو با هم در تضاد نیستند.**

---

## فصل ۳ — C# 3 و LINQ | بخش اول: ویژگی‌های پایه‌ای

اسکیت فصل ۳ را با یک نکته کلیدی شروع می‌کند: ویژگی‌های C# 3 را **نمی‌توان جداگانه** بررسی کرد — همه آنها مثل قطعات یک پازل هستند که وقتی کنار هم می‌نشینند، **LINQ** را می‌سازند. هر ویژگی به تنهایی مفید است، اما هدف اصلی‌شان این ترکیب است.

### ۳.۱ — Automatically Implemented Properties

در C# 2، حتی ساده‌ترین Property به چهار خط کد نیاز داشت:

```csharp
// C# 2 — پرحجم
public class Product
{
    private string _name;
    private decimal _price;

    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }

    public decimal Price
    {
        get { return _price; }
        set { _price = value; }
    }
}
```

**C# 3 — Auto-Implemented Properties:**

```csharp
// C# 3 — کامپایلر فیلد پشتیبان را خودش می‌سازد
public class Product
{
    public string  Name  { get; set; }
    public decimal Price { get; set; }
    public int     Stock { get; private set; } // setter محدود
}
```

**نکته مهم اسکیت:** کامپایلر یک فیلد خصوصی با نام تولیدشده (مثل `<Name>k__BackingField`) می‌سازد. تو هیچ‌وقت مستقیم به این فیلد دسترسی نداری — و نباید هم داشته باشی. اگر نیاز به منطق اضافه در getter یا setter داری، باید Property را به شکل کامل بنویسی.

### ۳.۲ — Implicit Typing با `var`

اسکیت در اینجا یک سوء‌تفاهم رایج را فوراً برطرف می‌کند:

> **`var` به معنای Dynamic Typing نیست.** نوع متغیر در **زمان کامپایل** تعیین می‌شود — فقط تو آن را ننوشته‌ای، کامپایلر از مقدار سمت راست استنتاج می‌کند.

```csharp
var name    = "محمدحسین";         // کامپایلر: string
var age     = 28;                  // کامپایلر: int
var price   = 99.9m;               // کامپایلر: decimal
var product = new Product();       // کامپایلر: Product

// این دو خط کاملاً معادل هستند:
string name1 = "محمدحسین";
var    name2 = "محمدحسین";

// var فقط برای متغیرهای محلی کار می‌کند
// این‌ها مجاز نیستند:
// public var Name { get; set; }   ❌
// private var _count = 0;         ❌ (فیلد کلاس)
```

**کِی از `var` استفاده کنیم؟**

| موقعیت | توصیه اسکیت |
|---------|-------------|
| `var list = new List<Product>()` | ✅ نوع واضح است |
| `var result = GetData()` | ⚠️ فقط اگر نام متد گویا باشد |
| `var x = Calculate()` | ❌ نوع مشخص نیست |
| `var items = new[] { 1, 2, 3 }` | ✅ با Implicitly Typed Arrays |

### Implicitly Typed Arrays

```csharp
// C# 2 — باید نوع را صریح بگویی
var numbers = new int[]    { 1, 2, 3, 4, 5 };
var names   = new string[] { "علی", "رضا", "مریم" };

// C# 3 — کامپایلر نوع را از عناصر می‌فهمد
var numbers = new[] { 1, 2, 3, 4, 5 };       // int[]
var names   = new[] { "علی", "رضا", "مریم" }; // string[]

// اگر عناصر انواع مختلف داشته باشند:
var mixed = new[] { 1, 2.5, 3 }; // ✅ double[] — چون 2.5 یک double است
var error = new[] { 1, "hello" }; // ❌ خطای کامپایل — نوع مشترک وجود ندارد
```

### ۳.۳ — Object و Collection Initializers

این ویژگی ظاهری ساده دارد اما برای LINQ حیاتی است — چون LINQ نیاز دارد **در یک عبارت واحد** شیء بسازی و مقداردهی کنی.

**Object Initializer:**

```csharp
// C# 2 — چند خط جداگانه
var product = new Product();
product.Name  = "لپ‌تاپ";
product.Price = 1500m;
product.Stock = 10;

// C# 3 — در یک عبارت
var product = new Product
{
    Name  = "لپ‌تاپ",
    Price = 1500m,
    Stock = 10
};

// حتی بدون پرانتز اگر Constructor بدون پارامتر باشد
var product = new Product { Name = "لپ‌تاپ", Price = 1500m };
```

**Collection Initializer:**

```csharp
// C# 2 — پرحجم
var products = new List<Product>();
products.Add(new Product { Name = "لپ‌تاپ",   Price = 1500m });
products.Add(new Product { Name = "کیبورد",    Price = 80m   });
products.Add(new Product { Name = "ماوس",      Price = 40m   });

// C# 3 — مختصر
var products = new List<Product>
{
    new Product { Name = "لپ‌تاپ",  Price = 1500m },
    new Product { Name = "کیبورد", Price = 80m   },
    new Product { Name = "ماوس",   Price = 40m   }
};

// Dictionary هم همین‌طور
var prices = new Dictionary<string, decimal>
{
    { "لپ‌تاپ",  1500m },
    { "کیبورد", 80m   },
    { "ماوس",   40m   }
};
```

**چرا «یک عبارت واحد» مهم است؟** اسکیت توضیح می‌دهد که در LINQ نمی‌توانی چند Statement داشته باشی — همه چیز باید یک **Expression** باشد. Object Initializer این امکان را فراهم می‌کند.

### ۳.۴ — Anonymous Types

اسکیت این ویژگی را مستقیماً با LINQ مرتبط می‌داند. گاهی نیاز داری یک شیء موقت بسازی که فقط چند Property دارد — بدون اینکه کلاس جداگانه‌ای تعریف کنی:

```csharp
// یک نوع بی‌نام با دو Property
var person = new { Name = "محمدحسین", Age = 28 };

Console.WriteLine(person.Name); // محمدحسین
Console.WriteLine(person.Age);  // 28

// person.Name = "علی"; ❌ — Anonymous Types کاملاً Immutable هستند
```

**کامپایلر چه می‌سازد؟**

کامپایلر یک کلاس مخفی با نامی مثل `<>f__AnonymousType0` می‌سازد که:
- تمام Property ها `readonly` هستند
- `Equals()`، `GetHashCode()` و `ToString()` به درستی پیاده‌سازی شده‌اند
- دو Anonymous Type با **همان Property ها و همان ترتیب** در یک Assembly، **همان نوع** هستند

```csharp
var a = new { Name = "محمدحسین", Age = 28 };
var b = new { Name = "علی",      Age = 30 };

// a و b هم‌نوع هستند — فقط مقادیر فرق دارند
Console.WriteLine(a.GetType() == b.GetType()); // → true

// اما این دو هم‌نوع نیستند — ترتیب Property ها فرق دارد
var c = new { Age = 28, Name = "محمدحسین" };
Console.WriteLine(a.GetType() == c.GetType()); // → false
```

**محدودیت‌های مهم Anonymous Types:**

- نمی‌توانی آنها را به عنوان **پارامتر یا مقدار بازگشتی** متد تعریف کنی (مگر با `object` یا `dynamic` که هر دو بد هستند)
- فقط در **همان متد** که ساخته شده‌اند کاربرد دارند
- بهترین استفاده: داخل LINQ Query برای Select کردن فیلدهای خاص

```csharp
// کاربرد اصلی — در LINQ Select
var result = products
    .Where(p => p.Price > 100)
    .Select(p => new { p.Name, p.Price }); // فقط Name و Price
```

---

## فصل ۳ — بخش دوم: Lambda Expressions و Extension Methods

### ۳.۵ — Lambda Expressions

اسکیت Lambda Expressions را **تکامل طبیعی** Anonymous Methods می‌داند — اما با یک تفاوت بنیادی که آنها را بسیار قدرتمندتر می‌کند. 

### سینتکس Lambda

```csharp
// Anonymous Method — C# 2
Func<int, int> square1 = delegate(int x) { return x * x; };

// Lambda Expression — C# 3
Func<int, int> square2 = (int x) => x * x;

// با Type Inference — کامپایلر نوع x را می‌فهمد
Func<int, int> square3 = x => x * x;

// چند پارامتر
Func<int, int, int> add = (x, y) => x + y;

// بدون پارامتر
Action greet = () => Console.WriteLine("سلام");

// با بدنه چند خطی
Func<int, int> factorial = n =>
{
    var result = 1;
    for (var i = 2; i <= n; i++)
        result *= i;
    return result;
};
```

**قوانین سینتکس:**

| حالت | مثال |
|------|------|
| یک پارامتر | `x => x * x` |
| چند پارامتر | `(x, y) => x + y` |
| بدون پارامتر | `() => 42` |
| با نوع صریح | `(int x) => x * x` |
| چند خط | `x => { var r = x * 2; return r; }` |

### Variable Capture در Lambda

دقیقاً مثل Anonymous Methods، Lambda ها هم می‌توانند متغیرهای بیرونی را Capture کنند — و همان قوانین و تله‌ها اعمال می‌شوند: 

```csharp
var multiplier = 3;
Func<int, int> multiply = x => x * multiplier;

Console.WriteLine(multiply(5));  // → 15

multiplier = 10; // متغیر بیرونی تغییر کرد
Console.WriteLine(multiply(5));  // → 50 — Lambda مقدار فعلی را می‌بیند، نه snapshot
```

### Expression Trees — تفاوت بنیادی با Anonymous Methods

اینجاست که اسکیت می‌گوید Lambda Expressions چیزی **بسیار فراتر** از Anonymous Methods هستند.

یک Lambda می‌تواند نه به عنوان **کد قابل اجرا**، بلکه به عنوان یک **ساختار داده** (درخت بیانی) در نظر گرفته شود:

```csharp
// Lambda به عنوان Delegate — کد اجرا می‌شود
Func<int, bool> isAdult = age => age >= 18;

// Lambda به عنوان Expression Tree — کد به صورت داده نگه داشته می‌شود
Expression<Func<int, bool>> isAdultExpr = age => age >= 18;
```

**این ساختار درخت چیست؟**

```csharp
// کامپایلر این Expression را به یک درخت تبدیل می‌کند:
// age => age >= 18
//
//         GreaterThanOrEqual
//        /                  \
//    Parameter              Constant
//    (age: int)             (18: int)

// می‌توانی درخت را بررسی کنی
var body = (BinaryExpression)isAdultExpr.Body;
Console.WriteLine(body.NodeType);  // → GreaterThanOrEqual
Console.WriteLine(body.Right);     // → 18
```

**چرا این مهم است؟** LINQ to SQL و Entity Framework از همین Expression Trees استفاده می‌کنند. وقتی می‌نویسی:

```csharp
var adults = dbContext.Users
    .Where(u => u.Age >= 18)
    .ToList();
```

Entity Framework درخت `u => u.Age >= 18` را می‌خواند و آن را به SQL ترجمه می‌کند: 

```sql
SELECT * FROM Users WHERE Age >= 18
```

اگر این یک Delegate ساده بود (نه Expression Tree)، Entity Framework نمی‌توانست آن را به SQL تبدیل کند — مجبور بود **همه رکوردها** را از دیتابیس بخواند و در حافظه فیلتر کند.

### ۳.۶ — Extension Methods

اسکیت این ویژگی را «چسبی که LINQ را سرپا نگه می‌دارد» می‌نامد.

**مشکل:** می‌خواهی به یک کلاس موجود (که کنترلش نداری) متد اضافه کنی.

```csharp
// می‌خواهی string یک متد IsNullOrEmpty داشته باشد
// اما نمی‌توانی کلاس string را تغییر دهی — sealed است

// C# 2 — راه‌حل ناخوشایند با متد static
public static class StringHelper
{
    public static bool IsNullOrEmpty(string value)
    {
        return string.IsNullOrEmpty(value);
    }
}

// استفاده — مصنوعی و ناخوانا
if (StringHelper.IsNullOrEmpty(username)) { ... }
```

**C# 3 — Extension Method:**

```csharp
// تعریف Extension Method
// ۱. کلاس باید static باشد
// ۲. متد باید static باشد
// ۳. اولین پارامتر با this مشخص می‌شود
public static class StringExtensions
{
    public static bool IsNullOrEmpty(this string value)
    {
        return string.IsNullOrEmpty(value);
    }

    public static string Truncate(this string value, int maxLength)
    {
        if (string.IsNullOrEmpty(value)) return value;
        return value.Length <= maxLength
            ? value
            : value[..maxLength] + "...";
    }
}

// استفاده — طبیعی و خوانا
var username = "محمدحسین";
if (username.IsNullOrEmpty()) { ... }

var short = username.Truncate(5); // → "محمدح..."
```

**پشت صحنه:** کامپایلر `username.Truncate(5)` را به `StringExtensions.Truncate(username, 5)` تبدیل می‌کند — Extension Methods واقعاً به کلاس اضافه نمی‌شوند، فقط **ظاهراً** اینطور به نظر می‌رسد. 

### Method Chaining — قدرت واقعی Extension Methods

وقتی Extension Methods را با هم زنجیر می‌کنی، یک Pipeline خوانا می‌سازی:

```csharp
var result = products
    .Where(p => p.Price > 100)        // IEnumerable<Product>
    .OrderBy(p => p.Price)            // IOrderedEnumerable<Product>
    .Select(p => p.Name)              // IEnumerable<string>
    .Take(5)                          // IEnumerable<string>
    .ToList();                        // List<string>
```

هر متد در این زنجیر یک Extension Method روی `IEnumerable<T>` است که در کلاس `Enumerable` تعریف شده. 

### قوانین مهم Extension Methods

اسکیت چند قانون حیاتی را بیان می‌کند: 

**اول — Instance Method همیشه اولویت دارد:**

```csharp
public class MyList
{
    public void Add(int item) { ... } // متد اصلی
}

public static class MyListExtensions
{
    public static void Add(this MyList list, int item) { ... } // Extension
}

var myList = new MyList();
myList.Add(5); // همیشه متد اصلی صدا زده می‌شود — نه Extension
```

**دوم — Extension Methods روی `null` کار می‌کنند:**

```csharp
public static class StringExtensions
{
    public static bool IsEmpty(this string value)
    {
        return string.IsNullOrEmpty(value);
    }
}

string name = null;
Console.WriteLine(name.IsEmpty()); // → true — بدون NullReferenceException!
// چون کامپایلر آن را به StringExtensions.IsEmpty(null) تبدیل می‌کند
```

**سوم — Namespace باید import شده باشد:**

```csharp
// اگر این using نباشد، Extension Methods آن namespace در دسترس نیستند
using MyProject.Extensions;

var result = "متن".Truncate(10); // فقط با using کار می‌کند
```

### یک اشتباه رایج — Extension روی Interface

یکی از قدرتمندترین کاربردهای Extension Methods، اضافه کردن رفتار به **Interface** هاست:

```csharp
// یک Interface ساده
public interface IRepository<T>
{
    IEnumerable<T> GetAll();
}

// Extension Method روی Interface — نه روی پیاده‌سازی‌ها
public static class RepositoryExtensions
{
    public static T GetFirst<T>(this IRepository<T> repo)
    {
        return repo.GetAll().FirstOrDefault();
    }

    public static int Count<T>(this IRepository<T> repo)
    {
        return repo.GetAll().Count();
    }
}

// حالا هر کلاسی که IRepository را پیاده‌سازی کند
// به صورت خودکار به این متدها دسترسی دارد
public class ProductRepository : IRepository<Product>
{
    public IEnumerable<Product> GetAll() { ... }
    // GetFirst() و Count() را هم دارد — بدون اینکه چیزی بنویسد
}
```

> **توصیه اسکیت:** Extension Methods ابزار قدرتمندی هستند، اما باید با احتیاط استفاده شوند. اگر می‌توانی متد را به خود کلاس اضافه کنی، این کار را بکن. Extension Methods برای مواردی هستند که **کنترل کلاس را نداری** یا می‌خواهی Interface را بدون تغییر آن گسترش دهی.

---

## فصل ۳ — بخش سوم: Query Expressions و LINQ

### ۳.۷ — Query Expressions

اسکیت این بخش را با یک اعلام صریح شروع می‌کند: **Query Expressions چیز جادویی‌ای نیستند.** آنها فقط یک روش دیگر برای نوشتن همان Extension Methods هستند — کامپایلر آنها را **قبل از هر چیز دیگری** به Method Calls ترجمه می‌کند. 

### ترجمه Query Expression به Method Call

```csharp
// Query Expression — سینتکس شبیه SQL
var result =
    from product in products
    where product.Price > 100
    orderby product.Price descending
    select new { product.Name, product.Price };

// معادل دقیق آن — Method Syntax
var result = products
    .Where(product => product.Price > 100)
    .OrderByDescending(product => product.Price)
    .Select(product => new { product.Name, product.Price });
```

**کامپایلر اول Query Expression را به Method Syntax تبدیل می‌کند، سپس کد را کامپایل می‌کند.** این یعنی اگر Method Syntax را بلد باشی، Query Expression هیچ چیز پنهانی ندارد. 

### Range Variables و Transparent Identifiers

اسکیت یک نکته ظریف را توضیح می‌دهد که اغلب نادیده گرفته می‌شود:

```csharp
var result =
    from order in orders
    from item in order.Items   // دو منبع داده — join ضمنی
    where item.Price > 50
    select new { order.Id, item.Name, item.Price };
```

کامپایلر اینجا چه می‌کند؟ باید هم `order` و هم `item` را همزمان در دسترس نگه دارد. برای این کار از **Transparent Identifiers** استفاده می‌کند: 

```csharp
// ترجمه تقریبی کامپایلر
var result = orders
    .SelectMany(
        order => order.Items,
        (order, item) => new { order, item }  // Transparent Identifier
    )
    .Where(x => x.item.Price > 50)
    .Select(x => new { x.order.Id, x.item.Name, x.item.Price });
```

این `new { order, item }` همان Transparent Identifier است — یک Anonymous Type موقت که فقط برای انتقال داده‌ها بین مراحل وجود دارد و در نتیجه نهایی دیده نمی‌شود.

### `let` — معرفی متغیر موقت

```csharp
// بدون let — محاسبه تکراری
var result =
    from product in products
    where product.Price * 0.9m > 100      // 0.9 دو بار محاسبه می‌شود
    select new { product.Name, DiscountedPrice = product.Price * 0.9m };

// با let — محاسبه یک‌بار، استفاده چندبار
var result =
    from product in products
    let discounted = product.Price * 0.9m  // یک‌بار محاسبه
    where discounted > 100
    select new { product.Name, DiscountedPrice = discounted };
```

`let` هم توسط کامپایلر به یک Anonymous Type تبدیل می‌شود — یعنی در واقع `discounted` به عنوان یک فیلد در یک Transparent Identifier زندگی می‌کند. 

### `join` — ترکیب دو منبع داده

```csharp
// دو مجموعه مجزا
var orders   = GetOrders();    // شامل CustomerId
var customers = GetCustomers(); // شامل Id و Name

// Query Expression با join
var result =
    from order in orders
    join customer in customers on order.CustomerId equals customer.Id
    select new
    {
        OrderId      = order.Id,
        CustomerName = customer.Name,
        order.Total
    };

// معادل Method Syntax
var result = orders.Join(
    customers,
    order    => order.CustomerId,
    customer => customer.Id,
    (order, customer) => new
    {
        OrderId      = order.Id,
        CustomerName = customer.Name,
        order.Total
    });
```

> **نکته اسکیت:** در LINQ to Objects (روی Collection های حافظه) ترجیح بده به جای `join` از روابط Navigation Property استفاده کنی. `join` بیشتر وقتی کاربرد دارد که دو منبع داده **مستقل** هستند و رابطه‌ای بین آنها تعریف نشده.

### کِی Query Syntax و کِی Method Syntax؟

اسکیت یک راهنمای عملی ارائه می‌دهد: 

| موقعیت | توصیه |
|---------|--------|
| `join` پیچیده با چند شرط | Query Syntax خواناتر است |
| `group by` | Query Syntax خواناتر است |
| چند `from` تودرتو | Query Syntax خواناتر است |
| فقط `where` و `select` ساده | Method Syntax کافی و مختصرتر است |
| زنجیره متدهای پیچیده | Method Syntax انعطاف بیشتری دارد |

```csharp
// Query Syntax — وقتی group by داری
var grouped =
    from product in products
    group product by product.Category into g
    select new { Category = g.Key, Count = g.Count() };

// Method Syntax — وقتی ساده است
var filtered = products
    .Where(p => p.Price > 100)
    .Select(p => p.Name);
```

### ۳.۸ — نتیجه نهایی: LINQ

اسکیت فصل ۳ را با یک جمع‌بندی قوی تمام می‌کند. می‌گوید LINQ یک **زبان Query** نیست — یک **روش تفکر** است. 

تمام ویژگی‌های C# 3 برای ساختن این سیستم طراحی شدند:

```
Auto Properties      ← ساختن Model های تمیز
var                  ← کار با Anonymous Types بدون نوشتن نوع
Object Initializers  ← ساختن شیء در یک Expression
Anonymous Types      ← شکل‌دهی مجدد داده در Select
Lambda Expressions   ← تعریف شرط‌ها و تبدیل‌ها
Extension Methods    ← اضافه کردن Where/Select/... به IEnumerable
Expression Trees     ← ترجمه Lambda به SQL یا سایر Query زبان‌ها
Query Expressions    ← سینتکس خوانا روی همه اینها
```

**یک مثال کامل که همه اینها را به هم می‌بندد:**

```csharp
// مدل — با Auto Property
public class Order
{
    public int      Id         { get; set; }
    public string   Customer   { get; set; }
    public decimal  Total      { get; set; }
    public DateTime CreatedAt  { get; set; }
    public bool     IsPaid     { get; set; }
}

// داده — با Collection Initializer
var orders = new List<Order>
{
    new Order { Id = 1, Customer = "محمدحسین", Total = 500m,  IsPaid = true,  CreatedAt = DateTime.Today.AddDays(-5)  },
    new Order { Id = 2, Customer = "علی",      Total = 1200m, IsPaid = false, CreatedAt = DateTime.Today.AddDays(-2)  },
    new Order { Id = 3, Customer = "محمدحسین", Total = 300m,  IsPaid = true,  CreatedAt = DateTime.Today.AddDays(-10) },
    new Order { Id = 4, Customer = "رضا",      Total = 800m,  IsPaid = false, CreatedAt = DateTime.Today              }
};

// Query — همه ویژگی‌ها در کنار هم
var report =
    from order in orders
    where order.IsPaid
    let daysSince = (DateTime.Today - order.CreatedAt).Days
    group order by order.Customer into customerGroup
    select new
    {
        Customer   = customerGroup.Key,
        OrderCount = customerGroup.Count(),
        TotalPaid  = customerGroup.Sum(o => o.Total),
        LastOrder  = customerGroup.Max(o => o.CreatedAt)
    };

// خروجی
foreach (var row in report)
    Console.WriteLine($"{row.Customer}: {row.OrderCount} سفارش — جمع: {row.TotalPaid:C}");

// نتیجه:
// محمدحسین: 2 سفارش — جمع: 800.00
```

### LINQ روی منابع مختلف

اسکیت یک نکته معماری مهم را مطرح می‌کند: همان Query می‌تواند روی منابع مختلف اجرا شود — فقط نوع Provider عوض می‌شود: 

```csharp
// روی List — اجرا در حافظه (LINQ to Objects)
var result1 = products.Where(p => p.Price > 100);

// روی EF DbSet — ترجمه به SQL (LINQ to Entities)
var result2 = dbContext.Products.Where(p => p.Price > 100);

// روی XML — ترجمه به XPath (LINQ to XML)
var result3 = xDocument.Descendants("Product")
    .Where(e => (decimal)e.Element("Price") > 100);
```

**تفاوت حیاتی:** `result1` از نوع `IEnumerable<T>` است و در حافظه فیلتر می‌شود. `result2` از نوع `IQueryable<T>` است و فیلتر به SQL ترجمه می‌شود. این تفاوت مستقیماً روی **Performance** تاثیر دارد. 

> **هشدار اسکیت:** اگر `IQueryable<T>` را به `IEnumerable<T>` تبدیل کنی (مثلاً با `AsEnumerable()`) قبل از `Where`، تمام رکوردها از دیتابیس خوانده می‌شوند و فیلتر در حافظه انجام می‌شود. این یکی از رایج‌ترین مشکلات Performance در برنامه‌های EF است.

---

## فصل ۴ — C# 4: Improving Interoperability | بخش اول: Dynamic Typing

اسکیت فصل ۴ را با یک اعتراف جالب شروع می‌کند: C# 4 در مقایسه با C# 2 و 3 یک نسخه **کوچک‌تر** بود — هدفش نه افزودن ویژگی‌های بزرگ، بلکه **کاهش اصطکاک** در تعامل با دنیای بیرون از .NET بود. 

### ۴.۱ — Dynamic Typing

### مشکلی که Dynamic حل می‌کند

سه موقعیت وجود دارد که Static Typing کافی نیست: 

```csharp
// موقعیت اول — Reflection
// می‌خواهی متدی را در Runtime صدا بزنی که نامش را در کامپایل‌تایم نمی‌دانی
var method = obj.GetType().GetMethod("Process");
method.Invoke(obj, new object; // کاملاً بدون Type Safety

// موقعیت دوم — COM Interop
// Excel Object Model همه چیز را به عنوان object برمی‌گرداند
var excel    = new Excel.Application();
var workbook = excel.Workbooks.Open("data.xlsx"); // نوع واقعی object است
var sheet    = workbook.Sheets ;                 // بازهم object

// موقعیت سوم — زبان‌های Dynamic مثل IronPython
// نوع شیء در Runtime مشخص می‌شود
var pyEngine = Python.CreateEngine();
var result   = pyEngine.Execute("2 + 2"); // چه نوعی است؟
```

**C# 4 — کلمه کلیدی `dynamic`:**

```csharp
dynamic obj = GetSomeObject();
obj.Process(42, "hello"); // بررسی در Runtime، نه کامپایل‌تایم
```

### `dynamic` چطور کار می‌کند؟

اسکیت توضیح می‌دهد که `dynamic` در واقع یک نوع است — اما بررسی عملیات روی آن به **Runtime** موکول می‌شود: 

```csharp
// static — بررسی در کامپایل‌تایم
string name = "محمدحسین";
name.Process(); // ❌ خطای کامپایل — string متد Process ندارد

// dynamic — بررسی در Runtime
dynamic name = "محمدحسین";
name.Process(); // ✅ کامپایل می‌شود — اما در Runtime خطا می‌دهد
```

**DLR — Dynamic Language Runtime:**

پشت صحنه، `dynamic` از یک لایه زیرساختی به نام **DLR** استفاده می‌کند. DLR نتایج را **Cache** می‌کند تا هر بار از صفر بررسی نکند: 

```csharp
dynamic calculator = new Calculator();

// اولین فراخوانی — DLR نوع را بررسی می‌کند و Cache می‌کند
var r1 = calculator.Add(1, 2);

// فراخوانی‌های بعدی — از Cache استفاده می‌کند (سریع‌تر)
var r2 = calculator.Add(3, 4);
var r3 = calculator.Add(5, 6);
```

### رفتار `dynamic` فراتر از Reflection

اسکیت یک مثال قدرتمند می‌آورد. اگر کلاسی `IDynamicMetaObjectProvider` را پیاده‌سازی کند، می‌تواند رفتار کاملاً سفارشی در برابر `dynamic` داشته باشد: 

```csharp
// یک شیء که رفتار dynamic آن کاملاً سفارشی است
public class DynamicDictionary : DynamicObject
{
    private readonly Dictionary<string, object> _data = new();

    // هر Property ای که روی این شیء dynamic صدا بزنی
    // به عنوان کلید Dictionary در نظر گرفته می‌شود
    public override bool TryGetMember(GetMemberBinder binder, out object result)
    {
        return _data.TryGetValue(binder.Name, out result);
    }

    public override bool TrySetMember(SetMemberBinder binder, object value)
    {
        _data[binder.Name] = value;
        return true;
    }
}

// استفاده
dynamic person = new DynamicDictionary();
person.Name = "محمدحسین"; // در واقع _data["Name"] = "محمدحسین"
person.Age  = 28;          // در واقع _data["Age"] = 28

Console.WriteLine(person.Name); // → محمدحسین
Console.WriteLine(person.Age);  // → 28
```

این الگو پایه کار با **JSON dynamic**، **ExpandoObject** و بسیاری از کتابخانه‌های scripting است.

### پشت صحنه `dynamic` — یک نگاه کوتاه

```csharp
dynamic x = 10;
dynamic y = 20;
var sum = x + y;

// کامپایلر این کد را به چیزی شبیه این تبدیل می‌کند:
var sum = (dynamic)Microsoft.CSharp.RuntimeBinder.Binder.BinaryOperation(
    CSharpBinderFlags.None,
    ExpressionType.Add,
    typeof(Program),
    new[]
    {
        CSharpArgumentInfo.Create(CSharpArgumentInfoFlags.None, null),
        CSharpArgumentInfo.Create(CSharpArgumentInfoFlags.None, null)
    }
).Invoke(x, y);
```

اسکیت می‌گوید نیازی نیست این را حفظ باشی — اما دانستن اینکه Overhead وجود دارد مهم است. 

### محدودیت‌ها و تله‌های `dynamic`

اسکیت صریحاً هشدار می‌دهد: 

**اول — Extension Methods با `dynamic` کار نمی‌کنند:**

```csharp
dynamic value = "محمدحسین";

// ❌ خطای Runtime — Extension Methods در dynamic resolve نمی‌شوند
var upper = value.ToUpperInvariant(); // این کار می‌کند — متد اصلی string است
var result = value.IsNullOrEmpty();   // ❌ خطا — این Extension Method است

// راه‌حل — Cast صریح
var result = ((string)value).IsNullOrEmpty(); // ✅
```

**دوم — Lambda Expression را نمی‌توان به `dynamic` پاس داد:**

```csharp
dynamic list = new List<int> { 1, 2, 3 };

// ❌ خطای کامپایل
var filtered = list.Where(x => x > 1);

// راه‌حل — Cast به نوع مشخص
var filtered = ((List<int>)list).Where(x => x > 1); // ✅
```

**سوم — Overload Resolution با `dynamic` متفاوت است:**

```csharp
public void Process(int value)    => Console.WriteLine("int");
public void Process(string value) => Console.WriteLine("string");

dynamic d = 42;
Process(d); // در Runtime تصمیم می‌گیرد → "int"

dynamic d2 = "hello";
Process(d2); // در Runtime تصمیم می‌گیرد → "string"
```

این گاهی مفید است — اما می‌تواند رفتار غیرمنتظره ایجاد کند اگر نوع Runtime با آنچه انتظار داری فرق داشته باشد. 

### توصیه‌های اسکیت برای استفاده از `dynamic`

```csharp
// ✅ موارد مناسب

// ۱. COM Interop
dynamic excel = Activator.CreateInstance(Type.GetTypeFromProgID("Excel.Application"));
excel.Visible = true;

// ۲. تعامل با کتابخانه‌های dynamic
dynamic result = jsonObject.users[0].name; // JSON dynamic

// ۳. جایگزین Reflection پیچیده
dynamic obj = Activator.CreateInstance(someType);
obj.Initialize(); // به جای GetMethod("Initialize").Invoke(obj, null)

// ❌ موارد نامناسب

// نباید برای ساده کردن کد معمولی استفاده کنی
dynamic name = "محمدحسین"; // بی‌دلیل — string کافی است
dynamic list = new List<int>(); // بی‌دلیل — نوع مشخص است
```

> **قانون اسکیت:** `dynamic` آخرین راه‌حل است، نه اولین. اگر می‌توانی با Generics، Interface یا Polymorphism کاری را انجام دهی، آن روش را انتخاب کن. `dynamic` Type Safety را قربانی می‌کند و خطاها را از کامپایل‌تایم به Runtime منتقل می‌کند — جایی که پیدا کردن آنها سخت‌تر است.

### ۴.۲ — Optional Parameters و Named Arguments

این ویژگی کوچک اما پرکاربرد است — مخصوصاً در COM Interop که اسکیت بعداً توضیح می‌دهد:

```csharp
// Optional Parameters — مقدار پیش‌فرض در تعریف متد
public void CreateUser(
    string name,
    int    age      = 18,       // اختیاری
    string role     = "User",   // اختیاری
    bool   isActive = true)     // اختیاری
{
    // ...
}

// فراخوانی‌های مختلف
CreateUser("محمدحسین");                          // age=18, role="User", isActive=true
CreateUser("علی", 25);                           // role="User", isActive=true
CreateUser("رضا", 30, "Admin");                  // isActive=true
CreateUser("مریم", 22, "User", false);           // همه پارامترها

// Named Arguments — پارامترها را با نام مشخص می‌کنی
CreateUser("محمدحسین", isActive: false);          // age و role پیش‌فرض می‌مانند
CreateUser("علی", role: "Admin", age: 25);        // ترتیب مهم نیست
```

**یک نکته مهم درباره Versioning:**

اسکیت هشدار می‌دهد که Optional Parameters یک تله Versioning دارند: 

```csharp
// نسخه اول کتابخانه
public void Log(string message, LogLevel level = LogLevel.Info) { ... }

// نسخه دوم — مقدار پیش‌فرض تغییر کرد
public void Log(string message, LogLevel level = LogLevel.Warning) { ... }

// مشکل: کدی که قبلاً کامپایل شده هنوز LogLevel.Info را فراخوانی می‌کند
// چون مقدار پیش‌فرض در سمت Caller کامپایل می‌شود، نه در سمت Library
Log("خطا"); // → همیشه LogLevel.Info — حتی بعد از بروزرسانی Library!
```

---

## فصل ۴ — بخش دوم: COM Interoperability و Generic Variance

### ۴.۳ — COM Interoperability

اسکیت این بخش را با یک نکته تاریخی شروع می‌کند: COM (Component Object Model) یک تکنولوژی مایکروسافت از دهه ۹۰ است که هنوز در قلب Office، Windows Shell و بسیاری از ابزارهای سازمانی زندگی می‌کند. C# 4 سه بهبود مشخص برای کار با COM آورد. 

### مشکل قبل از C# 4 — کار با Excel

```csharp
// C# 3 — کار با Excel Object Model طاقت‌فرسا بود
var excel    = new Microsoft.Office.Interop.Excel.Application();
var workbook = excel.Workbooks.Open(
    "data.xlsx",
    Type.Missing, Type.Missing, Type.Missing,  // پارامترهای اجباری بی‌معنی
    Type.Missing, Type.Missing, Type.Missing,
    Type.Missing, Type.Missing, Type.Missing,
    Type.Missing, Type.Missing, Type.Missing,
    Type.Missing, Type.Missing
);
```

`Type.Missing` برای هر پارامتر اختیاری COM که مقدار پیش‌فرض نداشت باید صریحاً نوشته می‌شد. 

**C# 4 — با Optional Parameters:**

```csharp
// C# 4 — همان کار، بسیار تمیزتر
var excel    = new Excel.Application();
var workbook = excel.Workbooks.Open("data.xlsx"); // بقیه Optional هستند
```

### بهبود اول — Linking Primary Interop Assemblies

قبل از C# 4، برای توزیع برنامه‌ای که از COM استفاده می‌کرد، باید **PIA (Primary Interop Assembly)** را هم همراه برنامه توزیع می‌کردی — یک DLL جداگانه که تعریف‌های COM را داشت.

```csharp
// C# 4 — با [Embed Interop Types] = true در Project Settings
// کامپایلر فقط تعریف‌هایی که واقعاً استفاده می‌کنی را
// مستقیماً داخل Assembly ات کامپایل می‌کند

// نتیجه: نیازی به توزیع PIA نیست — برنامه Self-Contained است
```

اسکیت می‌گوید این بهبود برای سازمان‌هایی که برنامه‌های Office Automation توزیع می‌کنند **عملاً حیاتی** بود. 

### بهبود دوم — Named Indexers در COM

برخی از COM Object ها یک Property خاص دارند که با Index کار می‌کند — مثل `Cells` در Excel:

```csharp
// C# 3 — دسترسی به Cell در Excel
var sheet = workbook.Worksheets ;
var cell  = sheet.get_Range("A1", Type.Missing); // متد مصنوعی

// C# 4 — Named Indexer مستقیم
var cell = sheet.Range["A1"];   // طبیعی و خوانا
var cell = sheet.Cells[1, 1];  // یا با ایندکس عددی
```

### مثال کامل — ساخت یک فایل Excel با C# 4

```csharp
public static class ExcelExporter
{
    public static void Export(IEnumerable<Order> orders, string filePath)
    {
        dynamic excel = new Excel.Application();
        excel.Visible = false;

        dynamic workbook  = excel.Workbooks.Add();
        dynamic worksheet = workbook.Sheets ;

        // هدر ستون‌ها
        worksheet.Cells[1, 1] = "شناسه";
        worksheet.Cells[1, 2] = "مشتری";
        worksheet.Cells[1, 3] = "مبلغ";

        // داده‌ها
        var row = 2;
        foreach (var order in orders)
        {
            worksheet.Cells[row, 1] = order.Id;
            worksheet.Cells[row, 2] = order.Customer;
            worksheet.Cells[row, 3] = order.Total;
            row++;
        }

        workbook.SaveAs(filePath);
        workbook.Close();
        excel.Quit();
    }
}
```

بدون `dynamic` و بهبودهای C# 4، این کد سه برابر طولانی‌تر بود. 

### ۴.۴ — Generic Variance

اسکیت می‌گوید این ویژگی یکی از **مفهومی‌ترین** بخش‌های C# 4 است و درک آن نیاز به دقت دارد.

### مشکل — چرا Variance اصلاً وجود دارد؟

```csharp
// می‌دانیم که این کار می‌کند:
string name   = "محمدحسین";
object obj    = name; // ✅ — string از object ارث برده

// اما این چطور؟
List<string> names   = new List<string>();
List<object> objects = names; // ❌ خطای کامپایل!
```

چرا؟ اسکیت یک استدلال دقیق می‌آورد: 

```csharp
// فرض کن این کار مجاز بود:
List<string> names   = new List<string> { "محمدحسین", "علی" };
List<object> objects = names; // فرضی

// حالا این می‌توانستیم بنویسیم:
objects.Add(42); // ❌ یک int به لیست string اضافه می‌کنیم!

// و بعد:
string first = names[2]; // Runtime Exception — 42 یک string نیست
```

**نتیجه:** `List<T>` باید **Invariant** باشد — یعنی `List<string>` و `List<object>` هیچ رابطه ارثی با هم ندارند. اما گاهی این محدودیت بیش از حد سخت‌گیرانه است. 

### Covariance — کلمه کلیدی `out`

**Covariance** یعنی اگر `string` از `object` ارث برده، پس `IEnumerable<string>` هم می‌تواند به جای `IEnumerable<object>` استفاده شود:

```csharp
// IEnumerable<T> با out T تعریف شده:
public interface IEnumerable<out T>
{
    IEnumerator<T> GetEnumerator();
}

// پس این کار می‌کند:
IEnumerable<string> names   = new List<string> { "محمدحسین", "علی" };
IEnumerable<object> objects = names; // ✅ Covariance

// چرا امن است؟ چون IEnumerable فقط می‌خواند — هیچ‌وقت مقداری Add نمی‌کند
foreach (var obj in objects)
    Console.WriteLine(obj); // ✅ هر string یک object معتبر است
```

**قانون:** `out T` یعنی T فقط در **خروجی** (return type) استفاده می‌شود — هیچ‌وقت به عنوان پارامتر ورودی. 

### Contravariance — کلمه کلیدی `in`

**Contravariance** برعکس Covariance است — و کمی پیچیده‌تر:

```csharp
// IComparer<T> با in T تعریف شده:
public interface IComparer<in T>
{
    int Compare(T x, T y);
}

// یک Comparer برای object
IComparer<object> objectComparer = Comparer<object>.Default;

// می‌توان از آن به عنوان IComparer<string> استفاده کرد
IComparer<string> stringComparer = objectComparer; // ✅ Contravariance

// چرا امن است؟
// اگر objectComparer می‌تواند هر دو object را مقایسه کند،
// قطعاً می‌تواند دو string را هم مقایسه کند — چون string یک object است
```

**قانون:** `in T` یعنی T فقط در **ورودی** (پارامترها) استفاده می‌شود — هیچ‌وقت به عنوان return type. 

### جدول خلاصه Variance

| نوع | کلمه کلیدی | جهت | مثال |
|-----|------------|-----|------|
| **Covariance** | `out` | بزرگ‌تر به کوچک‌تر | `IEnumerable<string>` → `IEnumerable<object>` |
| **Contravariance** | `in` | کوچک‌تر به بزرگ‌تر | `IComparer<object>` → `IComparer<string>` |
| **Invariance** | (هیچ‌کدام) | هیچ تبدیلی | `List<string>` ≠ `List<object>` |

### محدودیت‌های Variance

اسکیت چند محدودیت مهم را ذکر می‌کند: 

```csharp
// ۱. فقط برای Interface و Delegate کار می‌کند — نه Class
public interface IProducer<out T> { T Produce(); }   // ✅
public class Producer<out T> { }                      // ❌ خطای کامپایل

// ۲. فقط برای Reference Types کار می‌کند
IEnumerable<int>    ints    = new List<int>();
IEnumerable<object> objects = ints; // ❌ int یک Value Type است

// ۳. Value Types هیچ‌وقت Variant نیستند
IEnumerable<string> strings = new List<string>();
IEnumerable<object> objects = strings; // ✅ — string یک Reference Type است
```

### Variance در عمل — مثال واقعی

```csharp
public interface IRepository<out T>    // Covariant
{
    T GetById(int id);
    IEnumerable<T> GetAll();
}

public class UserRepository : IRepository<User>
{
    public User GetById(int id) { ... }
    public IEnumerable<User> GetAll() { ... }
}

// چون IRepository<T> با out T تعریف شده:
IRepository<User>   userRepo   = new UserRepository();
IRepository<object> objectRepo = userRepo; // ✅ — Covariance

// کاربرد عملی — یک متد که هر Repository را می‌پذیرد
public static void PrintAll(IRepository<object> repo)
{
    foreach (var item in repo.GetAll())
        Console.WriteLine(item);
}

PrintAll(userRepo);    // ✅ — بدون Cast
```

> **توصیه اسکیت:** در کد روزانه لازم نیست خودت `in` و `out` بنویسی — مگر اینکه کتابخانه طراحی می‌کنی. اما **درک** اینکه چرا `IEnumerable<string>` را می‌توانی به `IEnumerable<object>` تبدیل کنی، از باگ‌های پنهان جلوگیری می‌کند. 

### جمع‌بندی فصل ۴

اسکیت فصل ۴ را با این جمله تمام می‌کند:

> C# 4 یک نسخه **اصطکاک‌زدا** بود. هدفش نه تغییر روش برنامه‌نویسی، بلکه برداشتن موانعی بود که توسعه‌دهندگان را مجبور می‌کرد با دنیای خارج از .NET — اعم از COM، Python یا Ruby — به شیوه‌ای دردناک تعامل کنند. 

---

## فصل ۵ — Writing Asynchronous Code | بخش اول: مقدمه async/await

اسکیت فصل ۵ را با یک جمله قوی شروع می‌کند: **async/await بزرگ‌ترین تغییر C# 5 بود — نه به خاطر اینکه کار جدیدی ممکن کرد، بلکه به خاطر اینکه کار درست را آسان کرد.** 

### مشکل اصلی — چرا Asynchrony اصلاً سخت است؟

برای درک عمق مشکل، اسکیت یک سناریوی ساده می‌آورد:

```csharp
// کد Synchronous — ساده اما مشکل‌ساز
public void UpdateDashboard()
{
    var weather = GetWeather();    // ۲ ثانیه صبر می‌کند
    var emails  = GetEmails();     // ۱ ثانیه صبر می‌کند
    var news    = GetNews();       // ۱.۵ ثانیه صبر می‌کند

    // در این ۴.۵ ثانیه، UI Thread کاملاً بلوک است
    // کاربر نمی‌تواند روی هیچ چیزی کلیک کند
    UpdateUI(weather, emails, news);
}
```

**سه روش قبل از C# 5 برای حل این مشکل:**

```csharp
// روش اول — Thread جدید
// مشکل: Thread ها گران هستند، مدیریت آنها پیچیده است
new Thread(() => {
    var weather = GetWeather();
    Dispatcher.Invoke(() => weatherLabel.Text = weather.Description);
}).Start();

// روش دوم — ThreadPool و Callback
ThreadPool.QueueUserWorkItem(_ => {
    var weather = GetWeather();
    Dispatcher.Invoke(() => weatherLabel.Text = weather.Description);
});

// روش سوم — BeginInvoke / EndInvoke (APM Pattern)
// مشکل: کد به شدت پیچیده و مستعد خطا می‌شود
GetWeatherAsync(result => {
    GetEmailsAsync(emailResult => {
        // Callback Hell — هر عملیات داخل callback قبلی
        UpdateUI(result, emailResult);
    });
});
```

هر سه روش کار می‌کردند اما کد را **غیرقابل خواندن** و **مستعد باگ** می‌کردند. 

### ۵.۱ — اولین مواجهه با async/await

```csharp
// C# 5 — همان منطق، کد خطی و خوانا
private async Task UpdateDashboard()
{
    // هر دو عملیات همزمان شروع می‌شوند
    var weatherTask = GetWeatherAsync();
    var emailTask   = GetEmailsAsync();

    // منتظر هر دو می‌مانیم — بدون بلوک کردن UI Thread
    var weather = await weatherTask;
    var emails  = await emailTask;

    // این کد روی UI Thread اجرا می‌شود — امن است
    weatherLabel.Text = weather.Description;
    inboxLabel.Text   = emails.Count.ToString();
}
```

اسکیت می‌گوید نکته جادویی اینجاست: کد **خطی** به نظر می‌رسد — مثل کد Synchronous معمولی — اما در واقع **Asynchronous** است. 

### ۵.۲ — تفکر درباره Asynchrony

### مبانی اجرای Asynchronous

اسکیت یک تمثیل دقیق می‌آورد:

> تصور کن در یک رستوران هستی. گارسون سفارش تو را می‌گیرد و به آشپزخانه می‌رود — اما **منتظر نمی‌ماند** تا غذا آماده شود. در این مدت سفارش میز بعدی را هم می‌گیرد. وقتی غذا آماده شد، برمی‌گردد و تحویل می‌دهد.

در برنامه‌نویسی:
- **گارسون** = Thread
- **آشپزخانه** = I/O Operation (شبکه، دیسک، دیتابیس)
- **منتظر ماندن بیهوده** = Blocking

```csharp
// Synchronous — Thread بلوک است
var data = File.ReadAllText("large_file.txt"); // Thread اینجا منتظر می‌ماند

// Asynchronous — Thread آزاد است
var data = await File.ReadAllTextAsync("large_file.txt"); // Thread به کار دیگری می‌رود
```

### Synchronization Context — بازگشت به UI Thread

یکی از پیچیده‌ترین مسائل Async Programming این است: وقتی عملیات تمام شد، کدام Thread کد بعد از `await` را اجرا می‌کند؟

```csharp
private async void Button_Click(object sender, EventArgs e)
{
    // این روی UI Thread اجرا می‌شود
    statusLabel.Text = "در حال بارگذاری...";

    var data = await GetDataAsync(); // UI Thread آزاد می‌شود

    // این هم روی UI Thread اجرا می‌شود — بدون Dispatcher.Invoke!
    // SynchronizationContext این را تضمین می‌کند
    dataGrid.ItemsSource = data;
}
```

**SynchronizationContext** یک مکانیزم است که تضمین می‌کند کد بعد از `await` در همان Context قبلی اجرا شود. در WPF و WinForms این یعنی UI Thread. در ASP.NET Core این مکانیزم وجود ندارد — هر Thread آزادی می‌تواند ادامه را اجرا کند. 

### ۵.۳ — تعریف Async Methods

**انواع Return Type:**

```csharp
// ۱. Task — برای عملیاتی که نتیجه‌ای برنمی‌گردانند
public async Task SaveDataAsync(string data)
{
    await File.WriteAllTextAsync("data.txt", data);
}

// ۲. Task<T> — برای عملیاتی که نتیجه برمی‌گردانند
public async Task<string> LoadDataAsync()
{
    return await File.ReadAllTextAsync("data.txt");
}

// ۳. void — فقط برای Event Handler — در بقیه جاها اجتناب کن
private async void Button_Click(object sender, EventArgs e)
{
    await DoSomethingAsync();
}

// ۴. ValueTask<T> — بهینه برای عملیاتی که اغلب Synchronous هستند (C# 7)
public async ValueTask<int> GetCachedValueAsync(int key)
{
    if (_cache.TryGetValue(key, out var cached))
        return cached; // بدون Heap Allocation

    return await FetchFromDatabaseAsync(key);
}
```

**چرا `async void` خطرناک است؟**

```csharp
// مشکل async void — Exception قابل Catch نیست
private async void LoadData()
{
    var data = await GetDataAsync(); // اگر اینجا Exception بیاید...
}

// هیچ‌کس نمی‌تواند این Exception را بگیرد!
try
{
    LoadData(); // این فقط یک void method است
}
catch (Exception ex)
{
    // هرگز اینجا نمی‌رسد — Exception برنامه را Crash می‌کند
}

// درست — از Task استفاده کن
private async Task LoadDataAsync()
{
    var data = await GetDataAsync();
}

try
{
    await LoadDataAsync(); // ✅ Exception قابل Catch است
}
catch (Exception ex)
{
    HandleError(ex);
}
```

### ۵.۴ — عبارت `await`

اسکیت توضیح می‌دهد که `await` یک عملگر است — نه یک دستور:

```csharp
// await روی هر چیزی که "Awaitable" باشد کار می‌کند
var result1 = await someTask;              // Task<T>
var result2 = await someValueTask;         // ValueTask<T>
var result3 = await Task.Delay(1000);      // Task (بدون نتیجه)

// می‌توانی await را داخل Expression استفاده کنی
var length = (await GetStringAsync()).Length;

// یا داخل شرط
if (await IsValidAsync(input))
    ProcessInput(input);
```

**Awaitable Pattern — چه چیزی می‌توان await کرد؟**

هر شیئی که این Pattern را پیاده‌سازی کند:

```csharp
// یک شیء Awaitable باید:
// ۱. متد GetAwaiter() داشته باشد
// ۲. GetAwaiter() باید شیئی برگرداند که:
//    - IsCompleted property داشته باشد
//    - GetResult() متد داشته باشد
//    - INotifyCompletion را پیاده‌سازی کرده باشد

// مثال — یک Awaitable سفارشی ساده
public class DelayAwaitable
{
    private readonly int _milliseconds;

    public DelayAwaitable(int milliseconds)
        => _milliseconds = milliseconds;

    public TaskAwaiter GetAwaiter()
        => Task.Delay(_milliseconds).GetAwaiter();
}

// استفاده
await new DelayAwaitable(1000); // یک ثانیه صبر می‌کند
```

### ۵.۵ — Wrapping مقادیر بازگشتی

یک نکته ظریف که اسکیت روی آن تاکید می‌کند:

```csharp
public async Task<int> GetValueAsync()
{
    await Task.Delay(100);
    return 42; // int برمی‌گرداند — نه Task<int>!
}

// کامپایلر خودش این را به Task<int> تبدیل می‌کند
// نیازی نیست بنویسی: return Task.FromResult(42);
```

اگر متد Async است اما نیازی به انتظار واقعی ندارد:

```csharp
// این کار می‌کند اما یک هشدار کامپایلر می‌دهد
public async Task<int> GetValueAsync()
{
    return 42; // هیچ await ای نداری — پس چرا async؟
}

// بهتر — بدون async برای متدهای بدون await واقعی
public Task<int> GetValueAsync()
{
    return Task.FromResult(42); // مستقیم و بدون Overhead
}
```

### ۵.۶ — جریان اجرای Async Method

اسکیت با یک مثال گام‌به‌گام جریان اجرا را نشان می‌دهد:

```csharp
private async Task<string> ProcessAsync()
{
    Console.WriteLine("۱ — شروع");               // همزمان اجرا می‌شود

    var data = await FetchDataAsync();             // اینجا متوقف می‌شود
                                                   // Thread آزاد می‌شود

    Console.WriteLine("۲ — داده دریافت شد");      // بعد از تکمیل Fetch
    Console.WriteLine($"۳ — طول: {data.Length}");

    var processed = await ProcessDataAsync(data);  // دوباره متوقف می‌شود

    Console.WriteLine("۴ — پردازش تمام شد");

    return processed;
}
```

**جدول جریان اجرا:**

| مرحله | اتفاق |
|-------|-------|
| فراخوانی `ProcessAsync()` | متد شروع به اجرا می‌کند |
| رسیدن به اولین `await` | متد متوقف، Thread آزاد می‌شود |
| تکمیل `FetchDataAsync` | متد از جایی که متوقف شده ادامه می‌دهد |
| رسیدن به دومین `await` | دوباره متوقف، Thread آزاد می‌شود |
| تکمیل `ProcessDataAsync` | متد تا انتها اجرا می‌شود |

### ۵.۱۰ — توصیه‌های عملی اسکیت

اسکیت در پایان این فصل چند قانون طلایی بیان می‌کند: 

**اول — از `ConfigureAwait(false)` در کتابخانه‌ها استفاده کن:**

```csharp
// در کد کتابخانه — نیازی به برگشت به Context اصلی نداری
public async Task<string> FetchDataAsync(string url)
{
    using var client = new HttpClient();
    return await client.GetStringAsync(url).ConfigureAwait(false);
    // false یعنی: بعد از await، روی هر Thread آزادی ادامه بده
    // این از Deadlock جلوگیری می‌کند و Performance بهتر است
}
```

**دوم — چند Task مستقل را همزمان شروع کن:**

```csharp
// ❌ یکی یکی — ۳ ثانیه طول می‌کشد
var weather = await GetWeatherAsync();  // ۱ ثانیه
var emails  = await GetEmailsAsync();   // ۱ ثانیه
var news    = await GetNewsAsync();     // ۱ ثانیه

// ✅ همزمان — ۱ ثانیه طول می‌کشد
var weatherTask = GetWeatherAsync();
var emailTask   = GetEmailsAsync();
var newsTask    = GetNewsAsync();

var weather = await weatherTask;
var emails  = await emailTask;
var news    = await newsTask;

// یا با WhenAll
var (weather, emails, news) = await Task.WhenAll(
    GetWeatherAsync(),
    GetEmailsAsync(),
    GetNewsAsync()
);
```

**سوم — Sync و Async را مخلوط نکن:**

```csharp
// ❌ خطرناک — می‌تواند Deadlock ایجاد کند
public string GetData()
{
    return GetDataAsync().Result;      // .Result بلوک می‌کند
    return GetDataAsync().GetAwaiter().GetResult(); // هم همینطور
}

// ✅ درست — async تا آخر
public async Task<string> GetDataAsync()
{
    return await FetchFromSourceAsync();
}
```

**چهارم — همیشه Cancellation پشتیبانی کن:**

```csharp
public async Task<string> FetchDataAsync(
    string url,
    CancellationToken cancellationToken = default)
{
    using var client = new HttpClient();
    return await client.GetStringAsync(url, cancellationToken);
}

// استفاده با Timeout
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
try
{
    var data = await FetchDataAsync("https://api.example.com", cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("عملیات لغو شد یا Timeout رخ داد");
}
```

---

## فصل ۶ — Async Implementation | پیاده‌سازی داخلی async

اسکیت فصل ۶ را با یک هشدار شروع می‌کند: **این فصل برای اکثر توسعه‌دهندگان «نیاز به دانستن» نیست — اما برای کسی که می‌خواهد async را واقعاً بفهمد، نه فقط استفاده کند، ضروری است.**

### ۶.۱ — ساختار کد تولیدشده

وقتی یک متد `async` می‌نویسی، کامپایلر آن را به یک **State Machine** تبدیل می‌کند. اسکیت می‌گوید این همان ایده Iterator Blocks در C# 2 است — اما بسیار پیچیده‌تر.

```csharp
// کدی که می‌نویسی
private async Task<int> SumAsync(int x, int y)
{
    await Task.Delay(100);
    return x + y;
}
```

کامپایلر این را به تقریباً این ساختار تبدیل می‌کند:

```csharp
// ساختار تقریبی کد تولیدشده توسط کامپایلر
private Task<int> SumAsync(int x, int y)
{
    var stateMachine = new SumAsyncStateMachine
    {
        _x       = x,
        _y       = y,
        _builder = AsyncTaskMethodBuilder<int>.Create(),
        _state   = -1  // حالت اولیه
    };

    stateMachine._builder.Start(ref stateMachine);
    return stateMachine._builder.Task;
}

// State Machine تولیدشده
private struct SumAsyncStateMachine : IAsyncStateMachine
{
    public int    _x, _y;
    public int    _state;
    public AsyncTaskMethodBuilder<int> _builder;

    private TaskAwaiter _awaiter;

    public void MoveNext()
    {
        int result;
        try
        {
            if (_state == 0) goto State0;

            // State اولیه — قبل از اولین await
            _awaiter = Task.Delay(100).GetAwaiter();

            if (!_awaiter.IsCompleted)
            {
                _state = 0;
                _builder.AwaitUnsafeOnCompleted(ref _awaiter, ref this);
                return; // متد را ترک می‌کند — Thread آزاد می‌شود
            }

            State0:
            _awaiter.GetResult(); // نتیجه await را می‌گیریم
            result = _x + _y;
            _builder.SetResult(result);
        }
        catch (Exception ex)
        {
            _state = -2;
            _builder.SetException(ex);
        }
    }

    public void SetStateMachine(IAsyncStateMachine stateMachine)
        => _builder.SetStateMachine(stateMachine);
}
```

### Stub Method — آماده‌سازی و اولین قدم

اسکیت توضیح می‌دهد که وقتی متد async صدا زده می‌شود، یک **Stub Method** اجرا می‌شود که:

```csharp
// سه کار Stub Method:
// ۱. State Machine را می‌سازد
// ۲. متغیرهای ورودی را منتقل می‌کند
// ۳. MoveNext() را برای اولین بار صدا می‌زند

private Task<string> FetchAsync(string url)
{
    // State Machine ساخته می‌شود — اینجا روی Stack است (struct)
    var stateMachine = new FetchAsyncStateMachine();
    stateMachine._url     = url;
    stateMachine._state   = -1;
    stateMachine._builder = AsyncTaskMethodBuilder<string>.Create();

    // اولین MoveNext — تا اولین await اجرا می‌کند
    stateMachine._builder.Start(ref stateMachine);

    // Task را برمی‌گردانیم — نتیجه هنوز آماده نیست
    return stateMachine._builder.Task;
}
```

### ۶.۲ — یک پیاده‌سازی کامل MoveNext

یک مثال کامل‌تر با دو `await`:

```csharp
// کدی که می‌نویسی
private async Task<string> ProcessAsync()
{
    var raw  = await FetchRawDataAsync();
    var data = await ParseAsync(raw);
    return data.ToString();
}
```

**State Machine معادل:**

```csharp
private struct ProcessAsyncStateMachine : IAsyncStateMachine
{
    public int    _state;
    public AsyncTaskMethodBuilder<string> _builder;

    // متغیرهای محلی متد اصلی — باید در State Machine نگه داشته شوند
    private string       _raw;
    private ParsedData   _data;

    // Awaiter هر await
    private TaskAwaiter<byte[]>       _awaiter1; // برای FetchRawDataAsync
    private TaskAwaiter<ParsedData>   _awaiter2; // برای ParseAsync

    public void MoveNext()
    {
        try
        {
            switch (_state)
            {
                case -1: // حالت اولیه
                    _awaiter1 = FetchRawDataAsync().GetAwaiter();

                    if (!_awaiter1.IsCompleted)
                    {
                        _state = 0;
                        _builder.AwaitUnsafeOnCompleted(ref _awaiter1, ref this);
                        return;
                    }
                    goto case 0;

                case 0: // بعد از اولین await
                    _raw = _awaiter1.GetResult();

                    _awaiter2 = ParseAsync(_raw).GetAwaiter();

                    if (!_awaiter2.IsCompleted)
                    {
                        _state = 1;
                        _builder.AwaitUnsafeOnCompleted(ref _awaiter2, ref this);
                        return;
                    }
                    goto case 1;

                case 1: // بعد از دومین await
                    _data = _awaiter2.GetResult();
                    _builder.SetResult(_data.ToString());
                    return;
            }
        }
        catch (Exception ex)
        {
            _state = -2; // حالت خطا
            _builder.SetException(ex);
        }
    }
}
```

### ۶.۳ — Control Flow و MoveNext

**await داخل حلقه:**

اسکیت یک نکته مهم مطرح می‌کند: await داخل حلقه باعث می‌شود State Machine هر بار به همان State برگردد:

```csharp
private async Task<List<string>> FetchAllAsync(IEnumerable<string> urls)
{
    var results = new List<string>();

    foreach (var url in urls)
    {
        var content = await FetchAsync(url); // هر بار به State 0 برمی‌گردد
        results.Add(content);
    }

    return results;
}
```

State Machine برای این کد باید علاوه بر State، وضعیت Iterator حلقه را هم نگه دارد — از همین رو متغیرهای محلی در State Machine ذخیره می‌شوند نه روی Stack.

### **await داخل try/finally:**

```csharp
private async Task ProcessWithCleanupAsync()
{
    var resource = AcquireResource();
    try
    {
        var data = await FetchAsync();     // اینجا State Machine متوقف می‌شود
        Process(data);
    }
    finally
    {
        resource.Release(); // باید حتی بعد از Exception اجرا شود
    }
}
```

کامپایلر باید مطمئن شود `finally` همیشه اجرا می‌شود — حتی اگر Exception بیاید یا Cancellation رخ دهد. این پیچیدگی قابل توجهی به State Machine اضافه می‌کند.

### ۶.۴ — Execution Contexts و Flow

اسکیت یک نکته ظریف امنیتی را توضیح می‌دهد:

```csharp
// ExecutionContext به صورت خودکار منتقل می‌شود
public async Task ProcessRequestAsync()
{
    // اینجا یک کاربر خاص در Context است
    var userId = Thread.CurrentPrincipal.Identity.Name; // "محمدحسین"

    await Task.Delay(100); // Thread عوض می‌شود

    // اما ExecutionContext منتقل شده
    var sameUserId = Thread.CurrentPrincipal.Identity.Name; // هنوز "محمدحسین"
}
```

**ExecutionContext** شامل اطلاعات امنیتی، Logical Call Context و AsyncLocal است. کامپایلر تضمین می‌کند که بعد از هر `await`، این Context بازیابی می‌شود — حتی اگر Thread عوض شده باشد.

```csharp
// AsyncLocal — داده‌ای که در async flow منتقل می‌شود
private static readonly AsyncLocal<string> _correlationId = new();

public async Task HandleRequestAsync(string requestId)
{
    _correlationId.Value = requestId;

    await DoWorkAsync(); // Thread ممکن است عوض شود

    // اما _correlationId هنوز همان مقدار را دارد
    Log($"درخواست {_correlationId.Value} پردازش شد");
}
```

### ۶.۵ — Boxing Dance و بهینه‌سازی

اسکیت یک جزئیات پیاده‌سازی مهم را توضیح می‌دهد:

```csharp
// State Machine یک struct است — روی Stack زندگی می‌کند
// اما وقتی باید منتظر بماند، باید روی Heap برود
// چون Stack Frame از بین می‌رود وقتی متد return می‌کند

// این "Boxing Dance" نامیده می‌شود:
// ۱. ابتدا State Machine روی Stack است (struct)
// ۲. وقتی اولین await ناقص می‌شود، روی Heap کپی می‌شود (box)
// ۳. SetStateMachine این boxing را مدیریت می‌کند

public void SetStateMachine(IAsyncStateMachine stateMachine)
{
    _builder.SetStateMachine(stateMachine); // به builder اطلاع می‌دهد
}
```

**چرا این مهم است؟** در .NET Core، کامپایلر این boxing را بهینه کرده — در اکثر موارد از boxing جلوگیری می‌شود. اما در .NET Framework هنوز وجود دارد.

### جمع‌بندی فصل ۶

اسکیت فصل را با این پیام تمام می‌کند:

```
async متد        →    Stub Method + State Machine
await            →    بررسی IsCompleted + ثبت Continuation
MoveNext()       →    ادامه از State قبلی
Exception        →    SetException در Builder
نتیجه نهایی     →    SetResult در Builder
ExecutionContext  →    به صورت خودکار منتقل می‌شود
```

> **توصیه نهایی اسکیت:** لازم نیست این جزئیات را در کار روزانه به یاد داشته باشی. اما اگر روزی با یک Deadlock عجیب، یک Performance Issue در async کد، یا یک Exception که انتظارش را نداشتی روبرو شدی — این دانش دقیقاً همان چیزی است که تفاوت را می‌سازد.

---

## فصل ۷ — C# 5 Bonus Features

اسکیت این فصل را یک «تنفس» می‌نامد — بعد از عمق فصل ۶، دو ویژگی کوچک اما مفید C# 5 را بررسی می‌کند. 

### ۷.۱ — Capturing Variables در foreach

این یک باگ تاریخی C# بود که در C# 5 اصلاح شد.

**مشکل در C# 4 و قبل‌تر:**

```csharp
var names = new List<string> { "علی", "رضا", "محمدحسین" };
var actions = new List<Action>();

// C# 4 — تله Variable Capture در foreach
foreach (var name in names)
{
    actions.Add(() => Console.WriteLine(name));
}

foreach (var action in actions)
    action();

// انتظار: علی، رضا، محمدحسین
// واقعیت: محمدحسین، محمدحسین، محمدحسین
// چون همه Lambda ها به همان متغیر name اشاره می‌کردند
```

**چرا این اتفاق می‌افتاد؟**

در C# 4، کامپایلر متغیر `name` را **خارج از حلقه** تعریف می‌کرد:

```csharp
// C# 4 — کد تولیدشده تقریبی
var name = default(string); // یک متغیر برای کل حلقه
var enumerator = names.GetEnumerator();
while (enumerator.MoveNext())
{
    name = enumerator.Current; // هر بار همان متغیر به‌روز می‌شود
    actions.Add(() => Console.WriteLine(name)); // همه به همان name اشاره دارند
}
// وقتی Action ها اجرا می‌شوند، name آخرین مقدار را دارد
```

**C# 5 — اصلاح شده:**

```csharp
// C# 5 — کد تولیدشده تقریبی
var enumerator = names.GetEnumerator();
while (enumerator.MoveNext())
{
    var name = enumerator.Current; // هر بار یک متغیر جدید ساخته می‌شود
    actions.Add(() => Console.WriteLine(name)); // هر Lambda متغیر خودش را دارد
}

// حالا خروجی صحیح است: علی، رضا، محمدحسین
```

**نکته مهم اسکیت:** این تغییر فقط برای `foreach` اعمال شد — **نه** برای `for`:

```csharp
// for — هنوز همان مشکل وجود دارد
var actions = new List<Action>();
for (var i = 0; i < 3; i++)
{
    actions.Add(() => Console.WriteLine(i));
}
// خروجی: 3، 3، 3 — نه 0، 1، 2

// راه‌حل برای for — کپی محلی
for (var i = 0; i < 3; i++)
{
    var localI = i; // هر بار یک کپی جدید
    actions.Add(() => Console.WriteLine(localI));
}
// خروجی: 0، 1، 2
```

### ۷.۲ — Caller Information Attributes

این ویژگی برای **Logging** و **Debugging** بسیار مفید است.

**مشکل قبل از C# 5:**

```csharp
// می‌خواهی بدانی این Log از کجا صدا زده شده
public void Log(string message)
{
    // هیچ اطلاعاتی از Caller نداری
    Console.WriteLine($";
}

// یا مجبور بودی دستی اطلاعات بدهی — مستعد خطا
Log($";
```

**C# 5 — سه Attribute جدید:**

```csharp
using System.Runtime.CompilerServices;

public void Log(
    string message,
    [CallerMemberName]  string memberName = "",  // نام متد صداکننده
    [CallerFilePath]    string filePath   = "",  // مسیر فایل
       // شماره خط
{
    Console.WriteLine($";
    Console.WriteLine($"  {message}");
}

// فراخوانی — بدون هیچ پارامتر اضافه‌ای
public class OrderService
{
    public void ProcessOrder(Order order)
    {
        Log("پردازش سفارش شروع شد");
        // خروجی:
        // [OrderService.cs:15 → ProcessOrder]
        //   پردازش سفارش شروع شد
    }
}
```

کامپایلر مقادیر را **در زمان کامپایل** درج می‌کند — هیچ Overhead زمان اجرا وجود ندارد.

### یک Logger کامل با Caller Attributes

```csharp
public static class Logger
{
    private static readonly string _separator = new('-', 60);

    public static void Info(
        string message,
        [CallerMemberName] string member = "",
        [CallerFilePath]   string file   = "",
        
            => Write("INFO", message, member, file, line);

    public static void Error(
        string message,
        [CallerMemberName] string member = "",
        [CallerFilePath]   string file   = "",
        
            => Write("ERROR", message, member, file, line);

    private static void Write(
        string level,
        string message,
        string member,
        string file,
        int    line)
    {
        var timestamp = DateTime.Now.ToString("HH:mm:ss.fff");
        var fileName  = Path.GetFileNameWithoutExtension(file);
        Console.WriteLine($";
        Console.WriteLine($"  → {message}");
    }
}

// استفاده
public class PaymentService
{
    public async Task<bool> ProcessPaymentAsync(decimal amount)
    {
        Logger.Info($"شروع پردازش پرداخت: {amount:C}");

        try
        {
            var result = await _gateway.ChargeAsync(amount);
            Logger.Info($"پرداخت موفق — کد: {result.TransactionId}");
            return true;
        }
        catch (PaymentException ex)
        {
            Logger.Error($"پرداخت ناموفق: {ex.Message}");
            return false;
        }
    }
}
```

### ساده‌سازی INotifyPropertyChanged

یکی از مهم‌ترین کاربردهای این ویژگی در WPF و Xamarin است:

```csharp
// قبل از C# 5 — نام Property را دستی می‌نوشتی
public class PersonViewModel : INotifyPropertyChanged
{
    private string _name;

    public string Name
    {
        get => _name;
        set
        {
            _name = value;
            OnPropertyChanged("Name"); // اگر نام Property عوض شود، باگ!
        }
    }

    protected void OnPropertyChanged(string propertyName)
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

    public event PropertyChangedEventHandler PropertyChanged;
}

// C# 5 — CallerMemberName مشکل را حل می‌کند
public class PersonViewModel : INotifyPropertyChanged
{
    private string _name;
    private int    _age;

    public string Name
    {
        get => _name;
        set { _name = value; OnPropertyChanged(); } // نیازی به نوشتن "Name" نیست
    }

    public int Age
    {
        get => _age;
        set { _age = value; OnPropertyChanged(); }
    }

    protected void OnPropertyChanged(
        => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

    public event PropertyChangedEventHandler PropertyChanged;
}
```

### موارد خاص Caller Information Attributes

اسکیت چند حالت ظریف را بیان می‌کند:

```csharp
// ۱. صدا زدن از Constructor
public class MyService
{
    public MyService()
    {
        Log("سرویس ساخته شد");
        // memberName → ".ctor"
    }
}

// ۲. صدا زدن از Property
public string Name
{
    get
    {
        Log("Name خوانده شد");
        // memberName → "Name"
        return _name;
    }
}

// ۳. صدا زدن از یک Lambda
var action = new Action(() => Log("از Lambda"));
action();
// memberName → نام متدی که Lambda داخلش تعریف شده
```

### جمع‌بندی فصل ۷ و بخش دوم کتاب

اسکیت در پایان این فصل یک نگاه کلی به C# 2 تا 5 می‌اندازد:

```
C# 2  →  پایه‌گذاری Type Safety و Expressiveness
          (Generics، Nullable، Iterators، Anonymous Methods)

C# 3  →  تکمیل ابزارهای Functional و ساختن LINQ
          (Lambda، Extension Methods، Anonymous Types)

C# 4  →  کاهش اصطکاک با دنیای بیرون
          (dynamic، Optional Parameters، COM، Variance)

C# 5  →  Asynchrony به عنوان یک شهروند درجه‌یک
          (async/await، Caller Attributes)
```

> **پیام اسکیت:** هر نسخه یک مشکل واقعی داشت که حل کرد. هیچ‌کدام ویژگی اضافه نکردند — همه یک **درد** داشتند که برطرف کردند. این همان چیزی است که C# را از زبان‌های تکامل‌نیافته متمایز می‌کند.

---

## فصل ۸ — C# 6: Super-Sleek Properties و Expression-Bodied Members

اسکیت بخش سوم کتاب را با یک جمله خلاصه می‌کند: **C# 6 نسخه‌ای بود که کد را «تمیزتر» کرد — نه با افزودن قدرت جدید، بلکه با حذف Ceremony اضافه.** 

### ۸.۱ — تاریخچه کوتاه Properties

قبل از اینکه بهبودها را ببینیم، اسکیت یک مرور سریع می‌کند:

```csharp
// C# 1 — کاملاً دستی
public class Product
{
    private string _name;
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }
}

// C# 2 — دسترسی مجزا برای getter/setter
public string Name { get; private set; }

// C# 3 — Auto-Implemented Properties
public string Name { get; set; }

// C# 6 — بهبودهای بیشتر...
```

### ۸.۲ — بهبودهای Auto-Implemented Properties

**اول — Read-Only Auto Properties:**

```csharp
// قبل از C# 6 — برای Immutable Property مجبور بودی فیلد جداگانه بنویسی
public class Point
{
    private readonly int _x;
    private readonly int _y;

    public int X { get { return _x; } }
    public int Y { get { return _y; } }

    public Point(int x, int y)
    {
        _x = x;
        _y = y;
    }
}

// C# 6 — Read-Only Auto Property
public class Point
{
    public int X { get; }  // فقط getter — فیلد پشتیبان readonly است
    public int Y { get; }

    public Point(int x, int y)
    {
        X = x; // فقط در Constructor مقداردهی ممکن است
        Y = y;
    }
}
```

اسکیت تاکید می‌کند که این با `{ get; private set; }` فرق دارد — در Read-Only Auto Property، فیلد پشتیبان واقعاً `readonly` است و **هیچ‌جایی غیر از Constructor** نمی‌توان آن را تغییر داد. 

**دوم — Initializing Auto Properties:**

```csharp
// قبل از C# 6 — مقداردهی اولیه فقط در Constructor ممکن بود
public class Config
{
    public int    MaxRetries { get; set; }
    public string BaseUrl    { get; set; }

    public Config()
    {
        MaxRetries = 3;
        BaseUrl    = "https://api.example.com";
    }
}

// C# 6 — Property Initializer
public class Config
{
    public int    MaxRetries { get; set; } = 3;
    public string BaseUrl    { get; set; } = "https://api.example.com";
    public List<string> Tags { get; set; } = new List<string>();

    // ترکیب با Read-Only
    public DateTime CreatedAt { get; } = DateTime.UtcNow;
}
```

**ترتیب اجرا مهم است:**

```csharp
public class MyService
{
    public string Name { get; } = "پیش‌فرض";  // اول اجرا می‌شود

    public MyService()
    {
        Name = "مقدار Constructor";  // بعد اجرا می‌شود — مقدار را override می‌کند
    }
}
```

**سوم — Auto Properties در Struct:**

```csharp
// قبل از C# 6 — Struct با Auto Property مجبور بود this را Initialize کند
public struct Coordinate
{
    public double Lat  { get; private set; }
    public double Long { get; private set; }

    public Coordinate(double lat, double lon) : this() // this() اجباری بود!
    {
        Lat  = lat;
        Long = lon;
    }
}

// C# 6 — this() دیگر اجباری نیست
public struct Coordinate
{
    public double Lat  { get; }
    public double Long { get; }

    public Coordinate(double lat, double lon)
    {
        Lat  = lat;
        Long = lon;
    }
}
```

### ۸.۳ — Expression-Bodied Members

این ویژگی برای متدها و Property هایی که **یک عبارت ساده** دارند بسیار کاربردی است.

**سینتکس پایه — عملگر `=>`:**

```csharp
// قبل از C# 6 — حتی برای یک خط کد، آکولاد اجباری بود
public string GetFullName()
{
    return FirstName + " " + LastName;
}

// C# 6 — Expression-Bodied Method
public string GetFullName() => FirstName + " " + LastName;
```

**Read-Only Computed Properties:**

```csharp
// قبل از C# 6
public string FullName
{
    get { return $"{FirstName} {LastName}"; }
}

// C# 6 — بسیار مختصرتر
public string FullName => $"{FirstName} {LastName}";

// مثال‌های بیشتر
public bool   IsAdult  => Age >= 18;
public int    Area     => Width * Height;
public string Display  => $"[{Id}] {Name} — {Price:C}";
```

**Expression-Bodied Methods:**

```csharp
public class OrderService
{
    private readonly IRepository<Order> _repo;

    // متد ساده
    public Task<Order> GetByIdAsync(int id)
        => _repo.GetByIdAsync(id);

    // با منطق کوچک
    public bool IsValid(Order order)
        => order != null && order.Total > 0 && order.Items.Any();

    // Override متدهای object
    public override string ToString()
        => $"OrderService } orders]";
}
```

**Expression-Bodied Indexers و Operators:**

```csharp
public class Matrix
{
    private readonly double[,] _data;
    private readonly int _rows, _cols;

    public Matrix(int rows, int cols)
    {
        _rows = rows;
        _cols = cols;
        _data = new double[rows, cols];
    }

    // Expression-Bodied Indexer
    public double this[int row, int col]
        => _data[row, col];

    // Expression-Bodied Operator
    public static Matrix operator +(Matrix a, Matrix b)
        => a.Add(b);

    // Expression-Bodied متد کمکی
    private Matrix Add(Matrix other)
        => CreateFrom((r, c) => _data;

    private Matrix CreateFrom(Func<int, int, double> valueFactory)
    {
        var result = new Matrix(_rows, _cols);
        for (var r = 0; r < _rows; r++)
            for (var c = 0; c < _cols; c++)
                result._data;
        return result;
    }
}
```

### محدودیت‌های C# 6 برای Expression-Bodied Members

اسکیت صریحاً می‌گوید که در C# 6 برخی موارد هنوز پشتیبانی نمی‌شدند: 

```csharp
// ❌ C# 6 — Constructor با Expression Body ممکن نبود
public Person(string name) => Name = name; // فقط C# 7+

// ❌ C# 6 — Property با getter و setter همزمان ممکن نبود
public string Name
{
    get => _name;
    set => _name = value; // فقط C# 7+
}

// ✅ C# 6 — فقط Read-Only Computed Property
public string Name => _name;
```

### راهنمای استفاده از Expression-Bodied Members

اسکیت یک معیار ساده می‌دهد: 

```csharp
// ✅ مناسب — منطق واقعاً یک عبارت است
public decimal Tax      => Price * 0.09m;
public bool    IsOnSale => DiscountedPrice < Price;
public string  Label    => $"{Name}: {Price:C}";

// ✅ مناسب — Delegation ساده
public Task SaveAsync() => _repo.SaveAsync(this);

// ❌ نامناسب — منطق پیچیده است، خوانایی کم می‌شود
public string Process() =>
    string.Join(", ", Items
        .Where(i => i.IsActive)
        .OrderBy(i => i.Priority)
        .Select(i => $"{i.Name}({i.Score:F1})"));

// بهتر است این را به شکل معمولی بنویسی:
public string Process()
{
    var activeItems = Items
        .Where(i => i.IsActive)
        .OrderBy(i => i.Priority);

    return string.Join(", ", activeItems
        .Select(i => $"{i.Name}({i.Score:F1})"));
}
```

> **قانون طلایی اسکیت:** Expression-Bodied Members برای کدی هستند که **نیازی به توضیح ندارد** — یعنی هر توسعه‌دهنده‌ای با یک نگاه بفهمد چه کاری انجام می‌شود. اگر شک داری، از شکل معمولی استفاده کن.

---

## فصل ۱۰ — C# 6: A Smörgåsbord of Features

اسکیت این فصل را «بوفه» می‌نامد — مجموعه‌ای از ویژگی‌های کوچک که موضوع مشترکی ندارند جز اینکه همه کد را **مختصرتر و امن‌تر** می‌کنند.  

### ۱۰.۱ — Using Static Directives

قبل از C# 6، برای استفاده از متدهای Static باید همیشه نام کلاس را می‌نوشتی:

```csharp
// قبل از C# 6
var root    = Math.Sqrt(16);
var rounded = Math.Round(3.14);
Console.WriteLine(root);

// C# 6 — using static
using static System.Math;
using static System.Console;

var root    = Sqrt(16);    // بدون Math.
var rounded = Round(3.14); // بدون Math.
WriteLine(root);           // بدون Console.
```

**کاربرد واقعی — کد تمیزتر:**

```csharp
using static System.Math;
using static System.String;

public class GeometryService
{
    public double CircleArea(double radius)
        => PI * Pow(radius, 2); // بدون Math.PI و Math.Pow

    public bool IsValidName(string name)
        => !IsNullOrWhiteSpace(name) // بدون String.
           && name.Length <= 100;
}
```

### Extension Methods و using static

اسکیت یک نکته مهم بیان می‌کند:

```csharp
// Extension Methods با using static در دسترس نیستند
using static MyProject.StringExtensions;

var result = "متن".Truncate(10);  // ✅ این کار می‌کند
var result = Truncate("متن", 10); // ❌ این کار نمی‌کند

// using static فقط Static Members غیر-Extension را Import می‌کند
// برای Extension Methods همچنان نیاز به using معمولی داری
using MyProject.Extensions; // ✅ درست برای Extension Methods
```

### ۱۰.۲ — Object و Collection Initializer Enhancements

**Indexers در Object Initializers:**

```csharp
// قبل از C# 6 — Dictionary را دستی پر می‌کردی
var headers = new Dictionary<string, string>();
headers["Content-Type"]  = "application/json";
headers["Authorization"] = "Bearer token123";

// C# 3 — Collection Initializer با Add
var headers = new Dictionary<string, string>
{
    { "Content-Type",  "application/json" },
    { "Authorization", "Bearer token123"  }
};

// C# 6 — Index Initializer — خواناتر
var headers = new Dictionary<string, string>
{
    ["Content-Type"]  = "application/json",
    ["Authorization"] = "Bearer token123",
    ["Accept"]        = "application/json"
};
```

**چرا دو روش وجود دارد؟**

اسکیت توضیح می‌دهد که روش C# 3 متد `Add()` را صدا می‌زند، اما روش C# 6 مستقیماً Indexer را استفاده می‌کند — این تفاوت وقتی رفتار `Add` و `set` متفاوت است، اهمیت پیدا می‌کند:

```csharp
public class ConfigCollection
{
    private readonly Dictionary<string, string> _data = new();

    // Add — اگر کلید وجود داشته باشد Exception می‌دهد
    public void Add(string key, string value)
        => _data.Add(key, value);

    // Indexer — اگر کلید وجود داشته باشد Override می‌کند
    public string this[string key]
    {
        get => _data[key];
        set => _data[key] = value;
    }
}

// با {} — از Add استفاده می‌کند
var config = new ConfigCollection
{
    { "key", "value1" },
    { "key", "value2" } // ❌ Exception — کلید تکراری
};

// با [] — از Indexer استفاده می‌کند
var config = new ConfigCollection
{
    ["key"] = "value1",
    ["key"] = "value2" // ✅ دومی اولی را Override می‌کند
};
```

### Extension Methods در Collection Initializers

```csharp
// اگر یک کلاس متد Add ندارد اما Extension Method دارد
public class EventList
{
    private readonly List<string> _events = new();
    public IEnumerable<string> Events => _events;
}

// Extension Method
public static class EventListExtensions
{
    public static void Add(this EventList list, string eventName)
        => list._events.Add(eventName); // فرضی — اگر دسترسی داشتیم
}

// C# 6 — از Extension Method در Initializer استفاده می‌کند
var log = new EventList { "ورود کاربر", "مشاهده صفحه", "خروج" };
```

### ۱۰.۳ — Null Conditional Operator

اسکیت می‌گوید این ویژگی احتمالاً **پرکاربردترین** ویژگی C# 6 است.  

**مشکل کلاسیک — NullReferenceException:**

```csharp
// قبل از C# 6 — کد دفاعی طولانی
public string GetCustomerCity(Order order)
{
    if (order == null)
        return null;
    if (order.Customer == null)
        return null;
    if (order.Customer.Address == null)
        return null;
    return order.Customer.Address.City;
}

// C# 6 — Null Conditional Operator ?.
public string GetCustomerCity(Order order)
    => order?.Customer?.Address?.City;
```

**جزئیات عملگر `?.`:**

```csharp
var order = GetOrder();

// اگر order یا Customer یا Address null باشد → null برمی‌گرداند
var city    = order?.Customer?.Address?.City;   // string?
var length  = order?.Customer?.Name?.Length;     // int? (نه int)
var upper   = order?.Customer?.Name?.ToUpper();  // string?

// ترکیب با ?? برای مقدار پیش‌فرض
var city    = order?.Customer?.Address?.City ?? "نامشخص";
var length  = order?.Customer?.Name?.Length  ?? 0;
```

**Null Conditional با متدها:**

```csharp
// فراخوانی متد — اگر شیء null باشد، متد صدا زده نمی‌شود
order?.Cancel();         // اگر order null باشد، هیچ اتفاقی نمی‌افتد
list?.Clear();

// با Event Handler — الگوی رایج
public event EventHandler<OrderArgs> OrderPlaced;

// قبل از C# 6 — نیاز به بررسی null
var handler = OrderPlaced;
if (handler != null)
    handler(this, new OrderArgs(order));

// C# 6 — مختصر و Thread-Safe
OrderPlaced?.Invoke(this, new OrderArgs(order));
```

**Null Conditional با Indexer:**

```csharp
// ?[] برای array و list
var list = GetList();
var first = list?[0];     // اگر list null باشد → null

// ترکیب
var name = customers?[0]?.Name ?? "نامشخص";
```

**یک تله مهم — Boolean Comparison:**

```csharp
// مشکل — نتیجه bool? است نه bool
var isActive = order?.IsActive;       // bool? — نه bool

// نمی‌توانی مستقیم در if استفاده کنی
if (order?.IsActive) { }              // ❌ خطای کامپایل

// راه‌حل اول — مقایسه صریح
if (order?.IsActive == true)  { }     // ✅ فقط اگر هم order و هم IsActive true باشند
if (order?.IsActive != false) { }     // ✅ اگر null یا true باشد

// راه‌حل دوم — ?? با bool
if (order?.IsActive ?? false) { }    // ✅ اگر null باشد false در نظر می‌گیرد
```

### ۱۰.۴ — Exception Filters

قبل از C# 6، نمی‌توانستی یک Exception را بر اساس شرط بگیری — یا می‌گرفتی یا نمی‌گرفتی:

```csharp
// قبل از C# 6 — مجبور بودی catch کنی و بعد re-throw کنی
try
{
    await ProcessAsync();
}
catch (HttpRequestException ex)
{
    if (ex.StatusCode == HttpStatusCode.NotFound)
        HandleNotFound(ex);
    else
        throw; // re-throw — اما Stack Trace تغییر می‌کند!
}
```

**C# 6 — Exception Filter با `when`:**

```csharp
try
{
    await ProcessAsync();
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
{
    HandleNotFound(ex); // فقط برای 404
}
catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
{
    HandleUnauthorized(ex); // فقط برای 401
}
catch (HttpRequestException ex)
{
    HandleGenericError(ex); // بقیه HTTP خطاها
}
```

**چرا `when` بهتر از re-throw است؟**

اسکیت یک تفاوت حیاتی توضیح می‌دهد: وقتی از `when` استفاده می‌کنی، اگر شرط `false` باشد، Exception **اصلاً Catch نمی‌شود** — Stack Trace کاملاً دست‌نخورده باقی می‌ماند. اما با `throw` داخل catch، حتی اگر `throw;` بنویسی، برخی اطلاعات debug از بین می‌روند:

```csharp
// ❌ Stack Trace ممکن است آسیب ببیند
catch (Exception ex)
{
    if (ShouldHandle(ex)) Handle(ex);
    else throw;
}

// ✅ Stack Trace کاملاً دست‌نخورده
catch (Exception ex) when (ShouldHandle(ex))
{
    Handle(ex);
}
```

**Logging به عنوان Side Effect:**

اسکیت یک الگوی جالب نشان می‌دهد:

```csharp
// when می‌تواند Side Effect داشته باشد
// اگر false برگرداند، Exception را رد می‌کند اما Log را ثبت کرده
catch (Exception ex) when (LogException(ex))
{
    // هرگز اینجا نمی‌رسیم چون LogException همیشه false برمی‌گرداند
}

private bool LogException(Exception ex)
{
    _logger.LogError(ex, "خطا رخ داد — در حال انتشار به بالا");
    return false; // اجازه می‌دهد Exception ادامه پیدا کند
}
```

این الگو به تو اجازه می‌دهد Exception را بدون گرفتن آن **Log** کنی — Stack Trace کامل می‌ماند.

### جمع‌بندی فصل ۱۰ و C# 6

اسکیت C# 6 را با این پیام جمع‌بندی می‌کند:

```
using static          →  حذف نام کلاس تکراری برای Static Members
Index Initializers    →  مقداردهی Dictionary با سینتکس طبیعی‌تر
Null Conditional ?.   →  حذف بررسی‌های تکراری null
Exception Filters     →  کنترل دقیق‌تر بدون آسیب به Stack Trace
Expression-Bodied     →  حذف Ceremony برای متدها و Property های ساده
String Interpolation  →  جایگزین خوانا برای string.Format
nameof                →  حذف Magic String از کد
```

> **پیام اسکیت:** C# 6 نسخه‌ای بود که تیم C# وقت گذاشت و پرسید: «کجاهایی از زبان باعث می‌شود توسعه‌دهنده کد اضافه و تکراری بنویسد؟» — و برای هر کدام یک راه‌حل ظریف طراحی کرد. نتیجه زبانی بود که همان قدرت قبل را داشت اما کد نوشته‌شده با آن **قابل‌خواندن‌تر** و **کمتر مستعد خطا** بود.

---