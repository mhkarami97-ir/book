---
layout: post
full-width: true
title: How Google Tests Software
subtitle: How Google Tests Software
cover-img: /assets/images/how_google_tests_software.jpg
thumbnail-img: /assets/images/how_google_tests_software.jpg
share-img: /assets/images/how_google_tests_software.jpg
tags: [کتاب, مهندسی, برنامه_نویسی]
---

## توضیحات
روش هایی تست نرم افزار در گوگل

## نظر
اطلاعات مفید و جالبی درباره تست در شرکت گوگل می‌دهد که در شرکت خود می‌توانید استفاده کنید

## نظر
 - `امتیاز` : 07/10
 - `به دیگران توصیه می‌کنم` : بله
 - `دوباره می‌خوانم` : خیر
 - `ایده برجسته` : نقش‌های مهندسی تست در گوگل (SWE, SET, TE) و اهمیت تست‌پذیری در طراحی نرم‌افزار
 - `تاثیر در من` : دقت بیشتر در طراحی برای تست‌پذیری و تفکیک نقش‌ها در تیم‌های توسعه
 - `نکات مثبت` : ساختارمند بودن تست در گوگل، تاکید بر تست‌پذیری، نقش‌های مشخص مهندسی تست
 - `نکات منفی` : کمی قدیمی

## مشخصات
 - `نویسنده` : Jeff Carollo, James A. Whittaker, Jason Arbon
 - `انتشارات` : 

## بخش‌هایی از کتاب

# بخش اول: مقدمه‌ای بر تست نرم‌افزار در گوگل

در این بخش، جیمز ویتاکر (James Whittaker) یک حقیقت تلخ اما واقعی را بیان می‌کند: **"کیفیت با تست کردن به وجود نمی‌آید."** (Quality cannot be tested in).

### ۱. فلسفه اصلی: کیفیت ≠ تست
در بسیاری از شرکت‌های سنتی، فرآیند به این صورت است: توسعه‌دهندگان (Developers) کد می‌زنند و آن را به تیم تست (QA) "پرتاب" می‌کنند. تیم تست باگ پیدا می‌کند و برمی‌گرداند. گوگل می‌گوید این روش محکوم به شکست است.

**نکته عمیق و تخصصی:**
اگر نرم‌افزار از ابتدا درست معماری و کدنویسی نشده باشد، هیچ مقدار تستی نمی‌تواند آن را باکیفیت کند. مثل این است که ماشینی بسازید که موتورش نقص دارد و بخواهید با رنگ کردن بدنه، کیفیتش را بالا ببرید.
در گوگل، **توسعه و تست در هم آمیخته‌اند (Blended).** شما نمی‌توانید بگویید کجا توسعه تمام شد و کجا تست شروع شد.

> **درس برای ما:** در پروژه‌های .NET Core خودت، تست نباید یک مرحله جداگانه در انتهای اسپرینت باشد. تست باید بخشی از فرآیند نوشتن کد باشد (مثل TDD که اشاره کردی).

### ۲. نقش‌های کلیدی (The Roles)
گوگل برای حل مشکل مقیاس‌پذیری و کیفیت، نقش‌های مهندسی را بازتعریف کرده است. این قسمت بسیار مهم است چون تفاوت "تستر" و "مهندس تست" را نشان می‌دهد.

#### الف) مهندس نرم‌افزار (SWE - Software Engineer)
*   **وظیفه:** توسعه فیچرها و کدهای اصلی محصول.
*   **مسئولیت تست:** بله، درست خواندی. مسئولیت اصلی کیفیت با خود SWE است. آن‌ها باید کدهای Unit Test خود را بنویسند.
*   **دیدگاه:** "من چیزی را می‌سازم، پس مسئولیت خراب شدنش با من است."

#### ب) مهندس نرم‌افزار در تست (SET - Software Engineer in Test)
*   **وظیفه:** این نقش یک توسعه‌دهنده است، اما تمرکزش روی **تست‌پذیری (Testability)** است.
*   **کار عملی:** SETها فریم‌ورک‌های تست می‌سازند. آن‌ها Mocks و Stubs را ایجاد می‌کنند تا SWEها بتوانند راحت‌تر تست بنویسند. آن‌ها "زیرساخت کیفیت" را می‌سازند.
*   **تخصص:** این افراد باید به اندازه SWEها در کدنویسی (مثلاً C# یا Java) قوی باشند، اما ذهنیتشان روی شکستن کد و پیدا کردن نقاط ضعف معماری متمرکز است.

#### ج) مهندس تست (TE - Test Engineer)
*   **وظیفه:** تمرکز روی **کاربر (User)**.
*   **کار عملی:** آن‌ها تست‌های End-to-End را مدیریت می‌کنند، ریسک‌های پروژه را تحلیل می‌کنند و مطمئن می‌شوند که تمام اجزا در کنار هم برای کاربر نهایی درست کار می‌کنند.
*   **دیدگاه:** "آیا این محصول واقعاً نیاز کاربر را برطرف می‌کند؟"

### ۳. ساختار سازمانی: استقلال مهندسی (Engineering Productivity)
یک نکته بسیار استراتژیک در گوگل این است که تیم‌های تست (SET و TE) معمولاً زیر نظر مدیران محصول (Product Managers) نیستند. آن‌ها در یک سازمان مستقل به نام **Engineering Productivity** فعالیت می‌کنند.
*   **چرا؟** چون اگر تسترها زیر نظر مدیر محصول باشند، وقتی ددلاین (Deadline) نزدیک می‌شود، مدیر ممکن است بگوید "بی‌خیال تست شوید، باید ریلیز کنیم".
*   **نتیجه:** در گوگل، تیم تست قدرت "وتو" دارد و می‌تواند بگوید "این محصول از نظر کیفی آماده نیست" و کسی نمی‌تواند آن‌ها را مجبور به تایید کند.

### ۴. انواع تست‌ها: کوچک، متوسط، بزرگ (Small, Medium, Large)
گوگل به جای استفاده از واژه‌های گیج‌کننده مثل Unit, Integration, System, Functional، از سایز تست استفاده می‌کند که روی **Scope** (دامنه) تمرکز دارد:

1.  **Small Tests (تست‌های کوچک):**
    *   معمولاً همان Unit Testها هستند.
    *   روی یک تابع یا کلاس واحد تمرکز دارند.
    *   باید بسیار سریع باشند (زیر ۱۰۰ میلی‌ثانیه).
    *   هیچ وابستگی خارجی (دیتابیس، شبکه، فایل سیستم) نباید داشته باشند (همه چیز Mock می‌شود).
    *   **مسئول:** عمدتاً SWE.

2.  **Medium Tests (تست‌های متوسط):**
    *   معمولاً Integration Test هستند.
    *   تعامل بین دو یا چند ماژول را چک می‌کنند (مثلاً سرویس و دیتابیس In-Memory).
    *   ممکن است از Mock استفاده کنند یا نکنند (مثلاً استفاده از Local Database).
    *   **مسئول:** همکاری SWE و SET.

3.  **Large Tests (تست‌های بزرگ):**
    *   تست‌های End-to-End یا System Tests.
    *   سناریوی واقعی کاربر را شبیه‌سازی می‌کنند.
    *   از دیتابیس واقعی، شبکه واقعی و سرویس‌های خارجی استفاده می‌کنند.
    *   کند هستند و ممکن است ساعت‌ها طول بکشند.
    *   **مسئول:** عمدتاً TE و SET.

### ۱. اصل "Quality is a Feature"
در معماری تمیز (Clean Architecture)، ما اغلب تست‌ها را در یک پروژه جداگانه (مثلاً `MyProject.Tests`) می‌گذاریم. گوگل به ما یاد می‌دهد که زیرساخت تست (مثل کلاس‌های Base برای Integration Testها، کانتینرهای Docker برای بالا آوردن دیتابیس تست و ...) خودش یک محصول مهندسی است.
*   **توصیه:** اگر در پروژه‌هایت از EF Core استفاده می‌کنی، یک زیرساخت قوی برای `InMemoryDatabase` یا بهتر از آن، استفاده از `Testcontainers` برای بالا آوردن SQL Server واقعی در تست‌های Medium بساز. این کار دقیقاً وظیفه یک SET است.

### ۲. پرهیز از Mockهای بیش از حد
در بخش تست‌های Small، گوگل تاکید می‌کند که Mockها خوب هستند، اما در تست‌های Medium و Large باید مراقب باشیم. اگر همه چیز را Mock کنیم، در واقع داریم "تست می‌کنیم که آیا Mockهای ما درست کار می‌کنند" نه اینکه کد ما درست کار می‌کند.
*   **Best Practice:** در .NET Core، سعی کن Logic خالص (Domain Logic) را طوری بنویسی که وابستگی خارجی نداشته باشد تا راحت Small Test شود (بدون نیاز به Mock پیچیده). این دقیقاً با اصول DDD که تو کار می‌کنی همخوانی دارد. Domain Model نباید به Infrastructure وابسته باشد.

### ۳. اتوماسیون بی‌پایان (Automation)
گوگل می‌گوید اگر کاری را باید دستی انجام دهید، اشتباه است. حتی فرآیند بیلد و ریلیز.
*   **اقدام عملی:** مطمئن شو که پایپ‌لاین‌های CI/CD (مثلاً با GitHub Actions که کار می‌کنی) طوری تنظیم شده‌اند که به محض Push کردن کد:
    1.  Small Tests اجرا شوند.
    2.  اگر پاس شدند، بیلد انجام شود.
    3.  Medium Tests در یک محیط ایزوله اجرا شوند.

---

# فصل دوم: مهندس نرم‌افزار در تست (SET) - تحلیل عمیق

در این فصل، جیمز ویتاکر (James Whittaker) به تشریح یکی از کلیدی‌ترین نقش‌های مهندسی در گوگل می‌پردازد: **مهندس نرم‌افزار در تست** یا **SET**.

## ۱. مقدمه: تقابل آرمان‌شهر و واقعیت
ویتاکر بحث را با توصیف یک فرآیند توسعه ایده‌آل آغاز می‌کند. در یک دنیای کامل، توسعه‌دهنده پیش از آنکه حتی یک خط کد بنویسد، از خود می‌پرسد: **«این قطعه کد چگونه تست خواهد شد؟»**

در چنین دنیایی، توسعه‌دهنده برای تمام حالات مرزی (Boundary Cases)، داده‌های ورودی نامعتبر و خطاهای احتمالی، تست می‌نویسد. اما در واقعیت، فشار زمان و ددلاین‌ها باعث می‌شود که توسعه‌دهندگان (SWEs) اغلب روی "نوشتن فیچر" تمرکز کنند و "تست‌پذیری" را فراموش کنند.

اینجاست که نقش **SET** متولد می‌شود.

## ۲. تعریف دقیق نقش SET
برخلاف تصور رایج در بسیاری از شرکت‌ها، SET یک "تستر دستی" یا "QA سنتی" نیست.
*   **هویت:** SET یک توسعه‌دهنده (Developer) تمام‌عیار است. مهارت کدنویسی او باید هم‌تراز با مهندس نرم‌افزار (SWE) باشد.
*   **ماموریت:** وظیفه اصلی SET، **تست کردن محصول نیست**؛ بلکه وظیفه او فراهم کردن بستری است که SWEها بتوانند کدهایشان را تست کنند.
*   **تمرکز:** تمرکز SWE روی کاربر و فیچرهاست، اما تمرکز SET روی **تست‌پذیری (Testability)**، **قابلیت اطمینان (Reliability)** و **زیرساخت‌های کیفیت** است.

به زبان ساده: **SWE فیچر را می‌نویسد، و SET کدی را می‌نویسد که نوشتن تست برای آن فیچر را ممکن می‌سازد.**

## ۳. چرخه حیات توسعه و نقش SET

گوگل برای مدیریت مقیاس عظیم کدهایش، فرآیندهای مشخصی دارد که SET در تمام آن‌ها نقش ایفا می‌کند.

### الف) فاز پروتوتایپ (The Prototype Phase)
در ابتدای خلق یک محصول جدید، هدف اصلی اثبات کارایی ایده است. در این مرحله، گوگل اجازه می‌دهد که کیفیت فدای سرعت شود.
*   **قانون:** تا زمانی که مشخص نشود یک محصول ارزش توسعه دارد، صرف منابع برای تست‌های پیچیده، اتلاف وقت است.
*   **نقش SET:** در این مرحله دخالت چندانی نمی‌کند تا سرعت تیم گرفته نشود.

### ب) فاز طراحی (The Design Phase)
زمانی که پروژه رسمی شد، SET وارد می‌شود. این مهم‌ترین نقطه‌ی اثرگذاری SET است. او مستندات طراحی (Design Docs) را بررسی می‌کند.
در گوگل، SETها مستندات را بر اساس چهار معیار نقد می‌کنند:
1.  **کامل بودن (Completeness):** آیا همه وابستگی‌ها و سناریوها دیده شده‌اند؟
2.  **صحت (Correctness):** آیا منطق سیستم درست است؟ (حتی غلط‌های املایی در مستندات نشانه بی‌دقتی تلقی می‌شوند).
3.  **یکپارچگی (Consistency):** آیا دیاگرام‌ها با متن توضیحات همخوانی دارند؟
4.  **تست‌پذیری (Testability):** آیا می‌توان برای این سیستم تست خودکار نوشت؟ آیا وابستگی‌های خارجی (External Dependencies) قابل کنترل هستند؟

> **تحلیل معماری برای شما:**
> به عنوان یک معمار نرم‌افزار، وقتی Design یک میکروسرویس جدید را بررسی می‌کنید، باید بپرسید: "آیا این سرویس به دیتابیس SQL وابستگی مستقیم (Hard-coded) دارد یا از طریق Interface تزریق می‌شود؟" اگر مستقیم باشد، تست‌پذیری پایین است و SET باید اینجا اعتراض کند.

## ۴. اتوماسیون و استراتژی تست (Automation Planning)

یکی از وظایف اصلی SET، نوشتن فریم‌ورک‌های تست است. گوگل تاکید دارد که **نباید** همه چیز را به صورت End-to-End (تست بزرگ) تست کرد، زیرا این تست‌ها کند و شکننده (Brittle) هستند.

### استفاده از ماک‌ها و فیک‌ها (Mocks & Fakes)
برای اینکه بتوانیم تست‌های کوچک (Small Tests) و سریع داشته باشیم، باید وابستگی‌ها را شبیه‌سازی کنیم.
*   **Mock:** شبیه‌سازی رفتار یک تابع (مثلاً: اگر متد X صدا زده شد، مقدار Y را برگردان).
*   **Fake:** پیاده‌سازی سبک و سریع یک Interface (مثلاً: یک دیتابیس که به جای SQL Server، از یک `List<T>` در حافظه استفاده می‌کند).

SETها وظیفه دارند این کلاس‌های Fake را بنویسند تا SWEها بتوانند به راحتی از آن‌ها استفاده کنند.

## ۵. مثال عملی با رویکرد Clean Code و C#

کتاب مثالی از یک سرویس `AddUrl` می‌زند. بیایید این مثال را با استانداردهای .NET Core، اصول SOLID و معماری تمیز بازنویسی کنیم.

### گام اول: تعریف قراردادها (Contracts)
قبل از پیاده‌سازی سرویس، باید ورودی و خروجی مشخص شود. در گوگل از Protocol Buffers استفاده می‌شود، اما در .NET ما از DTOها استفاده می‌کنیم.

```csharp
// Contracts/AddUrlRequest.cs
public class AddUrlRequest
{
    public string Url { get; set; }      // الزامی
    public string Comment { get; set; }  // اختیاری
}

// Contracts/AddUrlResponse.cs
public class AddUrlResponse
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; }
    public int RecordId { get; set; }
}
```

### گام دوم: تعریف اینترفیس (Interface Definition)
این مهم‌ترین بخش برای تست‌پذیری است.

```csharp
// Interfaces/IUrlService.cs
public interface IUrlService
{
    Task<AddUrlResponse> AddUrlAsync(AddUrlRequest request);
}
```

### گام سوم: پیاده‌سازی Fake توسط SET
مهندس SET این کلاس را می‌نویسد تا بقیه تیم بتوانند بدون نیاز به دیتابیس واقعی، کدهایشان را تست کنند.

```csharp
// Tests/Fakes/FakeUrlService.cs
public class FakeUrlService : IUrlService
{
    // استفاده از یک لیست در حافظه به جای دیتابیس واقعی
    private readonly List<AddUrlRequest> _storedUrls = new();
    
    public Task<AddUrlResponse> AddUrlAsync(AddUrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
        {
            return Task.FromResult(new AddUrlResponse 
            { 
                IsSuccess = false, 
                ErrorMessage = "URL cannot be empty" 
            });
        }

        _storedUrls.Add(request);
        
        return Task.FromResult(new AddUrlResponse 
        { 
            IsSuccess = true, 
            RecordId = _storedUrls.Count 
        });
    }
}
```

### گام چهارم: نوشتن تست واحد (Unit Test)
حالا SWE می‌تواند با استفاده از این Fake، منطق کنترلر یا لایه بالاتر را تست کند.

```csharp
[TestClass]
public class UrlControllerTests
{
    private UrlController _controller;
    private IUrlService _fakeService;

    [TestInitialize]
    public void Setup()
    {
        // تزریق وابستگی Fake
        _fakeService = new FakeUrlService(); 
        _controller = new UrlController(_fakeService);
    }

    [TestMethod]
    public async Task AddUrl_ValidRequest_ReturnsOk()
    {
        // Arrange
        var request = new AddUrlRequest { Url = "https://site.com" };

        // Act
        var result = await _controller.Post(request);

        // Assert
        Assert.IsInstanceOfType(result, typeof(OkObjectResult));
    }
}
```

## ۶. دروازه‌های کیفیت (Quality Gates) و صف ارسال (Submit Queue)

یکی از جذاب‌ترین بخش‌های مهندسی گوگل، نحوه مدیریت کدها قبل از ورود به مخزن اصلی (Main Repository) است.

1.  **بررسی کد (Code Review):** تمام تغییرات باید توسط حداقل یک نفر دیگر بررسی شود. SETها نیز در بررسی کدها شرکت می‌کنند تا مطمئن شوند کد جدید، تست‌های قبلی را خراب نمی‌کند.
2.  **صف ارسال (Submit Queue):** وقتی توسعه‌دهنده کد را نهایی می‌کند، کد وارد یک صف خودکار می‌شود.
    *   سیستم به صورت خودکار تمام تست‌های مرتبط (Small, Medium) را اجرا می‌کند.
    *   اگر حتی یک تست شکست بخورد (Fail شود)، کد رد (Reject) می‌شود و به توسعه‌دهنده برمی‌گردد.
    *   این مکانیزم تضمین می‌کند که شاخه اصلی (Main Branch) همیشه سالم و قابل بیلد (Green) باقی بماند.

---

# فصل سوم: مهندس تست (Test Engineer - TE)

## مقدمه: دیدگاه کاربر‌محور

این فصل به تشریح سومین و آخرین نقش اساسی در معادله کیفیت گوگل می‌پردازد: **مهندس تست** یا **TE (Test Engineer)**. برخلاف دو نقش پیشین که بیشتر روی جنبه‌های فنی تمرکز دارند، TE نقشی است که **کاملاً از منظر کاربر نهایی** به محصول نگاه می‌کند.

ویتاکر از اصطلاح **«تصویر دوگانه» (Split Personality)** استفاده می‌کند برای توصیف TE. این نقش ترکیبی از **مهارت‌های فنی قوی** (که مورد احترام توسعه‌دهندگان باشد) و **تمرکز روی کاربر** (که توسعه‌دهندگان را در مسیر صحیح نگه دارد) است.

## ۱. ماهیت نقش TE: چرا متفاوت است؟

### الف) نقش SWE (مهندس نرم‌افزار):
- تمرکز: **فیچر و کارایی**
- چشم‌انداز: **محدود و موضعی** (معمولاً روی یک فیچر)

### ب) نقش SET (مهندس نرم‌افزار در تست):
- تمرکز: **تست‌پذیری و زیرساخت**
- چشم‌انداز: **تکنیکی و ماندگاری** (آیا محصول برای تست طراحی شده است؟)

### ج) نقش TE (مهندس تست):
- تمرکز: **تأثیر روی کاربر و ریسک کلی**
- چشم‌انداز: **اکولوژی کل محصول** (آیا این محصول برای کاربر واقعی کار می‌کند؟)

**نکته کلیدی:** TE تنهایی است که تمام محصول را **یک‌پارچه** مشاهده می‌کند، نه تک‌تک اجزاء.

## ۲. چه زمانی TE درگیر می‌شود؟

یکی از نکات اساسی و شگفت‌انگیز در فلسفه گوگل این است که **نه تمام محصولات به TE نیاز دارند**. ویتاکر به صراحت می‌گوید:

> **"نه همه پروژه‌ها نیاز به توجه TE دارند."**

### پروژه‌هایی که TE نیاز ندارند:
*   **پروژه‌های تجربی (Experimental)** که شانس Cancel شدن زیادی دارند.
*   **پروژه‌های اولیه (Early-stage)** که هنوز ماموریت روشنی ندارند.
*   **پروژه‌های ۲۰ درصد** (تلاش‌های جانبی) که شانس تبدیل‌شدن به محصول رسمی کم است.

### زمان مناسب درگیری TE:
*   زمانی که محصول **رسمیت یافته** و **شانس بالایی برای شیپ (Ship)** دارد.
*   زمانی که فیچرها **نسبتاً ثابت** شده و لیست نهایی تعریف شود.
*   زمانی که محصول به مرحله **نزدیک‌شدن به رونمایی** رسید و **ریسک‌های نهفته** باید پیدا شود.

> **اصل مالی:** "TE سرمایه‌گذاری زیادی درست قبل از رونمایی، نه در ابتدای کار."

## ۳. مسؤولیت‌های اساسی TE

### الف) تشخیص نقاط ضعف (Risk Assessment)
TE باید به این سؤالات پاسخ دهد:

1.  **امنیت (Security):** آیا داده‌های کاربر محفوظ‌اند؟ آیا نقاط تزریق SQL یا XSS وجود دارد؟
2.  **حریم خصوصی (Privacy):** چه داده‌هایی جمع‌آوری می‌شوند؟ آیا کاربران از این آگاهند؟
3.  **عملکرد (Performance):** سرعت مناسب است؟ آیا تحت بار زیاد شکست می‌خورد؟
4.  **قابل‌اعتماد‌بودن (Reliability):** آیا محصول به طور مداوم کار می‌کند؟ آیا هنگام خرابی، پیام‌های واضحی نمایش می‌دهد؟
5.  **تجربه کاربری (Usability):** آیا رابط‌کاربری شهودی است؟ آیا کاربرانی با سطح‌های مختلف مهارت می‌توانند از آن استفاده کنند؟
6.  **سازگاری بین‌المللی (Globalization):** آیا برای کشورهای مختلف کار می‌کند؟ آیا حروف نامشخص تعریف شده‌اند؟
7.  **سازگاری (Compatibility):** آیا با دستگاه‌ها و مرورگرهای مختلف کار می‌کند؟

### ب) مدیریت تست اکتشافی (Exploratory Testing)
برخلاف تست‌های خودکار که از قبل برنامه‌ریزی شده‌اند، TE تست‌های **کاوشی** انجام می‌دهد:
*   سناریوهای واقعی کاربر را شبیه‌سازی می‌کند.
*   به دنبال رفتارهای غیرمنتظره می‌گردد.
*   **خطا در منطق UX** را پیدا می‌کند (مثلاً دکمه‌ای که باید غیرفعال باشد ولی فعال است).

### ج) تست‌های مقیاس بزرگ (Large Tests)
TE مسؤول است که:
*   تست‌های **End-to-End کامل** طراحی و اجرا شوند.
*   سناریوهای **چند‌مرحله‌ای** تست شوند (مثلاً: ثبت‌نام → ورود → سفارش → پرداخت → تأیید).
*   **داده‌های واقعی** استفاده شوند، نه داده‌های Mock.

## ۴. زندگی TE در طول چرخه توسعه

### فاز اول: ورود به پروژه (Project Engagement)

هنگامی که TE برای اولین بار به پروژه اضافه می‌شود:

1.  **یادگیری:** مستندات تمام فیچرها را می‌خواند و معماری کل محصول را درک می‌کند.
2.  **ارزیابی ریسک:** نقاط ضعف بالقوه را شناسایی می‌کند.
3.  **برنامه‌ریزی:** آزمون‌هایی را طراحی می‌کند که بیشترین تأثیر را دارند.

### فاز دوم: سناریوهای کاربری (User Scenarios)

TE سؤال می‌کند:
*   **کاربران واقعی** از این محصول چگونه استفاده می‌کنند؟
*   **مسیرهای شاد (Happy Path)** چیست؟ (مسیری که صحیح تمام می‌شود)
*   **مسیرهای ناگوار (Unhappy Path)** چیست؟ (وقتی چیزهایی اشتباه می‌روند)

**مثال برای یک سرویس افزودن URL:**
*   **مسیر شاد:** کاربر URL معتبر را وارد می‌کند → سرویس آن را می‌پذیرد → تأیید می‌شود.
*   **مسیر ناگوار:** کاربر URL باطل را وارد می‌کند → سرویس آن را رد می‌کند → پیام خطای واضح نمایش می‌دهد.

### فاز سوم: تست‌های ترکیبی (Combinatorial Testing)

وقتی محصول نزدیک رونمایی است، TE:
*   **اجزایی را ترکیب** می‌کند که معمولاً جدا تست می‌شوند.
*   تأثیرات **جانبی غیرمنتظره** را پیدا می‌کند.

## ۵. مثال عملی: تست کردن سرویس `AddUrl`

بر اساس مثال کتاب، بیایید ببینیم TE این سرویس را چگونه تست می‌کند:

### سناریوی کاربری نخست: تازه‌کنندگی عادی
```
1. کاربر به صفحه AddUrl می‌رود
2. URL = "https://example.com" را وارد می‌کند
3. Comment = "Great website" را اختیاری وارد می‌کند
4. دکمه Submit را می‌کشد
5. سرویس URL را در دیتابیس ذخیره می‌کند
6. کاربر پیام موفقیت را می‌بیند
```

**چیزهایی که TE باید بررسی کند:**
*   پیام موفقیت **واضح و به‌هنگام** است؟
*   آیا **redirect خودکار** به صحیح است؟
*   آیا URL در دیتابیس **یقه‌ای صحیح** ذخیره شد (با `https://` و بدون فضای اضافی)؟

### سناریوی کاربری دوم: ورودی نامعتبر
```
1. کاربر URL نامعتبر = "not a url" را وارد می‌کند
2. Comment نیز وارد می‌کند
3. Submit را می‌کشد
4. سرویس URL را رد می‌کند
```

**چیزهایی که TE باید بررسی کند:**
*   **پیام خطا** چیست؟ آیا واضح است؟
*   آیا **Input اصلی محفوظ** ماند (تا کاربر دوباره نخورد تا وارد کند؟)
*   آیا **Comment** که کاربر وارد کرد حذف نشد؟

### سناریوی کاربری سوم: شرایط لبه‌ای (Edge Cases)
*   **URL خیلی طولانی** (۱۰۰۰۰ حرف)
*   **URL با کاراکترهای خاص** (ویتنامی، عربی، Emoji)
*   **نمی‌تواند بدون Comment کار کند** (اگرچه اختیاری است!)

## ۶. تفاوت بین SET و TE - خلاصه مقایسه‌ای

| جنبه | SET | TE |
|------|-----|-----|
| **تمرکز اصلی** | تست‌پذیری و زیرساخت | تأثیر کاربری و ریسک کلی |
| **کدنویسی** | ۱۰۰٪ توسعه‌دهنده | متغیر (۵۰-۱۰۰٪) |
| **نوع تست** | Small و Medium | Large و Exploratory |
| **مخاطب** | SWEها (توسعه‌دهندگان) | کاربرانِ نهایی |
| **تخصص** | Mocks، Fakes، Frameworks | Scenarios، Risk، UX |
| **زمان درگیری** | از اولین طراحی | زمانی که محصول بلوغ یافتند |
| **سوال کلیدی** | "آیا می‌توانیم تست کنیم؟" | "آیا برای کاربر کار می‌کند؟" |

## ۷. ساختار سازمانی TE

ویتاکر در کتاب توضیح می‌دهد که گوگل ساختار **سلسله‌مراتبی معقولی** برای مدیریت تیم تست دارد:

1.  **Tech Lead (رهبر فنی):** مسؤول جهت‌گیری فنی و حل مسائل پیچیده.
2.  **Test Engineering Manager (مدیر مهندسی تست):** مسؤول مدیریت روزمره و توزیع بار کاری.
3.  **Test Director (مدیر تست):** جهت‌گیری استراتژیک و سیاست‌های کلی.
4.  **Senior Test Director:** تنهایی (Pat Copeland) با مسؤولیت سراسری شرکت.

### اصول رهبری تست در گوگل:
*   **الهام‌بخشی بر اجبار:** بجای دستورات مستقیم، رهبران الهام و چشم‌انداز ارائه می‌دهند.
*   **استقلال و اعتماد:** مهندسین خود‌مختار‌اند و باید به خود اعتماد داشته باشند.
*   **تنوع و گسترش:** به مهندسین کمک می‌کند تا بین پروژه‌ها حرکت کنند (حداکثر ۱۸ ماه در یک پروژه).

## ۸. نکات کلیدی برای معمار نرم‌افزار (شما)

### 1️⃣ دید کلی‌تر (Holistic View)
هنگام طراحی معماری، فقط به **اجزاء تکنیکی** نگاه نکنید. به این سؤالات پاسخ دهید:
*   **کاربر واقعی** چگونه این سیستم را استفاده می‌کند؟
*   **ریسک‌های کاری (Business Risk)** کدام‌ها هستند؟

### 2️⃣ تست‌های سناریو‌محور (Scenario-Based Tests)
برای پروژه‌های حیاتی (مثل سیستم مدیریت مراقبت‌های درمانی که شما در DDD کار می‌کنی):
*   تست‌های End-to-End بنویس که **سناریوهای بیمار واقعی** را نمایندگی کنند.
*   مثلاً: ثبت بیمار → ایجاد پلان مراقبتی → اجرای فعالیت‌ها → ارزیابی نتایج.

### 3️⃣ سناریوهای شکست (Failure Scenarios)
نه تنها "مسیر شاد" را تست کنید:
*   **سرویس خارجی (External Service) Down است:** سیستم چگونه رفتار می‌کند؟
*   **دیتابیس پرتر:**ً داده‌ها تجدید مطالعه می‌شوند؟
*   **خروج‌ناگهانی مهندسی:** State سیستم پایدار است؟

### 4️⃣ تست‌های Globalization (اگر لازم است)
برای ایرانیان:
*   **فارسی:** آیا متن Right-to-Left درست نمایش داده می‌شود؟
*   **تاریخ:** آیا تاریخ‌های شمسی درست محاسبه می‌شوند؟
*   **ارز:** آیا تومان و تبدیل‌ها صحیح است؟

## خلاصه: از TE چه می‌توان یاد گرفت؟

TE نمایندگی است از **دیدگاه کاربر در تیم توسعه**. در پروژه‌های خودت:

| مسئله | راه‌حل |
|------|--------|
| تست‌های خودکار زیادی نوشته‌اند اما بازهم مشکل وجود دارد | TE نقش داشته است اما کسی آن را بازی نمی‌کند |
| تمام فیچرها کار می‌کند اما UX ضعیف است | از دیدگاه کاربر واقعی تست نشده |
| محصول به سرعت عملیات انجام می‌دهد اما تحت بار شکست می‌خورد | تست‌های Performance و Load ندارند |
| محصول برای انگلیسی طراحی شده و فارسی/بین‌المللی فراموش شده | Globalization Testing وجود ندارد |

---

# فصل چهارم: تست‌کردن در مقیاس بزرگ (Testing at Scale)

## مقدمه: چالش‌های فنی مقیاس

وقتی شرکتی مثل گوگل رشد پیدا می‌کند، تست‌های ساده و محلی دیگر کافی نیستند. یک مهندس توسعه‌دهنده می‌تواند تمام تست‌های خود را روی رایانه‌اش اجرا کند، اما شاخه اصلی (Main Branch) ممکن است هر روز صدها تغییر دریافت کند. هر تغییر می‌تواند تست‌های دیگر را شکست دهد.

**مسئله کلیدی:** چگونه می‌توانیم اطمینان حاصل کنیم که کد جدید تست‌های موجود را خراب نمی‌کند؟

## ۱. درک معماری زیرساخت تست (Test Infrastructure Architecture)

### الف) Unified Repository و Single Codebase
گوگل تمام کد خود را در یک مخزن کدی (Repository) واحد نگهداری می‌کند. این دارای پیامدهای بسیاری است:

**مزایا:**
*   هر مهندس می‌تواند **هر کد** را دید (شفافیت کامل).
*   **کتابخانه‌های مشترک** دارای یک نسخه واحد هستند (نه انفجار نسخه‌ها).
*   حرکت بین پروژه‌ها ساده است (همان Repository).

**چالش برای تست:**
*   تغییری که یک مهندس در مخزن انجام می‌دهد، ممکن است **صدها پروژه دیگر را تحت‌تأثیر قرار دهد**.
*   تمام تست‌های وابسته باید اجرا شوند تا قبل از قبول تغییر (Change)، بفهمیم خراب است یا نه.

### ب) Platform Uniformity (یکنواختی پلتفرم)
گوگل تمام توسعه‌دهندگانش را **یک توزیع Linux یکسان** می‌دهد. این تصمیم استراتژیک است:

**نتیجه:**
*   اگر کد روی لپ‌تاپ توسعه‌دهنده Pass شود، تقریباً **مطمئن است که روی سرور production هم Pass می‌شود**.
*   **Environmental bugs** (باگ‌هایی که فقط در محیط‌های مختلف رخ می‌دهند) به حداقل می‌رسند.

**برای شما در .NET Core:**
استفاده از Docker Container هدفی مشابه را دنبال می‌کند. توسعه در Container و تست در Container یکسان.

## ۲. سیستم ساخت (Build System) و تست‌های Target

### الف) Build Targets و Test Targets

در گوگل، تمام چیز فایل‌های `BUILD` توسط یک **Build Specification Language** تعریف می‌شود که زبان‌ مستقل است:

```
# مثال ساده (pseudo-code شبه گوگل)
cc_library(
    name = "addurl_service",
    srcs = ["addurl_service.cc"],
    hdrs = ["addurl_service.h"],
    deps = ["//storage:database"]
)

cc_test(
    name = "addurl_service_test",
    srcs = ["addurl_service_test.cc"],
    deps = [
        ":addurl_service",
        "//testing:fake_database"
    ]
)
```

**نکته اساسی:** هر **Library Build Target** دارای یک **Test Build Target** متناسر است.

### ب) جریان کار توسعه (Development Workflow) در گوگل

```
1. کد نوشته می‌شود (به صورت incremental)
   ↓
2. Unit Tests نوشته می‌شود (معمولاً توسط SWE)
   ↓
3. Test Target ایجاد می‌شود (معمولاً توسط SET)
   ↓
4. Build & Test محلی (روی رایانه توسعه‌دهنده)
   ↓
5. Code Review درخواست می‌شود
   ↓
6. Pre-Submit Automation اجرا می‌شود
   ├─ Style guide check
   ├─ تمام Test‌های موجود اجرا می‌شود
   └─ Static Analysis اجرا می‌شود
   ↓
7. اگر همه Pass شد → Code در Submit Queue منتظر می‌ماند
   ↓
8. Submit Queue میزی (Sandboxed) محیط تمیز میسازد و دوباره تست می‌کند
   ↓
9. اگر توسط Submit Queue Pass شد → Merged to Main Branch
```

## ۳. تعریف دقیق اندازه‌های تست (Test Size Definitions)

این یکی از بهترین‌های کتاب است. گوگل یک **سیستم ساده اما قدرتمند** برای طبقه‌بندی تست‌ها ایجاد کرده:

### تست کوچک (Small Test)
*   **Scope:** یک تابع یا کلاس واحد
*   **مثال:** `AddUrlServiceTest` - تنها منطق validation URL را تست می‌کند
*   **وابستگی‌ها:** **هیچ** - همه چیز Mock است
*   **سرعت:** ۱۰۰ میلی‌ثانیه یا کمتر
*   **مالک:** SWE (Feature Developer)
*   **Limitations:**
    - نمی‌تواند فایل‌سیستم واقعی را لمس کند
    - نمی‌تواند دیتابیس واقعی را لمس کند
    - نمی‌تواند شبکه را لمس کند

```csharp
[TestClass]
public class AddUrlServiceSmallTest
{
    private AddUrlService _service;
    private Mock<IUrlValidator> _mockValidator;
    
    [TestInitialize]
    public void Setup()
    {
        _mockValidator = new Mock<IUrlValidator>();
        _service = new AddUrlService(_mockValidator.Object);
    }
    
    [TestMethod]
    public void ValidateUrl_WithValidUrl_ReturnsTrue()
    {
        // Arrange
        _mockValidator.Setup(x => x.IsValid("https://example.com"))
            .Returns(true);
        
        // Act
        var result = _service.IsUrlValid("https://example.com");
        
        // Assert
        Assert.IsTrue(result);
    }
}
```

### تست متوسط (Medium Test)
*   **Scope:** ۲ یا چند ماژول که با هم کار می‌کنند
*   **مثال:** `AddUrlFrontendMediumTest` - Frontend + Service (بدون Database واقعی)
*   **وابستگی‌ها:** محیط **Fake** (مثلاً In-Memory Database)
*   **سرعت:** ۱-۲ ثانیه (می‌توانند کندتر باشند)
*   **مالک:** SET (Test Developer)
*   **مثال:**

```csharp
[TestClass]
public class AddUrlFrontendMediumTest : IntegrationTestBase
{
    private AddUrlFrontend _frontend;
    private FakeUrlService _fakeService;
    
    [TestInitialize]
    public void Setup()
    {
        _fakeService = new FakeUrlService();
        _frontend = new AddUrlFrontend(_fakeService);
    }
    
    [TestMethod]
    public void HandleRequest_WithValidUrl_ReturnsOk()
    {
        // Arrange
        var mockRequest = CreateMockHttpRequest("url=https://example.com");
        var mockResponse = new MockHttpResponse();
        
        // Act
        _frontend.HandleAddUrlRequest(mockRequest, mockResponse);
        
        // Assert
        Assert.AreEqual(200, mockResponse.StatusCode);
    }
}
```

### تست بزرگ (Large Test)
*   **Scope:** کل سیستم End-to-End
*   **مثال:** کاربری از UI گرفته تا Database
*   **وابستگی‌ها:** **همه چیز واقعی** (یا قریب‌به‌واقعی)
*   **سرعت:** ۱۰-۳۰ ثانیه یا بیشتر
*   **مالک:** TE (Test Engineer - اکتشافی)
*   **سناریو:**

```
کاربر ثبت نام می‌کند
→ برنامه او را تأیید می‌کند
→ URL را اضافه می‌کند
→ System آن را در database ذخیره می‌کند
→ کاربر می‌تواند URL را بعداً بازیابی کند
```

## ۴. نسبت آرمانی (The Golden Ratio: 70/20/10)

گوگل یک **هدف** برای نسبت تست‌ها تعریف کرده:

```
Small Tests:    70%  (تست‌های واحد - سریع و مستقل)
Medium Tests:   20%  (تست‌های Integration - متوسط)
Large Tests:    10%  (تست‌های E2E - اکتشافی)
```

**منطق:**
*   **کوچک:** تضمین می‌کند کل کد معقول کار می‌کند.
*   **متوسط:** تضمین می‌کند اجزاء با یکدیگر کار می‌کنند.
*   **بزرگ:** تضمین می‌کند **کاربر واقعی** می‌تواند استفاده کند.

**توجه:** برای پروژه‌های مختلف نسبت متفاوت است:
*   **UI-Heavy:** بیشتر Medium و Large (۳۰/۴۰/۳۰)
*   **Infrastructure/Backend:** بیشتر Small (۸۰/۱۵/۵)

## ۵. Submit Queue و Continuous Build

این قسمت توضیح می‌دهد که گوگل چگونه از تصادم‌های کد جلوگیری می‌کند.

### الف) مشکل
توسعه‌دهنده A تست‌های خود را میزی محلی اجرا می‌کند و Pass می‌شود.
توسعه‌دهنده B هم همینطور.
اما **وقتی کدهای A و B در شاخه اصلی ترکیب می‌شود**، باگ ظاهر می‌شود!

### ب) حل: Submit Queue

```
Developer Code → Code Review → Pass? → Submit Queue
                                          ↓
                                    [Sandboxed Build]
                                   (تمام تست‌ها دوباره)
                                          ↓
                                    Pass? → OK to merge
                                    Fail? → Reject & Notify
```

**مزایا:**
*   **Main Branch همیشه Green است** (همه تست‌ها pass).
*   **هیچ Integration Issue** وجود ندارد.
*   توسعه‌دهندگان می‌توانند **مستقل** کار کنند.

### ج) Continuous Build (نرم‌افزار تماشاگر)

حتی اگر Submit Queue یک CL را بپذیرد، ممکن است **بعدی** آن را خراب کند (race condition یا hidden dependency).

**Continuous Build:**
*   هر ساعت تمام تست‌های پروژه اجرا می‌شود
*   اگر شکست بخورد → Email به Maintainers

## ۶. مثال عملی: AddUrl Service با تفصیلات

کتاب یک مثال واقعی و جامع می‌دهد. بیایید آن را برای .NET بازنویسی کنیم:

### مرحله ۱: Protocol Buffer Definition

```csharp
// AddUrlContracts.cs
public record AddUrlRequest(
    string Url,
    string? Comment = null
);

public record AddUrlResponse(
    int? ErrorCode = null,
    string? ErrorDetails = null
);

public interface IAddUrlService
{
    Task<AddUrlResponse> AddUrlAsync(AddUrlRequest request);
}
```

### مرحله ۲: Frontend (Accept HTTP Request)

```csharp
// AddUrlFrontend.cs
public class AddUrlFrontend
{
    private readonly IAddUrlService _service;
    
    public AddUrlFrontend(IAddUrlService service)
    {
        _service = service;
    }
    
    public async Task HandleAddUrlAsync(
        HttpRequest request, 
        HttpResponse response)
    {
        var url = request.Query["url"].ToString();
        var comment = request.Query["comment"].ToString();
        
        var addRequest = new AddUrlRequest(url, comment);
        var result = await _service.AddUrlAsync(addRequest);
        
        if (result.ErrorCode.HasValue)
        {
            response.StatusCode = 400;
            await response.WriteAsJsonAsync(result);
        }
        else
        {
            response.StatusCode = 200;
        }
    }
}
```

### مرحله ۳: Small Test (Unit Test)

```csharp
[TestClass]
public class AddUrlFrontendSmallTest
{
    private AddUrlFrontend _frontend;
    private Mock<IAddUrlService> _mockService;
    
    [TestInitialize]
    public void Setup()
    {
        _mockService = new Mock<IAddUrlService>();
        _frontend = new AddUrlFrontend(_mockService.Object);
    }
    
    [TestMethod]
    public async Task HandleRequest_ServiceReturnsError_Returns400()
    {
        // Arrange
        var mockRequest = new Mock<HttpRequest>();
        mockRequest.SetupGet(x => x.Query["url"]).Returns("bad-url");
        
        _mockService
            .Setup(x => x.AddUrlAsync(It.IsAny<AddUrlRequest>()))
            .ReturnsAsync(new AddUrlResponse(
                ErrorCode: 1,
                ErrorDetails: "Invalid URL"
            ));
        
        var mockResponse = new Mock<HttpResponse>();
        
        // Act
        await _frontend.HandleAddUrlAsync(mockRequest.Object, mockResponse.Object);
        
        // Assert
        mockResponse.VerifySet(x => x.StatusCode = 400);
    }
}
```

### مرحله ۴: Medium Test (Integration Test)

```csharp
[TestClass]
public class AddUrlFrontendMediumTest : IntegrationTestFixture
{
    private AddUrlFrontend _frontend;
    private FakeAddUrlService _fakeService;
    
    [TestInitialize]
    public void Setup()
    {
        _fakeService = new FakeAddUrlService();
        _frontend = new AddUrlFrontend(_fakeService);
    }
    
    [TestMethod]
    public async Task HandleRequest_ValidUrl_SuccessfullyAdds()
    {
        // Arrange
        var mockRequest = CreateMockRequest("url=https://example.com&comment=Great");
        var mockResponse = new MockHttpResponse();
        
        // Act
        await _frontend.HandleAddUrlAsync(mockRequest, mockResponse);
        
        // Assert
        Assert.AreEqual(200, mockResponse.StatusCode);
        Assert.AreEqual(1, _fakeService.StoredUrls.Count);
        Assert.AreEqual("https://example.com", _fakeService.StoredUrls[0].Url);
    }
}

// Fake Implementation
public class FakeAddUrlService : IAddUrlService
{
    public List<AddUrlRequest> StoredUrls { get; } = new();
    
    public Task<AddUrlResponse> AddUrlAsync(AddUrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
        {
            return Task.FromResult(new AddUrlResponse(
                ErrorCode: 1,
                ErrorDetails: "URL required"
            ));
        }
        
        StoredUrls.Add(request);
        return Task.FromResult(new AddUrlResponse());
    }
}
```

### مرحله ۵: Large Test (E2E)

```csharp
[TestClass]
public class AddUrlE2ETest : E2ETestFixture
{
    private HttpClient _client;
    
    [TestInitialize]
    public override async Task SetupAsync()
    {
        await base.SetupAsync();
        _client = CreateHttpClient();
    }
    
    [TestMethod]
    public async Task AddUrl_CompleteScenario_WorksEndToEnd()
    {
        // Arrange: User adds a URL
        var addUrlRequest = new { url = "https://example.com", comment = "Test" };
        
        // Act: Send request to real server
        var response = await _client.PostAsJsonAsync("/addurl", addUrlRequest);
        
        // Assert: Check response
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        
        // Act: Retrieve the added URL
        var getResponse = await _client.GetAsync("/addurl?url=https://example.com");
        
        // Assert: Verify it was stored
        Assert.AreEqual(HttpStatusCode.OK, getResponse.StatusCode);
    }
}
```

## ۷. Coverage Goals و Measurement

گوگل از **Code Coverage** برای بررسی **ترکیب صحیح** تست‌ها استفاده می‌کند:

```
Coverage Report Only Small Tests:     ~95%  ✓ (خوب)
Coverage Report Only Large Tests:     ~30%  ✗ (پایین، نیاز به small tests)

Coverage Report All Tests Combined:  ~98%  ✓
```

## ۸. Test Certified Program

گوگل یک **برنامه گام‌به‌گام** برای بهبود کیفیت تست ایجاد کرده:

| Level | Requirements |
|-------|-------------|
| **Level 0** | Starting level |
| **Level 1** | Coverage bundles, Continuous Build, Classify tests, Smoke suite |
| **Level 2** | No Red tests, ≥50% coverage by all tests, ≥10% by small tests |
| **Level 3** | Tests for all changes, ≥50% small test coverage, Integration tests for features |
| **Level 4-5** | High bar, exploratory testing, security testing |

## ۹. توصیه‌های عملی برای شما (Mohammad Hossein)

### برای پروژه‌های .NET Core خودت:

1.  **Build Targets را تعریف کن:**
    ```bash
    dotnet build  # فقط kتابخانه‌های سازی
    dotnet test   # تمام تست‌ها
    dotnet test --filter "Category=Small"   # فقط Small
    ```

2.  **Ratio ۷۰/۲۰/۱۰ را هدف قرار بده:**
    ```
    Small Tests:  ~۱۰۰ test
    Medium Tests: ~۳۰ test
    Large Tests:  ~۱۵ test
    ```

3.  **Submit Queue شبیه (GitHub Actions):**
    ```yaml
    on: [pull_request]
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
          - run: dotnet test
          - if: failure()
            run: echo "Tests failed - PR cannot merge"
    ```

4.  **Fake Implementations:**
    ```csharp
    public class FakeRepository : IRepository
    {
        private List<Entity> _data = new();
        // تمام متدها محلی و Deterministic هستند
    }
    ```

5.  **Code Coverage Check:**
    ```bash
    dotnet test /p:CollectCoverage=true
    # Report coverage > 80% for commit
    ```
---

# فصل پنجم: تست اکتشافی و تست‌های بزرگ مقیاس

## مقدمه: محدودیت‌های خودکار‌سازی

یکی از بهترین نکات این فصل این است که ویتاکر به صراحت می‌گوید:

> **"اتوماسیون تست‌ها، تست نیست. اتوماسیون تست‌ها، اتوماسیون است."**

این تفاوت اساسی است. تست‌های خودکار فقط **چیزهایی را بررسی می‌کنند که ما به آن‌ها فکر کردیم**. اما **نمی‌توانند نوآوری کنند** و **نمی‌توانند سؤالات جدید بپرسند**.

## ۱. تعریف دقیق تست اکتشافی (Exploratory Testing)

تست اکتشافی یک **روش تست** است که در آن:

*   **Tester (مهندس تست) به‌طور فعال** محصول را کاوش می‌کند.
*   هیچ **script یا test case** از قبل تعریف‌شده‌ای وجود ندارد.
*   **شهود و خلاقیت** tester رهنمون است.
*   نتایج آن **تست‌های جدید** و **باگ‌های غیرمنتظره** است.

### مثال عملی

**خودکار (Automated):**
```
Input: Email = "user@example.com"
Output: ✓ Accepted
```

**اکتشافی (Exploratory):**
```
Tester: "چه اتفاقی می‌افتد اگر ایمیل دارای فاصلهٔ اضافی باشد؟"
Input: Email = " user@example.com " (فاصله‌های اول و پایانی)
Output: ✗ Rejected (غیرمنتظره!)
```

## ۲. سناریوهای تست اکتشافی

ویتاکر معرفی می‌کند **چهار استراتژی** برای تست اکتشافی:

### الف) تور (Tour) - گشت شناسایی‌کننده

مهندس تست محصول را **مثل یک توریست** کاوش می‌کند. مثلاً برای یک سرویس سفارش‌گیری:

1.  صفحهٔ اولیه را کاوش کن
2.  دسته‌بندی‌ها را روز کن
3.  محصول را اضافه کن
4.  سبد خریدت را مشاهده کن
5.  ... و الی آخر

### ب) تور ریسک‌محور (Risk-Focused Tour)

فقط روی **بخش‌های پرریسک** تمرکز کن:

*   تراکنش‌های مالی (پرریسک‌ترین)
*   داده‌های شخصی (حریم خصوصی)
*   فیچرهای کریتیکال

### ج) تور مبتنی بر خرابی (Failure Mode Tour)

سؤال کن: **"این کجا می‌تواند شکست بخورد؟"**

*   اگر شبکه قطع شود؟
*   اگر دیتابیس Down شود؟
*   اگر حافظه (Memory) تمام شود؟

### د) تور حس‌محور (Sensory Tour)

بر اساس **حواس** کاوش کن:

*   **بینایی:** رابط‌کاربری خوب نیست؟
*   **شنوایی:** صدا‌ها درست کار می‌کنند؟
*   **تاچ (برای موبایل):** دکمه‌ها قابل فشردگی هستند؟

## ۳. ابزارها و تکنیک‌های تست اکتشافی

### الف) Capability Attributes Components (CAC)

یک **فریم‌ورک** برای سازمان‌دهی تست‌ها در حالت اکتشافی:

**مثال: سیستم فروشگاهی**

| Attribute (ویژگی) | Component (جزء) | Capability (توانایی) |
|---|---|---|
| Performance (عملکرد) | Shopping Cart | Add items quickly |
| Security (امنیت) | Payment | Process securely |
| Usability (قابل‌استفاده) | Search | Find items easily |
| Reliability (قابل‌اعتماد) | Checkout | Complete purchase without errors |

### ب) Bug Bash (سرنگونی باگ)

*   تیم کامل (توسعه‌دهندگان، تستر‌ها، منیجرها) برای **۲-۴ ساعت** یکجا جلسه می‌نشینند.
*   هر نفر یک **بخش متفاوت** را تست می‌کند.
*   هدف: **باگ‌های هر چه بیشتر** را پیدا کند.
*   نتیجه: معمولاً ۱۰-۲۰ باگ در ساعت!

### ج) Crowd Testing (تست توده‌ای)

*   آزمون افرادی خارج از تیم (یا اپلیکیشن‌های third-party) به شرح کار یاری می‌رسانند.
*   هر فرد **۲-۳ ساعت** کاوش می‌کند.
*   تنوع دیدگاه‌ها باعث بیشتر **سناریوهای پوشش داده نشده** را پیدا کند.

## ۴. مثال دقیق: مورد مطالعه Chrome (نرم‌افزار "Bots")

این جزء بسیار جالب است. کتاب دو مهندس گوگل را به عنوان نمونهٔ تست اکتشافی معرفی می‌کند:

### الف) Jason Gao - ایده اولیه

Jason یک **ابزار خودکار** ساخت به نام **Bots** که:

*   **میلیون‌ها وب‌سایت** را بارگذاری می‌کند.
*   **هر پیکسل** و **هر عنصر DOM** را مقایسه می‌کند.
*   **تفاوت‌های رندرینگ** بین Firefox و Chrome را پیدا می‌کند.

**مثال نتیجه:**
```
Website: CNN.com
Firefox renders buttons as blue
Chrome renders buttons as green
Status: DIFFERENCE DETECTED (possible bug)
```

### ب) Tejas Shah - مقیاس‌پذیری

Tejas این ابزار را:
*   برای **هزاران وب‌سایت** مقیاس‌پذیر کرد.
*   **داشبورد** ایجاد کرد تا مهندسین بتوانند ببینند.
*   **مسائل واقعی** در وب را پیدا کرد (نه فقط مسائل شناخته‌شده).

**نتیجه:** Bots **۱ سال کار دستی** را در **۲ شب محاسباتی** انجام داد!

## ۵. تست‌های بزرگ مقیاس و تست‌های موازی

### الف) مشکل: مقیاس وب

وقتی **میلیون‌ها** کاربر درگیر هستند:

*   یک تغییر کوچک می‌تواند **درجات ظریفی** ایجاد کند.
*   مشکلات فقط در **بار بالا** ظاهر می‌شود.
*   تست‌های کوچک و متوسط **کافی نیستند**.

### ب) حل: Staged Rollout (ریلیز مرحله‌ای)

```
۱. Canary (۱٪ کاربران)
   ↓
۲. مراقبت ۲۴ ساعت
   ↓
۳. Dev (۱۰٪)
   ↓
۴. مراقبت ۲۴ ساعت
   ↓
۵. Test Channel (۳۰٪)
   ↓
۶. مراقبت ۲۴ ساعت
   ↓
۷. Stable Release (۱۰۰٪)
```

هر مرحله **۲۴ ساعت یا بیشتر** محاظه می‌شود تا مشکلات **غیرعادی** پیدا شود.

## ۶. نکات کلیدی برای معمار نرم‌افزار (شما - Mohammad Hossein)

### برای سیستم‌های DDD و Care Management

#### ۱️⃣ فیچری‌سازی Exploratory Testing در معماری

وقتی معماری میکروسرویس‌ها طراحی می‌کنید:

*   **Feature Toggles** قرار دهید تا تست‌های اکتشافی بتوانند فیچرها را روشن/خاموش کنند.
*   **Logging و Monitoring** ایجاد کنید تا TE‌ها بتوانند غیرعادی‌ها را ببینند.

```csharp
// Example: Feature Toggle for Exploratory Testing
public class FeatureToggleMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        var featureName = context.Request.Query["feature"];
        
        if (_featureService.IsFeatureEnabled(featureName))
        {
            // Enable new feature for testing
            context.Items["ExperimentalFeature"] = true;
        }
        
        await _next(context);
    }
}
```

#### ۲️⃣ Staged Rollout برای Production

برای سیستم‌های درمانی که حیاتی‌اند:

```csharp
// Staged rollout configuration
public class DeploymentStrategy
{
    public class Stage
    {
        public string Name { get; set; }  // "Canary", "Beta", "Stable"
        public double UserPercentage { get; set; }  // 1%, 10%, 100%
        public TimeSpan MonitoringDuration { get; set; }  // 24 hours
        public string[] HealthChecks { get; set; }  // Metrics to monitor
    }
    
    public List<Stage> Stages = new()
    {
        new Stage 
        { 
            Name = "Canary",
            UserPercentage = 0.01,  // 1%
            MonitoringDuration = TimeSpan.FromHours(24),
            HealthChecks = new[] { "ErrorRate", "Latency", "DBConnections" }
        },
        new Stage 
        { 
            Name = "Beta",
            UserPercentage = 0.1,  // 10%
            MonitoringDuration = TimeSpan.FromHours(24),
            HealthChecks = new[] { "ErrorRate", "Latency", "UserSatisfaction" }
        }
    };
}
```

#### ۳️⃣ Monitoring & Alerting برای Exploratory Testing

```csharp
// Real-time metrics for TE observation
public class TestMetricsCollector
{
    public void RecordAnomaly(string testName, string anomalyType, string details)
    {
        // e.g., "User cannot add care plan for patients over 100 years old"
        _metricsService.RecordEvent(
            eventName: "Exploratory_Anomaly",
            properties: new
            {
                TestName = testName,
                AnomalyType = anomalyType,
                Details = details,
                Timestamp = DateTime.UtcNow
            }
        );
    }
}
```

#### ۴️⃣ Risk-Based Testing Priority

برای سیستم‌های درمانی:

```csharp
// Priority matrix for exploratory testing
public enum TestPriority
{
    Critical,    // Patient safety: medication, care plan creation
    High,        // Data integrity: patient records
    Medium,      // Performance: system responsiveness
    Low          // UI/UX: cosmetic issues
}

public class RiskAssessment
{
    public TestPriority AssessRisk(string feature)
    {
        return feature switch
        {
            "MedicationAdministration" => TestPriority.Critical,
            "CarePlanGeneration" => TestPriority.Critical,
            "PatientRecordUpdate" => TestPriority.High,
            "ReportGeneration" => TestPriority.Medium,
            "DashboardDisplay" => TestPriority.Low,
            _ => TestPriority.Medium
        };
    }
}
```

## ۷. راهنمایی برای تیم

### تست اکتشافی چه زمانی انجام شود؟

| مرحله | متخصص | مدت |
|-------|------|-----|
| Unit Testing | SWE | هر روز |
| Integration Testing | SET | هر سه روز |
| **Exploratory Testing** | **TE** | **قبل از رونمایی** |
| Production Monitoring | TE + SRE | **۲۴ ساعت بعد** |

### تست اکتشافی چه نتیجه می‌دهد؟

✓ **Bugs غیرمنتظره** (۳۰-۴۰٪ از کل باگ‌ها)
✓ **Design Issues** (UX problems)
✓ **Performance Issues** (زیر بار)
✓ **Security Issues** (حملات غیرمنتظره)

## خلاصه

فصل پنجم یک **نکتهٔ مهم** را برجسته می‌کند:

> **"خودکار‌سازی اگر خوب باشد، باگ‌های شناخته‌شده را می‌گیرد. اما تست اکتشافی، باگ‌های ناشناخته را می‌گیرد."**

برای پروژه‌های **حیاتی** مثل سیستم‌های درمانی، هردو نیاز است:

1.  **Small Tests** (اتوماسیون) - سریع و قابل‌اعتماد
2.  **Exploratory Tests** (دستی) - نوآورانه و خلاق

---

# فصل پایانی: جمع‌بندی نهایی و درس‌های کلیدی

این فصل عصارهٔ تمام تجربیات گوگل در مهندسی کیفیت است. پیام اصلی کتاب در یک جمله خلاصه می‌شود: **تست‌کردن یک فاز جداگانه نیست؛ بلکه بخشی جدایی‌ناپذیر از فرآیند مهندسی است.**

در ادامه، اصول بنیادین، ساختار تیم‌ها و الگوهای معماری متناسب با اکوسیستم .NET را مرور می‌کنیم.

## ۱. اصل اول: کیفیت با تست کردن حاصل نمی‌شود

مهم‌ترین درس گوگل این است:
> **"کیفیت باید در ذات محصول ساخته شود، نه اینکه بعداً به آن تزریق گردد."**

تست‌کردن صرفاً یک ابزار برای **سنجش** کیفیت است، نه **ایجاد** آن. اگر کدی با معماری ضعیف نوشته شود، هیچ مقدار تستی نمی‌تواند آن را به یک محصول باکیفیت تبدیل کند. بنابراین، مسئولیت نهایی کیفیت بر عهدهٔ کسی است که کد را می‌نویسد، نه کسی که آن را تست می‌کند.

## ۲. تفکیک نقش‌ها در مهندسی کیفیت

گوگل به جای ایجاد "دپارتمان تضمین کیفیت" (QA Department) که جدا از توسعه‌دهندگان باشد، سه نقش مهندسی تعریف کرده است که همگی در فرآیند توسعه مشارکت دارند:

### الف) مهندس نرم‌افزار (SWE - Software Engineer)
*   **تمرکز:** توسعه ویژگی‌ها (Features) و نوشتن کدهای اصلی.
*   **مسئولیت تست:** نوشتن تست‌های کوچک (Unit Tests) و تضمین صحت عملکرد کدی که نوشته‌اند.
*   **دیدگاه:** "من مسئول کدی هستم که می‌نویسم."

### ب) مهندس نرم‌افزار در تست (SET - Software Engineer in Test)
*   **تمرکز:** ایجاد زیرساخت‌های تست و افزایش تست‌پذیری (Testability) کد.
*   **مسئولیت:** نوشتن فریم‌ورک‌های تست، ایجاد Mockها و Fakeها، و نگهداری سیستم‌های CI/CD.
*   **دیدگاه:** "چگونه می‌توانم به SWE کمک کنم تا راحت‌تر و سریع‌تر تست بنویسد؟"

### ج) مهندس تست (TE - Test Engineer)
*   **تمرکز:** دیدگاه کاربر نهایی، سناریوهای پیچیده و ریسک‌های سیستم.
*   **مسئولیت:** اجرای تست‌های اکتشافی (Exploratory)، تست‌های بزرگ (E2E) و تحلیل داده‌های کیفیت.
*   **دیدگاه:** "آیا این سیستم نیاز کاربر را در دنیای واقعی برطرف می‌کند؟"

## ۳. هرم تست و قانون ۷۰/۲۰/۱۰

گوگل برای حفظ تعادل بین "سرعت توسعه" و "اطمینان از کیفیت"، قانون ۷۰/۲۰/۱۰ را پیشنهاد می‌کند. انحراف از این نسبت معمولاً منجر به شکست پروژه می‌شود (Anti-Pattern).

| نوع تست | نام در گوگل | نام رایج | سهم | ویژگی‌ها |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | تست کوچک | Unit Test | **۷۰٪** | سریع (میلی‌ثانیه)، ایزوله (Mocked)، بدون وابستگی خارجی. |
| **Medium** | تست متوسط | Integration Test | **۲۰٪** | بررسی تعامل بین دو ماژول، استفاده از Fake Database. |
| **Large** | تست بزرگ | E2E / UI Test | **۱۰٪** | کند، شکننده (Brittle)، بررسی سناریوی کامل کاربر با دیتابیس واقعی. |

**چرا این نسبت مهم است؟**
اگر تمرکز شما بر تست‌های E2E باشد (الگوی قیف معکوس یا Ice-cream Cone)، فیدبک گرفتن ساعت‌ها طول می‌کشد و پیدا کردن ریشهٔ باگ دشوار می‌شود. تست‌های کوچک باید ستون فقرات استراتژی تست شما باشند.

## ۴. معماری برای تست‌پذیری در .NET Core

برای پیاده‌سازی این اصول در معماری DDD و .NET، باید کد را به گونه‌ای بنویسیم که تست‌کردن آن آسان باشد.

### اصل تزریق وابستگی (Dependency Injection) و وارونگی کنترل

کد تست‌ناپذیر معمولاً وابستگی‌های سخت (Hard-coded dependencies) دارد.

**❌ کد بد (تست‌ناپذیر):**
```csharp
public class OrderService
{
    // وابستگی مستقیم به دیتابیس (غیرقابل Mock کردن)
    private readonly ApplicationDbContext _db = new ApplicationDbContext();

    public void PlaceOrder(Order order)
    {
        if (order.Total > 1000)
            _db.Orders.Add(order); // تست این خط نیاز به دیتابیس واقعی دارد
    }
}
```

**✅ کد خوب (تست‌پذیر و منطبق با DDD):**
```csharp
public class OrderService
{
    private readonly IOrderRepository _repository;

    // تزریق وابستگی از طریق سازنده (Constructor Injection)
    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task PlaceOrderAsync(Order order)
    {
        // منطق تجاری (Business Logic)
        if (order.Total > 1000)
        {
            await _repository.AddAsync(order);
        }
    }
}
```

### تست واحد (Small Test) با استفاده از Moq

```csharp
[Fact] // xUnit
public async Task PlaceOrder_WhenTotalIsHigh_ShouldSaveOrder()
{
    // Arrange: آماده‌سازی محیط ایزوله
    var mockRepo = new Mock<IOrderRepository>();
    var service = new OrderService(mockRepo.Object);
    var order = new Order { Total = 1500 };

    // Act: اجرای متد
    await service.PlaceOrderAsync(order);

    // Assert: بررسی رفتار (فقط یک بار ذخیره شده باشد)
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
}
```

## ۵. عرضه مرحله‌ای (Staged Rollout)

در سیستم‌های بزرگ‌مقیاس، حتی با وجود تست‌های دقیق، محیط واقعی (Production) رفتارهای پیش‌بینی‌ناپذیری دارد. گوگل از استراتژی **عرضه مرحله‌ای** استفاده می‌کند:

1.  **نسخه قناری (Canary Channel):** عرضه به ۱٪ از کاربران (یا فقط تیم داخلی). اگر مشکلی باشد، بلافاصله متوقف می‌شود.
2.  **نسخه بتا (Beta Channel):** عرضه به ۱۰٪ از کاربران مشتاق. پایش متریک‌ها برای ۲۴ ساعت.
3.  **نسخه پایدار (Stable Channel):** عرضه عمومی پس از اطمینان کامل.

**کاربرد در .NET:**
استفاده از **Feature Flags** (مثلاً با کتابخانه Microsoft.FeatureManagement) به شما اجازه می‌دهد ویژگی‌های جدید را بدون تغییر کد، برای گروه خاصی از کاربران فعال یا غیرفعال کنید.

## ۶. درس‌های کلیدی برای معمار نرم‌افزار

به عنوان یک معمار نرم‌افزار (Software Architect)، این موارد چک‌لیست نهایی شما هستند:

1.  **تست به عنوان مستندات:** تست‌های واحد شما باید بهترین مستندات برای شرح رفتار Domain Model باشند.
2.  **شکست سریع (Fail Fast):** فرآیند CI/CD باید به گونه‌ای باشد که تست‌های کوچک ابتدا اجرا شوند. اگر خطایی وجود دارد، بیلد باید در کمتر از ۵ دقیقه شکست بخورد تا توسعه‌دهنده سریع مطلع شود.
3.  **تست‌های اکتشافی:** اتوماسیون نمی‌تواند خلاقیت را جایگزین کند. زمانی را برای "تست اکتشافی" (Exploratory Testing) اختصاص دهید تا سناریوهای غیرمنتظره را کشف کنید.
4.  **پرهیز از داده‌های ساختگی در تست‌های بزرگ:** در تست‌های E2E تا حد امکان از داده‌های واقعی (Sanitized Production Data) یا داده‌هایی که شباهت زیادی به واقعیت دارند استفاده کنید.

## سخن پایانی

کتاب **"How Google Tests Software"** به ما می‌آموزد که تست نرم‌افزار یک فعالیت جانبی نیست که در انتهای پروژه انجام شود؛ بلکه **ذهنیتی** است که از لحظهٔ طراحی سیستم آغاز می‌شود. در گوگل، شما نمی‌توانید یک توسعه‌دهندهٔ ارشد باشید مگر اینکه کیفیت کد خود را شخصاً تضمین کنید.

> **"تست کردن چیزی نیست که شما انجام می‌دهید تا محصولتان کار کند؛ تست کردن کاری است که انجام می‌دهید تا ثابت کنید محصولتان همین الان هم کار می‌کند."**