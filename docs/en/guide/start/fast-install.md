# Quick Start

## Download the Code

### Git

Use Git to install this project. Ensure you have the [Git](https://git-scm.com/) tool installed locally.

First, download the code to your local machine by executing the following command. `YourProject` is the name of the new application directory. If not specified, it defaults to `mineadmin`.

## Branch Introduction
- `master` branch: The default main branch, the most commonly used branch.
- `master-department` branch: Includes additional features such as department management, position management, and data permission settings.

Please choose the appropriate branch for development based on your needs to avoid unnecessary complications later!!!

```sh [Download Code]
git clone https://github.com/mineadmin/MineAdmin.git
```

After downloading, copy the `.env.example` file in the project directory to `.env` and configure the database and Redis settings.

## Backend Environment Setup

### Composer

If you are using a local environment, after configuring the `.env` file, you can proceed to [Backend Installation](#backend-installation).

### Docker

If you choose to develop with Docker, a few additional steps are required to complete the environment setup.

#### Docker-compose (Recommended)

MineAdmin provides a complete `docker-compose.yml` file. Simply execute the following command in the project directory to set up the environment:

```shell
docker-compose up -d
```

#### Docker Build

If you prefer to build your own container image, we have prepared a Dockerfile for you. Execute the following commands in the project directory to complete the environment setup:

```shell
# Build the image
docker build . -t mineadmin

# Start a container
docker run -d --name mineadmin -p 9501:9501 -v .:/opt/www mineadmin 
```

### Backend System Installation

Execute the following commands:

::: code-group

```shell[Reinstall Vendor]
composer install -vvv
```

```shell [Database Migration]
php bin/hyperf.php migrate
```

```shell [Data Seeding]
php bin/hyperf.php db:seed
```

:::

## Frontend Installation

We recommend using [nvm](https://github.com/nvm-sh/nvm) for local Node version management.

Navigate to `your-project-path/web` and execute:

```shell
# Install frontend dependencies
pnpm i 
# Start the local development server
pnpm dev
```