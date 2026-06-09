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

***

## 📘 فصل ۱ — Survival of the Sharpest

### بخش اول: C# چگونه تکامل یافت؟

**جان اسکیت** در ابتدای فصل یک سوال مهم مطرح می‌کند: وقتی یک زبان برنامه‌نویسی در طول سال‌ها تغییر می‌کند، آیا این تغییرات هدفمند هستند یا تصادفی؟ 

پاسخ برای C# کاملاً هدفمند است. اسکیت می‌گوید به جای نشان دادن یک مثال واحد از تمام نسخه‌ها، بهتر است **محورهای تکامل** را بشناسیم. 

***

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

***

### محور دوم: کد مختصرتر (Concise Code)

اسکیت یک مثال تدریجی از تکامل Delegates می‌آورد که نشان می‌دهد C# چقدر Ceremony (تشریفات اضافه) را حذف کرده: 

| نسخه | کد | مشکل |
|------|----|------|
| **C# 1** | `button.Click += new EventHandler(HandleButtonClick);` | پرحجم، نیاز به متد جداگانه |
| **C# 2** | `button.Click += HandleButtonClick;` | ساده‌تر با Method Group Conversion |
| **C# 2** | `button.Click += delegate { MessageBox.Show("Clicked!"); };` | Anonymous Method، نیازی به متد جداگانه نیست |
| **C# 3** | `button.Click += (sender, args) => MessageBox.Show("Clicked!");` | Lambda Expression، خواناترین شکل |

***

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

***

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

***

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

***

### ۱.۳ — یک Community در حال تکامل

این بخش کوتاه اما مهم است. اسکیت می‌گوید C# دیگر فقط یک زبان «Microsoft برای Windows» نیست. 

**چند تغییر بنیادی در Community:**

- **GitHub و Open Source:** کد کامپایلر C# (Roslyn) روی GitHub است. هر کسی می‌تواند باگ گزارش دهد، PR بفرستد یا حتی برای ویژگی‌های جدید **رای** بدهد
- **Language Design در فضای عمومی:** مخزن `dotnet/csharplang` روی GitHub، محل بحث درباره تمام تصمیمات طراحی زبان است. تصمیماتی که قبلاً پشت درهای بسته Microsoft گرفته می‌شد
- **Stack Overflow:** خود اسکیت (با بیشترین reputation تاریخ Stack Overflow) بخشی از این Community است و می‌گوید تعامل با توسعه‌دهندگان دیگر، **بهترین روش یادگیری** اوست

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

***

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

