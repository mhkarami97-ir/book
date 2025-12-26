---
layout: post
full-width: true
title: The Art of Unit Testing
subtitle: The Art of Unit Testing
cover-img: /assets/images/the_art_of_unit_testing.jpg
thumbnail-img: /assets/images/the_art_of_unit_testing.jpg
share-img: /assets/images/the_art_of_unit_testing.jpg
tags: [کتاب, برنامه_نویسی, فنی]
---

## توضیحات
روش‌های عالی تست کردن، در به حداکثر رساندن کیفیت پروژه و سرعت تحویل شما کمک می‌کنند. تست‌های اشتباه کد شما را شکسته، اشکالات را چند برابر می‌کنند و باعث افزایش زمان و هزینه می‌شوند. شما این را به خودتان و پروژه هایتان مدیون هستید که یاد بگیرید که چگونه برای افزایش بهره‌وری و کیفیت نهایی نرم افزار خود، تست واحد عالی انجام دهید.  
کتاب اصول ها، الگو‌ها و روش‌های آزمون واحد (Unit Testing Principles, Patterns and Practices)، به شما می‌آموزد که تست هایی را طراحی کنید که مدل دامنه و سایر نواحی اصلی کد شما را هدف قرار دهند. در این راهنما که به شکلی واضح نوشته شده است، شما یاد می‌گیرید که تست‌های حرفه ای با کیفیت بسازید، با خیال راحت فرآیند تست کردن خود را خودکار کنید و تست کردن را در داخل چرخه عمر برنامه یکپارچه کنید. وقتی ذهنیت تست کردن را قبول کنید، از اینکه چگونه تست‌های بهتر باعث می‌شوند که کد بهتری بنویسید شگفت زده خواهید شد.  

## مشخصات
`نویسنده` : Roy Osherove  
`امتیاز` : 09/10  
`صفحه مشخصات` : [skybooks](https://skybooks.ir/products/The-Art-of-Unit-Testing-With-Examples-in-net)  
`صفحه مشخصات` : [goodreads](https://www.goodreads.com/book/show/6487349-the-art-of-unit-testing)  

## خلاصه
Unit Test:

* automated & repeatable
* easy to implement
* anyone should be able to run it
* should run at the push of a button
* should run quickly

when concentrate only on the big test =>
the logic coverage is smaller
many parts of the core logic aren't test

logical code:

* an IF statement
* a loop
* switch case
* calculation
* decision making

---

TDD

-> write test -> run all test
           ↓
       make test pass
           ↓
       run all test <---
           |               |
       not two           refactor     fix bugs if
       other             if test pass   failed
           ↓
       write
       new test

----------------------------

methodName\_stateUnderTest\_ExpectedBehavior

* arrange
* act
* assert

----------------------------

constructor injection
interface as a property get or set
stub before method call (factory class)
local factory (extract & override)

---

Testable object oriented design

using internal and \[InternalVisible]
using \[Conditional("Debug.")] att
using #if & #endif -> for constructor
not very good

state base testing -> result
Interaction Testing -> action
(
by mock object

stub vs mock
(
stub can't fail test, and mock can

having more mock object
-> you are testing more than one thing

TypeMock Isolator -> nuget

---

DisAdvantage mock:

un readable test code
verify the wrong things
having more than one mock per test
overspecifying the tests

mock -> only for verify call
stub -> only for return value

don't repeat logic on test

try to always use hard coded value on test

---

static logger with static setter (use) for test

basetest -> virtual / override one each test class

have virtual test on base to prevent forget test case like crud

avoiding logic in tests
-> switch if else, foreach, for, while

making sure it fails when it should, and doesn't just pass when it should

just public method
private method may lead to breaking tests even though the over all functionality is correct

---

use factory class on test to new class /or new on setup method

setup method -> should only contains code that applies to all the tests

it is better each test create its own mock by helper method

smell of bad tests:
test run on specific order
test calling other test
test sharing in-memory state without rolling back
Integration test with
shared resources and no rollback

unit test should be testing the public contract and public functionality

---

use string.contain instead of string.equal if can

naming variable -> not magic number

if you don't have anything good to say don't say anything on asserting

unit test can double the time it takes to implement a specific feature, but the overall release date for the product may actually be reduced

↑percent coverage

build number

---

working with legacy code

where do start adding tests
logical complexity ↑ logic
dependency Level | logical | don't
priority            | easy    | care
                    -----------------> dependency
                           ignore

write integration test before refactoring

TypeMock Isolator, Depender, FitNesse
NDepend, simian, TypeMock Racer

## بخش‌هایی از کتاب
![mhkarami97](/assets/images/the_art_of_unit_testing/1.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/2.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/3.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/4.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/5.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/6.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/7.jpg)
![mhkarami97](/assets/images/the_art_of_unit_testing/8.jpg)