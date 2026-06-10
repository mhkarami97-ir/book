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

