using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace ComicPlatform.API.Services
{
    public class MangaDexSearchResult
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;
    }

    public class MangaDexChapterResult
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Chapter { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public int Volume { get; set; }
    }

    public class MangaDexService
    {
        private readonly HttpClient _httpClient;
        private const string InitialBaseUrl = "https://api.mangadex.org";
        private const string UploadBaseUrl = "https://uploads.mangadex.org";

        public MangaDexService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri(InitialBaseUrl);
            // MangaDex requires a User-Agent
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "ComicPlatform-AutoCrawler/1.0");
        }

        public async Task<List<MangaDexSearchResult>> SearchMangaAsync(string title)
        {
            var url = $"/manga?title={Uri.EscapeDataString(title)}&includes[]=cover_art&order[relevance]=desc&limit=10";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(jsonString);
            var dataArray = json?["data"]?.AsArray();

            var results = new List<MangaDexSearchResult>();

            if (dataArray == null) return results;

            foreach (var item in dataArray)
            {
                var attrs = item["attributes"];
                var id = item["id"]?.ToString() ?? "";

                // Get English or en title
                var titleNode = attrs?["title"];
                var mainTitle = titleNode?["en"]?.ToString() ?? titleNode?["ja-ro"]?.ToString() ?? "Unknown Title";

                var descNode = attrs?["description"];
                var desc = descNode?["en"]?.ToString() ?? descNode?["vi"]?.ToString() ?? "";

                // Find cover
                var relationships = item["relationships"]?.AsArray();
                string coverFileName = "";
                if (relationships != null)
                {
                    foreach (var rel in relationships)
                    {
                        if (rel["type"]?.ToString() == "cover_art")
                        {
                            coverFileName = rel["attributes"]?["fileName"]?.ToString() ?? "";
                            break;
                        }
                    }
                }

                var coverUrl = string.IsNullOrEmpty(coverFileName) 
                    ? "" 
                    : $"{UploadBaseUrl}/covers/{id}/{coverFileName}";

                results.Add(new MangaDexSearchResult
                {
                    Id = id,
                    Title = mainTitle,
                    Description = desc,
                    CoverUrl = coverUrl
                });
            }

            return results;
        }

        public async Task<List<MangaDexChapterResult>> GetMangaChaptersAsync(string mangaId)
        {
            // Try getting Vietnamese first, then English. Actually let's fetch both or just let the API sort it.
            // Let's fetch vi and en, ordered by chapter asc
            var url = $"/manga/{mangaId}/feed?translatedLanguage[]=vi&translatedLanguage[]=en&order[chapter]=asc&limit=500";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(jsonString);
            var dataArray = json?["data"]?.AsArray();

            var results = new List<MangaDexChapterResult>();
            if (dataArray == null) return results;

            foreach (var item in dataArray)
            {
                var attrs = item["attributes"];
                var id = item["id"]?.ToString() ?? "";
                var title = attrs?["title"]?.ToString() ?? "";
                var chapterNumStr = attrs?["chapter"]?.ToString() ?? "0";
                var lang = attrs?["translatedLanguage"]?.ToString() ?? "";

                results.Add(new MangaDexChapterResult
                {
                    Id = id,
                    Title = title,
                    Chapter = chapterNumStr,
                    Language = lang
                });
            }

            return results;
        }

        public async Task<List<string>> GetChapterImagesAsync(string chapterId)
        {
            var url = $"/at-home/server/{chapterId}";
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                // external chapters or chapters with no images will return 404 or other errors
                return new List<string>();
            }

            var jsonString = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(jsonString);

            var baseUrl = json?["baseUrl"]?.ToString() ?? "";
            var hash = json?["chapter"]?["hash"]?.ToString() ?? "";
            var dataArray = json?["chapter"]?["data"]?.AsArray();

            var images = new List<string>();

            if (dataArray != null && !string.IsNullOrEmpty(baseUrl) && !string.IsNullOrEmpty(hash))
            {
                foreach (var fileName in dataArray)
                {
                    // Construct final URL
                    images.Add($"{baseUrl}/data/{hash}/{fileName}");
                }
            }

            return images;
        }
        
        public async Task<MangaDexSearchResult> GetMangaDetailsAsync(string mangaId)
        {
             var url = $"/manga/{mangaId}?includes[]=cover_art";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var json = JsonNode.Parse(jsonString);
            var item = json?["data"];

            if (item == null) return null;

            var attrs = item["attributes"];
            var id = item["id"]?.ToString() ?? "";

            var titleNode = attrs?["title"];
            var mainTitle = titleNode?["en"]?.ToString() ?? titleNode?["ja-ro"]?.ToString() ?? "Unknown Title";

            var descNode = attrs?["description"];
            var desc = descNode?["en"]?.ToString() ?? descNode?["vi"]?.ToString() ?? "";

            var relationships = item["relationships"]?.AsArray();
            string coverFileName = "";
            if (relationships != null)
            {
                foreach (var rel in relationships)
                {
                    if (rel["type"]?.ToString() == "cover_art")
                    {
                        coverFileName = rel["attributes"]?["fileName"]?.ToString() ?? "";
                        break;
                    }
                }
            }

            var coverUrl = string.IsNullOrEmpty(coverFileName) 
                ? "" 
                : $"{UploadBaseUrl}/covers/{id}/{coverFileName}";

            return new MangaDexSearchResult
            {
                Id = id,
                Title = mainTitle,
                Description = desc,
                CoverUrl = coverUrl
            };
        }
    }
}
