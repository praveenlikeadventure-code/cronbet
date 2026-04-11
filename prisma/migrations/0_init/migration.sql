-- CreateTable
CREATE TABLE "BettingPlatform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "bonusText" TEXT,
    "affiliateUrl" TEXT NOT NULL DEFAULT '#',
    "rating" REAL NOT NULL DEFAULT 0,
    "pros" TEXT NOT NULL DEFAULT '[]',
    "cons" TEXT NOT NULL DEFAULT '[]',
    "sports" TEXT NOT NULL DEFAULT '[]',
    "payments" TEXT NOT NULL DEFAULT '[]',
    "minDeposit" TEXT,
    "payoutSpeed" TEXT,
    "license" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rank" INTEGER NOT NULL DEFAULT 999,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "visibilityType" TEXT NOT NULL DEFAULT 'ALL_COUNTRIES',
    "allowedCountries" TEXT NOT NULL DEFAULT '[]',
    "blockedCountries" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PlatformGeoOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformId" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "bonusText" TEXT NOT NULL,
    "bonusAmount" TEXT NOT NULL,
    "minDeposit" TEXT NOT NULL,
    "affiliateUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlatformGeoOffer_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "BettingPlatform" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AutoBlogSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "publishTime" TEXT NOT NULL DEFAULT '09:00',
    "useRotation" BOOLEAN NOT NULL DEFAULT true,
    "topicIndex" INTEGER NOT NULL DEFAULT 0,
    "lastPublishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlogAd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "positions" TEXT NOT NULL DEFAULT '["ALL"]',
    "badge" TEXT,
    "highlightPoints" TEXT NOT NULL DEFAULT '[]',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOnAllBlogs" BOOLEAN NOT NULL DEFAULT true,
    "specificBlogIds" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "blogId" TEXT,
    "blogSlug" TEXT,
    "position" TEXT NOT NULL,
    "popupType" TEXT,
    "action" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PageGeoRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pagePath" TEXT NOT NULL,
    "pageLabel" TEXT NOT NULL,
    "isRestricted" BOOLEAN NOT NULL DEFAULT false,
    "allowedCountries" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PopupSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "scrollEnabled" BOOLEAN NOT NULL DEFAULT true,
    "exitEnabled" BOOLEAN NOT NULL DEFAULT true,
    "timeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "scrollTriggerPct" INTEGER NOT NULL DEFAULT 50,
    "timeTriggerSeconds" INTEGER NOT NULL DEFAULT 60,
    "maxExitPlatforms" INTEGER NOT NULL DEFAULT 3,
    "popupPlatformIds" TEXT NOT NULL DEFAULT '[]',
    "displayOnAllBlogs" BOOLEAN NOT NULL DEFAULT true,
    "specificBlogIds" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BettingPlatform_slug_key" ON "BettingPlatform"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformGeoOffer_platformId_countryCode_key" ON "PlatformGeoOffer"("platformId", "countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PageGeoRule_pagePath_key" ON "PageGeoRule"("pagePath");
