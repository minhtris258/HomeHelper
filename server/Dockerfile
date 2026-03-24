# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Vì Dockerfile nằm cùng cấp với server.csproj, ta copy trực tiếp
COPY ["server.csproj", "./"]
RUN dotnet restore "server.csproj"

COPY . .
RUN dotnet build "server.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render yêu cầu port 10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Tên file dll dựa theo tên project server.csproj của bạn
ENTRYPOINT ["dotnet", "server.dll"]