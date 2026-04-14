-- Thay thế 'USERNAME_CUA_BAN' bằng tên tài khoản bạn đã đăng ký
-- Chạy lệnh này trong SQL Server của bạn (LocalDB hoặc Docker)

USE ComicPlatformDB;
GO

UPDATE Users 
SET Role = 'Admin' 
WHERE Username = 'admin';

-- Kiểm tra lại
SELECT Username, Role FROM Users;
