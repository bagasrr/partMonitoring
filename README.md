# Part Monitoring Frontend

A web application for monitoring machine parts, built with React, Vite, Redux, and TailwindCSS.

## Features

- **Dashboard**: Overview of part statuses (Spare, Broken, In Use, Repair) and charts for usage statistics.
- **Parts Management**: Add, edit, delete, swap, replace, and update status of parts.
- **Sections & Machines**: Manage rooms (sections) and machines.
- **Vendors**: Manage vendor data.
- **Users**: Admin/user management, profile editing, registration, login.
- **History**: Track all changes and activities on parts.
- **Notifications**: Real-time feedback for actions.
- **Responsive UI**: Optimized for desktop and mobile.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- [Axios](https://axios-http.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Date-fns](https://date-fns.org/)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Swiper](https://swiperjs.com/)

## Getting Started

### Prerequisites

- Node.js & npm
- Backend API running (see `.env` for API URL)

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/partMonitoring1.git
   cd partMonitoring1
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment**
   - Edit `.env` file to set `VITE_BACKEND_URL` to your backend API.

4. **Run the development server**
   ```sh
   npm run dev
   ```

5. **Build for production**
   ```sh
   npm run build
   ```

6. **Preview production build**
   ```sh
   npm run preview
   ```

### Linting

```sh
npm run lint
```

## Project Structure

```
src/
  app/                # Redux store
  assets/             # Static assets
  components/         # Reusable UI components
  element/            # UI elements (Button, Table, etc)
  features/           # Redux slices
  hooks/              # Custom hooks
  pages/              # Route pages
  utils/              # Utility functions (API, formatting, etc)
public/               # Static files
```

## Environment Variables

See [.env](.env) for API configuration.

## License

MIT

---

Made with ❤️ by Bagas Ramadhan Rusnadi
