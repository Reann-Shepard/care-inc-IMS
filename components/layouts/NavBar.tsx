'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, use } from 'react';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const path = usePathname();
  const navItems = [
    'Overview',
    'Inventory',
    'Packages',
    'Alterations',
    'Order-Manufacturer',
  ];
  const [current, setCurrent] = useState(path.replace('/', ''));

  useEffect(() => {
    setCurrent(path.replace('/', ''));
  }, [path]);

  return (
    <div className="navbar bg-base-100 items-center justify-center">
      <div className="navbar-start flex justify-start w-full">
        <ul className="menu menu-horizontal px-1 my-2 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-6 2xl:space-x-8">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={
                'rounded-md mx-6 ' +
                (item.toLocaleLowerCase() === current ? 'bg-ochre' : '')
              }
            >
              {/* {`${item}`}
                        {item === selected ? (
                        <motion.div className="bg-ochre" layoutId="background" />
                        ) : null}
                         */}
              <Link href={`/${item.toLowerCase()}`} prefetch={false}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-center hidden lg:flex" />

      <div className="navbar-end hidden lg:flex" />
    </div>
  );
}
