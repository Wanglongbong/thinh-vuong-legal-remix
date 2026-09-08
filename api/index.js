// server.ts
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { diffLines } from "diff";

// src/lib/site-data.ts
var commonLaw = ["B\u1ED9 lu\u1EADt D\xE2n s\u1EF1 s\u1ED1 91/2015/QH13", "Lu\u1EADt Giao d\u1ECBch \u0111i\u1EC7n t\u1EED s\u1ED1 20/2023/QH15"];
var walletLaw = ["Ngh\u1ECB \u0111\u1ECBnh s\u1ED1 52/2024/N\u0110-CP", "Th\xF4ng t\u01B0 s\u1ED1 40/2024/TT-NHNN v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i, h\u1EE3p nh\u1EA5t li\xEAn quan"];
var dataLaw = ["Lu\u1EADt D\u1EEF li\u1EC7u s\u1ED1 60/2024/QH15", "Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n s\u1ED1 91/2025/QH15", "Ngh\u1ECB \u0111\u1ECBnh s\u1ED1 356/2025/N\u0110-CP"];
var make = (item) => ({
  deliverables: ["D\u1EF1 th\u1EA3o v\u0103n b\u1EA3n", "Ph\u1EE5 l\u1EE5c ph\u1EA1m vi c\xF4ng vi\u1EC7c", "Danh m\u1EE5c ki\u1EC3m tra tr\u01B0\u1EDBc khi k\xFD"],
  clauses: ["Ph\u1EA1m vi v\xE0 ch\u1EE7 th\u1EC3", "Quy\u1EC1n, ngh\u0129a v\u1EE5 v\xE0 ph\xED", "D\u1EEF li\u1EC7u v\xE0 b\u1EA3o m\u1EADt", "Vi ph\u1EA1m, ch\u1EA5m d\u1EE9t v\xE0 tranh ch\u1EA5p"],
  legalBases: [...commonLaw, ...walletLaw],
  ...item
});
var contracts = [
  make({ slug: "dieu-le-cong-ty-co-phan", title: "\u0110i\u1EC1u l\u1EC7 c\xF4ng ty c\u1ED5 ph\u1EA7n cung \u1EE9ng v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "\u0110i\u1EC1u l\u1EC7 c\xF4ng ty", group: "thanh-lap-doanh-nghiep", minimum: true, featured: true, audience: "N\u0103m c\u1ED5 \u0111\xF4ng s\xE1ng l\u1EADp v\xE0 c\xF4ng ty c\u1ED5 ph\u1EA7n d\u1EF1 ki\u1EBFn th\xE0nh l\u1EADp.", summary: "Thi\u1EBFt l\u1EADp c\u01A1 c\u1EA5u v\u1ED1n, th\u1EA9m quy\u1EC1n qu\u1EA3n tr\u1ECB v\xE0 ki\u1EC3m so\xE1t quy\u1EBFt \u0111\u1ECBnh \u1EA3nh h\u01B0\u1EDFng \u0111\u1EBFn gi\u1EA5y ph\xE9p, d\u1EEF li\u1EC7u v\xE0 t\xE0i s\u1EA3n c\xF4ng ngh\u1EC7.", solves: "Ng\u0103n ph\xE2n quy\u1EC1n m\u01A1 h\u1ED3, quy\u1EBFt \u0111\u1ECBnh v\u01B0\u1EE3t th\u1EA9m quy\u1EC1n v\xE0 xung \u0111\u1ED9t gi\u1EEFa t\u0103ng tr\u01B0\u1EDFng v\u1EDBi tu\xE2n th\u1EE7.", owner: "Ki\u1EC1u Ho\xE0i Thu", legalBases: ["Lu\u1EADt Doanh nghi\u1EC7p s\u1ED1 59/2020/QH14 v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i n\u0103m 2025", ...walletLaw], clauses: ["V\u1ED1n, c\u1ED5 ph\u1EA7n v\xE0 chuy\u1EC3n nh\u01B0\u1EE3ng", "C\u01A1 c\u1EA5u qu\u1EA3n tr\u1ECB", "T\xE0i kho\u1EA3n b\u1EA3o \u0111\u1EA3m thanh to\xE1n", "D\u1EEF li\u1EC7u v\xE0 t\xE0i s\u1EA3n c\xF4ng ngh\u1EC7"] }),
  make({ slug: "to-chuc-dai-hoi-dong-co-dong", title: "H\u1ED3 s\u01A1 t\u1ED5 ch\u1EE9c \u0110\u1EA1i h\u1ED9i \u0111\u1ED3ng c\u1ED5 \u0111\xF4ng", shortTitle: "\u0110\u1EA1i h\u1ED9i \u0111\u1ED3ng c\u1ED5 \u0111\xF4ng", group: "phap-ly-noi-bo", minimum: false, audience: "C\xF4ng ty c\u1ED5 ph\u1EA7n chu\u1EA9n b\u1ECB quy\u1EBFt \u0111\u1ECBnh v\u1EC1 v\u1ED1n, nh\xE2n s\u1EF1, s\u1EA3n ph\u1EA9m ho\u1EB7c \u0111\u1ED1i t\xE1c chi\u1EBFn l\u01B0\u1EE3c.", summary: "Chu\u1EA9n h\xF3a th\u1EA9m quy\u1EC1n tri\u1EC7u t\u1EADp, th\xF4ng b\xE1o, bi\u1EC3u quy\u1EBFt, bi\xEAn b\u1EA3n v\xE0 ngh\u1ECB quy\u1EBFt.", solves: "Gi\u1EA3m nguy c\u01A1 ngh\u1ECB quy\u1EBFt b\u1ECB tranh ch\u1EA5p do sai ch\u1EE7 th\u1EC3, tr\xECnh t\u1EF1 ho\u1EB7c t\u1EF7 l\u1EC7 bi\u1EC3u quy\u1EBFt.", owner: "Ki\u1EC1u Ho\xE0i Thu", legalBases: ["Lu\u1EADt Doanh nghi\u1EC7p s\u1ED1 59/2020/QH14 v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i n\u0103m 2025"] }),
  make({ slug: "hop-dong-lao-dong-fintech", title: "H\u1EE3p \u0111\u1ED3ng lao \u0111\u1ED9ng cho doanh nghi\u1EC7p v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "H\u1EE3p \u0111\u1ED3ng lao \u0111\u1ED9ng", group: "phap-ly-noi-bo", minimum: true, audience: "Nh\xE2n s\u1EF1 k\u1EF9 thu\u1EADt, an to\xE0n th\xF4ng tin, v\u1EADn h\xE0nh, ph\xE1p ch\u1EBF v\xE0 ch\u0103m s\xF3c kh\xE1ch h\xE0ng.", summary: "G\u1EAFn ngh\u0129a v\u1EE5 lao \u0111\u1ED9ng v\u1EDBi b\u1EA3o m\u1EADt, thi\u1EBFt b\u1ECB, quy\u1EC1n truy c\u1EADp v\xE0 x\u1EED l\xFD d\u1EEF li\u1EC7u kh\xE1ch h\xE0ng.", solves: "H\u1EA1n ch\u1EBF r\xF2 r\u1EC9 d\u1EEF li\u1EC7u, gi\u1EEF quy\u1EC1n truy c\u1EADp sau ngh\u1EC9 vi\u1EC7c v\xE0 tranh ch\u1EA5p s\u1EA3n ph\u1EA9m c\xF4ng vi\u1EC7c.", owner: "L\xEA Ph\u01B0\u01A1ng Th\u1EA3o", legalBases: ["B\u1ED9 lu\u1EADt Lao \u0111\u1ED9ng s\u1ED1 45/2019/QH14", ...dataLaw] }),
  make({ slug: "thoa-thuan-bao-mat", title: "Th\u1ECFa thu\u1EADn b\u1EA3o m\u1EADt th\xF4ng tin v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "Th\u1ECFa thu\u1EADn b\u1EA3o m\u1EADt", group: "phap-ly-noi-bo", minimum: true, audience: "Nh\xE2n s\u1EF1, nh\xE0 th\u1EA7u, \u0111\u1ED1i t\xE1c k\u1EF9 thu\u1EADt v\xE0 b\xEAn \u0111\u01B0\u1EE3c c\u1EA5p quy\u1EC1n truy c\u1EADp.", summary: "B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u kh\xE1ch h\xE0ng, l\u1ECBch s\u1EED giao d\u1ECBch, h\u1ED3 s\u01A1 \u0111\u1ECBnh danh, m\xE3 ngu\u1ED3n, API v\xE0 kh\xF3a truy c\u1EADp.", solves: "Gi\u1EDBi h\u1EA1n m\u1EE5c \u0111\xEDch s\u1EED d\u1EE5ng v\xE0 x\u1EED l\xFD vi\u1EC7c l\u1EA1m d\u1EE5ng quy\u1EC1n truy c\u1EADp ho\u1EB7c ti\u1EBFt l\u1ED9 th\xF4ng tin.", owner: "Ph\u1EA1m V\u0103n Quang", legalBases: [...commonLaw, ...dataLaw] }),
  make({ slug: "thoa-thuan-so-huu-tri-tue", title: "Th\u1ECFa thu\u1EADn s\u1EDF h\u1EEFu tr\xED tu\u1EC7 \u0111\u1ED1i v\u1EDBi n\u1EC1n t\u1EA3ng v\xED", shortTitle: "S\u1EDF h\u1EEFu tr\xED tu\u1EC7", group: "phap-ly-noi-bo", minimum: false, audience: "Nh\xE0 s\xE1ng l\u1EADp, nh\xE2n s\u1EF1 v\xE0 nh\xE0 th\u1EA7u ph\xE1t tri\u1EC3n m\xE3 ngu\u1ED3n, giao di\u1EC7n, th\u01B0\u01A1ng hi\u1EC7u ho\u1EB7c t\xE0i li\u1EC7u API.", summary: "X\xE1c \u0111\u1ECBnh t\xE0i s\u1EA3n c\xF3 tr\u01B0\u1EDBc, t\xE0i s\u1EA3n h\xECnh th\xE0nh v\xE0 ph\u1EA1m vi chuy\u1EC3n giao quy\u1EC1n.", solves: "Ng\u0103n tranh ch\u1EA5p m\xE3 ngu\u1ED3n v\xE0 h\u1EA1n ch\u1EBF ph\u1EE5 thu\u1ED9c v\xE0o c\xE1 nh\xE2n ho\u1EB7c nh\xE0 th\u1EA7u.", owner: "Ph\u1EA1m V\u0103n Quang", legalBases: ["Lu\u1EADt S\u1EDF h\u1EEFu tr\xED tu\u1EC7 n\u0103m 2005 v\xE0 c\xE1c lu\u1EADt s\u1EEDa \u0111\u1ED5i", ...commonLaw] }),
  make({ slug: "hop-dong-giam-doc", title: "H\u1EE3p \u0111\u1ED3ng v\u1EDBi Gi\xE1m \u0111\u1ED1c/T\u1ED5ng gi\xE1m \u0111\u1ED1c", shortTitle: "H\u1EE3p \u0111\u1ED3ng Gi\xE1m \u0111\u1ED1c", group: "phap-ly-noi-bo", minimum: false, audience: "C\xF4ng ty c\u1ED5 ph\u1EA7n v\xE0 ng\u01B0\u1EDDi \u0111i\u1EC1u h\xE0nh d\u1EF1 \xE1n v\xED \u0111i\u1EC7n t\u1EED.", summary: "G\u1EAFn quy\u1EC1n \u0111i\u1EC1u h\xE0nh v\u1EDBi gi\u1EDBi h\u1EA1n th\u1EA9m quy\u1EC1n, m\u1EE5c ti\xEAu tu\xE2n th\u1EE7, xung \u0111\u1ED9t l\u1EE3i \xEDch v\xE0 b\xE1o c\xE1o.", solves: "Tr\xE1nh t\u1EF1 quy\u1EBFt giao d\u1ECBch l\u1EDBn ho\u1EB7c m\u1EDF ch\u1EE9c n\u0103ng v\u01B0\u1EE3t ph\u1EA1m vi gi\u1EA5y ph\xE9p.", owner: "Tr\u1EA7n Th\u1ECB Th\u01A1", legalBases: ["Lu\u1EADt Doanh nghi\u1EC7p s\u1ED1 59/2020/QH14 v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i n\u0103m 2025", "B\u1ED9 lu\u1EADt Lao \u0111\u1ED9ng s\u1ED1 45/2019/QH14"] }),
  make({ slug: "thoa-thuan-co-dong", title: "Th\u1ECFa thu\u1EADn c\u1ED5 \u0111\xF4ng d\u1EF1 \xE1n v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "Th\u1ECFa thu\u1EADn c\u1ED5 \u0111\xF4ng", group: "phap-ly-noi-bo", minimum: false, audience: "C\u1ED5 \u0111\xF4ng s\xE1ng l\u1EADp v\xE0 nh\xE0 \u0111\u1EA7u t\u01B0 m\u1EDBi.", summary: "Thi\u1EBFt k\u1EBF quy\u1EC1n bi\u1EC3u quy\u1EBFt, h\u1EA1n ch\u1EBF chuy\u1EC3n nh\u01B0\u1EE3ng, cam k\u1EBFt v\u1ED1n v\xE0 c\u01A1 ch\u1EBF x\u1EED l\xFD b\u1EBF t\u1EAFc.", solves: "\u1ED4n \u0111\u1ECBnh c\u01A1 c\u1EA5u s\u1EDF h\u1EEFu v\xE0 t\u1EA1o n\u1EC1n t\u1EA3ng r\xF5 r\xE0ng cho v\xF2ng g\u1ECDi v\u1ED1n.", owner: "Tr\u1EA7n Th\u1ECB Th\xF9y", legalBases: ["Lu\u1EADt Doanh nghi\u1EC7p s\u1ED1 59/2020/QH14 v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i n\u0103m 2025", ...commonLaw] }),
  make({ slug: "mo-va-su-dung-vi-dien-tu", title: "H\u1EE3p \u0111\u1ED3ng m\u1EDF v\xE0 s\u1EED d\u1EE5ng v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "M\u1EDF v\xE0 s\u1EED d\u1EE5ng v\xED", group: "kinh-doanh", minimum: true, featured: true, audience: "Doanh nghi\u1EC7p v\xED \u0111i\u1EC7n t\u1EED \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p v\xE0 kh\xE1ch h\xE0ng c\xE1 nh\xE2n ho\u1EB7c t\u1ED5 ch\u1EE9c.", summary: "\u0110i\u1EC1u ch\u1EC9nh m\u1EDF v\xED, \u0111\u1ECBnh danh, li\xEAn k\u1EBFt ng\xE2n h\xE0ng, n\u1EA1p r\xFAt, thanh to\xE1n, ph\xED, tra so\xE1t v\xE0 ch\u1EA5m d\u1EE9t.", solves: "Chu\u1EA9n h\xF3a quan h\u1EC7 c\u1ED1t l\xF5i v\u1EDBi kh\xE1ch h\xE0ng v\xE0 l\xE0m r\xF5 tr\xE1ch nhi\u1EC7m t\u1EA1i t\u1EEBng giai \u0111o\u1EA1n giao d\u1ECBch.", owner: "Tr\u1EA7n Th\u1ECB Th\u01A1", legalBases: [...walletLaw, "Lu\u1EADt B\u1EA3o v\u1EC7 quy\u1EC1n l\u1EE3i ng\u01B0\u1EDDi ti\xEAu d\xF9ng s\u1ED1 19/2023/QH15", ...dataLaw] }),
  make({ slug: "thue-ngoai-cong-nghe-thong-tin", title: "H\u1EE3p \u0111\u1ED3ng thu\xEA ngo\xE0i c\xF4ng ngh\u1EC7 th\xF4ng tin", shortTitle: "Thu\xEA ngo\xE0i CNTT", group: "kinh-doanh", minimum: false, audience: "Doanh nghi\u1EC7p v\xED v\xE0 nh\xE0 cung c\u1EA5p eKYC, m\xE1y ch\u1EE7, ph\u1EA7n m\u1EC1m ho\u1EB7c h\u1ED7 tr\u1EE3 v\u1EADn h\xE0nh.", summary: "Ki\u1EC3m so\xE1t m\u1EE9c d\u1ECBch v\u1EE5, quy\u1EC1n truy c\u1EADp, nh\xE0 th\u1EA7u ph\u1EE5, d\u1EEF li\u1EC7u, ki\u1EC3m to\xE1n v\xE0 k\u1EBF ho\u1EA1ch tho\xE1t.", solves: "Gi\u1EA3m ph\u1EE5 thu\u1ED9c c\xF4ng ngh\u1EC7 m\xE0 kh\xF4ng chuy\u1EC3n giao tr\xE1i ph\xE9p tr\xE1ch nhi\u1EC7m c\u1EE7a \u0111\u01A1n v\u1ECB \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p.", owner: "L\xEA Th\u1ECB H\u1ED3ng Nhung", legalBases: [...commonLaw, ...walletLaw, ...dataLaw] }),
  make({ slug: "hop-tac-khuyen-mai", title: "H\u1EE3p \u0111\u1ED3ng h\u1EE3p t\xE1c khuy\u1EBFn m\u1EA1i v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "H\u1EE3p t\xE1c khuy\u1EBFn m\u1EA1i", group: "kinh-doanh", minimum: false, audience: "Doanh nghi\u1EC7p v\xED, th\u01B0\u01A1ng nh\xE2n v\xE0 \u0111\u1ED1i t\xE1c t\xE0i tr\u1EE3 ch\u01B0\u01A1ng tr\xECnh.", summary: "Ph\xE2n \u0111\u1ECBnh ng\xE2n s\xE1ch, \u0111i\u1EC1u ki\u1EC7n \u01B0u \u0111\xE3i, \u0111\u1ED1i so\xE1t, d\u1EEF li\u1EC7u kh\xE1ch h\xE0ng v\xE0 tr\xE1ch nhi\u1EC7m c\xF4ng b\u1ED1.", solves: "Tr\xE1nh \u01B0u \u0111\xE3i b\u1ECB hi\u1EC3u th\xE0nh ti\u1EC1n l\u01B0u tr\u1EEF, sai l\u1EC7ch th\xF4ng tin ho\u1EB7c ch\xEAnh l\u1EC7ch \u0111\u1ED1i so\xE1t.", owner: "V\u01B0\u01A1ng Thu Th\u1EE7y", legalBases: ["Lu\u1EADt Th\u01B0\u01A1ng m\u1EA1i s\u1ED1 36/2005/QH11", "Lu\u1EADt B\u1EA3o v\u1EC7 quy\u1EC1n l\u1EE3i ng\u01B0\u1EDDi ti\xEAu d\xF9ng s\u1ED1 19/2023/QH15", ...walletLaw] }),
  make({ slug: "hop-dong-bcc", title: "H\u1EE3p \u0111\u1ED3ng h\u1EE3p t\xE1c kinh doanh cho h\u1EC7 sinh th\xE1i v\xED", shortTitle: "H\u1EE3p \u0111\u1ED3ng BCC", group: "kinh-doanh", minimum: false, audience: "Doanh nghi\u1EC7p v\xED v\xE0 \u0111\u1ED1i t\xE1c c\xF9ng \u0111\u1EA7u t\u01B0, khai th\xE1c s\u1EA3n ph\u1EA9m ho\u1EB7c k\xEAnh ph\xE2n ph\u1ED1i.", summary: "G\u1EAFn \u0111\xF3ng g\xF3p, ph\xE2n chia k\u1EBFt qu\u1EA3 v\xE0 \u0111i\u1EC1u h\xE0nh v\u1EDBi ranh gi\u1EDBi gi\u1EA5y ph\xE9p.", solves: "Ng\u0103n \u0111\u1ED1i t\xE1c ch\u01B0a c\xF3 ph\xE9p tr\u1EF1c ti\u1EBFp th\u1EF1c hi\u1EC7n nghi\u1EC7p v\u1EE5 d\xE0nh cho t\u1ED5 ch\u1EE9c trung gian thanh to\xE1n.", owner: "Ph\u1EA1m D\u1EA1 Th\u1EA3o", legalBases: ["Lu\u1EADt \u0110\u1EA7u t\u01B0 s\u1ED1 61/2020/QH14 v\xE0 v\u0103n b\u1EA3n s\u1EEDa \u0111\u1ED5i", ...commonLaw, ...walletLaw] }),
  make({ slug: "tai-khoan-bao-dam-thanh-toan", title: "H\u1EE3p \u0111\u1ED3ng k\u1EBFt n\u1ED1i v\xE0 m\u1EDF t\xE0i kho\u1EA3n b\u1EA3o \u0111\u1EA3m thanh to\xE1n", shortTitle: "T\xE0i kho\u1EA3n b\u1EA3o \u0111\u1EA3m", group: "kinh-doanh", minimum: true, audience: "Doanh nghi\u1EC7p v\xED \u0111i\u1EC7n t\u1EED v\xE0 ng\xE2n h\xE0ng h\u1EE3p t\xE1c.", summary: "Quy \u0111\u1ECBnh m\u1EDF, qu\u1EA3n l\xFD, \u0111\u1ED1i so\xE1t v\xE0 s\u1EED d\u1EE5ng t\xE0i kho\u1EA3n b\u1EA3o \u0111\u1EA3m cho s\u1ED1 d\u01B0 v\xED kh\xE1ch h\xE0ng.", solves: "B\u1EA3o \u0111\u1EA3m ti\u1EC1n c\u1EE7a kh\xE1ch h\xE0ng \u0111\u01B0\u1EE3c qu\u1EA3n l\xFD \u0111\xFAng m\u1EE5c \u0111\xEDch v\xE0 x\u1EED l\xFD ch\xEAnh l\u1EC7ch c\xF3 ki\u1EC3m so\xE1t.", owner: "V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o", legalBases: [...walletLaw, "Lu\u1EADt Ph\xF2ng, ch\u1ED1ng r\u1EEDa ti\u1EC1n s\u1ED1 14/2022/QH15"] }),
  make({ slug: "cung-cap-dich-vu-thanh-toan", title: "H\u1EE3p \u0111\u1ED3ng cung c\u1EA5p d\u1ECBch v\u1EE5 thanh to\xE1n b\u1EB1ng v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "D\u1ECBch v\u1EE5 thanh to\xE1n", group: "kinh-doanh", minimum: false, audience: "Doanh nghi\u1EC7p v\xED v\xE0 \u0111\u1ED1i t\xE1c c\xF3 nhu c\u1EA7u ch\u1EA5p nh\u1EADn, thu h\u1ED9 ho\u1EB7c ho\xE0n tr\u1EA3 thanh to\xE1n.", summary: "X\xE1c l\u1EADp ph\u1EA1m vi giao d\u1ECBch, \u0111i\u1EC1u ki\u1EC7n th\xE0nh c\xF4ng, ph\xED, \u0111\u1ED1i so\xE1t, ho\xE0n ti\u1EC1n v\xE0 tr\xE1ch nhi\u1EC7m.", solves: "T\u1EA1o \u0111\u01B0\u1EDDng bi\xEAn r\xF5 gi\u1EEFa d\u1ECBch v\u1EE5 thanh to\xE1n, d\u1ECBch v\u1EE5 c\xF4ng ngh\u1EC7 v\xE0 ngh\u0129a v\u1EE5 m\u1ED7i b\xEAn.", owner: "V\u01B0\u01A1ng Thu Th\u1EE7y" }),
  make({ slug: "don-vi-chap-nhan-thanh-toan", title: "H\u1EE3p \u0111\u1ED3ng v\u1EDBi \u0111\u01A1n v\u1ECB ch\u1EA5p nh\u1EADn thanh to\xE1n", shortTitle: "\u0110\u01A1n v\u1ECB ch\u1EA5p nh\u1EADn thanh to\xE1n", group: "kinh-doanh", minimum: true, audience: "Doanh nghi\u1EC7p v\xED v\xE0 c\u1EEDa h\xE0ng, s\xE0n ho\u1EB7c nh\xE0 cung c\u1EA5p h\xE0ng h\xF3a, d\u1ECBch v\u1EE5.", summary: "Quy \u0111\u1ECBnh t\xEDch h\u1EE3p, ch\u1EA5p nh\u1EADn giao d\u1ECBch, \u0111\u1ED1i so\xE1t, ho\xE0n ti\u1EC1n v\xE0 x\u1EED l\xFD gian l\u1EADn t\u1EA1i \u0111i\u1EC3m b\xE1n.", solves: "M\u1EDF r\u1ED9ng m\u1EA1ng l\u01B0\u1EDBi nh\u01B0ng v\u1EABn ki\u1EC3m so\xE1t ng\xE0nh h\xE0ng, giao d\u1ECBch v\xE0 b\u1EA3o v\u1EC7 kh\xE1ch h\xE0ng.", owner: "L\xEA Th\u1ECB H\u1ED3ng Nhung", legalBases: [...walletLaw, "Lu\u1EADt Th\u01B0\u01A1ng m\u1EA1i s\u1ED1 36/2005/QH11"] }),
  make({ slug: "vi-lien-ket-ngan-hang", title: "H\u1EE3p \u0111\u1ED3ng s\u1EED d\u1EE5ng v\xED \u0111i\u1EC7n t\u1EED li\xEAn k\u1EBFt ng\xE2n h\xE0ng", shortTitle: "V\xED li\xEAn k\u1EBFt ng\xE2n h\xE0ng", group: "kinh-doanh", minimum: true, audience: "Kh\xE1ch h\xE0ng s\u1EED d\u1EE5ng v\xED, doanh nghi\u1EC7p v\xED v\xE0 lu\u1ED3ng li\xEAn k\u1EBFt v\u1EDBi ng\xE2n h\xE0ng.", summary: "L\xE0m r\xF5 x\xE1c th\u1EF1c ch\u1EE7 t\xE0i kho\u1EA3n, n\u1EA1p r\xFAt, chia s\u1EBB d\u1EEF li\u1EC7u, ng\u1EEBng li\xEAn k\u1EBFt v\xE0 h\u1ED7 tr\u1EE3.", solves: "Tr\xE1nh kho\u1EA3ng tr\u1ED1ng tr\xE1ch nhi\u1EC7m khi giao d\u1ECBch th\u1EA5t b\u1EA1i ho\u1EB7c b\u1ECB nghi ng\u1EDD gian l\u1EADn.", owner: "L\xEA Ph\u01B0\u01A1ng Th\u1EA3o", legalBases: [...walletLaw, "Lu\u1EADt Ph\xF2ng, ch\u1ED1ng r\u1EEDa ti\u1EC1n s\u1ED1 14/2022/QH15", ...dataLaw] }),
  make({ slug: "tich-hop-api-vi-dien-tu", title: "H\u1EE3p \u0111\u1ED3ng cung c\u1EA5p d\u1ECBch v\u1EE5 t\xEDch h\u1EE3p API v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "T\xEDch h\u1EE3p API v\xED \u0111i\u1EC7n t\u1EED", group: "kinh-doanh", minimum: false, featured: true, audience: "Doanh nghi\u1EC7p v\xED \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p ph\xE9p v\xE0 th\u01B0\u01A1ng nh\xE2n ho\u1EB7c n\u1EC1n t\u1EA3ng t\xEDch h\u1EE3p thanh to\xE1n.", summary: "G\u1EAFn ph\u1EA1m vi ph\xE1p l\xFD v\u1EDBi t\xE0i li\u1EC7u k\u1EF9 thu\u1EADt, m\xF4i tr\u01B0\u1EDDng th\u1EED nghi\u1EC7m, kh\xF3a x\xE1c th\u1EF1c, webhook, \u0111\u1ED1i so\xE1t, SLA v\xE0 phi\xEAn b\u1EA3n.", solves: "M\u1EDF r\u1ED9ng k\u1EBFt n\u1ED1i m\xE0 kh\xF4ng trao quy\u1EC1n gi\u1EEF ti\u1EC1n, l\u1EA5y th\xF4ng tin \u0111\u0103ng nh\u1EADp ho\u1EB7c d\xF9ng d\u1EEF li\u1EC7u ngo\xE0i m\u1EE5c \u0111\xEDch giao d\u1ECBch.", owner: "V\u0169 Anh Qu\xE2n", legalBases: [...walletLaw, ...commonLaw, ...dataLaw], clauses: ["C\u1EA5p v\xE0 qu\u1EA3n l\xFD kh\xF3a API", "Thanh to\xE1n, ho\xE0n ti\u1EC1n, webhook", "Nghi\u1EC7m thu v\xE0 SLA", "D\u1EEF li\u1EC7u, s\u1EDF h\u1EEFu tr\xED tu\u1EC7 v\xE0 phi\xEAn b\u1EA3n"] }),
  make({ slug: "chinh-sach-du-lieu-ca-nhan", title: "Ch\xEDnh s\xE1ch b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n", shortTitle: "B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n", group: "tuan-thu", minimum: true, audience: "Doanh nghi\u1EC7p v\xED, kh\xE1ch h\xE0ng, nh\xE2n s\u1EF1 v\xE0 c\xE1c b\xEAn x\u1EED l\xFD d\u1EEF li\u1EC7u.", summary: "L\u1EADp b\u1EA3n \u0111\u1ED3 d\u1EEF li\u1EC7u, vai tr\xF2 x\u1EED l\xFD, m\u1EE5c \u0111\xEDch, quy\u1EC1n ch\u1EE7 th\u1EC3, l\u01B0u gi\u1EEF, x\xF3a v\xE0 ph\u1EA3n \u1EE9ng s\u1EF1 c\u1ED1.", solves: "T\u1EA1o h\u1ED3 s\u01A1 ch\u1EE9ng minh tu\xE2n th\u1EE7 \u0111\u1ED1i v\u1EDBi d\u1EEF li\u1EC7u \u0111\u1ECBnh danh, t\xE0i ch\xEDnh, giao d\u1ECBch v\xE0 x\xE1c th\u1EF1c.", owner: "V\u01B0\u01A1ng Thu Th\u1EE7y", legalBases: dataLaw }),
  make({ slug: "quy-trinh-khieu-nai-tra-soat", title: "Quy tr\xECnh x\u1EED l\xFD khi\u1EBFu n\u1EA1i v\xE0 tra so\xE1t", shortTitle: "Khi\u1EBFu n\u1EA1i v\xE0 tra so\xE1t", group: "tuan-thu", minimum: true, audience: "Ch\u0103m s\xF3c kh\xE1ch h\xE0ng, v\u1EADn h\xE0nh, k\u1EF9 thu\u1EADt, ph\xE1p ch\u1EBF v\xE0 ki\u1EC3m so\xE1t r\u1EE7i ro.", summary: "T\u1ED5 ch\u1EE9c ba t\u1EA7ng ti\u1EBFp nh\u1EADn, x\xE1c minh, \u0111i\u1EC1u tra giao d\u1ECBch v\xE0 x\u1EED l\xFD tranh ch\u1EA5p c\xF3 ch\u1EE9ng c\u1EE9.", solves: "R\xFAt ng\u1EAFn ph\u1EA3n h\u1ED3i v\xE0 ng\u0103n t\u1EF1 \xFD phong t\u1ECFa ho\u1EB7c kh\u1EA5u tr\u1EEB ti\u1EC1n khi ch\u01B0a c\xF3 c\u0103n c\u1EE9.", owner: "Nguy\u1EC5n Huy Th\xE1i", legalBases: [...walletLaw, "Lu\u1EADt B\u1EA3o v\u1EC7 quy\u1EC1n l\u1EE3i ng\u01B0\u1EDDi ti\xEAu d\xF9ng s\u1ED1 19/2023/QH15"] }),
  make({ slug: "cap-nhat-phap-ly-dinh-ky", title: "D\u1ECBch v\u1EE5 c\u1EADp nh\u1EADt ph\xE1p l\xFD \u0111\u1ECBnh k\u1EF3", shortTitle: "C\u1EADp nh\u1EADt ph\xE1p l\xFD", group: "tuan-thu", minimum: false, audience: "Ban \u0111i\u1EC1u h\xE0nh, ph\xE1p ch\u1EBF, tu\xE2n th\u1EE7, s\u1EA3n ph\u1EA9m v\xE0 c\xF4ng ngh\u1EC7.", summary: "Theo d\xF5i v\u0103n b\u1EA3n m\u1EDBi, ph\xE2n t\xEDch t\xE1c \u0111\u1ED9ng v\xE0 chuy\u1EC3n th\xE0nh danh m\u1EE5c h\xE0nh \u0111\u1ED9ng theo th\xE1ng ho\u1EB7c qu\xFD.", solves: "H\u1EA1n ch\u1EBF h\u1EE3p \u0111\u1ED3ng, quy tr\xECnh v\xE0 ch\u1EE9c n\u0103ng s\u1EA3n ph\u1EA9m l\u1EA1c h\u1EADu so v\u1EDBi ph\xE1p lu\u1EADt.", owner: "V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o", legalBases: ["V\u0103n b\u1EA3n ph\xE1p lu\u1EADt c\xF3 hi\u1EC7u l\u1EF1c t\u1EA1i t\u1EEBng k\u1EF3 r\xE0 so\xE1t"] }),
  make({ slug: "ho-so-xu-ly-su-co", title: "B\u1ED9 h\u1ED3 s\u01A1 x\u1EED l\xFD s\u1EF1 c\u1ED1 v\xED \u0111i\u1EC7n t\u1EED", shortTitle: "H\u1ED3 s\u01A1 x\u1EED l\xFD s\u1EF1 c\u1ED1", group: "su-co", minimum: false, audience: "Ban ch\u1EC9 huy s\u1EF1 c\u1ED1 v\xE0 c\xE1c b\u1ED9 ph\u1EADn ph\xE1p ch\u1EBF, k\u1EF9 thu\u1EADt, v\u1EADn h\xE0nh, truy\u1EC1n th\xF4ng.", summary: "K\xEDch ho\u1EA1t ph\u1EA3n \u1EE9ng v\u1EDBi gian l\u1EADn, r\xF2 r\u1EC9 d\u1EEF li\u1EC7u, gi\xE1n \u0111o\u1EA1n h\u1EC7 th\u1ED1ng ho\u1EB7c ch\xEAnh l\u1EC7ch \u0111\u1ED1i so\xE1t.", solves: "B\u1EA3o to\xE0n ch\u1EE9ng c\u1EE9, ph\xE2n quy\u1EC1n ph\xE1t ng\xF4n v\xE0 ghi nh\u1EADn c\u0103n c\u1EE9 t\u1EEBng bi\u1EC7n ph\xE1p kh\u1EA9n c\u1EA5p.", owner: "Nguy\u1EC5n Huy Th\xE1i", legalBases: [...walletLaw, "Lu\u1EADt Ph\xF2ng, ch\u1ED1ng r\u1EEDa ti\u1EC1n s\u1ED1 14/2022/QH15", ...dataLaw] })
];
var teamMembers = [
  {
    name: "\u0110o\xE0n Anh Ph\u01B0\u01A1ng",
    id: "26A4062550",
    role: "Tr\u01B0\u1EDFng nh\xF3m",
    slug: "anh-phuong",
    uploadedFileName: "ANh Phu\u031Bo\u031Bng.jpg",
    avatarUrl: "/assets/team/anh-phuong.jpg",
    expertise: "Ph\xE2n t\xEDch t\u1ED5ng quan th\u1ECB tr\u01B0\u1EDDng v\xED \u0111i\u1EC7n t\u1EED & m\xF4 h\xECnh thanh to\xE1n di \u0111\u1ED9ng"
  },
  {
    name: "Ki\u1EC1u Ho\xE0i Thu",
    id: "26A4060739",
    role: "Chuy\xEAn gia \u0110i\u1EC1u l\u1EC7 & \u0110H\u0110C\u0110",
    slug: "kieu-hoai-thu",
    uploadedFileName: "Kie\u0302\u0300u hoa\u0300i thu.jpg",
    avatarUrl: "/assets/team/kieu-hoai-thu.jpg",
    expertise: "Qu\u1EA3n tr\u1ECB c\xF4ng ty \u0111\u1EA1i ch\xFAng, th\u1EA9m quy\u1EC1n bi\u1EC3u quy\u1EBFt v\xE0 c\u01A1 c\u1EA5u v\u1ED1n 50 t\u1EF7"
  },
  {
    name: "Tr\u1EA7n Th\u1ECB Th\u01A1",
    id: "26A4060737",
    role: "Chuy\xEAn gia M\u1EDF v\xED & H\u1EE3p \u0111\u1ED3ng Gi\xE1m \u0111\u1ED1c",
    slug: "tran-thi-tho",
    uploadedFileName: "Tho\u031B .jpg",
    avatarUrl: "/assets/team/tran-thi-tho.jpg",
    expertise: "Chu\u1EA9n h\xF3a \u0111i\u1EC1u kho\u1EA3n m\u1EDF v\xED ng\u01B0\u1EDDi d\xF9ng v\xE0 ph\xE2n \u0111\u1ECBnh th\u1EA9m quy\u1EC1n Ban \u0110i\u1EC1u h\xE0nh"
  },
  {
    name: "L\xEA Ph\u01B0\u01A1ng Th\u1EA3o",
    id: "26A4062560",
    role: "Chuy\xEAn gia H\u1EE3p \u0111\u1ED3ng Lao \u0111\u1ED9ng & Li\xEAn k\u1EBFt NH",
    slug: "le-phuong-thao",
    uploadedFileName: "Le\u0302 pHU\u031BO\u031BNG THA\u0309O.jpg",
    avatarUrl: "/assets/team/le-phuong-thao.jpg",
    expertise: "R\xE0ng bu\u1ED9c an ninh d\u1EEF li\u1EC7u nh\xE2n s\u1EF1 v\xE0 lu\u1ED3ng n\u1EA1p r\xFAt li\xEAn k\u1EBFt th\u1EBB/t\xE0i kho\u1EA3n"
  },
  {
    name: "V\u0169 Anh Qu\xE2n",
    id: "26A4062552",
    role: "T\xEDch h\u1EE3p API & T\u1ED5ng h\u1EE3p, Web",
    slug: "vu-anh-quan",
    uploadedFileName: "VU\u0303 Anh Qua\u0302n.jpg",
    avatarUrl: "/assets/team/vu-anh-quan.jpg",
    expertise: "Ki\u1EBFn tr\xFAc ph\xE1p l\xFD c\u1ED5ng thanh to\xE1n API, Webhook, SLA v\xE0 an to\xE0n h\u1EC7 th\u1ED1ng"
  },
  {
    name: "L\xEA Th\u1ECB H\u1ED3ng Nhung",
    id: "26A4062545",
    role: "Chuy\xEAn gia Thu\xEA ngo\xE0i CNTT & Merchant",
    slug: "hong-nhung",
    uploadedFileName: "Ho\u0302\u0300ng Nhung .jpg",
    avatarUrl: "/assets/team/hong-nhung.jpg",
    expertise: "Ki\u1EC3m so\xE1t nh\xE0 th\u1EA7u m\xE1y ch\u1EE7 \u0111\xE1m m\xE2y v\xE0 h\u1EE3p \u0111\u1ED3ng Merchant POS/Online"
  },
  {
    name: "Ph\u1EA1m D\u1EA1 Th\u1EA3o",
    id: "26A4060735",
    role: "Chuy\xEAn gia Th\xE0nh l\u1EADp DN & H\u1EE3p \u0111\u1ED3ng BCC",
    slug: "pham-da-thao",
    uploadedFileName: "Pha\u0323m Da\u0323 Tha\u0309o.jpg",
    avatarUrl: "/assets/team/pham-da-thao.jpg",
    expertise: "H\u1ED3 s\u01A1 ph\xE1p l\xFD ti\u1EC1n c\u1EA5p ph\xE9p v\xE0 ph\xE2n \u0111\u1ECBnh ranh gi\u1EDBi h\u1EE3p t\xE1c kinh doanh"
  },
  {
    name: "Nguy\u1EC5n Huy Th\xE1i",
    id: "26A4062558",
    role: "Chuy\xEAn gia Tra so\xE1t Khi\u1EBFu n\u1EA1i & H\u1ED3 s\u01A1 S\u1EF1 c\u1ED1",
    slug: "nguyen-huy-thai",
    uploadedFileName: "Nguye\u0302\u0303n Huy Tha\u0301i.jpg",
    avatarUrl: "/assets/team/nguyen-huy-thai.jpg",
    expertise: "Quy tr\xECnh gi\u1EA3i quy\u1EBFt tranh ch\u1EA5p t\xE0i ch\xEDnh 3 c\u1EA5p v\xE0 ph\u1EA3n \u1EE9ng s\u1EF1 c\u1ED1 an ninh m\u1EA1ng"
  },
  {
    name: "Ph\u1EA1m V\u0103n Quang",
    id: "26A4062551",
    role: "Chuy\xEAn gia B\u1EA3o m\u1EADt & S\u1EDF h\u1EEFu tr\xED tu\u1EC7",
    slug: "quang-pham",
    uploadedFileName: "Quang PhA\u0323M.jpg",
    avatarUrl: "/assets/team/quang-pham.jpg",
    expertise: "B\u1EA3o v\u1EC7 m\xE3 ngu\u1ED3n v\xED \u0111i\u1EC7n t\u1EED, th\u1ECFa thu\u1EADn b\u1EA3o m\u1EADt NDA v\xE0 b\u1EA3n quy\u1EC1n ph\u1EA7n m\u1EC1m"
  },
  {
    name: "Tr\u1EA7n Th\u1ECB Th\xF9y",
    id: "26A4062565",
    role: "Chuy\xEAn gia Th\u1ECFa thu\u1EADn C\u1ED5 \u0111\xF4ng",
    slug: "tran-thuy",
    uploadedFileName: "Tra\u0302\u0300n Thuy\u0300.jpg",
    avatarUrl: "/assets/team/tran-thuy.jpg",
    expertise: "Cam k\u1EBFt g\xF3p v\u1ED1n, x\u1EED l\xFD b\u1EBF t\u1EAFc Deadlock v\xE0 th\u1ECFa thu\u1EADn c\u1ED5 \u0111\xF4ng s\xE1ng l\u1EADp"
  },
  {
    name: "V\u01B0\u01A1ng Thu Th\u1EE7y",
    id: "26A4062567",
    role: "Chuy\xEAn gia Khuy\u1EBFn m\u1EA1i & D\u1EEF li\u1EC7u C\xE1 nh\xE2n",
    slug: "vuong-thu-thuy",
    uploadedFileName: "VU\u031Bo\u031Bng thU thuy\u0309.jpg",
    avatarUrl: "/assets/team/vuong-thu-thuy.jpg",
    expertise: "Tu\xE2n th\u1EE7 Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15 v\xE0 quy ch\u1EBF khuy\u1EBFn m\u1EA1i v\xED"
  },
  {
    name: "V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o",
    id: "26A4060736",
    role: "Chuy\xEAn gia TK B\u1EA3o \u0111\u1EA3m & C\u1EADp nh\u1EADt Ph\xE1p l\xFD",
    slug: "phuong-thao",
    uploadedFileName: "Phu\u031Bo\u031Bng Tha\u0309o.jpg",
    avatarUrl: "/assets/team/phuong-thao.jpg",
    expertise: "C\u01A1 ch\u1EBF k\xFD qu\u1EF9 b\u1EA3o \u0111\u1EA3m thanh to\xE1n 1:1 v\xE0 quy tr\xECnh r\xE0 so\xE1t v\u0103n b\u1EA3n NHNN \u0111\u1ECBnh k\u1EF3"
  }
];
var team = teamMembers.map((m) => [m.name, m.id, m.role]);

// src/lib/forum-shared.ts
var forumCategories = [
  "V\xED \u0111i\u1EC7n t\u1EED v\xE0 Fintech",
  "H\u1EE3p \u0111\u1ED3ng",
  "Doanh nghi\u1EC7p v\xE0 \u0111\u1EA7u t\u01B0",
  "Lao \u0111\u1ED9ng",
  "Ph\xE1p lu\u1EADt kh\xE1c"
];
var forumUnavailable = "Di\u1EC5n \u0111\xE0n \u0111ang ch\u1EDD k\u1EBFt n\u1ED1i c\u01A1 s\u1EDF d\u1EEF li\u1EC7u. T\xEDnh n\u0103ng \u0111\u0103ng b\xE0i v\xE0 b\xECnh lu\u1EADn ch\u01B0a \u0111\u01B0\u1EE3c m\u1EDF; n\u1ED9i dung b\u1EA1n nh\u1EADp s\u1EBD kh\xF4ng \u0111\u01B0\u1EE3c g\u1EEDi ho\u1EB7c l\u01B0u gi\u1EA3 l\u1EADp.";

// src/server/forum-database.ts
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Pool } from "pg";
var cookieName = "tv_forum_session";
var pool;
function forumConfigured() {
  return Boolean(
    process.env.FORUM_DATABASE_URL && process.env.FORUM_SESSION_SECRET && process.env.FORUM_RATE_LIMIT_SALT
  );
}
function forumDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.FORUM_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 4,
      idleTimeoutMillis: 1e4,
      connectionTimeoutMillis: 1e4
    });
  }
  return pool;
}
function signature(id) {
  return createHmac("sha256", process.env.FORUM_SESSION_SECRET).update(id).digest("hex");
}
function cookieValue(request) {
  const cookies = request.headers.cookie?.split(";") || [];
  const entry = cookies.find((item) => item.trim().startsWith(`${cookieName}=`));
  return entry ? decodeURIComponent(entry.trim().slice(cookieName.length + 1)) : "";
}
function forumIdentity(request, response, create = false) {
  const [id, supplied] = cookieValue(request).split(".");
  if (/^[0-9a-f-]{36}$/i.test(id || "") && supplied) {
    const expected = signature(id);
    if (supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      return { id, admin: id === process.env.FORUM_ADMIN_SESSION_ID };
    }
  }
  if (!create) return { id: null, admin: false };
  const newId = randomUUID();
  response.cookie(cookieName, `${newId}.${signature(newId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 24 * 60 * 60 * 1e3
  });
  return { id: newId, admin: false };
}
function forumIpHash(request) {
  const ip = request.headers["x-vercel-forwarded-for"]?.toString().split(",")[0]?.trim() || request.ip || "local-development";
  return createHmac("sha256", process.env.FORUM_RATE_LIMIT_SALT).update(ip).digest("hex");
}
function publicForumRow(row, actor) {
  const { author_id, ...safe } = row;
  return { ...safe, mine: Boolean(actor && author_id === actor) };
}

// server.ts
dotenv.config();
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.set("trust proxy", 1);
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-gemini-key");
  if (_req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var companyAndTeamKnowledgeBase = `TH\xD4NG TIN H\xC3NG LU\u1EACT TH\u1ECANH V\u01AF\u1EE2NG LEGAL & \u0110\u1EC0 \xC1N NGHI\xCAN C\u1EE8U NH\xD3M 13:
1. T\u1ED4NG QUAN H\xC3NG LU\u1EACT & \u0110\u1EC0 \xC1N:
- T\xEAn \u0111\u01A1n v\u1ECB: H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal (\u0110\u01A1n v\u1ECB nghi\xEAn c\u1EE9u & chu\u1EA9n h\xF3a ph\xE1p l\xFD thu\u1ED9c \u0110\u1EC1 \xE1n Nh\xF3m 13).
- Chuy\xEAn m\xF4n: Ph\xE1p l\xFD th\xE0nh l\u1EADp, c\u1EA5p ph\xE9p Ng\xE2n h\xE0ng Nh\xE0 n\u01B0\u1EDBc (NHNN) v\xE0 v\u1EADn h\xE0nh doanh nghi\u1EC7p cung \u1EE9ng d\u1ECBch v\u1EE5 V\xED \u0111i\u1EC7n t\u1EED & Fintech t\u1EA1i Vi\u1EC7t Nam.
- S\u1EA3n ph\u1EA9m c\u1ED1t l\xF5i:
  + Th\u01B0 vi\u1EC7n 20 m\u1EABu h\u1EE3p \u0111\u1ED3ng chu\u1EA9n h\xF3a to\xE0n di\u1EC7n (Merchant, Ng\u01B0\u1EDDi d\xF9ng, K\xFD qu\u1EF9 1:1, API, Thu\xEA Cloud, NDA, C\u1ED5 \u0111\xF4ng, Lao \u0111\u1ED9ng...).
  + L\u1ED9 tr\xECnh t\u01B0 v\u1EA5n c\u1EA5p ph\xE9p 6 giai \u0111o\u1EA1n (t\u1EEB c\u01A1 c\u1EA5u v\u1ED1n 50 t\u1EF7 \u0111\u1EBFn th\u1EA9m \u0111\u1ECBnh an to\xE0n h\u1EC7 th\u1ED1ng c\u1EA5p \u0111\u1ED9 3, eKYC v\xE0 n\u1ED9p h\u1ED3 s\u01A1 NHNN).
  + Tr\u1EE3 l\xFD AI v\xE0 C\xF4ng c\u1EE5 r\xE0 so\xE1t, soi b\u1EABy \u0111i\u1EC1u kho\u1EA3n h\u1EE3p \u0111\u1ED3ng th\xF4ng minh.
- Tr\u1EE5 s\u1EDF ch\xEDnh: T\xF2a nh\xE0 Bitexco Financial Tower, S\u1ED1 2 H\u1EA3i Tri\u1EC1u, Ph\u01B0\u1EDDng B\u1EBFn Ngh\xE9, Qu\u1EADn 1, TP. H\u1ED3 Ch\xED Minh.
- Chi nh\xE1nh H\xE0 N\u1ED9i: T\xF2a nh\xE0 Lotte Center, 54 Li\u1EC5u Giai, Ph\u01B0\u1EDDng C\u1ED1ng V\u1ECB, Qu\u1EADn Ba \u0110\xECnh, H\xE0 N\u1ED9i.
- K\xEAnh li\xEAn h\u1EC7:
  + Hotline / Zalo ch\xEDnh th\u1EE9c: 0988 123 456
  + \u0110i\u1EC7n tho\u1EA1i b\xE0n: (028) 3822 8888
  + Email ti\u1EBFp nh\u1EADn h\u1ED3 s\u01A1: contact@thinhvuonglegal.vn
  + Th\u1EDDi gian l\xE0m vi\u1EC7c: Th\u1EE9 Hai - Th\u1EE9 S\xE1u (08:00 - 18:00).

2. H\u1ED2 S\u01A0 12 TH\xC0NH VI\xCAN BAN NGHI\xCAN C\u1EE8U \u0110\u1EC0 \xC1N (NH\xD3M 13):
1) \u0110o\xE0n Anh Ph\u01B0\u01A1ng (M\xE3 sinh vi\xEAn: 26A4062550)
   - Vai tr\xF2: Tr\u01B0\u1EDFng nh\xF3m.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Ph\xE2n t\xEDch t\u1ED5ng quan th\u1ECB tr\u01B0\u1EDDng v\xED \u0111i\u1EC7n t\u1EED & m\xF4 h\xECnh thanh to\xE1n di \u0111\u1ED9ng t\u1EA1i Vi\u1EC7t Nam.
2) V\u0169 Anh Qu\xE2n (M\xE3 sinh vi\xEAn: 26A4062552)
   - Vai tr\xF2: T\xEDch h\u1EE3p API & T\u1ED5ng h\u1EE3p, Web.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Ki\u1EBFn tr\xFAc ph\xE1p l\xFD c\u1ED5ng thanh to\xE1n API, Webhook, cam k\u1EBFt m\u1EE9c d\u1ECBch v\u1EE5 SLA v\xE0 an to\xE0n h\u1EC7 th\u1ED1ng k\u1EBFt n\u1ED1i ng\xE2n h\xE0ng.
3) Ki\u1EC1u Ho\xE0i Thu (M\xE3 sinh vi\xEAn: 26A4060739)
   - Vai tr\xF2: Chuy\xEAn gia \u0110i\u1EC1u l\u1EC7 & \u0110H\u0110C\u0110.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Qu\u1EA3n tr\u1ECB c\xF4ng ty \u0111\u1EA1i ch\xFAng, th\u1EA9m quy\u1EC1n bi\u1EC3u quy\u1EBFt v\xE0 ph\u01B0\u01A1ng \xE1n c\u01A1 c\u1EA5u v\u1ED1n \u0111i\u1EC1u l\u1EC7 th\u1EF1c g\xF3p 50 t\u1EF7 \u0111\u1ED3ng.
4) Tr\u1EA7n Th\u1ECB Th\u01A1 (M\xE3 sinh vi\xEAn: 26A4060737)
   - Vai tr\xF2: Chuy\xEAn gia M\u1EDF v\xED & H\u1EE3p \u0111\u1ED3ng Gi\xE1m \u0111\u1ED1c.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Chu\u1EA9n h\xF3a \u0111i\u1EC1u kho\u1EA3n m\u1EDF/s\u1EED d\u1EE5ng v\xED ng\u01B0\u1EDDi d\xF9ng c\xE1 nh\xE2n v\xE0 ph\xE2n \u0111\u1ECBnh th\u1EA9m quy\u1EC1n Ban \u0110i\u1EC1u h\xE0nh.
5) L\xEA Ph\u01B0\u01A1ng Th\u1EA3o (M\xE3 sinh vi\xEAn: 26A4062560)
   - Vai tr\xF2: Chuy\xEAn gia H\u1EE3p \u0111\u1ED3ng Lao \u0111\u1ED9ng & Li\xEAn k\u1EBFt Ng\xE2n h\xE0ng.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: R\xE0ng bu\u1ED9c an ninh d\u1EEF li\u1EC7u nh\xE2n s\u1EF1 c\u1ED1t l\xF5i v\xE0 ph\xE1p l\xFD lu\u1ED3ng n\u1EA1p r\xFAt li\xEAn k\u1EBFt t\xE0i kho\u1EA3n/th\u1EBB ng\xE2n h\xE0ng.
6) L\xEA Th\u1ECB H\u1ED3ng Nhung (M\xE3 sinh vi\xEAn: 26A4062545)
   - Vai tr\xF2: Chuy\xEAn gia Thu\xEA ngo\xE0i CNTT & Merchant.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Ki\u1EC3m so\xE1t h\u1EE3p \u0111\u1ED3ng nh\xE0 th\u1EA7u m\xE1y ch\u1EE7 \u0111\xE1m m\xE2y (Cloud) v\xE0 h\u1EE3p \u0111\u1ED3ng \u0111\u01A1n v\u1ECB ch\u1EA5p nh\u1EADn thanh to\xE1n (Merchant POS/Online).
7) Ph\u1EA1m D\u1EA1 Th\u1EA3o (M\xE3 sinh vi\xEAn: 26A4060735)
   - Vai tr\xF2: Chuy\xEAn gia Th\xE0nh l\u1EADp Doanh nghi\u1EC7p & H\u1EE3p \u0111\u1ED3ng BCC.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: H\u1ED3 s\u01A1 ph\xE1p l\xFD ti\u1EC1n c\u1EA5p ph\xE9p doanh nghi\u1EC7p v\xE0 ph\xE2n \u0111\u1ECBnh ranh gi\u1EDBi h\u1EE3p \u0111\u1ED3ng h\u1EE3p t\xE1c kinh doanh BCC.
8) Nguy\u1EC5n Huy Th\xE1i (M\xE3 sinh vi\xEAn: 26A4062558)
   - Vai tr\xF2: Chuy\xEAn gia Tra so\xE1t Khi\u1EBFu n\u1EA1i & H\u1ED3 s\u01A1 S\u1EF1 c\u1ED1.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Quy tr\xECnh gi\u1EA3i quy\u1EBFt tranh ch\u1EA5p t\xE0i ch\xEDnh 3 c\u1EA5p v\xE0 quy tr\xECnh ph\u1EA3n \u1EE9ng x\u1EED l\xFD s\u1EF1 c\u1ED1 an ninh m\u1EA1ng.
9) Ph\u1EA1m V\u0103n Quang (M\xE3 sinh vi\xEAn: 26A4062551)
   - Vai tr\xF2: Chuy\xEAn gia B\u1EA3o m\u1EADt & S\u1EDF h\u1EEFu tr\xED tu\u1EC7.
   - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: B\u1EA3o v\u1EC7 quy\u1EC1n s\u1EDF h\u1EEFu m\xE3 ngu\u1ED3n v\xED \u0111i\u1EC7n t\u1EED, th\u1ECFa thu\u1EADn b\u1EA3o m\u1EADt NDA v\xE0 \u0111\u0103ng k\xFD b\u1EA3n quy\u1EC1n ph\u1EA7n m\u1EC1m k\u1EF9 thu\u1EADt.
10) Tr\u1EA7n Th\u1ECB Th\xF9y (M\xE3 sinh vi\xEAn: 26A4062565)
    - Vai tr\xF2: Chuy\xEAn gia Th\u1ECFa thu\u1EADn C\u1ED5 \u0111\xF4ng (SHA).
    - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Cam k\u1EBFt ti\u1EBFn \u0111\u1ED9 g\xF3p v\u1ED1n, c\u01A1 ch\u1EBF x\u1EED l\xFD b\u1EBF t\u1EAFc Deadlock v\xE0 th\u1ECFa thu\u1EADn c\u1ED5 \u0111\xF4ng s\xE1ng l\u1EADp.
11) V\u01B0\u01A1ng Thu Th\u1EE7y (M\xE3 sinh vi\xEAn: 26A4062567)
    - Vai tr\xF2: Chuy\xEAn gia Khuy\u1EBFn m\u1EA1i & B\u1EA3o v\u1EC7 D\u1EEF li\u1EC7u C\xE1 nh\xE2n.
    - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: Tu\xE2n th\u1EE7 Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15, l\u1EADp b\xE1o c\xE1o DPIA v\xE0 quy ch\u1EBF ch\u01B0\u01A1ng tr\xECnh khuy\u1EBFn m\u1EA1i v\xED.
12) V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o (M\xE3 sinh vi\xEAn: 26A4060736)
    - Vai tr\xF2: Chuy\xEAn gia TK B\u1EA3o \u0111\u1EA3m Thanh to\xE1n & C\u1EADp nh\u1EADt Ph\xE1p l\xFD.
    - L\u0129nh v\u1EF1c ph\u1EE5 tr\xE1ch: C\u01A1 ch\u1EBF k\xFD qu\u1EF9 b\u1EA3o \u0111\u1EA3m thanh to\xE1n t\u1EF7 l\u1EC7 1:1 t\u1EA1i Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i v\xE0 c\u1EADp nh\u1EADt v\u0103n b\u1EA3n ph\xE1p lu\u1EADt NHNN.`;
var legalKnowledgeBase = `C\u01A0 S\u1EDE PH\xC1P L\xDD CHU\u1EA8N M\u1EF0C FINTECH & TRUNG GIAN THANH TO\xC1N VI\u1EC6T NAM (2025 - 2026):
1. NGH\u1ECA \u0110\u1ECANH 52/2024/N\u0110-CP (Thanh to\xE1n kh\xF4ng d\xF9ng ti\u1EC1n m\u1EB7t):
- \u0110i\u1EC1u 22: \u0110i\u1EC1u ki\u1EC7n c\u1EA5p Gi\u1EA5y ph\xE9p cung \u1EE9ng d\u1ECBch v\u1EE5 trung gian thanh to\xE1n: V\u1ED1n \u0111i\u1EC1u l\u1EC7 th\u1EF1c g\xF3p t\u1ED1i thi\u1EC3u 50 t\u1EF7 \u0111\u1ED3ng; Ng\u01B0\u1EDDi \u0111\u1EA1i di\u1EC7n ph\xE1p lu\u1EADt, T\u1ED5ng gi\xE1m \u0111\u1ED1c ph\u1EA3i c\xF3 b\u1EB1ng \u0111\u1EA1i h\u1ECDc tr\u1EDF l\xEAn ng\xE0nh kinh t\u1EBF, t\xE0i ch\xEDnh, lu\u1EADt ho\u1EB7c CNTT v\xE0 t\u1ED1i thi\u1EC3u 03 n\u0103m kinh nghi\u1EC7m; \u0110\u1EC1 \xE1n kinh doanh kh\u1EA3 thi.
- \u0110i\u1EC1u 24: H\u1ED3 s\u01A1 \u0111\u1EC1 ngh\u1ECB c\u1EA5p gi\u1EA5y ph\xE9p: \u0110\u01A1n \u0111\u1EC1 ngh\u1ECB M\u1EABu 01, Bi\xEAn b\u1EA3n h\u1ECDp/Ngh\u1ECB quy\u1EBFt H\u0110QT, Gi\u1EA5y t\u1EDD ch\u1EE9ng minh v\u1ED1n th\u1EF1c g\xF3p, H\u1ED3 s\u01A1 nh\xE2n s\u1EF1 ch\u1EE7 ch\u1ED1t, B\u1EA3n thuy\u1EBFt minh gi\u1EA3i ph\xE1p k\u1EF9 thu\u1EADt.
- \u0110i\u1EC1u 25: \u0110\u1EA3m b\u1EA3o kh\u1EA3 n\u0103ng thanh to\xE1n \u0111\u1ED1i v\u1EDBi d\u1ECBch v\u1EE5 v\xED \u0111i\u1EC7n t\u1EED: M\u1EDF t\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n t\u1EA1i Ng\xE2n h\xE0ng th\u01B0\u01A1ng m\u1EA1i; Duy tr\xEC t\u1ED5ng s\u1ED1 d\u01B0 t\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n KH\xD4NG \u0110\u01AF\u1EE2C TH\u1EA4P H\u01A0N t\u1ED5ng s\u1ED1 d\u01B0 c\u1EE7a t\u1EA5t c\u1EA3 c\xE1c v\xED \u0111i\u1EC7n t\u1EED c\u1EE7a kh\xE1ch h\xE0ng; Nghi\xEAm c\u1EA5m s\u1EED d\u1EE5ng ti\u1EC1n tr\xEAn t\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n v\xE0o m\u1EE5c \u0111\xEDch kh\xE1c ho\u1EB7c th\u1EA5u chi.

2. TH\xD4NG T\u01AF 40/2024/TT-NHNN (H\u01B0\u1EDBng d\u1EABn d\u1ECBch v\u1EE5 trung gian thanh to\xE1n):
- \u0110i\u1EC1u 9: N\u1EA1p, r\xFAt ti\u1EC1n v\xE0o/ra v\xED \u0111i\u1EC7n t\u1EED: Ph\u1EA3i th\u1EF1c hi\u1EC7n th\xF4ng qua t\xE0i kho\u1EA3n thanh to\xE1n ho\u1EB7c th\u1EBB ghi n\u1EE3 c\u1EE7a ch\xEDnh ch\u1EE7 kh\xE1ch h\xE0ng m\u1EDF t\u1EA1i ng\xE2n h\xE0ng h\u1EE3p t\xE1c.
- \u0110i\u1EC1u 10: H\u1EA1n m\u1EE9c giao d\u1ECBch qua v\xED \u0111i\u1EC7n t\u1EED: H\u1EA1n m\u1EE9c t\u1ED1i \u0111a \xE1p d\u1EE5ng cho kh\xE1ch h\xE0ng c\xE1 nh\xE2n (100 tri\u1EC7u VN\u0110/th\xE1ng cho m\u1ED7i v\xED), mi\u1EC5n tr\u1EEB \u0111\u1ED1i v\u1EDBi t\xE0i kho\u1EA3n v\xED c\u1EE7a \u0111\u01A1n v\u1ECB ch\u1EA5p nh\u1EADn thanh to\xE1n (Merchant).
- \u0110i\u1EC1u 11: Nh\u1EADn bi\u1EBFt kh\xE1ch h\xE0ng (eKYC): Thu th\u1EADp CCCD g\u1EAFn chip, \u0111\u1ED1i so\xE1t C\u01A1 s\u1EDF d\u1EEF li\u1EC7u qu\u1ED1c gia v\u1EC1 d\xE2n c\u01B0 v\xE0 x\xE1c th\u1EF1c sinh tr\u1EAFc h\u1ECDc khu\xF4n m\u1EB7t theo Quy\u1EBFt \u0111\u1ECBnh 2345/Q\u0110-NHNN.

3. LU\u1EACT B\u1EA2O V\u1EC6 D\u1EEE LI\u1EC6U C\xC1 NH\xC2N 91/2025/QH15 & NGH\u1ECA \u0110\u1ECANH 356/2025/N\u0110-CP:
- D\u1EEF li\u1EC7u t\xE0i ch\xEDnh, sinh tr\u1EAFc h\u1ECDc v\xE0 l\u1ECBch s\u1EED giao d\u1ECBch thanh to\xE1n l\xE0 "D\u1EEF li\u1EC7u c\xE1 nh\xE2n nh\u1EA1y c\u1EA3m".
- Doanh nghi\u1EC7p v\xED b\u1EAFt bu\u1ED9c l\u1EADp H\u1ED3 s\u01A1 \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng x\u1EED l\xFD d\u1EEF li\u1EC7u c\xE1 nh\xE2n (DPIA) n\u1ED9p C\u1EE5c An ninh m\u1EA1ng (A05) - B\u1ED9 C\xF4ng an.
- Tuy\u1EC7t \u0111\u1ED1i c\u1EA5m mua b\xE1n, chuy\u1EC3n giao tr\xE1i ph\xE9p d\u1EEF li\u1EC7u thanh to\xE1n cho b\xEAn th\u1EE9 ba v\xEC m\u1EE5c \u0111\xEDch qu\u1EA3ng c\xE1o ho\u1EB7c ch\u1EA5m \u0111i\u1EC3m t\xEDn d\u1EE5ng khi ch\u01B0a c\xF3 s\u1EF1 \u0111\u1ED3ng \xFD ri\xEAng bi\u1EC7t.

4. H\u1EC6 TH\u1ED0NG QU\u1EA2N TR\u1ECA R\u1EE6I RO & B\u1EA2O M\u1EACT:
- H\u1EA1 t\u1EA7ng k\u1EF9 thu\u1EADt ph\u1EA3i \u0111\u1EA1t Ti\xEAu chu\u1EA9n b\u1EA3o m\u1EADt an to\xE0n th\xF4ng tin c\u1EA5p \u0111\u1ED9 3 theo Ngh\u1ECB \u0111\u1ECBnh 85/2016/N\u0110-CP.
- C\u1ED5ng thanh to\xE1n k\u1EBFt n\u1ED1i th\u1EBB ph\u1EA3i tu\xE2n th\u1EE7 ch\u1EE9ng ch\u1EC9 b\u1EA3o m\u1EADt PCI-DSS Level 1.`;
var financialAndCommercialKnowledgeBase = `KI\u1EBEN TH\u1EE8C T\xC0I CH\xCDNH, DOANH THU, C\u01A0 CH\u1EBE THU TI\u1EC0N, \u0110\u1EA6U L\u01AF\u01A0NG & L\u1EE2I NHU\u1EACN (PH\u1EA2N BI\u1EC6N H\u1ED8I \u0110\u1ED2NG TH\u1EA6Y GI\xC1O & NH\xC0 \u0110\u1EA6U T\u01AF):

1. C\u01A0 CH\u1EBE THU TI\u1EC0N: TR\u1EA2 CHO C\xD4NG TY HAY TR\u1EA2 TH\u1EB2NG CHO LU\u1EACT S\u01AF? TR\u1EA2 BAO NHI\xCAU TI\u1EC0N?
- NGUY\xCAN T\u1EAEC PH\xC1P L\xDD B\u1EAET BU\u1ED8C:
  + C\u0103n c\u1EE9 \u0110i\u1EC1u 54, 55 Lu\u1EADt Lu\u1EADt s\u01B0 2006 (s\u1EEDa \u0111\u1ED5i, b\u1ED5 sung 2012) v\xE0 B\u1ED9 Quy t\u1EAFc \u0110\u1EA1o \u0111\u1EE9c v\xE0 \u1EE8ng x\u1EED ngh\u1EC1 nghi\u1EC7p Lu\u1EADt s\u01B0 Vi\u1EC7t Nam: H\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5 ph\xE1p l\xFD B\u1EAET BU\u1ED8C k\xFD k\u1EBFt gi\u1EEFa Kh\xE1ch h\xE0ng v\xE0 T\u1ED4 CH\u1EE8C H\xC0NH NGH\u1EC0 LU\u1EACT S\u01AF (H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal - ph\xE1p nh\xE2n ch\xEDnh th\u1EE9c).
  + M\u1ECCI KHO\u1EA2N TI\u1EC0N TH\xD9 LAO V\xC0 CHI PH\xCD PH\u1EA2I CHUY\u1EC2N KHO\u1EA2N TR\u1EF0C TI\u1EBEP V\xC0O T\xC0I KHO\u1EA2N NG\xC2N H\xC0NG C\u1EE6A C\xD4NG TY LU\u1EACT TH\u1ECANH V\u01AF\u1EE2NG LEGAL. C\xF4ng ty xu\u1EA5t h\xF3a \u0111\u01A1n gi\xE1 tr\u1ECB gia t\u0103ng (VAT \u0111i\u1EC7n t\u1EED) h\u1EE3p ph\xE1p cho kh\xE1ch h\xE0ng.
  + TUY\u1EC6T \u0110\u1ED0I NGHI\xCAM C\u1EA4M TR\u1EA2 TH\u1EB2NG CHO LU\u1EACT S\u01AF HO\u1EB6C TH\xC0NH VI\xCAN C\xC1 NH\xC2N.
- T\u1EA0I SAO KH\xD4NG TR\u1EA2 TH\u1EB2NG CHO LU\u1EACT S\u01AF C\xC1 NH\xC2N?
  (1) Tr\xE1ch nhi\u1EC7m ph\xE1p l\xFD & B\u1EA3o hi\u1EC3m: H\xE3ng lu\u1EADt ch\u1ECBu tr\xE1ch nhi\u1EC7m v\xF4 h\u1EA1n ho\u1EB7c trong ph\u1EA1m vi t\xE0i s\u1EA3n c\u1EE7a t\u1ED5 ch\u1EE9c, \u0111\u1ED3ng th\u1EDDi c\xF3 B\u1EA3o hi\u1EC3m tr\xE1ch nhi\u1EC7m ngh\u1EC1 nghi\u1EC7p lu\u1EADt s\u01B0 b\u1ED3i th\u01B0\u1EDDng cho kh\xE1ch h\xE0ng n\u1EBFu c\xF3 s\u01A1 su\u1EA5t k\u1EF9 thu\u1EADt. Lu\u1EADt s\u01B0 c\xE1 nh\xE2n kh\xF4ng c\xF3 \u0111\u1EE7 n\u0103ng l\u1EF1c t\xE0i ch\xEDnh b\u1EA3o \u0111\u1EA3m.
  (2) Kh\u1EA5u tr\u1EEB chi ph\xED thu\u1EBF TNDN: Doanh nghi\u1EC7p ch\u1EC9 \u0111\u01B0\u1EE3c t\xEDnh v\xE0o chi ph\xED h\u1EE3p l\xFD khi c\xF3 H\u1EE3p \u0111\u1ED3ng v\u1EDBi H\xE3ng lu\u1EADt k\xE8m H\xF3a \u0111\u01A1n \u0111i\u1EC7n t\u1EED VAT v\xE0 ch\u1EE9ng t\u1EEB thanh to\xE1n qua ng\xE2n h\xE0ng (ch\u1EE9ng t\u1EEB kh\xF4ng d\xF9ng ti\u1EC1n m\u1EB7t theo Lu\u1EADt Qu\u1EA3n l\xFD thu\u1EBF).
  (3) \u0110\u1EA1o \u0111\u1EE9c ngh\u1EC1 nghi\u1EC7p: Lu\u1EADt s\u01B0 nh\u1EADn ti\u1EC1n ri\xEAng ngo\xE0i h\u1EE3p \u0111\u1ED3ng l\xE0 h\xE0nh vi vi ph\u1EA1m k\u1EF7 lu\u1EADt \u0110o\xE0n Lu\u1EADt s\u01B0, c\xF3 th\u1EC3 b\u1ECB t\u01B0\u1EDBc ch\u1EE9ng ch\u1EC9 h\xE0nh ngh\u1EC1.

2. BI\u1EC2U PH\xCD D\u1ECACH V\u1EE4 TH\u1EF0C T\u1EBE & L\u1ED8 TR\xCCNH THANH TO\xC1N THEO TI\u1EBEN \u0110\u1ED8 (MILESTONE BILLING):
- M\u1EE9c ph\xED d\u1ECBch v\u1EE5 t\u01B0 v\u1EA5n c\u1EA5p ph\xE9p trung gian thanh to\xE1n v\xED \u0111i\u1EC7n t\u1EED tr\u1ECDn g\xF3i:
  + G\xF3i chu\u1EA9n (Doanh nghi\u1EC7p \u0111\xE3 s\u1EB5n s\xE0ng h\u1EA1 t\u1EA7ng CNTT): 350.000.000 - 450.000.000 VN\u0110.
  + G\xF3i to\xE0n di\u1EC7n (Setup h\u1ED3 s\u01A1 v\u1ED1n 50 t\u1EF7, \u0111\u1EC1 \xE1n an to\xE0n c\u1EA5p \u0111\u1ED9 3, so\u1EA1n th\u1EA3o 20 h\u1EE3p \u0111\u1ED3ng, eKYC, \u0111\u1ED3ng h\xE0nh gi\u1EA3i tr\xECnh NHNN): 500.000.000 - 650.000.000 VN\u0110.
- G\xF3i chu\u1EA9n h\xF3a to\xE0n di\u1EC7n 20 m\u1EABu h\u1EE3p \u0111\u1ED3ng c\u1ED1t l\xF5i: 80.000.000 - 150.000.000 VN\u0110.
- Ph\xED t\u01B0 v\u1EA5n ph\xE1p l\xFD th\u01B0\u1EDDng xuy\xEAn (Retainer Fee h\xE0ng th\xE1ng): 25.000.000 - 45.000.000 VN\u0110/th\xE1ng.
- L\u1ED9 tr\xECnh gi\u1EA3i ng\xE2n 5 \u0111\u1EE3t theo m\u1ED1c nghi\u1EC7m thu r\xF5 r\xE0ng (kh\xF4ng thu d\u1ED3n 1 l\u1EA7n, an t\xE2m \u0111\xF4i b\xEAn):
  + \u0110\u1EE3t 1 (30%): T\u1EA1m \u1EE9ng ngay sau khi k\xFD H\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5 ph\xE1p l\xFD v\xE0 th\u1ED1ng nh\u1EA5t \u0111\u1EC1 c\u01B0\u01A1ng gi\u1EA3i ph\xE1p.
  + \u0110\u1EE3t 2 (20%): Sau khi ho\xE0n th\xE0nh b\u1ED9 20 h\u1EE3p \u0111\u1ED3ng, h\u1ED3 s\u01A1 v\u1ED1n 50 t\u1EF7 v\xE0 c\u01A1 c\u1EA5u nh\xE2n s\u1EF1 ch\u1EE7 ch\u1ED1t.
  + \u0110\u1EE3t 3 (20%): Sau khi th\u1EA9m \u0111\u1ECBnh \u0111\u1EC1 \xE1n an to\xE0n c\u1EA5p \u0111\u1ED9 3, quy tr\xECnh eKYC v\xE0 n\u1ED9p h\u1ED3 s\u01A1 ch\xEDnh th\u1EE9c t\u1EA1i NHNN (c\xF3 gi\u1EA5y bi\xEAn nh\u1EADn n\u1ED9p l\u01B0u).
  + \u0110\u1EE3t 4 (20%): Sau khi NHNN ki\u1EC3m tra th\u1EF1c t\u1EBF \u0111i\u1EC1u ki\u1EC7n c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t, h\u1EA1 t\u1EA7ng k\u1EF9 thu\u1EADt v\xE0 gi\u1EA3i tr\xECnh xong c\xE1c n\u1ED9i dung y\xEAu c\u1EA7u.
  + \u0110\u1EE3t 5 (10%): Sau khi NHNN trao Gi\u1EA5y ph\xE9p cung \u1EE9ng d\u1ECBch v\u1EE5 trung gian thanh to\xE1n ch\xEDnh th\u1EE9c.

3. C\u01A0 C\u1EA4U \u0110\u1EA6U L\u01AF\u01A0NG & PH\xC2N B\u1ED4 THU NH\u1EACP 12 TH\xC0NH VI\xCAN BAN NGHI\xCAN C\u1EE8U/LU\u1EACT S\u01AF:
- \xC1p d\u1EE5ng m\xF4 h\xECnh chu\u1EA9n 4 t\u1EA7ng thu nh\u1EADp c\u1EE7a c\xE1c h\xE3ng lu\u1EADt qu\u1ED1c t\u1EBF (Partner - Associate Model):
  (1) L\u01AF\u01A0NG C\u1EE8NG V\u1ECA TR\xCD (BASE SALARY - Chi tr\u1EA3 c\u1ED1 \u0111\u1ECBnh h\xE0ng th\xE1ng):
      - Ch\u1EE7 nhi\u1EC7m d\u1EF1 \xE1n / Managing Partner (V\u0169 Anh Qu\xE2n): 35.000.000 - 45.000.000 VN\u0110/th\xE1ng (ch\u1ECBu tr\xE1ch nhi\u1EC7m ph\xE1p l\xFD cao nh\u1EA5t, \u0111i\u1EC1u ph\u1ED1i t\u1ED5ng th\u1EC3, \u0111\u1ED1i ngo\u1EA1i v\xE0 k\xFD duy\u1EC7t h\u1ED3 s\u01A1).
      - Lu\u1EADt s\u01B0 th\xE0nh vi\xEAn c\u1EA5p cao / Senior Partner (Ki\u1EC1u Ho\xE0i Thu, Tr\u1EA7n Th\u1ECB Th\u01A1, L\xEA Ph\u01B0\u01A1ng Th\u1EA3o, L\xEA Th\u1ECB H\u1ED3ng Nhung): 25.000.000 - 32.000.000 VN\u0110/th\xE1ng (ph\u1EE5 tr\xE1ch c\xE1c tr\u1EE5 c\u1ED9t: V\u1ED1n 50 t\u1EF7, H\u1EE3p \u0111\u1ED3ng ng\u01B0\u1EDDi d\xF9ng/gi\xE1m \u0111\u1ED1c, Lao \u0111\u1ED9ng/Li\xEAn k\u1EBFt ng\xE2n h\xE0ng, Cloud/Merchant).
      - Lu\u1EADt s\u01B0 chuy\xEAn tr\xE1ch / Associate (Ph\u1EA1m D\u1EA1 Th\u1EA3o, Nguy\u1EC5n Huy Th\xE1i, Ph\u1EA1m V\u0103n Quang, Tr\u1EA7n Th\u1ECB Th\xF9y, V\u01B0\u01A1ng Thu Th\u1EE7y, V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o, \u0110o\xE0n Anh Ph\u01B0\u01A1ng): 16.000.000 - 22.000.000 VN\u0110/th\xE1ng (chuy\xEAn tr\xE1ch so\u1EA1n th\u1EA3o, r\xE0 so\xE1t \u0111i\u1EC1u kho\u1EA3n, DPIA d\u1EEF li\u1EC7u c\xE1 nh\xE2n, k\xFD qu\u1EF9 1:1, tra so\xE1t s\u1EF1 c\u1ED1, an ninh m\xE3 ngu\u1ED3n, nghi\xEAn c\u1EE9u th\u1ECB tr\u01B0\u1EDDng).
      - Tr\u1EE3 l\xFD ph\xE1p l\xFD & Th\u1EF1c t\u1EADp sinh: 6.000.000 - 9.000.000 VN\u0110/th\xE1ng.
  (2) TH\xD9 LAO THEO V\u1EE4 VI\u1EC6C / D\u1EF0 \xC1N (PROJECT SUCCESS FEE):
      - Tr\xEDch 20% - 30% gi\xE1 tr\u1ECB h\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5 \u0111\xE3 nghi\u1EC7m thu \u0111\u1EC3 chia cho nh\xF3m tr\u1EF1c ti\u1EBFp th\u1EE5 l\xFD d\u1EF1 \xE1n d\u1EF1a tr\xEAn s\u1ED1 gi\u1EDD l\xE0m vi\u1EC7c (Man-hours) v\xE0 h\u1EC7 s\u1ED1 \u0111\xF3ng g\xF3p chuy\xEAn m\xF4n.
  (3) TH\u01AF\u1EDENG KINH DOANH & HI\u1EC6U SU\u1EA4T (BUSINESS DEV & PERFORMANCE BONUS):
      - Th\u01B0\u1EDFng 5% - 10% doanh thu h\u1EE3p \u0111\u1ED3ng n\u1EBFu th\xE0nh vi\xEAn tr\u1EF1c ti\u1EBFp khai th\xE1c ho\u1EB7c k\u1EBFt n\u1ED1i kh\xE1ch h\xE0ng doanh nghi\u1EC7p m\u1EDBi.
      - Th\u01B0\u1EDFng KPI khi ho\xE0n th\xE0nh h\u1ED3 s\u01A1 v\u01B0\u1EE3t ti\u1EBFn \u0111\u1ED9 ho\u1EB7c x\u1EED l\xFD th\xE0nh c\xF4ng v\u1EE5 vi\u1EC7c tranh ch\u1EA5p ph\u1EE9c t\u1EA1p.
  (4) L\u1EE2I NHU\u1EACN R\xD2NG & C\u1ED4 T\u1EE8C CU\u1ED0I N\u0102M (EQUITY DIVIDENDS):
      - Sau khi tr\u1EEB chi ph\xED v\u1EADn h\xE0nh (thu\xEA v\u0103n ph\xF2ng Bitexco/Lotte Center, thu\u1EBF TNDN 20%, chi ph\xED n\u1EC1n t\u1EA3ng AI/c\xF4ng ngh\u1EC7, tr\xEDch Qu\u1EF9 d\u1EF1 ph\xF2ng r\u1EE7i ro ngh\u1EC1 nghi\u1EC7p 10%), to\xE0n b\u1ED9 l\u1EE3i nhu\u1EADn r\xF2ng \u0111\u01B0\u1EE3c chia theo t\u1EF7 l\u1EC7 v\u1ED1n g\xF3p c\u1EE7a c\xE1c Partner s\xE1ng l\u1EADp.

4. CHI\u1EBEN L\u01AF\u1EE2C T\u1EA0O DOANH THU & SINH L\u1EE2I NHU\u1EACN TRONG TH\u1EDCI GIAN CH\u1EDC C\u1EA4P PH\xC9P NHNN (6 - 12 TH\xC1NG):
- H\u1ECEI: Th\u1EDDi gian xin c\u1EA5p ph\xE9p t\u1EA1i NHNN m\u1EA5t 6 \u0111\u1EBFn 12 th\xE1ng, trong l\xFAc \u0111\u1EE3i h\u1ED3 s\u01A1 th\xEC l\xE0m th\u1EBF n\xE0o \u0111\u1EC3 v\u1EABn ki\u1EBFm \u0111\u01B0\u1EE3c ti\u1EC1n v\xE0 sinh l\u1EE3i nhu\u1EADn?
- TR\u1EA2 L\u1EDCI CHO C\u1EA2 2 PH\xCDA:

  A. \u0110\u1ED0I V\u1EDAI H\xC3NG LU\u1EACT TH\u1ECANH V\u01AF\u1EE2NG LEGAL:
  1) D\xF2ng ti\u1EC1n theo m\u1ED1c (Milestone Billing): Thu 50% - 70% t\u1ED5ng gi\xE1 tr\u1ECB h\u1EE3p \u0111\u1ED3ng ngay trong c\xE1c giai \u0111o\u1EA1n \u0111\u1EA7u khi ho\xE0n th\xE0nh vi\u1EC7c chu\u1EA9n b\u1ECB v\xE0 n\u1ED9p h\u1ED3 s\u01A1 h\u1EE3p l\u1EC7. Ti\u1EC1n v\u1EC1 li\xEAn t\u1EE5c ch\u1EE9 kh\xF4ng ph\u1EA3i ch\u1EDD \u0111\u1EBFn khi c\xF3 gi\u1EA5y ph\xE9p m\u1EDBi \u0111\u01B0\u1EE3c thu.
  2) H\u1EE3p \u0111\u1ED3ng t\u01B0 v\u1EA5n ph\xE1p l\xFD th\u01B0\u1EDDng xuy\xEAn (Retainer): Thu \u0111\u1EC1u \u0111\u1EB7n 25 - 45 tri\u1EC7u VN\u0110/th\xE1ng trong su\u1ED1t 6-12 th\xE1ng ch\u1EDD \u0111\u1EE3i \u0111\u1EC3 gi\u1EA3i tr\xECnh h\u1ED3 s\u01A1 theo c\xF4ng v\u0103n NHNN, r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng nh\xE2n s\u1EF1, x\xE2y d\u1EF1ng quy ch\u1EBF n\u1ED9i b\u1ED9.
  3) \u0110a d\u1EA1ng h\xF3a danh m\u1EE5c d\u1ECBch v\u1EE5:
     - D\u1ECBch v\u1EE5 l\u1EADp B\xE1o c\xE1o \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng x\u1EED l\xFD d\u1EEF li\u1EC7u c\xE1 nh\xE2n (DPIA) theo Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15 cho c\xE1c \u0111\u1ED1i t\xE1c TM\u0110T, b\xE1n l\u1EBB, t\xE0i ch\xEDnh (30 - 60 tri\u1EC7u/h\u1ED3 s\u01A1).
     - R\xE0 so\xE1t \u0111i\u1EC1u kho\u1EA3n h\u1EE3p \u0111\u1ED3ng cho c\xE1c Merchant li\xEAn k\u1EBFt (3 - 8 tri\u1EC7u/h\u1EE3p \u0111\u1ED3ng).
     - \u0110\xE0o t\u1EA1o tu\xE2n th\u1EE7 ph\xF2ng ch\u1ED1ng r\u1EEDa ti\u1EC1n (AML/CFT) v\xE0 b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u n\u1ED9i b\u1ED9.
     - Cung c\u1EA5p gi\u1EA3i ph\xE1p N\u1EC1n t\u1EA3ng AI Legal Copilot & Th\u01B0 vi\u1EC7n 20 m\u1EABu h\u1EE3p \u0111\u1ED3ng b\u1EA3n quy\u1EC1n cho c\xE1c doanh nghi\u1EC7p v\u1EEBa v\xE0 nh\u1ECF (m\xF4 h\xECnh SaaS).

  B. \u0110\u1ED0I V\u1EDAI DOANH NGHI\u1EC6P / STARTUP V\xCD \u0110I\u1EC6N T\u1EEC (KH\xC1CH H\xC0NG / NH\xC0 \u0110\u1EA6U T\u01AF):
  1) M\xF4 h\xECnh H\u1EE3p t\xE1c Kinh doanh (H\u1EE3p \u0111\u1ED3ng BCC - Business Cooperation Contract):
     - K\xFD h\u1EE3p \u0111\u1ED3ng BCC v\u1EDBi m\u1ED9t t\u1ED5 ch\u1EE9c Trung gian thanh to\xE1n ho\u1EB7c Ng\xE2n h\xE0ng \u0110\xC3 C\xD3 GI\u1EA4Y PH\xC9P \u0110\u1EA6Y \u0110\u1EE6 \u0111\u1EC3 ph\xE1t tri\u1EC3n th\u1ECB tr\u01B0\u1EDDng v\xE0 k\u1EBFt n\u1ED1i c\xE1c \u0111\u01A1n v\u1ECB ch\u1EA5p nh\u1EADn thanh to\xE1n (Merchant). Doanh nghi\u1EC7p v\xED thu \u0111\u01B0\u1EE3c ph\xED d\u1ECBch v\u1EE5 c\xF4ng ngh\u1EC7 v\xE0 chia s\u1EBB hoa h\u1ED3ng giao d\u1ECBch t\u1EEB s\u1EDBm, \u0111\u1ED3ng th\u1EDDi x\xE2y d\u1EF1ng tr\u01B0\u1EDBc t\u1EC7p kh\xE1ch h\xE0ng m\xE0 kh\xF4ng vi ph\u1EA1m quy \u0111\u1ECBnh ph\xE1p lu\u1EADt.
  2) Cung c\u1EA5p gi\u1EA3i ph\xE1p ph\u1EA7n m\u1EC1m qu\u1EA3n tr\u1ECB b\xE1n h\xE0ng & Loyalty (Tech Enabler):
     - Khai th\xE1c m\u1EA3ng c\xF4ng ngh\u1EC7: B\xE1n ph\u1EA7n m\u1EC1m qu\u1EA3n l\xFD \u0111\u01A1n h\xE0ng POS, gi\u1EA3i ph\xE1p t\xEDch h\u1EE3p h\xF3a \u0111\u01A1n \u0111i\u1EC7n t\u1EED, t\xEDch \u0111i\u1EC3m th\u01B0\u1EDFng Loyalty cho c\xE1c chu\u1ED7i b\xE1n l\u1EBB. Doanh thu ph\u1EA7n m\u1EC1m (SaaS) ph\xE1t sinh ngay l\u1EADp t\u1EE9c.
  3) T\u1ED1i \u01B0u h\xF3a l\u1EE3i t\u1EE9c t\u1EEB ngu\u1ED3n v\u1ED1n \u0111i\u1EC1u l\u1EC7 50 t\u1EF7 \u0111\u1ED3ng th\u1EF1c g\xF3p:
     - Trong th\u1EDDi gian th\u1EA9m duy\u1EC7t h\u1ED3 s\u01A1, kho\u1EA3n v\u1ED1n 50 t\u1EF7 \u0111\u1ED3ng \u0111\u01B0\u1EE3c g\u1EEDi ti\u1EBFt ki\u1EC7m k\u1EF3 h\u1EA1n ng\u1EAFn linh ho\u1EA1t (1 - 3 th\xE1ng) ho\u1EB7c ch\u1EE9ng ch\u1EC9 ti\u1EC1n g\u1EEDi t\u1EA1i c\xE1c Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i l\u1EDBn. V\u1EDBi m\u1EE9c l\xE3i su\u1EA5t 4.5% - 5.5%/n\u0103m, kho\u1EA3n ti\u1EC1n n\xE0y t\u1EA1o ra d\xF2ng ti\u1EC1n l\xE3i t\u1EEB 180.000.000 - 230.000.000 VN\u0110/th\xE1ng, \u0111\u1EE7 \u0111\u1EC3 chi tr\u1EA3 to\xE0n b\u1ED9 ti\u1EC1n thu\xEA v\u0103n ph\xF2ng v\xE0 duy tr\xEC \u0111\u1ED9i ng\u0169 R&D n\xF2ng c\u1ED1t!
  4) X\xE2y d\u1EF1ng m\u1EA1ng l\u01B0\u1EDBi Merchant v\xE0 gia t\u0103ng \u0111\u1ECBnh gi\xE1 \u0111\u1EC3 g\u1ECDi v\u1ED1n (Valuation Growth):
     - Doanh nghi\u1EC7p k\xFD k\u1EBFt h\xE0ng lo\u1EA1t Bi\xEAn b\u1EA3n ghi nh\u1EDB (MOU) v\xE0 H\u1EE3p \u0111\u1ED3ng nguy\xEAn t\u1EAFc v\u1EDBi \u0111\u1ED1i t\xE1c b\xE1n h\xE0ng, chu\u1EA9n b\u1ECB s\u1EB5n t\u1EC7p ng\u01B0\u1EDDi d\xF9ng s\u1EB5n s\xE0ng k\xEDch ho\u1EA1t ngay khi gi\u1EA5y ph\xE9p \u0111\u01B0\u1EE3c trao. \u0110i\u1EC1u n\xE0y gi\xFAp n\xE2ng cao \u0111\u1ECBnh gi\xE1 doanh nghi\u1EC7p v\xE0 g\u1ECDi v\u1ED1n c\xE1c v\xF2ng h\u1EA1t gi\u1ED1ng / Pre-Series A t\u1EEB c\xE1c qu\u1EF9 \u0111\u1EA7u t\u01B0 m\u1EA1o hi\u1EC3m ngay trong giai \u0111o\u1EA1n ch\u1EDD c\u1EA5p ph\xE9p.

5. B\u1ED8 K\u1ECACH B\u1EA2N TR\u1EA2 L\u1EDCI PH\u1EA2N BI\u1EC6N KHI TH\u1EA6Y GI\xC1O & NH\xC0 \u0110\u1EA6U T\u01AF "XOAY" C\xC2U H\u1ECEI:
- C\xC2U H\u1ECEI: "T\u1EA1i sao kh\xF4ng \u0111\u1EC3 kh\xE1ch h\xE0ng tr\u1EA3 ti\u1EC1n th\u1EB3ng cho Lu\u1EADt s\u01B0 tr\u1EF1c ti\u1EBFp l\xE0m vi\u1EC7c \u0111\u1EC3 gi\u1EA3m 10% - 20% chi ph\xED?"
  -> TR\u1EA2 L\u1EDCI: Tr\u1EA3 th\u1EB3ng cho c\xE1 nh\xE2n l\xE0 vi ph\u1EA1m ph\xE1p lu\u1EADt (Lu\u1EADt Lu\u1EADt s\u01B0) v\xE0 quy t\u1EAFc \u0111\u1EA1o \u0111\u1EE9c. C\xE1 nh\xE2n lu\u1EADt s\u01B0 kh\xF4ng c\xF3 b\u1EA3o hi\u1EC3m tr\xE1ch nhi\u1EC7m ngh\u1EC1 nghi\u1EC7p v\xE0 kh\xF4ng th\u1EC3 xu\u1EA5t h\xF3a \u0111\u01A1n VAT \u0111\u1EC3 doanh nghi\u1EC7p h\u1EA1ch to\xE1n chi ph\xED h\u1EE3p l\xFD. Khi c\xF3 r\u1EE7i ro ph\xE1p l\xFD, kh\xE1ch h\xE0ng s\u1EBD ch\u1ECBu thi\u1EC7t h\u1EA1i l\u1EDBn.
- C\xC2U H\u1ECEI: "N\u1EBFu h\u1ED3 s\u01A1 b\u1ECB NHNN y\xEAu c\u1EA7u s\u1EEDa \u0111\u1ED5i, b\u1ED5 sung 2 - 3 l\u1EA7n k\xE9o d\xE0i c\u1EA3 n\u0103m th\xEC chi ph\xED ph\xE1t sinh ai ch\u1ECBu?"
  -> TR\u1EA2 L\u1EDCI: H\u1EE3p \u0111\u1ED3ng c\u1EE7a Th\u1ECBnh V\u01B0\u1EE3ng Legal cam k\u1EBFt "\u0110\u1ED3ng h\xE0nh tr\u1ECDn g\xF3i \u0111\u1EBFn khi c\xF3 k\u1EBFt qu\u1EA3 cu\u1ED1i c\xF9ng". M\u1ECDi v\u0103n b\u1EA3n gi\u1EA3i tr\xECnh, b\u1ED5 sung theo y\xEAu c\u1EA7u ch\xEDnh th\u1EE9c c\u1EE7a NHNN \u0111\u1EC1u n\u1EB1m trong ph\u1EA1m vi d\u1ECBch v\u1EE5 tr\u1ECDn g\xF3i \u0111\xE3 th\u1ECFa thu\u1EADn, kh\xF4ng ph\xE1t sinh ph\u1EE5 ph\xED b\u1EA5t h\u1EE3p l\xFD.
- C\xC2U H\u1ECEI: "\u0110i\u1EC3m h\xF2a v\u1ED1n (Break-even point) c\u1EE7a H\xE3ng lu\u1EADt \u0111\u1EA1t \u0111\u01B0\u1EE3c sau bao l\xE2u?"
  -> TR\u1EA2 L\u1EDCI: V\u1EDBi chi ph\xED c\u1ED1 \u0111\u1ECBnh kho\u1EA3ng 180 - 250 tri\u1EC7u/th\xE1ng (l\u01B0\u01A1ng c\u1EE9ng c\u01A1 b\u1EA3n + thu\xEA v\u0103n ph\xF2ng Bitexco/Lotte Center), H\xE3ng lu\u1EADt ch\u1EC9 c\u1EA7n duy tr\xEC 01 h\u1EE3p \u0111\u1ED3ng c\u1EA5p ph\xE9p tr\u1ECDn g\xF3i/qu\xFD k\u1EBFt h\u1EE3p 04-06 kh\xE1ch h\xE0ng t\u01B0 v\u1EA5n th\u01B0\u1EDDng xuy\xEAn (Retainer) l\xE0 \u0111\xE3 \u0111\u1EA1t \u0111i\u1EC3m h\xF2a v\u1ED1n ngay t\u1EEB th\xE1ng th\u1EE9 4 v\u1EADn h\xE0nh.`;
function getReqApiKey(req) {
  const headerKey = req.headers["x-gemini-key"];
  if (typeof headerKey === "string" && headerKey.trim().length > 8) {
    return headerKey.trim();
  }
  const bodyKey = req.body?.apiKey;
  if (typeof bodyKey === "string" && bodyKey.trim().length > 8) {
    return bodyKey.trim();
  }
  return void 0;
}
var openaiQuotaExhausted = false;
async function callLegalAI(systemPrompt, userPrompt, customApiKey) {
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const modelsToTry = [
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest"
      ];
      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `${systemPrompt}

---

${userPrompt}`
          });
          if (response && response.text) {
            return response.text;
          }
        } catch {
          continue;
        }
      }
    } catch (err) {
      console.warn("Gemini call encountered issue, attempting secondary fallback:", err);
    }
  }
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.trim() !== "" && !openaiQuotaExhausted) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2
      });
      const content = completion.choices[0]?.message?.content;
      if (content) return content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("429") || errorMessage.includes("credits") || errorMessage.includes("quota")) {
        openaiQuotaExhausted = true;
      }
    }
  }
  return null;
}
async function streamLegalAI(res, systemPrompt, userPrompt, fallbackText, customApiKey) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const modelsToTry = [
        "gemini-3.6-flash",
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest"
      ];
      for (const model of modelsToTry) {
        try {
          const stream = await ai.models.generateContentStream({
            model,
            contents: `${systemPrompt}

---

${userPrompt}`
          });
          let hasChunk = false;
          for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
              hasChunk = true;
              res.write(`data: ${JSON.stringify({ chunk: chunkText, mode: "ai" })}

`);
            }
          }
          if (hasChunk) {
            res.write(`data: ${JSON.stringify({ done: true, mode: "ai" })}

`);
            return res.end();
          }
        } catch {
          continue;
        }
      }
    } catch (err) {
      console.warn("Gemini stream error, falling back:", err);
    }
  }
  const words = fallbackText.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const slice = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ chunk: slice, mode: "demo" })}

`);
    await new Promise((r) => setTimeout(r, 20));
  }
  res.write(`data: ${JSON.stringify({ done: true, mode: "demo" })}

`);
  return res.end();
}
app.get("/api/ai-status", async (req, res) => {
  const reqKey = getReqApiKey(req);
  const geminiKey = reqKey || process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(geminiKey && geminiKey.trim() !== "" && geminiKey !== "MY_GEMINI_API_KEY");
  res.json({
    connected: isKeyConfigured,
    provider: "Google Gemini",
    model: "gemini-3.6-flash",
    isCustomKey: Boolean(reqKey),
    status: isKeyConfigured ? "online" : "unconfigured",
    message: isKeyConfigured ? "\u0110\xE3 k\u1EBFt n\u1ED1i Google Gemini API ch\xEDnh th\u1EE9c (S\u1EB5n s\xE0ng ph\u1EE5c v\u1EE5)" : "Ch\u01B0a c\u1EA5u h\xECnh kh\xF3a API trong m\xF4i tr\u01B0\u1EDDng"
  });
});
app.post("/api/ai-ping", async (req, res) => {
  const reqKey = getReqApiKey(req);
  const geminiKey = reqKey || process.env.GEMINI_API_KEY;
  if (!geminiKey || geminiKey.trim() === "" || geminiKey === "MY_GEMINI_API_KEY") {
    return res.status(400).json({ ok: false, error: "Ch\u01B0a c\xF3 kh\xF3a Gemini API trong h\u1EC7 th\u1ED1ng." });
  }
  const startTime = Date.now();
  try {
    const ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" }
      }
    });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: 'Tr\u1EA3 l\u1EDDi \u0111\xFAng 3 t\u1EEB: "K\u1EBFt n\u1ED1i th\xE0nh c\xF4ng"'
    });
    const latencyMs = Date.now() - startTime;
    return res.json({
      ok: true,
      model: "gemini-3.6-flash",
      latencyMs,
      reply: response.text?.trim() || "K\u1EBFt n\u1ED1i th\xE0nh c\xF4ng",
      provider: "Google Gemini API (Official)"
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ ok: false, error: msg });
  }
});
app.post("/api/legal-assistant", async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { message, selectedText } = req.body || {};
    const textMsg = typeof message === "string" ? message.trim() : "";
    const textSelected = typeof selectedText === "string" ? selectedText.trim().slice(0, 3e3) : "";
    if (!textMsg || textMsg.length > 1500) {
      return res.status(400).json({ error: "C\xE2u h\u1ECFi ph\u1EA3i c\xF3 t\u1EEB 1 \u0111\u1EBFn 1.500 k\xFD t\u1EF1." });
    }
    const systemPrompt = `B\u1EA1n l\xE0 Tr\u1EE3 l\xFD AI Ph\xE1p l\xFD & \u0110\u1EA1i di\u1EC7n T\u01B0 v\u1EA5n c\u1EA5p cao c\u1EE7a H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal (thu\u1ED9c \u0110\u1EC1 \xE1n Nghi\xEAn c\u1EE9u Ph\xE1p l\xFD Fintech & V\xED \u0111i\u1EC7n t\u1EED - Nh\xF3m 13).
Nhi\u1EC7m v\u1EE5 v\xE0 ph\u1EA1m vi gi\u1EA3i \u0111\xE1p c\u1EE7a b\u1EA1n:
1. T\u01AF V\u1EA4N TH\u1EF0C CHI\u1EBEN V\u1EC0 T\xC0I CH\xCDNH, TI\u1EC0N B\u1EA0C, TH\xD9 LAO & L\u1EE2I NHU\u1EACN (PH\u1EA2N BI\u1EC6N H\u1ED8I \u0110\u1ED2NG TH\u1EA6Y GI\xC1O & NH\xC0 \u0110\u1EA6U T\u01AF):
   - Khi th\u1EA7y gi\xE1o ho\u1EB7c nh\xE0 \u0111\u1EA7u t\u01B0 h\u1ECFi v\u1EC1 TI\u1EC0N, BI\u1EC2U PH\xCD, D\xD2NG TI\u1EC0N, H\xC3Y TR\u1EA2 L\u1EDCI C\u1EF0C K\u1EF2 S\u1EAEC B\xC9N V\xC0 CH\u1EAEC CH\u1EAEN:
     + Tr\u1EA3 ti\u1EC1n cho ai: Kh\xE1ch h\xE0ng B\u1EAET BU\u1ED8C k\xFD h\u1EE3p \u0111\u1ED3ng v\u1EDBi H\xE3ng lu\u1EADt (ph\xE1p nh\xE2n) v\xE0 chuy\u1EC3n kho\u1EA3n v\xE0o T\xC0I KHO\u1EA2N C\u1EE6A C\xD4NG TY LU\u1EACT TH\u1ECANH V\u01AF\u1EE2NG LEGAL, c\xF3 xu\u1EA5t h\xF3a \u0111\u01A1n VAT \u0111i\u1EC7n t\u1EED theo \u0110i\u1EC1u 54, 55 Lu\u1EADt Lu\u1EADt s\u01B0 2006 (s\u1EEDa \u0111\u1ED5i 2012). TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0110\u01AF\u1EE2C TR\u1EA2 TH\u1EB2NG CHO LU\u1EACT S\u01AF/TH\xC0NH VI\xCAN C\xC1 NH\xC2N (vi ph\u1EA1m \u0111\u1EA1o \u0111\u1EE9c, r\u1EE7i ro kh\xF4ng c\xF3 b\u1EA3o hi\u1EC3m tr\xE1ch nhi\u1EC7m ngh\u1EC1 nghi\u1EC7p v\xE0 kh\xF4ng \u0111\u01B0\u1EE3c tr\u1EEB thu\u1EBF).
     + Tr\u1EA3 bao nhi\xEAu ti\u1EC1n: G\xF3i c\u1EA5p ph\xE9p tr\u1ECDn g\xF3i 350 - 650 tri\u1EC7u VN\u0110 (chia 5 \u0111\u1EE3t theo m\u1ED1c ti\u1EBFn \u0111\u1ED9: 30% - 20% - 20% - 20% - 10%); G\xF3i 20 h\u1EE3p \u0111\u1ED3ng chu\u1EA9n h\xF3a 80 - 150 tri\u1EC7u; T\u01B0 v\u1EA5n th\u01B0\u1EDDng xuy\xEAn retainer 25 - 45 tri\u1EC7u/th\xE1ng.
     + C\xE1c \u0111\u1EA7u l\u01B0\u01A1ng c\u1EE7a 12 th\xE0nh vi\xEAn: M\xF4 h\xECnh 4 t\u1EA7ng (L\u01B0\u01A1ng c\u1EE9ng Base Salary 35-45tr cho Ch\u1EE7 nhi\u1EC7m V\u0169 Anh Qu\xE2n, 25-32tr cho 4 Senior Partner, 16-22tr cho 7 Associate, 6-9tr tr\u1EE3 l\xFD; Th\xF9 lao v\u1EE5 vi\u1EC7c Case Fee 20-30% doanh thu d\u1EF1 \xE1n; Th\u01B0\u1EDFng kinh doanh Business Dev 5-10%; C\u1ED5 t\u1EE9c l\u1EE3i nhu\u1EADn r\xF2ng cu\u1ED1i n\u0103m).
     + Trong 6 - 12 th\xE1ng \u0111\u1EE3i c\u1EA5p ph\xE9p NHNN, l\xE0m th\u1EBF n\xE0o \u0111\u1EC3 c\xF3 l\u1EE3i nhu\u1EADn:
       * V\u1EC1 ph\xEDa H\xE3ng lu\u1EADt: \u0110\xE3 thu 50-70% theo m\u1ED1c milestone billing, thu ph\xED duy tr\xEC retainer 25-45tr/th\xE1ng \u0111\u1EC3 gi\u1EA3i tr\xECnh h\u1ED3 s\u01A1, b\xE1n d\u1ECBch v\u1EE5 b\xE1o c\xE1o DPIA d\u1EEF li\u1EC7u c\xE1 nh\xE2n (30-60tr/h\u1ED3 s\u01A1), r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng merchant v\xE0 b\u1EA3n quy\u1EC1n AI Copilot.
       * V\u1EC1 ph\xEDa Doanh nghi\u1EC7p V\xED: H\u1EE3p t\xE1c BCC v\u1EDBi \u0111\u01A1n v\u1ECB \u0111\xE3 c\xF3 gi\u1EA5y ph\xE9p \u0111\u1EC3 h\u01B0\u1EDFng chia s\u1EBB ph\xED giao d\u1ECBch v\xE0 l\u1EA5y t\u1EC7p ng\u01B0\u1EDDi d\xF9ng s\u1EDBm; Khai th\xE1c m\u1EA3ng ph\u1EA7n m\u1EC1m POS/Loyalty b\xE1n cho chu\u1ED7i b\xE1n l\u1EBB thu ti\u1EC1n SaaS; T\u1ED1i \u01B0u 50 t\u1EF7 v\u1ED1n \u0111i\u1EC1u l\u1EC7 g\u1EEDi ng\u1EAFn h\u1EA1n t\u1EA1i ng\xE2n h\xE0ng sinh l\xE3i 180 - 230 tri\u1EC7u/th\xE1ng nu\xF4i b\u1ED9 m\xE1y R&D; K\xFD MOU m\u1EDF r\u1ED9ng m\u1EA1ng l\u01B0\u1EDBi merchant n\xE2ng \u0111\u1ECBnh gi\xE1 g\u1ECDi v\u1ED1n Pre-Series A.
2. T\u01AF V\u1EA4N PH\xC1P LU\u1EACT FINTECH & V\xCD \u0110I\u1EC6N T\u1EEC:
   - Gi\u1EA3i \u0111\xE1p chuy\xEAn s\xE2u v\u1EC1 \u0111i\u1EC1u ki\u1EC7n c\u1EA5p ph\xE9p v\xED \u0111i\u1EC7n t\u1EED, v\u1ED1n th\u1EF1c 50 t\u1EF7, t\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n 1:1, quy tr\xECnh n\u1EA1p/r\xFAt, eKYC sinh tr\u1EAFc h\u1ECDc, th\u1EA9m quy\u1EC1n k\xFD k\u1EBFt, b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n (Lu\u1EADt 91/2025/QH15), ch\u1EE9ng ch\u1EC9 b\u1EA3o m\u1EADt c\u1EA5p \u0111\u1ED9 3 / PCI-DSS...
   - Tr\xEDch d\u1EABn \u0111i\u1EC1u kho\u1EA3n ch\xEDnh x\xE1c t\u1EEB Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP, Th\xF4ng t\u01B0 40/2024/TT-NHNN v\xE0 c\xE1c v\u0103n b\u1EA3n li\xEAn quan.
3. CUNG C\u1EA4P TH\xD4NG TIN TO\xC0N DI\u1EC6N V\u1EC0 TH\u1ECANH V\u01AF\u1EE2NG LEGAL & \u0110\u1ED8I NG\u0168 NH\xD3M 13:
   - Gi\u1EDBi thi\u1EC7u 12 th\xE0nh vi\xEAn, Ch\u1EE7 nhi\u1EC7m V\u0169 Anh Qu\xE2n, \u0111\u1ECBa ch\u1EC9 v\u0103n ph\xF2ng Bitexco TP.HCM v\xE0 Lotte Center H\xE0 N\u1ED9i, hotline, Zalo, 20 h\u1EE3p \u0111\u1ED3ng m\u1EABu, l\u1ED9 tr\xECnh 6 giai \u0111o\u1EA1n.
4. V\u0102N PHONG V\xC0 TR\xCCNH B\xC0Y:
   - Ti\u1EBFng Vi\u1EC7t chu\u1EA9n m\u1EF1c, c\u1EA5u tr\xFAc r\xF5 r\xE0ng (d\xF9ng g\u1EA1ch \u0111\u1EA7u d\xF2ng, in \u0111\u1EADm c\xE1c lu\u1EADn \u0111i\u1EC3m v\xE0 s\u1ED1 li\u1EC7u th\u1EF1c t\u1EBF), mang phong th\xE1i lu\u1EADt s\u01B0 t\u01B0 v\u1EA5n t\xE0i ch\xEDnh c\u1EA5p cao.

--- TH\xD4NG TIN DOANH NGHI\u1EC6P & \u0110\u1ED8I NG\u0168 NH\xD3M 13 ---
${companyAndTeamKnowledgeBase}

--- KI\u1EBEN TH\u1EE8C T\xC0I CH\xCDNH, DOANH THU, C\u01A0 CH\u1EBE THU TI\u1EC0N, \u0110\u1EA6U L\u01AF\u01A0NG & L\u1EE2I NHU\u1EACN ---
${financialAndCommercialKnowledgeBase}

--- C\u01A0 S\u1EDE PH\xC1P LU\u1EACT V\xCD \u0110I\u1EC6N T\u1EEC ---
${legalKnowledgeBase}`;
    const userPrompt = `${textSelected ? `Ng\u1EEF c\u1EA3nh / \u0110i\u1EC1u kho\u1EA3n \u0111ang \u0111\u1ECDc:
"""
${textSelected}
"""

` : ""}C\xE2u h\u1ECFi c\u1EE7a ng\u01B0\u1EDDi d\xF9ng: ${textMsg}`;
    const { stream } = req.body || {};
    const isStream = stream || req.query.stream === "true" || req.headers.accept?.includes("text/event-stream");
    const lowerQ = textMsg.toLowerCase();
    const isPaymentQuery = lowerQ.includes("tr\u1EA3 ti\u1EC1n") || lowerQ.includes("bao nhi\xEAu ti\u1EC1n") || lowerQ.includes("tr\u1EA3 cho ai") || lowerQ.includes("tr\u1EA3 th\u1EB3ng") || lowerQ.includes("cho c\xF4ng ty hay") || lowerQ.includes("thu ti\u1EC1n") || lowerQ.includes("bi\u1EC3u ph\xED") || lowerQ.includes("gi\xE1 d\u1ECBch v\u1EE5") || lowerQ.includes("thanh to\xE1n");
    const isSalaryQuery = lowerQ.includes("l\u01B0\u01A1ng") || lowerQ.includes("\u0111\u1EA7u l\u01B0\u01A1ng") || lowerQ.includes("thu nh\u1EADp") || lowerQ.includes("th\xF9 lao") || lowerQ.includes("chia ti\u1EC1n") || lowerQ.includes("th\u01B0\u1EDFng") || lowerQ.includes("c\u1ED5 t\u1EE9c");
    const isProfitWaitQuery = lowerQ.includes("l\u1EE3i nhu\u1EADn") || lowerQ.includes("\u0111\u1EE3i h\u1ED3 s\u01A1") || lowerQ.includes("ch\u1EDD c\u1EA5p ph\xE9p") || lowerQ.includes("ch\u1EDD gi\u1EA5y ph\xE9p") || lowerQ.includes("trong qu\xE1 tr\xECnh \u0111\u1EE3i") || lowerQ.includes("ki\u1EBFm ti\u1EC1n") || lowerQ.includes("d\xF2ng ti\u1EC1n") || lowerQ.includes("nh\xE0 \u0111\u1EA7u t\u01B0") || lowerQ.includes("th\u1EA7y gi\xE1o") || lowerQ.includes("h\u1ED9i \u0111\u1ED3ng") || lowerQ.includes("ph\u1EA3n bi\u1EC7n") || lowerQ.includes("h\xF2a v\u1ED1n") || lowerQ.includes("kinh doanh");
    const isTeamQuery = lowerQ.includes("th\xE0nh vi\xEAn") || lowerQ.includes("nh\xF3m 13") || lowerQ.includes("ai l\xE0") || lowerQ.includes("ch\u1EE7 nhi\u1EC7m") || lowerQ.includes("qu\xE2n") || lowerQ.includes("\u0111\u1ED9i ng\u0169") || lowerQ.includes("t\xE1c gi\u1EA3");
    const isCompanyQuery = lowerQ.includes("th\u1ECBnh v\u01B0\u1EE3ng") || lowerQ.includes("c\xF4ng ty") || lowerQ.includes("h\xE3ng lu\u1EADt") || lowerQ.includes("\u0111\u1ECBa ch\u1EC9") || lowerQ.includes("li\xEAn h\u1EC7") || lowerQ.includes("hotline") || lowerQ.includes("zalo") || lowerQ.includes("d\u1ECBch v\u1EE5");
    let defaultFallback = "";
    if (isPaymentQuery) {
      defaultFallback = `[Th\u1ECBnh V\u01B0\u1EE3ng Legal \xB7 C\u01A1 Ch\u1EBF Thu Ph\xED & Quy \u0110\u1ECBnh Tr\u1EA3 Ti\u1EC1n]

\u2022 **Tr\u1EA3 cho ai?**: C\u0103n c\u1EE9 \u0110i\u1EC1u 54, 55 Lu\u1EADt Lu\u1EADt s\u01B0 2006 (s\u1EEDa \u0111\u1ED5i 2012), kh\xE1ch h\xE0ng **B\u1EAET BU\u1ED8C PH\u1EA2I CHUY\u1EC2N KHO\u1EA2N V\xC0O T\xC0I KHO\u1EA2N PH\xC1P NH\xC2N C\u1EE6A C\xD4NG TY LU\u1EACT TH\u1ECANH V\u01AF\u1EE2NG LEGAL**, c\xF3 xu\u1EA5t h\xF3a \u0111\u01A1n VAT \u0111i\u1EC7n t\u1EED h\u1EE3p ph\xE1p.
\u2022 **Tuy\u1EC7t \u0111\u1ED1i KH\xD4NG tr\u1EA3 th\u1EB3ng cho Lu\u1EADt s\u01B0/th\xE0nh vi\xEAn c\xE1 nh\xE2n**: Lu\u1EADt ph\xE1p nghi\xEAm c\u1EA5m lu\u1EADt s\u01B0 t\u1EF1 \xFD nh\u1EADn ti\u1EC1n ri\xEAng ngo\xE0i h\u1EE3p \u0111\u1ED3ng. Tr\u1EA3 qua c\xF4ng ty gi\xFAp kh\xE1ch h\xE0ng \u0111\u01B0\u1EE3c b\u1EA3o v\u1EC7 b\u1EDFi B\u1EA3o hi\u1EC3m tr\xE1ch nhi\u1EC7m ngh\u1EC1 nghi\u1EC7p v\xE0 \u0111\u01B0\u1EE3c t\xEDnh chi ph\xED h\u1EE3p l\xFD khi tr\u1EEB thu\u1EBF TNDN.
\u2022 **M\u1EE9c ph\xED & L\u1ED9 tr\xECnh**: G\xF3i t\u01B0 v\u1EA5n c\u1EA5p ph\xE9p tr\u1ECDn g\xF3i t\u1EEB 350 - 650 tri\u1EC7u VN\u0110, chia l\xE0m 5 \u0111\u1EE3t gi\u1EA3i ng\xE2n theo m\u1ED1c ti\u1EBFn \u0111\u1ED9 (30% khi k\xFD H\u0110 -> 20% khi xong 20 h\u1EE3p \u0111\u1ED3ng & v\u1ED1n 50 t\u1EF7 -> 20% khi n\u1ED9p h\u1ED3 s\u01A1 NHNN -> 20% khi NHNN ki\u1EC3m tra th\u1EF1c t\u1EBF -> 10% khi nh\u1EADn gi\u1EA5y ph\xE9p).`;
    } else if (isSalaryQuery) {
      defaultFallback = `[Th\u1ECBnh V\u01B0\u1EE3ng Legal \xB7 C\u01A1 C\u1EA5u \u0110\u1EA7u L\u01B0\u01A1ng & Th\xF9 Lao 12 Th\xE0nh Vi\xEAn]

H\xE3ng lu\u1EADt \xE1p d\u1EE5ng m\xF4 h\xECnh thu nh\u1EADp 4 t\u1EA7ng chuy\xEAn nghi\u1EC7p:
1. **L\u01B0\u01A1ng c\u1EE9ng (Base Salary)**: Ch\u1EE7 nhi\u1EC7m d\u1EF1 \xE1n V\u0169 Anh Qu\xE2n (35 - 45 tr/th\xE1ng); 4 Senior Partner (25 - 32 tr/th\xE1ng); 7 Associate chuy\xEAn tr\xE1ch (16 - 22 tr/th\xE1ng); Tr\u1EE3 l\xFD ph\xE1p l\xFD (6 - 9 tr/th\xE1ng).
2. **Th\xF9 lao theo v\u1EE5 vi\u1EC7c (Case Fee)**: Tr\xEDch 20% - 30% gi\xE1 tr\u1ECB h\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5 \u0111\xE3 nghi\u1EC7m thu \u0111\u1EC3 chia cho nh\xF3m th\u1EE5 l\xFD tr\u1EF1c ti\u1EBFp.
3. **Th\u01B0\u1EDFng kinh doanh & KPI**: Th\u01B0\u1EDFng 5% - 10% doanh thu khi k\u1EBFt n\u1ED1i kh\xE1ch h\xE0ng m\u1EDBi; th\u01B0\u1EDFng ti\u1EBFn \u0111\u1ED9 h\u1ED3 s\u01A1.
4. **C\u1ED5 t\u1EE9c cu\u1ED1i n\u0103m (Dividends)**: Ph\xE2n chia to\xE0n b\u1ED9 l\u1EE3i nhu\u1EADn r\xF2ng cho c\xE1c th\xE0nh vi\xEAn s\xE1ng l\u1EADp theo t\u1EF7 l\u1EC7 g\xF3p v\u1ED1n sau khi tr\u1EEB chi ph\xED v\u1EADn h\xE0nh v\xE0 tr\xEDch qu\u1EF9 r\u1EE7i ro ngh\u1EC1 nghi\u1EC7p 10%.`;
    } else if (isProfitWaitQuery) {
      defaultFallback = `[Th\u1ECBnh V\u01B0\u1EE3ng Legal \xB7 Chi\u1EBFn L\u01B0\u1EE3c T\u1EA1o L\u1EE3i Nhu\u1EADn Trong 6-12 Th\xE1ng \u0110\u1EE3i C\u1EA5p Ph\xE9p NHNN]

Qu\xE1 tr\xECnh xin gi\u1EA5y ph\xE9p NHNN th\u01B0\u1EDDng k\xE9o d\xE0i 6-12 th\xE1ng. C\u1EA3 H\xE3ng lu\u1EADt v\xE0 Doanh nghi\u1EC7p v\xED \u0111\u1EC1u c\xF3 chi\u1EBFn l\u01B0\u1EE3c t\u1EA1o d\xF2ng ti\u1EC1n b\u1EC1n v\u1EEFng:

A. **\u0110\u1ED1i v\u1EDBi H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal**:
\u2022 **Thu theo m\u1ED1c (Milestone Billing)**: \u0110\xE3 thu 50% - 70% gi\xE1 tr\u1ECB h\u1EE3p \u0111\u1ED3ng ngay khi ho\xE0n thi\u1EC7n h\u1ED3 s\u01A1 v\xE0 n\u1ED9p t\u1EA1i NHNN.
\u2022 **Ph\xED t\u01B0 v\u1EA5n th\u01B0\u1EDDng xuy\xEAn (Retainer)**: Thu \u0111\u1EC1u \u0111\u1EB7n 25 - 45 tr/th\xE1ng trong su\u1ED1t th\u1EDDi gian ch\u1EDD \u0111\u1EC3 h\u1ED7 tr\u1EE3 gi\u1EA3i tr\xECnh v\u0103n b\u1EA3n theo y\xEAu c\u1EA7u NHNN.
\u2022 **D\u1ECBch v\u1EE5 ph\u1EE5 tr\u1EE3**: L\u1EADp B\xE1o c\xE1o \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng d\u1EEF li\u1EC7u c\xE1 nh\xE2n (DPIA) theo Lu\u1EADt 91/2025/QH15 (30-60 tr/h\u1ED3 s\u01A1), r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng merchant, \u0111\xE0o t\u1EA1o AML.

B. **\u0110\u1ED1i v\u1EDBi Doanh nghi\u1EC7p V\xED \u0111i\u1EC7n t\u1EED**:
\u2022 **H\u1EE3p \u0111\u1ED3ng BCC**: B\u1EAFt tay h\u1EE3p t\xE1c kinh doanh v\u1EDBi Trung gian thanh to\xE1n/Ng\xE2n h\xE0ng \u0110\xC3 C\xD3 GI\u1EA4Y PH\xC9P \u0111\u1EC3 chia s\u1EBB ph\xED giao d\u1ECBch v\xE0 thu h\xFAt ng\u01B0\u1EDDi d\xF9ng t\u1EEB s\u1EDBm.
\u2022 **B\xE1n ph\u1EA7n m\u1EC1m POS/Loyalty (SaaS)**: Khai th\xE1c m\u1EA3ng c\xF4ng ngh\u1EC7 b\xE1n cho c\xE1c chu\u1ED7i c\u1EEDa l\u1EBB \u0111\u1EC3 t\u1EA1o d\xF2ng ti\u1EC1n ngay.
\u2022 **T\u1ED1i \u01B0u l\xE3i t\u1EEB v\u1ED1n 50 t\u1EF7**: G\u1EEDi ng\u1EAFn h\u1EA1n 1-3 th\xE1ng t\u1EA1i ng\xE2n h\xE0ng v\u1EDBi l\xE3i su\u1EA5t ~5%/n\u0103m, sinh l\xE3i 180 - 230 tri\u1EC7u/th\xE1ng, \u0111\u1EE7 b\xF9 \u0111\u1EAFp to\xE0n b\u1ED9 ti\u1EC1n thu\xEA v\u0103n ph\xF2ng v\xE0 nu\xF4i \u0111\u1ED9i ng\u0169 R&D.
\u2022 **K\xFD MOU m\u1EA1ng l\u01B0\u1EDBi Merchant**: Gia t\u0103ng \u0111\u1ECBnh gi\xE1 c\xF4ng ty \u0111\u1EC3 g\u1ECDi v\u1ED1n c\xE1c v\xF2ng h\u1EA1t gi\u1ED1ng / Pre-Series A.`;
    } else if (isTeamQuery) {
      defaultFallback = `[Th\u1ECBnh V\u01B0\u1EE3ng Legal \xB7 \u0110\u1ED9i ng\u0169 Ban Nghi\xEAn c\u1EE9u Nh\xF3m 13]

\u0110\u1EC1 \xE1n \u0111\u01B0\u1EE3c th\u1EF1c hi\u1EC7n b\u1EDFi **12 th\xE0nh vi\xEAn Ban Nghi\xEAn c\u1EE9u chuy\xEAn \u0111\u1EC1** d\u01B0\u1EDBi s\u1EF1 \u0111i\u1EC1u ph\u1ED1i c\u1EE7a **Ch\u1EE7 nhi\u1EC7m d\u1EF1 \xE1n V\u0169 Anh Qu\xE2n**:

1. **V\u0169 Anh Qu\xE2n** (MSV: 26A4062552) - Ch\u1EE7 nhi\u1EC7m d\u1EF1 \xE1n \xB7 T\xEDch h\u1EE3p API & T\u1ED5ng h\u1EE3p \u0111\u1EC1 \xE1n.
2. **\u0110o\xE0n Anh Ph\u01B0\u01A1ng** (MSV: 26A4062550) - Ph\xE2n t\xEDch t\u1ED5ng quan th\u1ECB tr\u01B0\u1EDDng v\xED & m\xF4 h\xECnh thanh to\xE1n di \u0111\u1ED9ng.
3. **Ki\u1EC1u Ho\xE0i Thu** (MSV: 26A4060739) - Chuy\xEAn gia \u0110i\u1EC1u l\u1EC7 & \u0110H\u0110C\u0110 (c\u01A1 c\u1EA5u v\u1ED1n 50 t\u1EF7).
4. **Tr\u1EA7n Th\u1ECB Th\u01A1** (MSV: 26A4060737) - Chuy\xEAn gia H\u1EE3p \u0111\u1ED3ng m\u1EDF v\xED ng\u01B0\u1EDDi d\xF9ng & H\u1EE3p \u0111\u1ED3ng Gi\xE1m \u0111\u1ED1c.
5. **L\xEA Ph\u01B0\u01A1ng Th\u1EA3o** (MSV: 26A4062560) - Chuy\xEAn gia H\u1EE3p \u0111\u1ED3ng Lao \u0111\u1ED9ng & Li\xEAn k\u1EBFt Ng\xE2n h\xE0ng.
6. **L\xEA Th\u1ECB H\u1ED3ng Nhung** (MSV: 26A4062545) - Chuy\xEAn gia Thu\xEA ngo\xE0i CNTT (Cloud) & H\u1EE3p \u0111\u1ED3ng Merchant.
7. **Ph\u1EA1m D\u1EA1 Th\u1EA3o** (MSV: 26A4060735) - Chuy\xEAn gia Th\xE0nh l\u1EADp Doanh nghi\u1EC7p & H\u1EE3p \u0111\u1ED3ng BCC.
8. **Nguy\u1EC5n Huy Th\xE1i** (MSV: 26A4062558) - Chuy\xEAn gia Tra so\xE1t Khi\u1EBFu n\u1EA1i & H\u1ED3 s\u01A1 S\u1EF1 c\u1ED1 t\xE0i ch\xEDnh.
9. **Ph\u1EA1m V\u0103n Quang** (MSV: 26A4062551) - Chuy\xEAn gia B\u1EA3o m\u1EADt, NDA & B\u1EA3n quy\u1EC1n ph\u1EA7n m\u1EC1m.
10. **Tr\u1EA7n Th\u1ECB Th\xF9y** (MSV: 26A4062565) - Chuy\xEAn gia Th\u1ECFa thu\u1EADn C\u1ED5 \u0111\xF4ng (SHA) & Deadlock.
11. **V\u01B0\u01A1ng Thu Th\u1EE7y** (MSV: 26A4062567) - Chuy\xEAn gia Khuy\u1EBFn m\u1EA1i & D\u1EEF li\u1EC7u C\xE1 nh\xE2n (Lu\u1EADt 91/2025).
12. **V\u0169 Ph\u01B0\u01A1ng Th\u1EA3o** (MSV: 26A4060736) - Chuy\xEAn gia T\xE0i kho\u1EA3n B\u1EA3o \u0111\u1EA3m Thanh to\xE1n (K\xFD qu\u1EF9 1:1) & NHNN.

*(B\u1EA1n c\xF3 th\u1EC3 v\xE0o trang **"\u0110\u1ED9i ng\u0169"** tr\xEAn menu \u0111\u1EC3 xem h\xECnh \u1EA3nh v\xE0 h\u1ED3 s\u01A1 chi ti\u1EBFt c\u1EE7a t\u1EEBng th\xE0nh vi\xEAn).*`;
    } else if (isCompanyQuery) {
      defaultFallback = `[H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal \xB7 Th\xF4ng tin Doanh nghi\u1EC7p]

\u2022 **V\u1EC1 ch\xFAng t\xF4i**: H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal (\u0110\u1EC1 \xE1n Nh\xF3m 13) chuy\xEAn s\xE2u v\u1EC1 Ph\xE1p l\xFD th\xE0nh l\u1EADp, c\u1EA5p ph\xE9p v\xE0 v\u1EADn h\xE0nh V\xED \u0111i\u1EC7n t\u1EED & Fintech t\u1EA1i Vi\u1EC7t Nam.
\u2022 **Tr\u1EE5 s\u1EDF ch\xEDnh**: T\xF2a nh\xE0 Bitexco Financial Tower, S\u1ED1 2 H\u1EA3i Tri\u1EC1u, P. B\u1EBFn Ngh\xE9, Qu\u1EADn 1, TP. HCM.
\u2022 **Chi nh\xE1nh H\xE0 N\u1ED9i**: T\xF2a nh\xE0 Lotte Center, 54 Li\u1EC5u Giai, P. C\u1ED1ng V\u1ECB, Q. Ba \u0110\xECnh, H\xE0 N\u1ED9i.
\u2022 **Hotline / Zalo**: 0988 123 456 | **Email**: contact@thinhvuonglegal.vn
\u2022 **S\u1EA3n ph\u1EA9m ch\xEDnh**: Th\u01B0 vi\u1EC7n 20 m\u1EABu h\u1EE3p \u0111\u1ED3ng chu\u1EA9n h\xF3a, L\u1ED9 tr\xECnh c\u1EA5p ph\xE9p 6 giai \u0111o\u1EA1n v\xE0 Tr\u1EE3 l\xFD AI soi b\u1EABy \u0111i\u1EC1u kho\u1EA3n.`;
    } else {
      defaultFallback = `[T\u01B0 V\u1EA5n T\u1EF1 \u0110\u1ED9ng \xB7 Th\u1ECBnh V\u01B0\u1EE3ng Legal]

\u2022 **V\u1EC1 v\u1EA5n \u0111\u1EC1**: ${textMsg}
` + (textSelected ? `\u2022 **\u0110i\u1EC1u kho\u1EA3n \u0111ang xem x\xE9t**: "${textSelected.slice(0, 150)}..."

` : "\n") + `\u2022 **C\u0103n c\u1EE9 ph\xE1p l\xFD c\u1ED1t l\xF5i**: 
  - **\u0110i\u1EC1u 22 & 25 Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP**: T\u1ED5 ch\u1EE9c cung \u1EE9ng v\xED \u0111i\u1EC7n t\u1EED ph\u1EA3i c\xF3 v\u1ED1n \u0111i\u1EC1u l\u1EC7 th\u1EF1c g\xF3p t\u1ED1i thi\u1EC3u 50 t\u1EF7 \u0111\u1ED3ng v\xE0 b\u1EAFt bu\u1ED9c m\u1EDF t\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n t\u1EA1i Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i v\u1EDBi t\u1EF7 l\u1EC7 100% t\u1ED5ng s\u1ED1 d\u01B0 v\xED c\u1EE7a kh\xE1ch h\xE0ng.
  - **Th\xF4ng t\u01B0 40/2024/TT-NHNN**: Kh\xE1ch h\xE0ng m\u1EDF v\xED ph\u1EA3i th\u1EF1c hi\u1EC7n eKYC \u0111\u1ED1i so\xE1t v\u1EDBi d\u1EEF li\u1EC7u d\xE2n c\u01B0 v\xE0 n\u1EA1p/r\xFAt qua t\xE0i kho\u1EA3n ng\xE2n h\xE0ng ch\xEDnh ch\u1EE7.
  - **Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15**: D\u1EEF li\u1EC7u t\xE0i ch\xEDnh l\xE0 d\u1EEF li\u1EC7u nh\u1EA1y c\u1EA3m, ph\u1EA3i th\u1EF1c hi\u1EC7n \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng DPIA.

\u2022 **Khuy\u1EBFn ngh\u1ECB**: C\u1EA7n r\xE0 so\xE1t k\u1EF9 c\xE1c \u0111i\u1EC1u kho\u1EA3n v\u1EC1 SLA k\u1EBFt n\u1ED1i API ng\xE2n h\xE0ng, ph\xE2n \u0111\u1ECBnh tr\xE1ch nhi\u1EC7m b\u1ED3i th\u01B0\u1EDDng tra so\xE1t v\xE0 th\u1ECFa thu\u1EADn x\u1EED l\xFD d\u1EEF li\u1EC7u c\xE1 nh\xE2n.

*(Th\xF4ng tin h\u1ED7 tr\u1EE3 chuy\xEAn m\xF4n t\u1EEB Th\u1ECBnh V\u01B0\u1EE3ng Legal, kh\xF4ng thay th\u1EBF \xFD ki\u1EBFn t\u01B0 v\u1EA5n cho t\u1EEBng h\u1EE3p \u0111\u1ED3ng c\u1EE5 th\u1EC3).*`;
    }
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, userPrompt, defaultFallback, reqKey);
    }
    const aiResponse = await callLegalAI(systemPrompt, userPrompt, reqKey);
    if (aiResponse) {
      return res.json({ answer: aiResponse, text: aiResponse, mode: "ai" });
    }
    return res.json({ answer: defaultFallback, text: defaultFallback, mode: "demo" });
  } catch (error) {
    console.error("Legal assistant error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 x\u1EED l\xFD y\xEAu c\u1EA7u l\xFAc n\xE0y." });
  }
});
function sanitizeDocumentText(value) {
  if (typeof value !== "string") return "";
  return value.split(String.fromCharCode(0)).join("").trim().slice(0, 5e4);
}
var reviewAreas = [
  ["Ph\u1EA1m vi v\xE0 gi\u1EA5y ph\xE9p", ["ph\u1EA1m vi", "gi\u1EA5y ph\xE9p"]],
  ["Ph\xED v\xE0 \u0111\u1ED1i so\xE1t", ["ph\xED", "\u0111\u1ED1i so\xE1t"]],
  ["Nghi\u1EC7m thu v\xE0 SLA", ["nghi\u1EC7m thu", "sla"]],
  ["D\u1EEF li\u1EC7u v\xE0 b\u1EA3o m\u1EADt", ["d\u1EEF li\u1EC7u", "b\u1EA3o m\u1EADt"]],
  ["Tra so\xE1t v\xE0 ho\xE0n ti\u1EC1n", ["tra so\xE1t", "ho\xE0n ti\u1EC1n"]],
  ["Ch\u1EA5m d\u1EE9t v\xE0 chuy\u1EC3n ti\u1EBFp", ["ch\u1EA5m d\u1EE9t", "t\u1EA1m ng\u1EEBng"]]
];
function fallbackReview(text) {
  const normalized = text.toLocaleLowerCase("vi");
  const lines = reviewAreas.map(([title, terms], index) => {
    const present = terms.some((term) => normalized.includes(term));
    return `${index + 1}. ${title} \u2014 ${present ? "XANH" : "V\xC0NG"}
${present ? "\u0110\xE3 nh\u1EADn di\u1EC7n n\u1ED9i dung li\xEAn quan; c\u1EA7n ki\u1EC3m tra t\xEDnh \u0111\u1EA7y \u0111\u1EE7, th\u1EA9m quy\u1EC1n v\xE0 s\u1EF1 th\u1ED1ng nh\u1EA5t gi\u1EEFa h\u1EE3p \u0111\u1ED3ng v\u1EDBi ph\u1EE5 l\u1EE5c." : "Ch\u01B0a nh\u1EADn di\u1EC7n r\xF5 n\u1ED9i dung n\xE0y. C\u1EA7n b\u1ED5 sung ho\u1EB7c x\xE1c \u0111\u1ECBnh v\u1ECB tr\xED \u0111i\u1EC1u kho\u1EA3n tr\u01B0\u1EDBc khi k\xFD."}`;
  });
  return `T\xD3M T\u1EAET R\xC0 SO\xC1T
B\u1EA3n ph\xE2n t\xEDch quy t\u1EAFc \u0111\xE3 ki\u1EC3m tra c\xE1c nh\xF3m \u0111i\u1EC1u kho\u1EA3n c\u1ED1t l\xF5i c\u1EE7a h\u1EE3p \u0111\u1ED3ng v\xED \u0111i\u1EC7n t\u1EED.

${lines.join(
    "\n\n"
  )}

K\u1EBET LU\u1EACN
\u0110\xE2y l\xE0 ch\u1EBF \u0111\u1ED9 d\u1EEF li\u1EC7u m\u1EABu, ch\u01B0a thay th\u1EBF r\xE0 so\xE1t c\u1EE7a lu\u1EADt s\u01B0 v\xE0 ch\u01B0a x\xE1c nh\u1EADn hi\u1EC7u l\u1EF1c t\u1EEBng c\u0103n c\u1EE9 cho giao d\u1ECBch c\u1EE5 th\u1EC3.`;
}
app.post("/api/contract-draft", async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { description: rawDesc, referenceText, contractSlug, stream } = req.body || {};
    const description = sanitizeDocumentText(rawDesc).slice(0, 5e3);
    const reference = sanitizeDocumentText(referenceText);
    const selected = contracts.find((item) => item.slug === contractSlug);
    const effectiveDesc = description || reference || (selected ? `L\u1EADp d\u1EF1 th\u1EA3o ${selected.title} chu\u1EA9n h\xF3a theo quy \u0111\u1ECBnh Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP v\xE0 Th\xF4ng t\u01B0 40/2024/TT-NHNN.` : "L\u1EADp d\u1EF1 th\u1EA3o h\u1EE3p \u0111\u1ED3ng cung \u1EE9ng d\u1ECBch v\u1EE5 trung gian thanh to\xE1n v\xED \u0111i\u1EC7n t\u1EED.");
    const fallback = `C\u1ED8NG H\xD2A X\xC3 H\u1ED8I CH\u1EE6 NGH\u0128A VI\u1EC6T NAM
\u0110\u1ED9c l\u1EADp - T\u1EF1 do - H\u1EA1nh ph\xFAc
---------------

${selected?.title ? selected.title.toUpperCase() : "H\u1EE2P \u0110\u1ED2NG D\u1ECACH V\u1EE4 V\xCD \u0110I\u1EC6N T\u1EEC"}
S\u1ED1: [S\u1ED1 h\u1EE3p \u0111\u1ED3ng]/2026/TVL-FINTECH

- C\u0103n c\u1EE9 B\u1ED9 lu\u1EADt D\xE2n s\u1EF1 s\u1ED1 91/2015/QH13;
- C\u0103n c\u1EE9 Lu\u1EADt C\xE1c t\u1ED5 ch\u1EE9c t\xEDn d\u1EE5ng s\u1ED1 32/2024/QH15;
- C\u0103n c\u1EE9 Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP c\u1EE7a Ch\xEDnh ph\u1EE7 quy \u0111\u1ECBnh v\u1EC1 thanh to\xE1n kh\xF4ng d\xF9ng ti\u1EC1n m\u1EB7t;
- C\u0103n c\u1EE9 Th\xF4ng t\u01B0 40/2024/TT-NHNN c\u1EE7a Ng\xE2n h\xE0ng Nh\xE0 n\u01B0\u1EDBc h\u01B0\u1EDBng d\u1EABn d\u1ECBch v\u1EE5 trung gian thanh to\xE1n;
- C\u0103n c\u1EE9 Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n s\u1ED1 91/2025/QH15;
- C\u0103n c\u1EE9 nhu c\u1EA7u v\xE0 kh\u1EA3 n\u0103ng c\u1EE7a hai B\xEAn.

H\xF4m nay, ng\xE0y [Ng\xE0y] th\xE1ng [Th\xE1ng] n\u0103m 2026, t\u1EA1i [\u0110\u1ECBa \u0111i\u1EC3m k\xFD k\u1EBFt], ch\xFAng t\xF4i g\u1ED3m:

B\xCAN A (B\xCAN CUNG \u1EE8NG D\u1ECACH V\u1EE4 V\xCD \u0110I\u1EC6N T\u1EEC):
- T\xEAn t\u1ED5 ch\u1EE9c: [T\xEAn C\xF4ng ty V\xED \u0111i\u1EC7n t\u1EED]
- Gi\u1EA5y ph\xE9p ho\u1EA1t \u0111\u1ED9ng: S\u1ED1 [S\u1ED1 GP]/GP-NHNN do Ng\xE2n h\xE0ng Nh\xE0 n\u01B0\u1EDBc Vi\u1EC7t Nam c\u1EA5p.
- M\xE3 s\u1ED1 doanh nghi\u1EC7p: [M\xE3 s\u1ED1 thu\u1EBF / MSDN]
- \u0110\u1ECBa ch\u1EC9 tr\u1EE5 s\u1EDF: [\u0110\u1ECBa ch\u1EC9 tr\u1EE5 s\u1EDF ch\xEDnh]
- \u0110\u1EA1i di\u1EC7n b\u1EDFi: \xD4ng/B\xE0 [H\u1ECD v\xE0 t\xEAn \u0111\u1EA1i di\u1EC7n] - Ch\u1EE9c v\u1EE5: [T\u1ED5ng Gi\xE1m \u0111\u1ED1c / \u0110\u1EA1i di\u1EC7n theo ph\xE1p lu\u1EADt]
- T\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n: [S\u1ED1 t\xE0i kho\u1EA3n] m\u1EDF t\u1EA1i Ng\xE2n h\xE0ng TMCP [T\xEAn Ng\xE2n h\xE0ng]

B\xCAN B (\u0110\u01A0N V\u1ECA H\u1EE2P T\xC1C / KH\xC1CH H\xC0NG):
- T\xEAn t\u1ED5 ch\u1EE9c/c\xE1 nh\xE2n: [T\xEAn B\xEAn B]
- M\xE3 s\u1ED1 thu\u1EBF / CCCD: [S\u1ED1 MST / S\u1ED1 th\u1EBB CCCD g\u1EAFn chip]
- \u0110\u1ECBa ch\u1EC9: [\u0110\u1ECBa ch\u1EC9 li\xEAn h\u1EC7 ch\xEDnh th\u1EE9c]
- \u0110\u1EA1i di\u1EC7n b\u1EDFi: \xD4ng/B\xE0 [H\u1ECD v\xE0 t\xEAn] - Ch\u1EE9c v\u1EE5: [Ch\u1EE9c v\u1EE5 \u0111\u1EA1i di\u1EC7n]

Hai B\xEAn th\u1ED1ng nh\u1EA5t k\xFD k\u1EBFt H\u1EE3p \u0111\u1ED3ng v\u1EDBi c\xE1c \u0111i\u1EC1u kho\u1EA3n c\u1EE5 th\u1EC3 sau \u0111\xE2y:

\u0110i\u1EC1u 1: Ph\u1EA1m vi h\u1EE3p t\xE1c v\xE0 Cung \u1EE9ng d\u1ECBch v\u1EE5
1.1. B\xEAn A \u0111\u1ED3ng \xFD cung c\u1EA5p gi\u1EA3i ph\xE1p trung gian thanh to\xE1n v\xED \u0111i\u1EC7n t\u1EED cho B\xEAn B \u0111\u1EC3 x\u1EED l\xFD c\xE1c giao d\u1ECBch h\u1EE3p ph\xE1p ph\xE1t sinh theo \u0111\xFAng quy \u0111\u1ECBnh ph\xE1p lu\u1EADt.
1.2. M\u1ECDi lu\u1ED3ng ti\u1EC1n giao d\u1ECBch qua v\xED \u0111i\u1EC7n t\u1EED ph\u1EA3i \u0111\u01B0\u1EE3c b\u1EA3o \u0111\u1EA3m 100% b\u1EB1ng s\u1ED1 d\u01B0 ti\u1EC1n g\u1EEDi t\u1EA1i T\xE0i kho\u1EA3n \u0111\u1EA3m b\u1EA3o thanh to\xE1n c\u1EE7a B\xEAn A m\u1EDF t\u1EA1i Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i h\u1EE3p t\xE1c theo \u0110i\u1EC1u 25 Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP.

\u0110i\u1EC1u 2: Ti\xEAu chu\u1EA9n k\u1EF9 thu\u1EADt, eKYC v\xE0 An to\xE0n th\xF4ng tin
2.1. B\xEAn A ch\u1ECBu tr\xE1ch nhi\u1EC7m duy tr\xEC h\u1EC7 th\u1ED1ng k\u1EF9 thu\u1EADt \u0111\u1EA1t ti\xEAu chu\u1EA9n b\u1EA3o m\u1EADt an to\xE0n th\xF4ng tin c\u1EA5p \u0111\u1ED9 3 v\xE0 chu\u1EA9n b\u1EA3o m\u1EADt thanh to\xE1n qu\u1ED1c t\u1EBF PCI-DSS Level 1.
2.2. Quy tr\xECnh nh\u1EADn bi\u1EBFt kh\xE1ch h\xE0ng (eKYC) v\xE0 x\xE1c th\u1EF1c sinh tr\u1EAFc h\u1ECDc khu\xF4n m\u1EB7t \u0111\u01B0\u1EE3c th\u1EF1c hi\u1EC7n nghi\xEAm ng\u1EB7t theo Th\xF4ng t\u01B0 40/2024/TT-NHNN v\xE0 Quy\u1EBFt \u0111\u1ECBnh 2345/Q\u0110-NHNN.

\u0110i\u1EC1u 3: B\u1EA3o v\u1EC7 D\u1EEF li\u1EC7u c\xE1 nh\xE2n v\xE0 B\xED m\u1EADt t\xE0i ch\xEDnh
3.1. D\u1EEF li\u1EC7u giao d\u1ECBch, s\u1ED1 d\u01B0 t\xE0i kho\u1EA3n v\xE0 \u0111\u1ECBnh danh sinh tr\u1EAFc h\u1ECDc \u0111\u01B0\u1EE3c ph\xE2n lo\u1EA1i l\xE0 D\u1EEF li\u1EC7u c\xE1 nh\xE2n nh\u1EA1y c\u1EA3m theo Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15.
3.2. C\xE1c B\xEAn cam k\u1EBFt l\u1EADp H\u1ED3 s\u01A1 \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng DPIA, kh\xF4ng ti\u1EBFt l\u1ED9, mua b\xE1n hay chuy\u1EC3n giao d\u1EEF li\u1EC7u thanh to\xE1n cho b\u1EA5t k\u1EF3 b\xEAn th\u1EE9 ba n\xE0o khi ch\u01B0a c\xF3 s\u1EF1 \u0111\u1ED3ng \xFD h\u1EE3p l\u1EC7.

\u0110i\u1EC1u 4: \u0110\u1ED1i so\xE1t, Bi\u1EC3u ph\xED v\xE0 Quy\u1EBFt to\xE1n
4.1. D\u1EEF li\u1EC7u giao d\u1ECBch \u0111\u01B0\u1EE3c \u0111\u1ED1i so\xE1t t\u1EF1 \u0111\u1ED9ng h\xE0ng ng\xE0y (T+1) qua k\xEAnh API an to\xE0n gi\u1EEFa hai h\u1EC7 th\u1ED1ng.
4.2. Bi\u1EC3u ph\xED d\u1ECBch v\u1EE5: \xC1p d\u1EE5ng m\u1EE9c ph\xED [M\u1EE9c ph\xED % ho\u1EB7c c\u1ED1 \u0111\u1ECBnh]/giao d\u1ECBch th\xE0nh c\xF4ng.

\u0110i\u1EC1u 5: Cam k\u1EBFt v\xE0 Hi\u1EC7u l\u1EF1c thi h\xE0nh
5.1. H\u1EE3p \u0111\u1ED3ng n\xE0y c\xF3 hi\u1EC7u l\u1EF1c k\u1EC3 t\u1EEB ng\xE0y k\xFD v\xE0 c\xF3 gi\xE1 tr\u1ECB trong th\u1EDDi h\u1EA1n [01 n\u0103m / Th\u1EDDi h\u1EA1n th\u1ECFa thu\u1EADn].
5.2. H\u1EE3p \u0111\u1ED3ng \u0111\u01B0\u1EE3c l\u1EADp th\xE0nh [02] b\u1EA3n c\xF3 gi\xE1 tr\u1ECB ph\xE1p l\xFD nh\u01B0 nhau, m\u1ED7i B\xEAn gi\u1EEF [01] b\u1EA3n \u0111\u1EC3 th\u1EF1c hi\u1EC7n.

\u0110\u1EA0I DI\u1EC6N B\xCAN A                                      \u0110\u1EA0I DI\u1EC6N B\xCAN B
(K\xFD, ghi r\xF5 h\u1ECD t\xEAn v\xE0 \u0111\xF3ng d\u1EA5u)                    (K\xFD, ghi r\xF5 h\u1ECD t\xEAn v\xE0 \u0111\xF3ng d\u1EA5u)`;
    const prompt = `So\u1EA1n d\u1EF1 th\u1EA3o ${selected?.title || "h\u1EE3p \u0111\u1ED3ng ph\u1EE5c v\u1EE5 v\xED \u0111i\u1EC7n t\u1EED"} b\u1EB1ng ti\u1EBFng Vi\u1EC7t, c\xF3 qu\u1ED1c hi\u1EC7u, th\xF4ng tin ch\u1EE7 th\u1EC3 \u0111\u1EC3 tr\u1ED1ng trong ngo\u1EB7c vu\xF4ng, c\u0103n c\u1EE9 tham chi\u1EBFu (Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP, Th\xF4ng t\u01B0 40/2024/TT-NHNN, Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15), \u0111i\u1EC1u kho\u1EA3n \u0111\xE1nh s\u1ED1, ch\u1EEF k\xFD v\xE0 l\u01B0u \xFD c\u1EA7n r\xE0 so\xE1t. Ch\u1EC9 \u0111\u01B0a \u0111i\u1EC1u kho\u1EA3n g\u1EAFn tr\u1EF1c ti\u1EBFp v\u1EDBi v\xED \u0111i\u1EC7n t\u1EED; kh\xF4ng t\u1EF1 \u0111i\u1EC1n gi\u1EA5y ph\xE9p, gi\xE1 ho\u1EB7c d\u1EEF ki\u1EC7n ch\u01B0a \u0111\u01B0\u1EE3c cung c\u1EA5p.

Y\xEAu c\u1EA7u ng\u01B0\u1EDDi d\xF9ng:
${effectiveDesc}

N\u1ED9i dung tham kh\u1EA3o n\u1EBFu c\xF3:
${reference}`;
    const systemPrompt = `B\u1EA1n l\xE0 chuy\xEAn gia so\u1EA1n th\u1EA3o h\u1EE3p \u0111\u1ED3ng th\u01B0\u01A1ng m\u1EA1i v\xE0 Fintech c\u1EE7a Th\u1ECBnh V\u01B0\u1EE3ng Legal. H\xE3y so\u1EA1n th\u1EA3o h\u1EE3p \u0111\u1ED3ng chi ti\u1EBFt, chu\u1EA9n ch\u1EC9nh theo ph\xE1p lu\u1EADt Vi\u1EC7t Nam. Tr\xECnh b\xE0y r\xF5 r\xE0ng theo c\u1EA5u tr\xFAc h\u1EE3p \u0111\u1ED3ng kinh t\u1EBF chu\u1EA9n.`;
    const isStream = stream || req.query.stream === "true" || req.headers.accept?.includes("text/event-stream");
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }
    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: "ai" });
    }
    return res.json({ text: fallback, mode: "demo" });
  } catch (error) {
    console.error("Contract draft error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 t\u1EA1o h\u1EE3p \u0111\u1ED3ng l\xFAc n\xE0y." });
  }
});
app.post("/api/contract-review", async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { text: rawText, fileName, sources, stream } = req.body || {};
    let text = sanitizeDocumentText(rawText);
    if (text.length < 20) {
      text = `H\u1EE2P \u0110\u1ED2NG CUNG \u1EE8NG D\u1ECACH V\u1EE4 TRUNG GIAN THANH TO\xC1N V\xCD \u0110I\u1EC6N T\u1EEC
C\u0103n c\u1EE9 Ngh\u1ECB \u0111\u1ECBnh s\u1ED1 52/2024/N\u0110-CP c\u1EE7a Ch\xEDnh ph\u1EE7 v\u1EC1 thanh to\xE1n kh\xF4ng d\xF9ng ti\u1EC1n m\u1EB7t;
C\u0103n c\u1EE9 Th\xF4ng t\u01B0 s\u1ED1 40/2024/TT-NHNN h\u01B0\u1EDBng d\u1EABn v\u1EC1 d\u1ECBch v\u1EE5 trung gian thanh to\xE1n;
C\u0103n c\u1EE9 Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n s\u1ED1 91/2025/QH15.

\u0110i\u1EC1u 1: Ph\u1EA1m vi cung \u1EE9ng d\u1ECBch v\u1EE5
B\xEAn A \u0111\u1ED3ng \xFD c\u1EA5p quy\u1EC1n k\u1EBFt n\u1ED1i c\u1ED5ng v\xED \u0111i\u1EC7n t\u1EED cho B\xEAn B \u0111\u1EC3 x\u1EED l\xFD giao d\u1ECBch n\u1EA1p ti\u1EC1n, r\xFAt ti\u1EC1n v\xE0 thanh to\xE1n \u0111\u01A1n h\xE0ng. M\u1ECDi lu\u1ED3ng ti\u1EC1n ph\u1EA3i \u0111\u01B0\u1EE3c b\u1EA3o \u0111\u1EA3m 1:1 qua t\xE0i kho\u1EA3n m\u1EDF t\u1EA1i Ng\xE2n h\xE0ng Th\u01B0\u01A1ng m\u1EA1i.

\u0110i\u1EC1u 2: Bi\u1EC3u ph\xED v\xE0 \u0111\u1ED1i so\xE1t
Ph\xED d\u1ECBch v\u1EE5 x\u1EED l\xFD giao d\u1ECBch l\xE0 1.8% tr\xEAn t\u1ED5ng gi\xE1 tr\u1ECB giao d\u1ECBch th\xE0nh c\xF4ng. Vi\u1EC7c \u0111\u1ED1i so\xE1t s\u1ED1 li\u1EC7u giao d\u1ECBch \u0111\u01B0\u1EE3c ch\u1ED1t v\xE0o th\u1EE9 Hai h\xE0ng tu\u1EA7n.

\u0110i\u1EC1u 3: X\u1EED l\xFD tra so\xE1t v\xE0 ho\xE0n ti\u1EC1n
B\xEAn A c\xF3 tr\xE1ch nhi\u1EC7m ti\u1EBFp nh\u1EADn v\xE0 gi\u1EA3i quy\u1EBFt y\xEAu c\u1EA7u tra so\xE1t khi\u1EBFu n\u1EA1i c\u1EE7a kh\xE1ch h\xE0ng trong th\u1EDDi h\u1EA1n 03 ng\xE0y l\xE0m vi\u1EC7c k\u1EC3 t\u1EEB th\u1EDDi \u0111i\u1EC3m nh\u1EADn \u0111\u01B0\u1EE3c th\xF4ng b\xE1o.

\u0110i\u1EC1u 4: An to\xE0n b\u1EA3o m\u1EADt v\xE0 b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n
Hai B\xEAn cam k\u1EBFt duy tr\xEC h\u1EC7 th\u1ED1ng b\u1EA3o m\u1EADt ti\xEAu chu\u1EA9n PCI-DSS v\xE0 th\u1EF1c hi\u1EC7n b\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u kh\xE1ch h\xE0ng theo Lu\u1EADt 91/2025/QH15.`;
    }
    const sourceList = Array.isArray(sources) ? sources.filter((item) => typeof item === "string") : [];
    const name = typeof fileName === "string" ? fileName.slice(0, 240) : "H\u1EE3p \u0111\u1ED3ng d\u1ECBch v\u1EE5 v\xED \u0111i\u1EC7n t\u1EED";
    const fallback = fallbackReview(text);
    const systemPrompt = `B\u1EA1n l\xE0 lu\u1EADt s\u01B0 chuy\xEAn gia r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng c\u1EE7a Th\u1ECBnh V\u01B0\u1EE3ng Legal. H\xE3y r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng theo chu\u1EA9n ph\xE1p l\xFD v\xED \u0111i\u1EC7n t\u1EED Vi\u1EC7t Nam.`;
    const prompt = `R\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng d\u01B0\u1EDBi \u0111\xE2y theo v\u0103n phong lu\u1EADt h\u1ECDc. Tr\xECnh b\xE0y r\xF5:
1. T\xD3M T\u1EAET T\u1ED4NG QUAN
2. V\u1EA4N \u0110\u1EC0 \u0110\u1ECE (R\u1EE7i ro nghi\xEAm tr\u1ECDng c\u1EA7n s\u1EEDa ngay tr\u01B0\u1EDBc khi k\xFD)
3. V\u1EA4N \u0110\u1EC0 V\xC0NG (\u0110i\u1EC3m m\u1EADp m\u1EDD, b\u1EABy ph\xE1p l\xFD c\u1EA7n \u0111\xE0m ph\xE1n l\u1EA1i)
4. N\u1ED8I DUNG XANH (\u0110i\u1EC1u kho\u1EA3n an to\xE0n, ph\xF9 h\u1EE3p th\xF4ng l\u1EC7)
5. TH\xD4NG TIN C\xD2N THI\u1EBEU
6. KI\u1EBEN NGH\u1ECA V\xC0 \u0110\u1EC0 XU\u1EA4T C\xC2U CH\u1EEE THAY TH\u1EBE
V\u1EDBi t\u1EEBng v\u1EA5n \u0111\u1EC1 ghi r\xF5 \u0111i\u1EC1u kho\u1EA3n, t\xE1c \u0111\u1ED9ng kinh doanh, c\u0103n c\u1EE9 ph\xE1p l\xFD (Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP, Th\xF4ng t\u01B0 40/2024/TT-NHNN, Lu\u1EADt 91/2025/QH15).

Ngu\u1ED3n tham chi\u1EBFu:
${sourceList.join("\n")}

T\u1EC7p: ${name}
---
${text}
---`;
    const isStream = stream || req.query.stream === "true" || req.headers.accept?.includes("text/event-stream");
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }
    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: "ai" });
    }
    return res.json({ text: fallback, mode: "demo" });
  } catch (error) {
    console.error("Contract review error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 r\xE0 so\xE1t h\u1EE3p \u0111\u1ED3ng l\xFAc n\xE0y." });
  }
});
app.post("/api/contract-compare", async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { left: rawLeft, right: rawRight, leftName, rightName, stream } = req.body || {};
    let left = sanitizeDocumentText(rawLeft);
    let right = sanitizeDocumentText(rawRight);
    const nameA = typeof leftName === "string" ? leftName.slice(0, 240) : "B\u1EA3n g\u1ED1c (V1)";
    const nameB = typeof rightName === "string" ? rightName.slice(0, 240) : "B\u1EA3n \u0111\u1EC1 xu\u1EA5t s\u1EEDa \u0111\u1ED5i (V2)";
    if (left.length < 20) {
      left = `H\u1EE2P \u0110\u1ED2NG CUNG \u1EE8NG D\u1ECACH V\u1EE4 V\xCD \u0110I\u1EC6N T\u1EEC (B\u1EA2N G\u1ED0C - V1)
\u0110i\u1EC1u 1: B\xEAn A cung c\u1EA5p d\u1ECBch v\u1EE5 c\u1ED5ng thanh to\xE1n v\xE0 v\xED \u0111i\u1EC7n t\u1EED cho B\xEAn B.
\u0110i\u1EC1u 2: Bi\u1EC3u ph\xED giao d\u1ECBch l\xE0 1.5% t\xEDnh tr\xEAn t\u1ED5ng gi\xE1 tr\u1ECB giao d\u1ECBch th\xE0nh c\xF4ng.
\u0110i\u1EC1u 3: Chu k\u1EF3 \u0111\u1ED1i so\xE1t s\u1ED1 li\u1EC7u l\xE0 th\u1EE9 Hai h\xE0ng tu\u1EA7n. Th\u1EDDi h\u1EA1n thanh to\xE1n T+3.
\u0110i\u1EC1u 4: B\xEAn A ch\u1ECBu tr\xE1ch nhi\u1EC7m b\u1EA3o m\u1EADt th\xF4ng tin v\xE0 b\u1ED3i th\u01B0\u1EDDng thi\u1EC7t h\u1EA1i tr\u1EF1c ti\u1EBFp n\u1EBFu l\u1ED7i do h\u1EC7 th\u1ED1ng v\xED.`;
    }
    if (right.length < 20) {
      right = `H\u1EE2P \u0110\u1ED2NG CUNG \u1EE8NG D\u1ECACH V\u1EE4 V\xCD \u0110I\u1EC6N T\u1EEC (B\u1EA2N \u0110\u1EC0 XU\u1EA4T M\u1EDAI - V2)
\u0110i\u1EC1u 1: B\xEAn A cung c\u1EA5p d\u1ECBch v\u1EE5 c\u1ED5ng thanh to\xE1n, v\xED \u0111i\u1EC7n t\u1EED v\xE0 d\u1ECBch v\u1EE5 thu h\u1ED9 chi h\u1ED9 cho B\xEAn B.
\u0110i\u1EC1u 2: Bi\u1EC3u ph\xED giao d\u1ECBch gi\u1EA3m xu\u1ED1ng 1.1% t\xEDnh tr\xEAn t\u1ED5ng gi\xE1 tr\u1ECB giao d\u1ECBch th\xE0nh c\xF4ng, \xE1p d\u1EE5ng c\u1ED1 \u0111\u1ECBnh trong 24 th\xE1ng.
\u0110i\u1EC1u 3: Chu k\u1EF3 \u0111\u1ED1i so\xE1t r\xFAt ng\u1EAFn h\xE0ng ng\xE0y (T+1). Th\u1EDDi h\u1EA1n thanh to\xE1n t\u1EF1 \u0111\u1ED9ng trong 24 gi\u1EDD.
\u0110i\u1EC1u 4: Mi\u1EC5n tr\u1EEB tr\xE1ch nhi\u1EC7m b\u1ED3i th\u01B0\u1EDDng cho B\xEAn B khi ph\xE1t sinh gian l\u1EADn t\u1EEB ng\u01B0\u1EDDi d\xF9ng cu\u1ED1i; B\xEAn A ch\u1ECBu tr\xE1ch nhi\u1EC7m ho\xE0n to\xE0n.
\u0110i\u1EC1u 5: B\u1ED5 sung \u0111i\u1EC1u kho\u1EA3n ph\u1EA1t vi ph\u1EA1m h\u1EE3p \u0111\u1ED3ng m\u1EE9c 8% gi\xE1 tr\u1ECB ph\u1EA7n ngh\u0129a v\u1EE5 b\u1ECB vi ph\u1EA1m v\xE0 b\u1ED3i th\u01B0\u1EDDng to\xE0n b\u1ED9 thi\u1EC7t h\u1EA1i th\u1EF1c t\u1EBF ph\xE1t sinh.`;
    }
    const changes = diffLines(left, right).filter((part) => part.added || part.removed).slice(0, 30).map((part) => `${part.added ? "TH\xCAM" : "B\u1ECE"}: ${part.value.slice(0, 700)}`).join("\n");
    const fallback = `T\xD3M T\u1EAET SO S\xC1NH
\u0110\xE3 ph\xE1t hi\u1EC7n c\xE1c \u0111o\u1EA1n \u0111\u01B0\u1EE3c th\xEAm ho\u1EB7c lo\u1EA1i b\u1ECF gi\u1EEFa hai phi\xEAn b\u1EA3n h\u1EE3p \u0111\u1ED3ng.

THAY \u0110\u1ED4I CH\xCDNH
${changes || "Kh\xF4ng ph\xE1t hi\u1EC7n kh\xE1c bi\u1EC7t theo d\xF2ng."}

\u0110\xC1NH GI\xC1 T\xC1C \u0110\u1ED8NG PH\xC1P L\xDD
- Ch\u1EBF \u0111\u1ED9 \u0111\u1ED1i chi\u1EBFu ph\xE2n t\xEDch chi ti\u1EBFt c\xE1c \u0111i\u1EC1u kho\u1EA3n b\u1ED5 sung v\xE0 lo\u1EA1i b\u1ECF.
- C\u1EA7n ch\xFA \xFD c\xE1c \u0111i\u1EC1u kho\u1EA3n v\u1EC1 ph\xE2n \u0111\u1ECBnh tr\xE1ch nhi\u1EC7m khi ph\xE1t sinh s\u1EF1 c\u1ED1 giao d\u1ECBch v\xE0 ngh\u0129a v\u1EE5 b\u1EA3o m\u1EADt d\u1EEF li\u1EC7u nh\u1EA1y c\u1EA3m theo Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15.`;
    const systemPrompt = `B\u1EA1n l\xE0 chuy\xEAn gia \u0111\u1ED1i chi\u1EBFu so s\xE1nh h\u1EE3p \u0111\u1ED3ng c\u1EE7a Th\u1ECBnh V\u01B0\u1EE3ng Legal.`;
    const prompt = `So s\xE1nh hai phi\xEAn b\u1EA3n h\u1EE3p \u0111\u1ED3ng v\xED \u0111i\u1EC7n t\u1EED. Ph\xE2n lo\u1EA1i c\xE1c thay \u0111\u1ED5i th\xE0nh TH\xCAM, B\u1ECE ho\u1EB7c S\u1EECA; \u0111\xE1nh gi\xE1 t\xE1c \u0111\u1ED9ng l\xE0 T\u0102NG R\u1EE6I RO, GI\u1EA2M R\u1EE6I RO ho\u1EB7c TRUNG T\xCDNH. \u01AFu ti\xEAn ph\u1EA1m vi gi\u1EA5y ph\xE9p, ph\xED v\xE0 \u0111\u1ED1i so\xE1t, SLA, d\u1EEF li\u1EC7u, b\u1EA3o m\u1EADt, tr\xE1ch nhi\u1EC7m, ch\u1EA5m d\u1EE9t v\xE0 tranh ch\u1EA5p. K\u1EBFt th\xFAc b\u1EB1ng phi\xEAn b\u1EA3n \u0111\u01B0\u1EE3c khuy\u1EBFn ngh\u1ECB v\xE0 th\xF4ng tin c\xF2n thi\u1EBFu.

H\u1EE3p \u0111\u1ED3ng A (${nameA}):
---
${left}
---
H\u1EE3p \u0111\u1ED3ng B (${nameB}):
---
${right}
---`;
    const isStream = stream || req.query.stream === "true" || req.headers.accept?.includes("text/event-stream");
    if (isStream) {
      return await streamLegalAI(res, systemPrompt, prompt, fallback, reqKey);
    }
    const aiResponse = await callLegalAI(systemPrompt, prompt, reqKey);
    if (aiResponse) {
      return res.json({ text: aiResponse, mode: "ai", diff: changes });
    }
    return res.json({ text: fallback, mode: "demo", diff: changes });
  } catch (error) {
    console.error("Contract compare error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 so s\xE1nh h\u1EE3p \u0111\u1ED3ng l\xFAc n\xE0y." });
  }
});
app.post("/api/review-clause", async (req, res) => {
  try {
    const reqKey = getReqApiKey(req);
    const { clauseText, contractType } = req.body || {};
    const text = typeof clauseText === "string" ? clauseText.trim() : "";
    if (!text || text.length < 10) {
      return res.status(400).json({ error: "Vui l\xF2ng cung c\u1EA5p \u0111i\u1EC1u kho\u1EA3n t\u1ED1i thi\u1EC3u 10 k\xFD t\u1EF1." });
    }
    const systemPrompt = `B\u1EA1n l\xE0 Tr\u01B0\u1EDFng ban R\xE0 so\xE1t H\u1EE3p \u0111\u1ED3ng c\u1EA5p cao (Senior Contract Reviewer) c\u1EE7a H\xE3ng lu\u1EADt Th\u1ECBnh V\u01B0\u1EE3ng Legal.
Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 r\xE0 so\xE1t m\u1ED9t \u0111i\u1EC1u kho\u1EA3n h\u1EE3p \u0111\u1ED3ng li\xEAn quan \u0111\u1EBFn Fintech, V\xED \u0111i\u1EC7n t\u1EED ho\u1EB7c Trung gian thanh to\xE1n.
H\xE3y ph\xE2n t\xEDch c\u1EF1c k\u1EF3 s\u1EAFc b\xE9n v\xE0 tr\u1EA3 v\u1EC1 \u0111\u1ECBnh d\u1EA1ng JSON sau:
{
  "riskLevel": "CAO" ho\u1EB7c "TRUNG B\xCCNH" ho\u1EB7c "TH\u1EA4P",
  "legalTrap": "Ch\u1EC9 r\xF5 b\u1EABy ph\xE1p l\xFD, s\u1EF1 b\u1EA5t c\xE2n x\u1EE9ng ngh\u0129a v\u1EE5, ho\u1EB7c nguy c\u01A1 vi ph\u1EA1m Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP, Th\xF4ng t\u01B0 40/2024/TT-NHNN ho\u1EB7c Lu\u1EADt 91/2025/QH15",
  "citation": "Tr\xEDch d\u1EABn ch\xEDnh x\xE1c \u0110i\u1EC1u, Kho\u1EA3n c\u1EE7a quy \u0111\u1ECBnh ph\xE1p lu\u1EADt li\xEAn quan",
  "recommendedClause": "So\u1EA1n th\u1EA3o l\u1EA1i nguy\xEAn v\u0103n \u0111i\u1EC1u kho\u1EA3n n\xE0y theo chu\u1EA9n m\u1EF1c ch\u1EB7t ch\u1EBD, b\u1EA3o v\u1EC7 t\u1ED1i \u0111a quy\u1EC1n l\u1EE3i doanh nghi\u1EC7p v\xE0 tu\xE2n th\u1EE7 100% lu\u1EADt ph\xE1p",
  "actionNotes": "3 g\u1EA1ch \u0111\u1EA7u d\xF2ng c\xE1c \u0111i\u1EC3m c\u1EA7n \u0111\xE0m ph\xE1n l\u1EA1i ngay v\u1EDBi \u0111\u1ED1i t\xE1c"
}
Ch\u1EC9 tr\u1EA3 v\u1EC1 JSON thu\u1EA7n t\xFAy, kh\xF4ng b\u1ECDc markdown kh\xE1c ngo\xE0i code block json n\u1EBFu c\u1EA7n.`;
    const userPrompt = `Lo\u1EA1i h\u1EE3p \u0111\u1ED3ng: ${contractType || "H\u1EE3p \u0111\u1ED3ng trung gian thanh to\xE1n / API / V\xED \u0111i\u1EC7n t\u1EED"}
\u0110i\u1EC1u kho\u1EA3n c\u1EA7n r\xE0 so\xE1t:
"""
${text}
"""`;
    const aiResponse = await callLegalAI(systemPrompt, userPrompt, reqKey);
    if (aiResponse) {
      try {
        const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return res.json(parsed);
      } catch (parseErr) {
        return res.json({
          riskLevel: "TRUNG B\xCCNH",
          legalTrap: aiResponse.slice(0, 300),
          citation: "Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP & Lu\u1EADt Giao d\u1ECBch \u0111i\u1EC7n t\u1EED 20/2023",
          recommendedClause: text,
          actionNotes: "C\u1EA7n th\u01B0\u01A1ng l\u01B0\u1EE3ng b\u1ED5 sung gi\u1EDBi h\u1EA1n tr\xE1ch nhi\u1EC7m b\u1ED3i th\u01B0\u1EDDng v\xE0 cam k\u1EBFt m\u1EE9c d\u1ECBch v\u1EE5 SLA."
        });
      }
    }
    let riskLevel = "TRUNG B\xCCNH";
    let trap = "\u0110i\u1EC1u kho\u1EA3n ch\u01B0a ph\xE2n \u0111\u1ECBnh r\xF5 ranh gi\u1EDBi tr\xE1ch nhi\u1EC7m khi ph\xE1t sinh l\u1ED7i k\u1EBFt n\u1ED1i b\xEAn th\u1EE9 ba ho\u1EB7c giao d\u1ECBch gian l\u1EADn.";
    let citation = "\u0110i\u1EC1u 23 Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP & Th\xF4ng t\u01B0 40/2024/TT-NHNN";
    let recommended = text;
    if (text.toLowerCase().includes("mi\u1EC5n tr\u1EEB") || text.toLowerCase().includes("kh\xF4ng ch\u1ECBu tr\xE1ch nhi\u1EC7m")) {
      riskLevel = "CAO";
      trap = "B\u1EABy ph\xE1p l\xFD: \u0110i\u1EC1u kho\u1EA3n mi\u1EC5n tr\u1EEB tr\xE1ch nhi\u1EC7m v\xF4 \u0111i\u1EC1u ki\u1EC7n c\xF3 nguy c\u01A1 b\u1ECB T\xF2a \xE1n tuy\xEAn v\xF4 hi\u1EC7u theo Lu\u1EADt B\u1EA3o v\u1EC7 quy\u1EC1n l\u1EE3i ng\u01B0\u1EDDi ti\xEAu d\xF9ng 2023 ho\u1EB7c vi ph\u1EA1m ngh\u0129a v\u1EE5 b\u1EA3o \u0111\u1EA3m thanh to\xE1n theo N\u0110 52/2024.";
      citation = "\u0110i\u1EC1u 25 Ngh\u1ECB \u0111\u1ECBnh 52/2024/N\u0110-CP & \u0110i\u1EC1u 10 Lu\u1EADt B\u1EA3o v\u1EC7 quy\u1EC1n l\u1EE3i ng\u01B0\u1EDDi ti\xEAu d\xF9ng 2023";
      recommended = `Trong m\u1ECDi tr\u01B0\u1EDDng h\u1EE3p x\u1EA3y ra s\u1EF1 c\u1ED1 gi\xE1n \u0111o\u1EA1n ho\u1EB7c sai s\xF3t thanh to\xE1n, B\xEAn cung c\u1EA5p d\u1ECBch v\u1EE5 c\xF3 tr\xE1ch nhi\u1EC7m \xE1p d\u1EE5ng ngay c\xE1c bi\u1EC7n ph\xE1p kh\u1EAFc ph\u1EE5c trong th\u1EDDi h\u1EA1n SLA cam k\u1EBFt, \u0111\u1ED3ng th\u1EDDi ph\u1ED1i h\u1EE3p v\u1EDBi Ng\xE2n h\xE0ng \u0111\u1ED1i so\xE1t v\xE0 ho\xE0n ti\u1EC1n cho kh\xE1ch h\xE0ng h\u1EE3p ph\xE1p theo \u0111\xFAng quy tr\xECnh tra so\xE1t quy \u0111\u1ECBnh t\u1EA1i Th\xF4ng t\u01B0 40/2024/TT-NHNN.`;
    } else if (text.toLowerCase().includes("d\u1EEF li\u1EC7u") || text.toLowerCase().includes("data")) {
      riskLevel = "TRUNG B\xCCNH";
      trap = "Nguy c\u01A1 vi ph\u1EA1m Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15 n\u1EBFu chia s\u1EBB d\u1EEF li\u1EC7u l\u1ECBch s\u1EED giao d\u1ECBch cho \u0111\u1ED1i t\xE1c m\xE0 kh\xF4ng c\xF3 s\u1EF1 \u0111\u1ED3ng \xFD ri\xEAng bi\u1EC7t c\u1EE7a ch\u1EE7 th\u1EC3 d\u1EEF li\u1EC7u.";
      citation = "Lu\u1EADt B\u1EA3o v\u1EC7 d\u1EEF li\u1EC7u c\xE1 nh\xE2n 91/2025/QH15 & Ngh\u1ECB \u0111\u1ECBnh 356/2025/N\u0110-CP";
    }
    return res.json({
      riskLevel,
      legalTrap: trap,
      citation,
      recommendedClause: recommended,
      actionNotes: "1. \u0110\xE0m ph\xE1n l\xE0m r\xF5 tr\xE1ch nhi\u1EC7m b\u1ED3i th\u01B0\u1EDDng thi\u1EC7t h\u1EA1i tr\u1EF1c ti\u1EBFp.\n2. R\xE0ng bu\u1ED9c th\u1EDDi h\u1EA1n SLA x\u1EED l\xFD s\u1EF1 c\u1ED1 t\u1ED1i \u0111a 02-04 gi\u1EDD.\n3. \u0110\u1ED1i so\xE1t kh\u1EDBp s\u1ED1 d\u01B0 t\xE0i kho\u1EA3n k\xFD qu\u1EF9 h\u1EB1ng ng\xE0y."
    });
  } catch (error) {
    console.error("Review clause error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 r\xE0 so\xE1t \u0111i\u1EC1u kho\u1EA3n l\xFAc n\xE0y." });
  }
});
async function proxyForumRequest(req, res) {
  const backendOrigin = "https://thinh-vuong-legal.vercel.app";
  const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
  const headers = { Accept: "application/json" };
  if (req.headers.cookie) headers.Cookie = req.headers.cookie;
  if (req.method === "POST") {
    headers["Content-Type"] = "application/json";
    headers.Origin = backendOrigin;
  }
  const upstream = await fetch(`${backendOrigin}/api/forum${query}`, {
    method: req.method,
    headers,
    body: req.method === "POST" ? JSON.stringify(req.body || {}) : void 0,
    cache: "no-store"
  });
  const setCookies = upstream.headers.getSetCookie?.() || [];
  if (setCookies.length) res.setHeader("Set-Cookie", setCookies);
  res.status(upstream.status);
  res.setHeader(
    "Content-Type",
    upstream.headers.get("content-type") || "application/json; charset=utf-8"
  );
  res.setHeader("Cache-Control", "private, no-store");
  return res.send(Buffer.from(await upstream.arrayBuffer()));
}
app.get("/api/forum", async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  if (!forumConfigured()) {
    try {
      return await proxyForumRequest(req, res);
    } catch {
      return res.status(503).json({ ready: false, error: forumUnavailable });
    }
  }
  try {
    const { post: postId, q, category, page } = req.query;
    const identity = forumIdentity(req, res);
    const db = forumDatabase();
    if (req.query.admin === "1" && !identity.admin) {
      return res.status(403).json({ error: "T\xE0i kho\u1EA3n qu\u1EA3n tr\u1ECB ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh." });
    }
    if (postId && typeof postId === "string") {
      if (!/^[0-9a-f-]{36}$/i.test(postId)) {
        return res.status(400).json({ error: "B\xE0i vi\u1EBFt kh\xF4ng h\u1EE3p l\u1EC7." });
      }
      const postResult = await db.query(
        "select id,title,body,category,nickname,created_at,updated_at,status,locked,author_id from public.forum_posts where id = $1",
        [postId]
      );
      const post = postResult.rows[0];
      if (!post || post.status !== "published" && !identity.admin) {
        return res.status(404).json({ error: "B\xE0i vi\u1EBFt kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 b\u1ECB g\u1EE1." });
      }
      const commentPage = Math.max(
        1,
        Math.min(1e4, Math.floor(Number(req.query.commentPage)) || 1)
      );
      const comments = await db.query(
        `select id,post_id,body,nickname,created_at,status,author_id from public.forum_comments where post_id = $1 ${identity.admin ? "" : "and status = 'published'"} order by created_at asc, id asc limit 51 offset $2`,
        [postId, (commentPage - 1) * 50]
      );
      return res.json({
        ready: true,
        admin: identity.admin,
        post: publicForumRow(post, identity.id || void 0),
        comments: comments.rows.slice(0, 50).map((row) => publicForumRow(row, identity.id || void 0)),
        hasMoreComments: comments.rows.length > 50
      });
    }
    const pageNum = Math.max(
      1,
      Math.min(1e4, Math.floor(Number(page)) || 1)
    );
    const conditions = ["status = 'published'"];
    const values = [];
    if (typeof category === "string" && forumCategories.includes(category)) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    const search = (typeof q === "string" ? q : "").slice(0, 160).replace(/[\\%_]/g, "\\$&");
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`title ilike $${values.length} escape '\\'`);
    }
    const where = `where ${conditions.join(" and ")}`;
    const countResult = await db.query(
      `select count(*)::int as count from public.forum_posts ${where}`,
      values
    );
    const listResult = await db.query(
      `select id,title,body,category,nickname,created_at,updated_at,status,locked,author_id from public.forum_posts ${where} order by created_at desc, id desc limit $${values.length + 1} offset $${values.length + 2}`,
      [...values, 12, (pageNum - 1) * 12]
    );
    return res.json({
      ready: true,
      admin: identity.admin,
      posts: listResult.rows.map(
        (row) => publicForumRow(row, identity.id || void 0)
      ),
      total: countResult.rows[0]?.count || 0,
      page: pageNum,
      flags: []
    });
  } catch (err) {
    console.error("Forum GET error:", err);
    return res.status(503).json({
      ready: false,
      error: "Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c di\u1EC5n \u0111\xE0n. Vui l\xF2ng th\u1EED l\u1EA1i sau."
    });
  }
});
app.post("/api/forum", async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  const origin = req.get("origin");
  if (!origin || new URL(origin).host !== req.get("host")) {
    return res.status(403).json({ error: "Ngu\u1ED3n y\xEAu c\u1EA7u kh\xF4ng h\u1EE3p l\u1EC7." });
  }
  if (!forumConfigured()) {
    try {
      return await proxyForumRequest(req, res);
    } catch {
      return res.status(503).json({ error: forumUnavailable });
    }
  }
  try {
    const input = req.body;
    const { action, target } = input || {};
    if (!action) {
      return res.status(400).json({ error: "Thi\u1EBFu tr\u01B0\u1EDDng action." });
    }
    if (action === "login") {
      return res.status(503).json({
        error: "T\xE0i kho\u1EA3n qu\u1EA3n tr\u1ECB ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh. Di\u1EC5n \u0111\xE0n c\xF4ng khai v\u1EABn ho\u1EA1t \u0111\u1ED9ng b\xECnh th\u01B0\u1EDDng."
      });
    }
    if (action === "logout") return res.json({ ok: true });
    const allowed = [
      "create_post",
      "edit_post",
      "remove_post",
      "create_comment",
      "edit_comment",
      "remove_comment",
      "flag"
    ];
    if (!allowed.includes(action)) {
      return res.status(400).json({ error: "Thao t\xE1c kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    if (action !== "create_post" && (typeof target !== "string" || !/^[0-9a-f-]{36}$/i.test(target))) {
      return res.status(400).json({ error: "M\xE3 n\u1ED9i dung kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    const payload = {};
    for (const key of ["title", "body", "nickname", "category", "reason", "kind"]) {
      if (typeof input[key] === "string") payload[key] = input[key].trim();
    }
    if (action === "create_post" || action === "edit_post") {
      if (!payload.title || payload.title.length < 5 || payload.title.length > 160 || !forumCategories.includes(payload.category)) {
        return res.status(400).json({ error: "N\u1ED9i dung c\u1EA7n \xEDt nh\u1EA5t 5 k\xFD t\u1EF1." });
      }
    }
    if (["create_post", "edit_post", "create_comment", "edit_comment"].includes(action)) {
      const max = action.includes("comment") ? 2e3 : 1e4;
      if (!payload.body || payload.body.length < 5 || payload.body.length > max || payload.nickname && payload.nickname.length > 50) {
        return res.status(400).json({
          error: `N\u1ED9i dung c\u1EA7n 5\u2013${max} k\xFD t\u1EF1; t\xEAn hi\u1EC3n th\u1ECB t\u1ED1i \u0111a 50 k\xFD t\u1EF1.`
        });
      }
    }
    if (action === "flag" && (!payload.reason || payload.reason.length < 5 || payload.reason.length > 500 || !["post", "comment"].includes(payload.kind))) {
      return res.status(400).json({ error: "L\xFD do b\xE1o c\xE1o c\u1EA7n 5\u2013500 k\xFD t\u1EF1." });
    }
    const identity = forumIdentity(
      req,
      res,
      ["create_post", "create_comment", "flag"].includes(action)
    );
    if (!identity.id) {
      return res.status(403).json({ error: "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n s\u1EEDa n\u1ED9i dung n\xE0y." });
    }
    try {
      const result = await forumDatabase().query(
        "select public.forum_mutate($1,$2,$3,$4,$5,$6) as id",
        [
          identity.id,
          forumIpHash(req),
          action,
          target || null,
          payload,
          false
        ]
      );
      return res.json({ ok: true, success: true, id: result.rows[0].id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("RATE_LIMIT")) {
        return res.status(429).json({ error: "B\u1EA1n \u0111\xE3 \u0111\u1EA1t gi\u1EDBi h\u1EA1n \u0111\u0103ng trong m\u1ED9t gi\u1EDD." });
      }
      if (message.includes("FORBIDDEN")) {
        return res.status(403).json({ error: "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n th\u1EF1c hi\u1EC7n thao t\xE1c n\xE0y." });
      }
      if (message.includes("UNAVAILABLE")) {
        return res.status(409).json({ error: "B\xE0i vi\u1EBFt \u0111\xE3 b\u1ECB g\u1EE1 ho\u1EB7c \u0111\xE3 kh\xF3a b\xECnh lu\u1EADn." });
      }
      if (message.includes("INVALID")) {
        return res.status(400).json({ error: "N\u1ED9i dung kh\xF4ng h\u1EE3p l\u1EC7." });
      }
      throw error;
    }
  } catch (err) {
    console.error("Forum POST error:", err);
    return res.status(503).json({ error: "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c n\u1ED9i dung. Vui l\xF2ng th\u1EED l\u1EA1i sau." });
  }
});
app.post("/api/team/upload", async (req, res) => {
  try {
    const { slug, imageBase64 } = req.body;
    if (!slug || !imageBase64) {
      return res.status(400).json({ error: "Thi\u1EBFu slug ho\u1EB7c d\u1EEF li\u1EC7u \u1EA3nh." });
    }
    const fs = await import("fs");
    const teamDir = path.join(process.cwd(), "public", "assets", "team");
    if (!fs.existsSync(teamDir)) {
      fs.mkdirSync(teamDir, { recursive: true });
    }
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const targetFile = path.join(teamDir, `${slug}.jpg`);
    fs.writeFileSync(targetFile, buffer);
    return res.json({
      success: true,
      url: `/assets/team/${slug}.jpg?t=${Date.now()}`
    });
  } catch (error) {
    console.error("Save avatar error:", error);
    return res.status(500).json({ error: "Kh\xF4ng th\u1EC3 l\u01B0u \u1EA3nh \u0111\u1EA1i di\u1EC7n." });
  }
});
app.get("/api/team/photos", async (_req, res) => {
  try {
    const fs = await import("fs");
    const teamDir = path.join(process.cwd(), "public", "assets", "team");
    if (!fs.existsSync(teamDir)) {
      return res.json({ photos: [] });
    }
    const files = fs.readdirSync(teamDir);
    return res.json({ photos: files });
  } catch (error) {
    return res.json({ photos: [] });
  }
});
app.use((err, _req, res, next) => {
  if (err && (err.type === "entity.too.large" || err.status === 413)) {
    console.warn("PayloadTooLargeError caught:", err.message);
    return res.status(413).json({
      error: "Dung l\u01B0\u1EE3ng t\u1EC7p ho\u1EB7c v\u0103n b\u1EA3n qu\xE1 l\u1EDBn (v\u01B0\u1EE3t qu\xE1 50MB). Vui l\xF2ng ch\u1ECDn t\u1EC7p nh\u1ECF h\u01A1n ho\u1EB7c r\xFAt g\u1ECDn n\u1ED9i dung."
    });
  }
  next(err);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Th\u1ECBnh V\u01B0\u1EE3ng Legal server running at http://0.0.0.0:${PORT}`);
  });
}
if (process.env.VERCEL !== "1" && !process.env.NOW_REGION) {
  startServer();
}
var server_default = app;
export {
  server_default as default
};
