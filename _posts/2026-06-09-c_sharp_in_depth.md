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

