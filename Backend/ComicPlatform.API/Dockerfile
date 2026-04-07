# Base image for .NET 10 SDK (for building)
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview
WORKDIR /app
COPY --from=build-env /app/out .

# Expose port (ASP.NET Core uses 8080 by default in containers natively now)
EXPOSE 8080

ENTRYPOINT ["dotnet", "ComicPlatform.API.dll"]
