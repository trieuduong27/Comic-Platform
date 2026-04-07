-- Active: 1775542421232@@127.0.0.1@3306@comicplatformdb
CREATE DATABASE ComicPlatformDB;
GO

USE ComicPlatformDB;
GO

-- Users Table
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'User' CHECK (Role IN ('User', 'Admin')),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Comics Table
CREATE TABLE Comics (
    ComicId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Slug NVARCHAR(250) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    CoverImage NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Ongoing' CHECK (Status IN ('Ongoing', 'Completed')),
    ViewCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Genres Table
CREATE TABLE Genres (
    GenreId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Slug NVARCHAR(100) NOT NULL UNIQUE
);

-- ComicGenres (N-N)
CREATE TABLE ComicGenres (
    ComicId INT NOT NULL,
    GenreId INT NOT NULL,
    PRIMARY KEY (ComicId, GenreId),
    FOREIGN KEY (ComicId) REFERENCES Comics(ComicId) ON DELETE CASCADE,
    FOREIGN KEY (GenreId) REFERENCES Genres(GenreId) ON DELETE CASCADE
);

-- Chapters Table
CREATE TABLE Chapters (
    ChapterId INT IDENTITY(1,1) PRIMARY KEY,
    ComicId INT NOT NULL,
    ChapterNumber FLOAT NOT NULL,
    Title NVARCHAR(200),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ComicId) REFERENCES Comics(ComicId) ON DELETE CASCADE
);

-- ChapterImages Table
CREATE TABLE ChapterImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ChapterId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    PageOrder INT NOT NULL,
    FOREIGN KEY (ChapterId) REFERENCES Chapters(ChapterId) ON DELETE CASCADE
);

-- Bookmarks Table
CREATE TABLE Bookmarks (
    UserId INT NOT NULL,
    ComicId INT NOT NULL,
    SavedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (UserId, ComicId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (ComicId) REFERENCES Comics(ComicId) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IX_Chapters_ComicId ON Chapters(ComicId);
CREATE INDEX IX_ChapterImages_ChapterId_PageOrder ON ChapterImages(ChapterId, PageOrder);
CREATE INDEX IX_ComicGenres_GenreId ON ComicGenres(GenreId);
CREATE INDEX IX_Bookmarks_UserId ON Bookmarks(UserId);
