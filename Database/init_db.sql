-- Users Table
CREATE TABLE Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) DEFAULT 'User' CHECK (Role IN ('User', 'Admin')),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comics Table
CREATE TABLE Comics (
    ComicId INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Slug VARCHAR(250) NOT NULL UNIQUE,
    Description TEXT,
    CoverImage VARCHAR(2000),
    Status VARCHAR(20) DEFAULT 'Ongoing' CHECK (Status IN ('Ongoing', 'Completed')),
    ViewCount INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Genres Table
CREATE TABLE Genres (
    GenreId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    Slug VARCHAR(100) NOT NULL UNIQUE
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
    ChapterId INT AUTO_INCREMENT PRIMARY KEY,
    ComicId INT NOT NULL,
    ChapterNumber FLOAT NOT NULL,
    Title VARCHAR(200),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ComicId) REFERENCES Comics(ComicId) ON DELETE CASCADE
);

-- ChapterImages Table
CREATE TABLE ChapterImages (
    ImageId INT AUTO_INCREMENT PRIMARY KEY,
    ChapterId INT NOT NULL,
    ImageUrl VARCHAR(2000) NOT NULL,
    PageOrder INT NOT NULL,
    FOREIGN KEY (ChapterId) REFERENCES Chapters(ChapterId) ON DELETE CASCADE
);

-- Bookmarks Table
CREATE TABLE Bookmarks (
    UserId INT NOT NULL,
    ComicId INT NOT NULL,
    SavedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserId, ComicId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (ComicId) REFERENCES Comics(ComicId) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IX_Chapters_ComicId ON Chapters(ComicId);
CREATE INDEX IX_ChapterImages_ChapterId_PageOrder ON ChapterImages(ChapterId, PageOrder);
CREATE INDEX IX_ComicGenres_GenreId ON ComicGenres(GenreId);
CREATE INDEX IX_Bookmarks_UserId ON Bookmarks(UserId);
