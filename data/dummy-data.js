const Category = require("../models/category");
const Blog = require("../models/blog");
const slugField = require("../helpers/slug-field");
const bcrypt = require("bcrypt");
const Role = require("../models/role");
const User = require("../models/user");
const generateName = require("../helpers/random-generate-name");

const populate = async () => {
  const count = await Category.count();

  if (count == 0) {
    const users = await User.bulkCreate([
      {
        fullName: "Çınar Kavuk",
        email: "cinar@info.com",
        password: await bcrypt.hashSync("1234", 10),
      },
      {
        fullName: "Anıl Kavuk",
        email: "anil@info.com",
        password: await bcrypt.hashSync("1234", 10),
      },
      {
        fullName: "Akın Kavuk",
        email: "akin@info.com",
        password: await bcrypt.hashSync("1234", 10),
      },
    ]);

    const roles = await Role.bulkCreate([
      { roleName: "admin", url: "admin" },
      { roleName: "moderator", url: "moderator" },
      { roleName: "guest", url: "guest" },
    ]);

    await users[0].addRole(roles[1]); // moderator
    await users[1].addRole(roles[0]); // admin
    await users[2].addRole(roles[2]); // guest

    const categories = await Category.bulkCreate([
      {
        name: "Web Geliştirme",
        url: slugField("Web Geliştirme"),
      },
      {
        name: "Mobile Geliştirme",
        url: slugField("Mobile Geliştirme"),
      },
      {
        name: "Programlama",
        url: slugField("Programlama"),
      },
    ]);

    const blogs = await Blog.bulkCreate([
      {
        title: "Komple Uygulamalı Web Geliştirme Eğitimi",
        url: generateName(8),
        subTitle:
          "Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
        description:
          "Web geliştirme komple bir web sitesinin hem web tasarım (html,css,javascript), hem de web programlama (asp.net mvc) konularının kullanılarak geliştirilmesidir. Sadece html css kullanarak statik bir site tasarlayabiliriz ancak işin içine bir web programlama dilini de katarsak dinamik bir web uygulaması geliştirmiş oluruz. ",
        image: "1.jpeg",
        homePage: true,
        approval: true,
        userId: 2,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        url: generateName(8),
        subTitle:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "2.jpeg",
        homePage: true,
        approval: true,
        userId: 2,
      },
      {
        title: "Python Django ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Python django ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.",
        description:
          "Python django kursumuza katılmak için temel düzeyde Python programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Django konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "3.jpeg",
        homePage: true,
        approval: true,
        userId: 1,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "(Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "3.jpeg",
        homePage: true,
        approval: true,
        userId: 1,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "3.jpeg",
        homePage: true,
        approval: true,
        userId: 2,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "1.jpeg",
        homePage: true,
        approval: true,
        userId: 2,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "6.jpeg",
        homePage: true,
        approval: true,
        userId: 2,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "3.jpeg",
        homePage: true,
        approval: true,
        userId: 1,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "2.jpeg",
        homePage: true,
        approval: true,
        userId: 1,
      },
      {
        title: "Node.js ile Sıfırdan İleri Seviye Web Geliştirme",
        url: generateName(8),
        subTitle:
          "Node.js ile sıfırdan ileri seviye dinamik web uygulaması geliştirmeyi öğren.)",
        description:
          "Node.js kursumuza katılmak için temel düzeyde Javascript programlama bilgisi ve temel düzelde HTML/CSS bilgisine sahip olmanız yeterlidir. Kursumuz sıfırdan ileri seviyeye tüm Node.js konularını içeriyor ve her konu en temelden detaylı bir şekilde anlatılıyor. Ayrıca her bölümde öğrendiklerimizi uygulayabileceğimiz gerçek bir projeyi sıfırdan ileri seviyeye adım adım geliştiriyoruz.",
        image: "3.jpeg",
        homePage: true,
        approval: true,
        userId: 1,
      },
    ]);

    await categories[0].addBlog(blogs[0]);
    await categories[0].addBlog(blogs[1]);

    await categories[1].addBlog(blogs[2]);
    await categories[1].addBlog(blogs[3]);

    await categories[2].addBlog(blogs[2]);
    await categories[2].addBlog(blogs[3]);

    await blogs[0].addCategory(categories[1]);
  }
};

module.exports = populate;
