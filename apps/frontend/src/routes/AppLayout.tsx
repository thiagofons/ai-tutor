import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const AppLayout = () => {
  return (
    <div className="apple-canvas flex min-h-screen flex-col">
      <AppNavbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
