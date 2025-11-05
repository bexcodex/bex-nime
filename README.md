<div align="center">
  <h1>bexnime</h1>
  <p>A web application for streaming anime, built with Next.js. Scrapes data from Otakudesu to provide a rich anime viewing experience.</p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white" alt="Cloudflare" />
  </p>

  <p>
    <a href="https://github.com/bexcodex/bex-nime">
      <img src="https://img.shields.io/github/stars/bexcodex/bex-nime?style=social" alt="Github Stars">
    </a>
    <a href="https://github.com/bexcodex/bex-nime/issues">
      <img src="https://img.shields.io/github/issues/bexcodex/bex-nime" alt="Github Issues">
    </a>
    <a href="https://github.com/bexcodex/bex-nime/network/members">
      <img src="https://img.shields.io/github/forks/bexcodex/bex-nime?style=social" alt="Github Forks" />
    </a>
  </p>
</div>

---

## ✨ Features

- **Browse & Search**: Easily find any anime.
- **Watch Episodes**: Stream episodes directly.
- **Detailed Information**: View genres, status, and episode lists.
- **Categorized Lists**: Separate sections for ongoing and completed series.
- **Watch History**: Keep track of what you've watched.
- **Responsive Design**: Enjoy a seamless experience on any device.

## Previews

<div style="text-align: left;">
  home Page
  <img style="margin-top:10px" src="https://raw.githubusercontent.com/bexcodex/bex-nime/refs/heads/main/public/screenshot-1.png" alt="home Page" style="max-width: 80%;">
  <br/>
  ongoing Page
  <img style="margin-top:10px" src="https://raw.githubusercontent.com/bexcodex/bex-nime/refs/heads/main/public/screenshot-2.png" alt="ongoing Page" style="max-width: 80%;">
  <br/>
  genre page
  <img style="margin-top:10px" src="https://raw.githubusercontent.com/bexcodex/bex-nime/refs/heads/main/public/screenshot-3.png" alt="genre page" style="max-width: 50%;">
  <br/>
</div>

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Data Source**: Scraped from [Otakudesu](https://otakudesu.best/)

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer)
- `pnpm` package manager
  ```sh
  npm install -g pnpm
  ```

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/bexcodex/bex-nime.git
    cd bex-nime
    ```

2.  **Install dependencies**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables**
    
    Create a `.env` file in the root of the project and add any necessary environment variables.
    ```sh
    touch .env
    ```

4.  **Run the development server**
    ```sh
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ☁️ Deployment

This project is optimized for deployment on [Cloudflare Pages](https://pages.cloudflare.com/).

## 🔌 API Endpoints

The application exposes several API endpoints to fetch anime data.

| Method | Endpoint                               | Description                               |
| :----- | :------------------------------------- | :---------------------------------------- |
| `GET`  | `/api/v1/home`                         | Get home page data (ongoing & complete).  |
| `GET`  | `/api/v1/anime/[slug]`                 | Get details for a specific anime.         |
| `GET`  | `/api/v1/anime/[slug]/episodes`        | Get the episode list for an anime.        |
| `GET`  | `/api/v1/anime/[slug]/episodes/[ep]`   | Get the stream URL for a specific episode.|
| `GET`  | `/api/v1/search/[keyword]`             | Search for anime by a keyword.            |
| `GET`  | `/api/v1/genres`                       | Get a list of all available genres.       |
| `GET`  | `/api/v1/genres/[slug]`                | Get anime for a specific genre.           |
| `GET`  | `/api/v1/ongoing-anime`                | Get the list of all ongoing anime.        |
| `GET`  | `/api/v1/complete-anime`               | Get the list of all complete anime.       |


## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📜 License

Distributed under the an MIT License. See [LICENSE](LICENSE) for more information.