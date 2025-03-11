import { Link } from "@remix-run/react";
import React from "react";

export const Sidebar = () => {
  const links = [
    { name: "Goals", href: "/goals", icon: "/assets/rocket.svg" },
    { name: "Income", href: "/dashboard", icon: "/assets/money.svg" },
    { name: "Expense", href: "/expense", icon: "/assets/graph.svg" },
    { name: "Loans", href: "/loans", icon: "/assets/loans.svg" },
    { name: "Knowledge", href: "/knowledge", icon: "/assets/statement.svg" },
  ];

  return (
    <div className="h-full w-[120px] bg-background border-r-2 border-primary px-2 py-3 flex flex-col items-center">
      <img src="/assets/pennywise.svg" className="h-12 w-12 mt-5" alt="" />
      <div className="mt-10">
        <div className="flex flex-col space-y-10">
          {links.map((link, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center my-4"
            >
              <Link to={link.href} className="flex items-center justify-center">
                <img src={link.icon} alt={link.name} className="h-8 w-8" />
              </Link>
              <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {link.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
