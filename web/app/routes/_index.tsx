import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Pennywise" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Navbar = () => {
  return (
    <div className="border-b-2 border-primary h-20 flex items-center justify-between px-24">
      <div className="navlinks flex items-center space-x-[50px]">
        <div className="flex space-x-4 items-center logo">
          <img
            className="h-10 w-10"
            src="/assets/pennywise.svg"
            alt="pennywise"
          />
          <div className="font-sentient uppercase font-semibold text-2xl tracking-wide mt-1 text-secondary">
            pennywise
          </div>
        </div>
        <div className="space-x-[40px]">
          <a className="font-sentient text-primary text-2xl mt-1" href="#about">
            About
          </a>
          <a href="#team" className="font-sentient text-primary text-2xl mt-1">
            Team
          </a>
        </div>
      </div>
      <div className="buttons flex space-x-[20px]">
        <Link to="/login">
          <button className="text-primary font-medium border border-primary rounded-full px-2 py-1 text-xl font-sentient">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="text-background font-medium border border-primary bg-primary rounded-full px-3 py-1 text-xl font-sentient">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default function Index() {
  return (
    <div className="bg-background h-screen">
      <Navbar />
      <div className="landing"></div>
    </div>
  );
}
