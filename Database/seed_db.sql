-- Active: 1775542421232@@127.0.0.1@3306@comicplatformdb
USE ComicPlatformDB;
GO

-- Seed Genres
INSERT INTO Genres (Name, Slug) VALUES 
('Action', 'action'), 
('Fantasy', 'fantasy'), 
('Romance', 'romance');

-- Seed Comics
INSERT INTO Comics (Title, Slug, Description, CoverImage, Status, ViewCount) VALUES 
('The Beginning After The End', 'tbate', 'King Grey has unrivaled strength, wealth, and prestige...', 'https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400&h=600&fit=crop', 'Ongoing', 100),
('Solo Leveling', 'solo-leveling', '10 years ago, after the Gate that connected the real world with the monster world opened...', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=600&fit=crop', 'Completed', 5000),
('Chainsaw Man', 'chainsaw-man', 'Denji has a simple dream—to live a happy and peaceful life...', 'https://images.unsplash.com/photo-1580477651161-0ae7d8d21c0b?q=80&w=400&h=600&fit=crop', 'Ongoing', 25000),
('Omniscient Reader', 'orv', 'Only I know the end of this world...', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&h=600&fit=crop', 'Ongoing', 8000),
('Jujutsu Kaisen', 'jjk', 'Idly indulging in baseless paranormal activities...', 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=400&h=600&fit=crop', 'Ongoing', 9000),
('Naruto', 'naruto', 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage...', 'https://images.unsplash.com/photo-1578589318433-39b5a16ce14d?q=80&w=400&h=600&fit=crop', 'Completed', 150000),
('One Piece', 'one-piece', 'Follows the adventures of Monkey D. Luffy and his pirate crew...', 'https://images.unsplash.com/photo-1613376023733-7a97a5f6eacb?q=80&w=400&h=600&fit=crop', 'Ongoing', 200000),
('Bleach', 'bleach', 'Ichigo Kurosaki obtains the powers of a Soul Reaper...', 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=400&h=600&fit=crop', 'Completed', 85000),
('Attack on Titan', 'aot', 'Set in a world where humanity is forced to live in cities surrounded by three enormous walls...', 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=400&h=600&fit=crop', 'Completed', 120000),
('Dragon Ball', 'dragon-ball', 'Son Goku, from his childhood through adulthood as he trains in martial arts...', 'https://images.unsplash.com/photo-1610477218683-16cabdcb55f5?q=80&w=400&h=600&fit=crop', 'Completed', 300000);

-- Seed ComicGenres
INSERT INTO ComicGenres (ComicId, GenreId) VALUES 
(1, 1), (1, 2), -- TBATE: Action, Fantasy
(2, 1), -- Solo Leveling: Action
(3, 1), -- Chainsaw Man
(4, 2), -- ORV
(5, 1), -- JJK
(6, 1), (6, 2), -- Naruto
(7, 1), (7, 2), -- One Piece
(8, 1), (8, 2), -- Bleach
(9, 1), -- AOT
(10, 1), (10, 2); -- Dragon Ball

-- Seed Chapters
INSERT INTO Chapters (ComicId, ChapterNumber, Title) VALUES 
(1, 1, 'The King Returns'),
(1, 2, 'New World'),
(2, 1, 'E-Rank Hunter'),
(3, 1, 'Dog and Chainsaw'),
(4, 1, 'Starting the Paid Service'),
(5, 1, 'Ryomen Sukuna'),
(6, 1, 'Enter: Naruto Uzumaki!'),
(7, 1, 'Romance Dawn'),
(8, 1, 'Death and Strawberry'),
(9, 1, 'To You, 2,000 Years From Now'),
(10, 1, 'Bulma and Son Goku');

-- Seed ChapterImages
INSERT INTO ChapterImages (ChapterId, ImageUrl, PageOrder) VALUES 
(1, 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop', 1),
(1, 'https://images.unsplash.com/photo-1580477651161-0ae7d8d21c0b?q=80&w=800&auto=format&fit=crop', 2),
(1, 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', 3),
(3, 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop', 1),
(3, 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', 2),
(7, 'https://images.unsplash.com/photo-1578589318433-39b5a16ce14d?q=80&w=800&auto=format&fit=crop', 1),
(8, 'https://images.unsplash.com/photo-1613376023733-7a97a5f6eacb?q=80&w=800&auto=format&fit=crop', 1),
(9, 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=800&auto=format&fit=crop', 1),
(10, 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=800&auto=format&fit=crop', 1),
(11, 'https://images.unsplash.com/photo-1610477218683-16cabdcb55f5?q=80&w=800&auto=format&fit=crop', 1);
